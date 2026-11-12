import { NewsPostCard } from "~/components/news/NewsPostCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { api } from "~/trpc/server";

export const LatestNews = async () => {
  const posts = await api.news.getLatestPublishedPosts();

  if (posts.length === 0) {
    return (
      <p className="text-center text-lg text-neutral-600">
        No news posts have been published yet.
      </p>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {posts.map((post) => (
          <CarouselItem key={post.id} className="basis-1/2">
            <NewsPostCard
              title={post.title}
              category={post.category}
              shortDescription={post.short_description}
              authorUsername={post.author_username}
              createdOn={post.created_on}
              updatedOn={post.updated_on}
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};
