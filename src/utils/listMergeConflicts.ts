import { Octokit } from "@octokit/rest";
import { sleep } from "./sleep";
import { cli } from "cli-ux";

export async function listMergeConflicts(
  octokit: Octokit,
  owner: string,
  repo: string,
  label: string
): Promise<boolean> {
  let hasMergeConflicts = false;

  if (!label) {
    const prs = (
      await octokit.pulls.list({
        owner,
        repo,
      })
    ).data.map((el) => el.number);

    prs.forEach(async (el) => {
      await sleep(2000);
      const data = await octokit.pulls.get({
        owner,
        repo,
        pull_number: el,
      });

      const { data: prData } = data;
      if (!prData.mergeable) {
        hasMergeConflicts = true;
        console.log("Failed to merge");
        console.log(`${prData.head.label} -> ${prData.base.label}`);
        console.log(`PR Number: ${prData.number}`);
        await cli.url(`Github Link: ${prData.html_url}`, prData.html_url);
      }
    });

    return hasMergeConflicts;
  } else {
    const prs = (
      await octokit.pulls.list({
        owner,
        repo,
      })
    ).data
      .filter((el) => {
        const labels = el.labels.map((el) => el.name);
        return labels.includes(label);
      })
      .map((el) => el.number);

    prs.forEach(async (el) => {
      await sleep(2000);
      const data = await octokit.pulls.get({
        owner,
        repo,
        pull_number: el,
      });

      const { data: prData } = data;
      if (!prData.mergeable) {
        hasMergeConflicts = true;
        console.log("Failed to merge");
        console.log(`${prData.head.label} -> ${prData.base.label}`);
        console.log(`PR Number: ${prData.number}`);
        await cli.url(`Github Link: ${prData.html_url}`, prData.html_url);
      }
    });

    return hasMergeConflicts;
  }
}
