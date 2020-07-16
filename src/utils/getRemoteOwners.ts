import { git } from "../git";
import { parse } from "url";

export async function getRemoteOwners() {
  const remotes = await git.getRemotes(true);
  const newRemotes = remotes.filter((el) =>
    el.refs.push.startsWith("https://github.com/")
  );
  if (newRemotes.length > 0) {
    const remote = newRemotes[0].refs.push;
    const splitRepoOwner = parse(remote).pathname?.split("/").slice(1);
    // @ts-ignore
    splitRepoOwner[1] = splitRepoOwner[1].replace(/.git+$/g, "");
    return splitRepoOwner;
  } else {
    console.log("remote must include github");
    process.exit(0);
  }
}
