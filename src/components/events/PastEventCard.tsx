import Image from "next/image";
import { Calendar, Clock, ExternalLink, Users } from "lucide-react";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { dateConstructor } from "~/utils/dateUtils";
import type { MeetupEvent } from "~/server/api/routers/meetup";
import Link from "next/link";
import { eventPageHref } from "~/utils/eventUtils";

export default function PastEventCard(event: MeetupEvent) {
  return (
    <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative h-48">
        <Image
          src={event.eventPhoto ?? "/placeholder.svg"}
          alt={event.name}
          fill
          className="object-cover"
        />
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        <Link href={eventPageHref(event.name)}>
          <h4 className="font-din hover:text-accentRed">{event.name}</h4>
        </Link>

        <div className="mt-3 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="mr-2 h-4 w-4 text-accent" />

            <span>{dateConstructor(event.dateTime, event.endTime)[0]}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Clock className="mr-2 h-4 w-4 text-accent" />

            <span>{dateConstructor(event.dateTime, event.endTime)[1]}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Users className="mr-2 h-4 w-4 text-accent" />

            <span>{event.attendeeCount} attendees</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-end p-4 pt-0">
        <Link
          href={event.eventUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-20 text-neutral-600 hover:text-blue-600"
        >
          <ExternalLink className="h-6 w-6" />
          <span className="sr-only">View event on Meetup</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
