import { HydrateClient } from "../trpc/server";
import { UpcomingEventCard } from "~/components/UpcomingEventCard";
import { Suspense } from "react";
import { UpcomingEventCard_Loading } from "~/components/loading/UpcomingEventCard_Loading";
import { PastEvents } from "~/components/PastEvents";

export default async function HomePage() {
  return (
    <HydrateClient>
      <div className="flex flex-col justify-center align-middle">
        <section className="bg-accent">
          <div className="responsiveContainer flex flex-col items-center py-12">
            <h1 className="mb-4 break-words font-din text-3xl font-bold">
              Welcome to Code & Coffee!
            </h1>

            <p className="max-w-3xl text-center text-2xl">
              The community-led meetup for devs to get together and
              professionally grow.
            </p>
          </div>
        </section>

        <section className="bg-gray-100">
          <div className="responsiveContainer flex flex-col gap-8 py-12">
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
              <Suspense fallback={<UpcomingEventCard_Loading />}>
                <UpcomingEventCard />
              </Suspense>
            </div>
            <div>
              <h3 className="mb-4 font-din text-2xl font-semibold">
                Past Events
              </h3>
              <Suspense fallback={<UpcomingEventCard_Loading />}>
                <PastEvents />
              </Suspense>
            </div>
          </div>
        </section>
      </div>
    </HydrateClient>
  );
}
