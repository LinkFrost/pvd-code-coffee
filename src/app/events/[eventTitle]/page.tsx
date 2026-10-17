import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { api, apiResult } from "~/trpc/server";
import { dateConstructor } from "~/utils/dateUtils";
import { parseEventDescription } from "~/utils/eventUtils";
import { markdownComponents } from "~/utils/markdownUtils";

export default async function EventPage(props: {
  params: Promise<{ eventTitle: string }>;
}) {
  const params = await props.params;
  const title = decodeURIComponent(params.eventTitle);
  const eventResult = await apiResult(api.meetup.getEventByTitle({ title }));

  if (!eventResult.success) {
    return (
      <div className="responsiveContainer flex min-h-[50vh] items-center justify-center py-16">
        <p className="font-din text-xl text-neutral-600">
          This event could not be loaded right now.
        </p>
      </div>
    );
  }

  const event = eventResult.data;

  if (!event) {
    notFound();
  }

  const [eventDate, eventTime] = dateConstructor(event.dateTime, event.endTime);
  const { short, full } = parseEventDescription(event.description);
  const location = event.venue?.name?.trim() ?? "Location TBA";

  return (
    <article className="flex flex-col">
      <header className="bg-accent">
        <div className="responsiveContainer flex flex-col items-center gap-5 py-12 text-center sm:py-16">
          <h1 className="max-w-4xl break-words font-din text-3xl font-bold md:text-4xl">
            {event.name}
          </h1>

          <div className="flex flex-col items-center gap-4 text-lg text-neutral-800 md:flex-row">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-black" />
              <span>{eventDate}</span>
            </div>

            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-black" />
              <span>{eventTime}</span>
            </div>

            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-black" />
              <span>{location}</span>
            </div>
          </div>

          {short ? <p className="max-w-3xl text-lg">{short}</p> : null}

          {event.attendeeCount > 0 ? (
            <div className="flex items-center text-lg text-neutral-800">
              <Users className="mr-2 h-4 w-4 text-black" />
              <span>{event.attendeeCount} attendees</span>
            </div>
          ) : null}
        </div>
      </header>

      <section className="bg-gray-100">
        <div className="responsiveContainer py-10">
          <div className="whitespace-pre-wrap text-lg text-neutral-800">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {full.trim() ? full : "No description provided yet."}
            </Markdown>
          </div>
        </div>
      </section>
    </article>
  );
}
