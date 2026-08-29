import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Suspense } from "react";

import { NewsFeed } from "~/components/news/NewsFeed";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";

export default async function News() {
  const session = await auth();
  const role = session.sessionClaims?.metadata?.role;
  const canCreatePost = role === "admin" || role === "author";

  return (
    <div className="flex flex-col justify-center align-middle">
      <section className="bg-accent">
        <div className="responsiveContainer flex h-full flex-col items-center justify-between gap-6 py-12 sm:py-16">
          <h1 className="break-words text-center font-din text-3xl font-bold">
            News
          </h1>

          <p className="max-w-3xl text-center text-lg sm:text-2xl">
            Stay up to date with the latest news and events in the PVD Code &
            Coffee community!
          </p>
        </div>
      </section>

      <section className="bg-gray-100">
        <div className="responsiveContainer flex flex-col gap-8 py-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-din text-3xl font-semibold">Latest News</h2>

            {canCreatePost && (
              <Button asChild variant="cncDefault">
                <Link href="/news/editor">New Post</Link>
              </Button>
            )}
          </div>

          <Suspense
            fallback={
              <div className="flex items-center justify-center gap-2 py-16 text-neutral-600">
                <Spinner className="size-8" />
                <span>Loading news…</span>
              </div>
            }
          >
            <NewsFeed />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
