"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { api, type RouterOutputs } from "~/trpc/react";
import { formatDate } from "~/utils/dateUtils";
import {
  newsPostStatusBadgeClasses,
  newsPostStatusLabels,
} from "~/utils/newsUtils";
import { cn } from "~/utils/tailwindUtils";

type ManageablePost = RouterOutputs["news"]["getManageablePosts"][number];

const authorName = (post: ManageablePost) => {
  const fullName = [post.author_first_name, post.author_last_name]
    .filter(Boolean)
    .join(" ");

  return fullName.length > 0
    ? fullName
    : (post.author_username ?? "Unknown author");
};

export function ManageableNewsPosts() {
  const posts = api.news.getManageablePosts.useQuery();

  if (posts.isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-neutral-600">
        <Spinner className="size-6" />
        <span>Loading your posts…</span>
      </div>
    );
  }

  if (posts.isError) {
    return (
      <p className="py-6 text-neutral-600">
        Your saved posts could not be loaded.
      </p>
    );
  }

  if (!posts.data?.length) {
    return (
      <p className="py-6 text-neutral-600">
        You have not created any news posts yet.
      </p>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {posts.data.map((post) => (
        <Card key={post.id} className="transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="font-din text-xl">{post.title}</CardTitle>
              <Badge className={cn(newsPostStatusBadgeClasses[post.status])}>
                {newsPostStatusLabels[post.status]}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-2 text-sm text-neutral-600">
            <p>By {authorName(post)}</p>
            <p>Updated {formatDate(post.updated_on)}</p>
          </CardContent>

          <CardFooter>
            <Button asChild variant="outline" size="sm">
              <Link href={`/news/editor/${post.id}`}>
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
