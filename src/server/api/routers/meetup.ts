import { z } from "zod";
import { graphqlClient } from "~/lib/graphql-client";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export interface MeetupEventResponse {
  groupByUrlname: {
    id: string;
    events: {
      edges: [
        {
          node: {
            id: string;
            title: string;
            description: string;
            dateTime: string;
            endTime: string;
            eventUrl: string;
            rsvps: {
              totalCount: number;
            };
            venues: {
              name: string;
              address: string;
              city: string;
              postalCode: string;
              state: string;
            }[];
            featuredEventPhoto: { id: string; standardUrl: string } | null;
          };
        },
      ];
    };
  };
}

export interface MeetupEvent {
  id: string;
  name: string;
  description: string;
  dateTime: string;
  endTime: string;
  venue:
    | {
        name: string;
        address: string;
        city: string;
        postalCode: string;
        state: string;
      }
    | undefined;
  eventUrl: string;
  eventPhoto: string | undefined;
  attendeeCount: number;
}

export const meetupRouter = createTRPCRouter({
  getEvents: publicProcedure
    .input(z.enum(["PAST", "UPCOMING"]))
    .query(async ({ input }) => {
      const query = `
      {
        groupByUrlname(urlname: "providence-code-coffee ") {
          id
          events(${input === "UPCOMING" ? "first: 1" : "first: 6 status: PAST sort: DESC"}) {
            edges {
              node {
                id
                title
                description
                dateTime
                endTime
                eventUrl
                rsvps {
                  totalCount
                }
                venues {
                  name
                  address
                  city
                  postalCode
                  state
                }
                featuredEventPhoto {
                  id
                  standardUrl
                }
                photoAlbum {
                  photoCount
                }
              }
            }
          }
        }
      }
    `;

      try {
        const response =
          await graphqlClient.request<MeetupEventResponse>(query);

        const events: MeetupEvent[] = response.groupByUrlname.events.edges.map(
          (event) => ({
            id: event.node.id,
            name: event.node.title,
            description: event.node.description,
            dateTime: event.node.dateTime,
            endTime: event.node.endTime,
            venue: event.node.venues[0],
            eventUrl: event.node.eventUrl,
            eventPhoto: event.node.featuredEventPhoto?.standardUrl,
            attendeeCount: event.node.rsvps.totalCount,
          }),
        );

        return events;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        throw new Error("Failed to fetch data from Meetup API", err);
      }
    }),
});
