import Image from "next/image";
import { Calendar, Clock, Users } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { dateConstructor } from "~/lib/dateConstructor";
import type { MeetupEvent } from "~/server/api/routers/meetup";
import Link from "next/link";

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

      <CardContent className="p-4">
        <Link href={event.eventUrl} target="_blank" rel="noopener noreferrer">
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
    </Card>
  );
}
