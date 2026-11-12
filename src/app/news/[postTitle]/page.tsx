import { auth } from "@clerk/nextjs/server";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NewsPostContent } from "~/components/news/NewsPostContent";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { api, apiResult } from "~/trpc/server";
import { formatDate } from "~/utils/dateUtils";
import { newsPostCategoryBadgeClasses } from "~/utils/newsUtils";
import { cn } from "~/utils/tailwindUtils";

export default async function NewsPostPage(props: {
  params: Promise<{ postTitle: string }>;
}) {
  const params = await props.params;
  const title = decodeURIComponent(params.postTitle);
  const postResult = await apiResult(
    api.news.getPublishedPostByTitle({ title }),
  );

  if (!postResult.success) {
    return (
      <div className="responsiveContainer flex min-h-[50vh] items-center justify-center py-16">
        <p className="font-din text-xl text-neutral-600">
          This news post could not be loaded right now.
        </p>
      </div>
    );
  }

  const post = postResult.data;

  if (!post) {
    notFound();
  }

  const session = await auth();
  const role = session.sessionClaims?.metadata?.role;
  const canEdit =
    role === "admin" ||
    (role === "author" &&
      Boolean(
        session.userId &&
          post.author_clerk_id &&
          session.userId === post.author_clerk_id,
      ));

  return (
    <article className="flex flex-col">
      <header className="bg-accent">
        <div className="responsiveContainer flex flex-col items-center gap-5 py-8 text-center">
          <h1 className="max-w-4xl break-words font-din text-2xl font-bold sm:text-3xl">
            {post.title}
          </h1>

          <p className="max-w-3xl text-lg sm:text-xl">
            {post.short_description}
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-8">
            <div className="space-y-1 text-sm text-neutral-700">
              <p className="text-center text-lg text-black sm:text-xl">
                By{" "}
                {post.author_username ? (
                  <Link
                    href={`/profile/${encodeURIComponent(post.author_username)}`}
                    className="font-medium hover:text-accentRed"
                  >
                    {post.author_username}
                  </Link>
                ) : (
                  <span className="font-medium">
                    {post.author_username ?? "Unknown author"}
                  </span>
                )}
              </p>
              <p>
                Created {formatDate(post.created_on)} · Updated{" "}
                {formatDate(post.updated_on)} ·{" "}
                <Badge
                  variant="secondary"
                  className={cn(
                    "font-normal",
                    newsPostCategoryBadgeClasses[post.category],
                  )}
                >
                  {post.category}
                </Badge>
              </p>
            </div>
            {canEdit && (
              <Button asChild variant="outline">
                <Link href={`/news/editor/${post.id}`}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <section className="bg-gray-100">
        <div className="responsiveContainer py-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <NewsPostContent content={post.content} />
          </div>
        </div>
      </section>
    </article>
  );
}
