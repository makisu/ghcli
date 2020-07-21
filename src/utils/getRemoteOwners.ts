import { git } from "../git";
//@ts-ignore no types
import * as gh from "parse-github-url";

export async function getRemoteOwners() {
  const remotes = await git.getRemotes(true);
  const newRemotes = remotes.filter(
    (el) =>
      el.refs.push.startsWith("https://github.com/") ||
      el.refs.push.startsWith("git@github.com:")
  );
  if (newRemotes.length > 0) {
    const remote = newRemotes[0].refs.push;

    const parsedUrl = gh(remote);
    return [parsedUrl.owner, parsedUrl.name];
  } else {
    console.log("remote must include github");
    process.exit(0);
  }
}
