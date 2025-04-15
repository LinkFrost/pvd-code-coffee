import { api } from "~/trpc/server";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import PastEventCard from "./PastEventCard";

export const PastEvents = async () => {
  const pastEvents = await api.meetup.getEvents("PAST");

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {pastEvents.map((event) => (
          <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
            <PastEventCard
              id={event.id}
              name={event.name}
              description={event.description}
              dateTime={event.dateTime}
              endTime={event.endTime}
              venue={event.venue}
              eventUrl={event.eventUrl}
              eventPhoto={event.eventPhoto}
              attendeeCount={event.attendeeCount}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};
