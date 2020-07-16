import { Command, flags } from "@oclif/command";
import { getConfigAccessToken } from "../utils/getConfigAccessToken";
import { getAuthenticatedOctokit } from "../utils/getOctokit";
import { getRemoteOwners } from "../utils/getRemoteOwners";
import { sleep } from "../utils/sleep";
import { listMergeConflicts } from "../utils/listMergeConflicts";
import { config } from "../config";

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
            console.log(error.message);
            process.exit(0);
          }
        });
        // merges them
        pullsWithLabels.map(async (el) => {
          // to avoid rate-limiting
          await sleep(3000);
          try {
            await octokit.pulls.merge({
              owner,
              repo,
              pull_number: el.number,
              base: flags.branch,
            });
            console.log(`Successfully merged: PR#${el.number}`);
            config.set(`${owner}:${repo}:recent-branch`, flags.branch.trim());
          } catch (error) {
            const hasMergeConflicts = await listMergeConflicts(
              octokit,
              owner,
              repo,
              flags.label
            );

            if (!hasMergeConflicts) {
              console.log(error.message);
            }
            // process.exit(0);
          }
        });
      } else {
        console.log("no open PRs with that label");
      }
    }
  }
}
