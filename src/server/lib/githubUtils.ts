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
 * Fetches README.md via the GitHub API, which resolves the default branch
 * automatically in a single request.
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

  const apiUrl = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/readme`;

  const res = await fetch(apiUrl, {
    headers: {
      Accept: "application/vnd.github.raw+json",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.log("[project readme] not found", {
      githubUrl,
      owner: parsed.owner,
      repo: parsed.repo,
      status: res.status,
    });

    return null;
  }

  const text = await res.text();

  console.log("[project readme] fetched", {
    githubUrl,
    bytes: text.length,
  });

  return text;
};
