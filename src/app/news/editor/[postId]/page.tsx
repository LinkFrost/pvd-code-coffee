import Link from "next/link";
import { notFound } from "next/navigation";

import { NewsEditor } from "~/components/news/NewsEditor";
import { Button } from "~/components/ui/button";
import { requireNewsAuthor } from "~/server/auth/news";
import { api } from "~/trpc/server";
import type { RouterOutputs } from "~/trpc/react";

export default async function EditNewsPostPage(props: {
  params: Promise<{ postId: string }>;
}) {
  await requireNewsAuthor();

  const params = await props.params;
  const postId = Number(params.postId);

  if (!Number.isInteger(postId) || postId <= 0) {
    notFound();
  }

  let post: RouterOutputs["news"]["getPostForEditing"];

  try {
    post = await api.news.getPostForEditing({ postId });
  } catch {
    notFound();
  }

  return (
    <div className="flex flex-col justify-center align-middle">
      <section className="bg-accent">
        <div className="responsiveContainer flex flex-col items-center gap-6 py-12 sm:py-16">
          <h1 className="break-words text-center font-din text-3xl font-bold">
            Edit News Post
          </h1>

          <Button asChild variant="outline">
            <Link href="/news/editor">Back to News Editor Dashboard</Link>
          </Button>
        </div>
      </section>

      <section className="bg-gray-100">
        <div className="responsiveContainer py-10">
          <NewsEditor post={post} />
        </div>
      </section>
    </div>
  );
}
