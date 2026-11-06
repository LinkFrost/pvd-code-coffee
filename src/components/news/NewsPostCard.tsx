import Link from "next/link";

import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatDate } from "~/utils/dateUtils";
import {
  newsPostCategoryBadgeClasses,
  type NewsPostCategory,
} from "~/utils/newsUtils";
import { cn } from "~/utils/tailwindUtils";

type NewsPostCardProps = {
  title: string;
  category: NewsPostCategory;
  shortDescription: string;
  authorUsername: string | null;
  createdOn: Date;
  updatedOn: Date;
};

export function NewsPostCard({
  title,
  category,
  shortDescription,
  authorUsername,
  createdOn,
  updatedOn,
}: NewsPostCardProps) {
  const postHref = `/news/${encodeURIComponent(title)}`;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <Link href={postHref} aria-label={`Read ${title}`}>
          <CardTitle className="font-din text-2xl hover:text-accentRed">
            {title}
          </CardTitle>
        </Link>

        <CardDescription>
          By{" "}
          {authorUsername ? (
            <Link
              href={`/profile/${encodeURIComponent(authorUsername)}`}
              className="font-medium hover:text-accentRed"
            >
              {authorUsername}
            </Link>
          ) : (
            <span className="font-medium">
              {authorUsername ?? "Unknown author"}
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-neutral-700">{shortDescription}</p>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-4">
        <Badge
          variant="secondary"
          className={cn("font-normal", newsPostCategoryBadgeClasses[category])}
        >
          {category}
        </Badge>

        <div className="space-y-1 text-xs text-neutral-500">
          <p>Created: {formatDate(createdOn)}</p>
          <p>Updated: {formatDate(updatedOn)}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
