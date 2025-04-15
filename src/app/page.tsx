import { api, HydrateClient } from "../trpc/server";
import { UpcomingEventCard } from "~/components/UpcomingEventCard";
import PastEventCard from "~/components/PastEventCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "~/components/ui/carousel";

export default async function HomePage() {
  const upcomingEvent = await api.meetup.getEvents("UPCOMING");
  const pastEvents = await api.meetup.getEvents("PAST");

  return (
    <HydrateClient>
      <main className="flex flex-col justify-center align-middle">
        <section className="bg-accent">
          <div className="responsiveContainer flex flex-col items-center py-12">
            <h1 className="mb-4 break-words font-din text-3xl font-bold">
              Welcome to Code & Coffee!
            </h1>

            <p className="max-w-3xl text-center text-xl">
              We are the Providence chapter for the community-led meetup for
              devs to get together and professionally grow! Join us as at our
              events where we share projects, ideas, stories, and of course,
              coffee. From complete novices to industry professionals with years
              of experience, everyone is welcome here as we foster an
              environment focused on the community.
            </p>
          </div>
        </section>

        <section className="bg-gray-100">
          <div className="responsiveContainer mx-auto flex flex-col gap-8 py-12">
            <div className="flex flex-col items-center">
              <h2 className="mb-4 text-center font-din text-3xl font-bold">
                Our Events
              </h2>
              <p className="max-w-3xl text-center text-xl">
                Join in on discussions surrounding tech, present a project you
                are working on, meet other people with similar (or completely
                different) interests, or simply use this space as a workspace!
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-din text-2xl font-semibold">
                Upcoming Event
              </h3>

              {upcomingEvent[0] && (
                <UpcomingEventCard
                  id={upcomingEvent[0].id}
                  name={upcomingEvent[0].name}
                  description={upcomingEvent[0].description}
                  dateTime={upcomingEvent[0].dateTime}
                  endTime={upcomingEvent[0].endTime}
                  venue={upcomingEvent[0].venue}
                  eventUrl={upcomingEvent[0].eventUrl}
                  eventPhoto={upcomingEvent[0].eventPhoto}
                  attendeeCount={upcomingEvent[0].attendeeCount}
                />
              )}
            </div>

            <div>
              <h3 className="mb-4 font-din text-2xl font-semibold">
                Past Events
              </h3>

              <Carousel className="w-full">
                <CarouselContent>
                  {pastEvents.map((event) => (
                    <CarouselItem
                      key={event.id}
                      className="md:basis-1/2 lg:basis-1/3"
                    >
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
            </div>
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
