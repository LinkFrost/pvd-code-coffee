import { z } from "zod";
import { graphqlClient } from "~/lib/graphql-client";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export type MeetupResponse = {
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
  getPastEvents: publicProcedure.query(async () => {
    const query = `
      {
        groupByUrlname(urlname: "providence-code-coffee ") {
          id
          events(status: PAST) {
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
      const response = await graphqlClient.request<MeetupResponse>(query);

      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw new Error("Failed to fetch data from Meetup API", err);
    }
  }),
});
