const parseGithubOwnerRepo = (
  url: string,
): { owner: string; repo: string } | null => {
  try {
    const u = new URL(url);
    if (u.hostname !== "github.com" && u.hostname !== "www.github.com") {
      return null;
    }
    const parts = u.pathname.replace(/\/$/, "").split("/").filter(Boolean);
    if (parts.length < 2) {
      return null;
    }
    const owner = parts[0];
    const repoSegment = parts[1];
    if (!owner || !repoSegment) {
      return null;
    }
    return {
      owner,
      repo: repoSegment.replace(/\.git$/i, ""),
    };
  } catch {
    return null;
  }
};

/**
 * Fetches README.md from the default branch (main, then master) via raw.githubusercontent.com.
 * Logs the outcome for debugging.
 */
export const fetchProjectReadme = async (
  githubUrl: string | null | undefined,
): Promise<string | null> => {
  if (!githubUrl?.trim()) {
    console.log("[project readme] skipped: no github url");
    return null;
  }

  const parsed = parseGithubOwnerRepo(githubUrl.trim());
  if (!parsed) {
    console.log("[project readme] could not parse url", { githubUrl });
    return null;
  }

  for (const branch of ["main", "master"] as const) {
    const rawUrl = `https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/${branch}/README.md`;
    const res = await fetch(rawUrl, { next: { revalidate: 3600 } });

    if (res.ok) {
      const text = await res.text();
      console.log("[project readme] fetched", {
        githubUrl,
        branch,
        bytes: text.length,
      });
      return text;
    }
  }

  console.log("[project readme] not found on main/master", {
    githubUrl,
    owner: parsed.owner,
    repo: parsed.repo,
  });
  return null;
};
