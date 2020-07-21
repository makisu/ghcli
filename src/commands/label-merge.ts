import { Command, flags } from "@oclif/command";
import { getConfigAccessToken } from "../utils/getConfigAccessToken";
import { getAuthenticatedOctokit } from "../utils/getOctokit";
import { getRemoteOwners } from "../utils/getRemoteOwners";
import { sleep } from "../utils/sleep";
import { listMergeConflicts } from "../utils/listMergeConflicts";
import { config } from "../config";

async function merge(
  // @ts-ignore
  octokit,
  owner: string,
  repo: string,
  prNum: number,
  base: string,
  label: string
) {
  try {
    await octokit.pulls.merge({
      owner,
      repo,
      pull_number: prNum,
      base: base,
    });

    console.log(`Successfully merged: PR#${prNum}`);
    config.set(`${owner}:${repo}:recent-branch`, base.trim());
  } catch (error) {
    const hasMergeConflicts = await listMergeConflicts(
      octokit,
      owner,
      repo,
      label
    );

    if (!hasMergeConflicts) {
      if (
        error.message ===
        "Base branch was modified. Review and try the merge again."
      ) {
        await sleep(3000);
        await merge(octokit, owner, repo, prNum, base, label);
      }
    }
    // process.exit(0);
  }
}

export default class LabelMerge extends Command {
  static description =
    "🔍 finds all open PRs tagged with label {X} on a repo and merge them into branch {Y}";

  static flags = {
    help: flags.help({ char: "h" }),
    label: flags.string({ char: "l", required: true, description: "pr label" }),
    branch: flags.string({
      char: "b",
      required: true,
      description: "target branch",
    }),
  };

  async run() {
    const { flags } = this.parse(LabelMerge);
    const accessToken: string = await getConfigAccessToken();

    if (accessToken) {
      const octokit = getAuthenticatedOctokit(accessToken);
      //@ts-ignore
      const [owner, repo] = await getRemoteOwners();
      // get remote branches
      // and check if branch is in remote
      try {
        const { data: branchData } = await octokit.repos.listBranches({
          owner,
          repo,
          per_page: 10000,
        });
        const listOfBranches = branchData.map((el) => el.name);

        if (!listOfBranches.includes(flags.branch.trim())) {
          console.log("branch does not exist on remote repo");
          process.exit(0);
        }
      } catch (error) {
        console.log(error.message);
      }

      const pullsWithLabels = (
        await octokit.pulls.list({
          owner,
          repo,
        })
      ).data.filter((el) => {
        const labels = el.labels.map((el) => el.name);
        return labels.includes(flags.label);
      });

      if (pullsWithLabels.length > 0) {
        console.log("Merging...");
        // updates all the bases of PRs
        pullsWithLabels.map(async (el) => {
          // to avoid rate-limiting
          await sleep(3000);
          try {
            await octokit.pulls.update({
              owner,
              repo,
              pull_number: el.number,
              base: flags.branch,
            });
          } catch (error) {
            // console.log(error.message);

            process.exit(0);
          }
        });

        // merges them
        pullsWithLabels.map(async (el) => {
          // to avoid rate-limiting
          await sleep(3000);
          await merge(
            octokit,
            owner,
            repo,
            el.number,
            flags.branch,
            flags.label
          );
        });
      } else {
        console.log("no open PRs with that label");
      }
    }
  }
}
