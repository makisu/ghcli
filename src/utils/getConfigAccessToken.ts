import { git } from "../git";
import { startAuthFlow } from "../auth/getAccessToken";
import { config } from "../config";

export async function getConfigAccessToken(): Promise<string> {
  try {
    // check if git repo
    await git.status();
    // check if remote has github
    const remotes = await git.getRemotes(true);
    if (remotes.length === 0) {
      console.log("remote must include github");
      process.exit(0);
    }
    remotes.forEach((el) => {
      if (!el.refs.push.startsWith("https://github.com/")) {
        console.log("remote must include github");
        process.exit(0);
      }
    });
    if (!config.has("accessToken")) {
      console.log("No access token found.");
      console.log("Logging you in...");
      console.log("opening browser...");
      await startAuthFlow();
      return "";
    }

    //@ts-ignore
    return config.get("accessToken");
  } catch (error) {
    console.log(
      "Error: fatal: not a git repository (or any of the parent directories): .git"
    );

    process.exit(0);
  }
}
