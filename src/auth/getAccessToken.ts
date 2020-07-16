import * as crypto from "crypto";
import fetch from "node-fetch";
import * as open from "open";
import * as http from "http";
import { URL, URLSearchParams, parse } from "url";

import { config } from "../config";

function randomString(): string {
  return crypto.randomBytes(20).toString("hex");
}

export async function startAuthFlow() {
  const clientID = "1e4c1065d5b720bb6838";
  // This value is safe to be embedded in version control
  // https://github.com/cli/cli/issues/1369
  const clientSecret = "99fffdee5fb032855054f71e317661b553e8ae8e";
  const redirectUri = "http://127.0.0.1:6236/callback";
  const scope = "repo";
  const state = randomString();
  const url = new URL("https://github.com/login/oauth/authorize");

  const firstStepParams = {
    client_id: clientID,
    redirect_uri: redirectUri,
    state,
    scope,
  };
  url.search = new URLSearchParams(firstStepParams).toString();
  const link = url.href;
  await open(link, { url: true });

  const server = http
    .createServer(async (req, res) => {
      //@ts-ignore
      const parsedUrl = parse(req.url, true);
      if (parsedUrl.pathname !== "/callback") {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("404 Not Found\n");
        res.end();
        req.connection.end();
        req.connection.destroy();
        server.close();
        return;
      }
      const queryAsObject = parsedUrl.query;
      const authCode = queryAsObject.code;
      const serverState = queryAsObject.state;

      if (state !== serverState) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.write("Server mismatch\n");
        res.end();
        req.connection.end();
        req.connection.destroy();
        server.close();
        return;
      }
      try {
        const secondStepUrl = new URL(
          "https://github.com/login/oauth/access_token"
        );
        const secondStepParams = {
          client_id: clientID,
          client_secret: clientSecret,
          code: authCode,
          redirect_uri: redirectUri,
          state,
        };
        secondStepUrl.search = new URLSearchParams(secondStepParams).toString();
        const resp = await fetch(secondStepUrl, {
          method: "POST",
        }).then((r) => r.text());

        const accessToken = resp.split("&")[0].split("=")[1];
        config.set("accessToken", accessToken);
      } catch (error) {
        console.log(error);
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(
        "<p>You have successfully authenticated. You may now close this page.</p>"
      );
      res.end();

      req.connection.end();
      req.connection.destroy();
      server.close();
    })
    .listen(6236, "127.0.0.1");
}
