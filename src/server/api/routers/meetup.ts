import { z } from "zod";
import { graphqlClient } from "~/lib/graphql-client";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export type MeetupEventResponse = {
  groupByUrlname: {
    id: string;
    events: {
      edges: [
        {
          node: {
            id: string;
            title: string;
            dateTime: string;
            featuredEventPhoto: { id: string; standardUrl: string } | null;
          };
        },
      ];
    };
  };
};

export const meetupRouter = createTRPCRouter({
  getEvents: publicProcedure
    .input(z.enum(["PAST", "UPCOMING"]))
    .query(async ({ input }) => {
      const query = `
      {
        groupByUrlname(urlname: "providence-code-coffee ") {
          id
          events(${input === "UPCOMING" ? "first: 1" : "status: PAST"}) {
            edges {
              node {
                id
                title
                dateTime
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

        return response.groupByUrlname.events.edges.map((event) => ({
          id: event.node.id,
          title: event.node.title,
          dateTime: event.node.dateTime,
          featuredEventPhoto: event.node.featuredEventPhoto?.standardUrl,
        }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        throw new Error("Failed to fetch data from Meetup API", err);
      }
    }),
});
