import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { dateConstructor } from "~/utils/dateUtils";
import { eventPageHref, parseEventDescription } from "~/utils/eventUtils";
import { api } from "~/trpc/server";

export const UpcomingEventCard = async () => {
  const upcomingEvent = await api.meetup.getEvents("UPCOMING");
  const event = upcomingEvent[0];

  if (!event) {
    return <p className="text-center text-lg">No Upcoming Events</p>;
  }

  const { short } = parseEventDescription(event.description);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="md:flex">
        <div className="relative md:w-1/3">
          <Image
            src={event.eventPhoto ?? "/placeholder.svg"}
            alt={event.name}
            fill
            className="!static object-contain md:pl-6"
          />
        </div>

        <CardContent className="flex flex-1 flex-col p-6 md:w-2/3">
          <Link href={eventPageHref(event.name)}>
            <h4 className="font-din text-xl hover:text-accentRed">
              {event.name}
            </h4>
          </Link>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="mr-2 h-4 w-4 text-accent" />

              <div className="flex flex-col">
                <span>{dateConstructor(event.dateTime, event.endTime)[0]}</span>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <Clock className="mr-2 h-4 w-4 text-accent" />

              <div className="flex flex-col">
                <span>{dateConstructor(event.dateTime, event.endTime)[1]}</span>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin className="mr-2 h-4 w-4 text-accent" />

              <span>{event.venue?.name}</span>
            </div>
          </div>

          {short ? <p className="mt-4 text-gray-700">{short}</p> : null}

          <div className="mt-auto flex items-end justify-end gap-4 pt-6">
            <Button
              className="font-din text-white"
              variant={"cncDefault"}
              asChild
            >
              <a
                href={event.eventUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                RSVP Now <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
