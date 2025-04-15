import Image from "next/image";
import { Calendar, Users } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { dateConstructor } from "~/lib/dateConstructor";
import type { MeetupEvent } from "~/server/api/routers/meetup";

export default function PastEventCard(event: MeetupEvent) {
  return (
    <Card className="h-full overflow-hidden border border-accent border-opacity-30 shadow-md hover:border-2">
      <div className="relative h-48">
        <Image
          src={event.eventPhoto ?? "/placeholder.svg"}
          alt={event.name}
          fill
          className="object-cover"
        />
      </div>

      <CardContent className="p-4">
        <h4 className="font-din">{event.name}</h4>

        <div className="mt-3 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="mr-2 h-4 w-4 text-accent" />

            <span>{dateConstructor(event.dateTime, event.endTime)}</span>
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
