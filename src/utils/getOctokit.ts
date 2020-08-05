import { Octokit } from "@octokit/rest";

export function getAuthenticatedOctokit(accessToken: string) {
  return new Octokit({ auth: `token ${accessToken}` });
}
