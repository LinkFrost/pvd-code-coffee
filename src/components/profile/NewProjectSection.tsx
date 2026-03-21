import { clerkClient } from "@clerk/nextjs/server";

import { provider } from "~/lib/constants";
import { NewProjectDialog } from "~/components/profile/NewProjectDialog";

export type GithubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
};

export async function NewProjectSection({
  username,
  userId,
}: {
  username: string;
  userId: string | null | undefined;
}) {
  let githubRepos: GithubRepo[] = [];

  if (userId) {
    try {
      const clerk = await clerkClient();
      const clerkResponse = await clerk.users.getUserOauthAccessToken(
        userId,
        provider,
      );
      const accessToken = clerkResponse.data[0]?.token;

      if (accessToken) {
        const response = await fetch("https://api.github.com/user/repos", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (response.ok) {
          githubRepos = (await response.json()) as GithubRepo[];
        }
      }
    } catch (error) {
      console.log("Clerk OAuth token not found:", error);
    }
  }

  return <NewProjectDialog username={username} githubRepos={githubRepos} />;
}
