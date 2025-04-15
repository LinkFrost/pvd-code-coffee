import Image from "next/image";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { dateConstructor } from "~/lib/dateConstructor";
import type { MeetupEvent } from "~/server/api/routers/meetup";

export const UpcomingEventCard = (event: MeetupEvent) => {
  return (
    <Card className="overflow-hidden border-2 border-accent border-opacity-50 shadow-md">
      <div className="md:flex">
        <div className="relative h-60 md:h-auto md:w-1/3">
          <Image
            src={event.eventPhoto ?? "/placeholder.svg"}
            alt={event.name}
            fill
            className="object-cover"
          />
        </div>

        <CardContent className="p-6 md:w-2/3">
          <h4 className="font-din text-xl">{event.name}</h4>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-gray-600">
              <Calendar className="mr-2 h-4 w-4 text-accent" />

              <span>{dateConstructor(event.dateTime, event.endTime)}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin className="mr-2 h-4 w-4 text-accent" />

              <span>{event.venue?.name}</span>
            </div>
          </div>

          <p className="mt-4 text-gray-700">
            {event.description.split("\n")[0]?.split("Short Description: ")}
          </p>

          <div className="mt-6">
            <Button
              className="font-din text-black"
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
