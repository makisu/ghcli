import { Command, flags } from "@oclif/command";
import { config } from "../config";
import { getConfigAccessToken } from "../utils/getConfigAccessToken";
import { getRemoteOwners } from "../utils/getRemoteOwners";
import { getAuthenticatedOctokit } from "../utils/getOctokit";
import cli from "cli-ux";
import { listMergeConflicts } from "../utils/listMergeConflicts";

export default class PrMerge extends Command {
  static description = "🖇 Create a PR that merges branch Y into branch {Z}";
  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    branch: flags.string({
      char: "b",
      description: "target branch",
      required: true,
    }),
  };

  async run() {
    const { flags } = this.parse(PrMerge);
    const accessToken = await getConfigAccessToken();

    if (accessToken) {
      const octokit = getAuthenticatedOctokit(accessToken);
      //@ts-ignore
      const [owner, repo] = await getRemoteOwners();

      if (!config.has(`${owner}:${repo}:recent-branch`)) {
        console.log("No recent branch has been added with `label-merge`.");
        process.exit(1);
      }

      const recentBranch = config.get(`${owner}:${repo}:recent-branch`);
      if (recentBranch === flags.branch.trim()) {
        console.log("Recent branch is the same as passed branch option");
        process.exit(1);
      }
      // get remote branches
      // and check if branch is in remote
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
      // end check

      const willMerge = await cli.confirm(
        `Do you want to merge the PR of ${recentBranch} to ${flags.branch}? (y/n)`
      );

      const data = await octokit.pulls.create({
        owner,
        repo,
        title: `Merge ${recentBranch} to ${flags.branch}`,
        head: recentBranch as string,
        base: flags.branch.trim(),
      });

      if (willMerge) {
        await cli.wait(1000);
        try {
          await octokit.pulls.merge({
            owner,
            repo,
            pull_number: data.data.number,
          });

          console.log("Your pull request has been merged.");
        } catch (error) {
          const hasMergeConflicts = await listMergeConflicts(
            octokit,
            owner,
            repo,
            ""
          );

          if (!hasMergeConflicts) {
            console.log(error.message);
          }
        }
      } else {
        console.log("A pull request has been created!");
        console.log("View it at:");
        await cli.url(`${data.data.html_url}`, data.data.html_url);
      }
    }
  }
}
