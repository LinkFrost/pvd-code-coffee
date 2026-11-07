import { z } from "zod";
import { graphqlClient } from "~/utils/graphQLUtils";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const MEETUP_GROUP_URLNAME = "providence-code-coffee ";

type MeetupEventNode = {
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

export interface MeetupEventsResponse {
  groupByUrlname: {
    id: string;
    events: {
      edges: {
        node: MeetupEventNode;
      }[];
    };
  };
}

export interface MeetupEventResponse {
  event: MeetupEventNode | null;
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

const mapMeetupEvent = (node: MeetupEventNode): MeetupEvent => ({
  id: node.id,
  name: node.title,
  description: node.description,
  dateTime: node.dateTime,
  endTime: node.endTime,
  venue: node.venues[0],
  eventUrl: node.eventUrl,
  eventPhoto: node.featuredEventPhoto?.standardUrl,
  attendeeCount: node.rsvps.totalCount,
});

const fetchEventById = async (eventId: string): Promise<MeetupEvent | null> => {
  const query = `
    query GetEvent($eventId: ID!) {
      event(id: $eventId) {
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
  `;

  const response = await graphqlClient.request<MeetupEventResponse>(query, {
    eventId,
  });

  if (!response.event) {
    return null;
  }

  return mapMeetupEvent(response.event);
};

const findEventIdByTitle = async (title: string): Promise<string | null> => {
  const query = `
    {
      groupByUrlname(urlname: "${MEETUP_GROUP_URLNAME}") {
        upcoming: events(first: 5) {
          edges {
            node {
              id
              title
            }
          }
        }
        past: events(first: 50 status: PAST sort: DESC) {
          edges {
            node {
              id
              title
            }
          }
        }
      }
    }
  `;

  const response = await graphqlClient.request<{
    groupByUrlname: {
      upcoming: { edges: { node: { id: string; title: string } }[] };
      past: { edges: { node: { id: string; title: string } }[] };
    } | null;
  }>(query);

  const group = response.groupByUrlname;

  if (!group) {
    return null;
  }

  const upcomingMatch = group.upcoming.edges.find(
    (edge) => edge.node.title === title,
  );

  if (upcomingMatch) {
    return upcomingMatch.node.id;
  }

  const pastMatch = group.past.edges.find((edge) => edge.node.title === title);

  if (pastMatch) {
    return pastMatch.node.id;
  }

  return null;
};

export const meetupRouter = createTRPCRouter({
  getEvents: publicProcedure
    .input(z.enum(["PAST", "UPCOMING"]))
    .query(async ({ input }) => {
      const query = `
      {
        groupByUrlname(urlname: "${MEETUP_GROUP_URLNAME}") {
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
          await graphqlClient.request<MeetupEventsResponse>(query);

        return response.groupByUrlname.events.edges.map((event) =>
          mapMeetupEvent(event.node),
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        throw new Error("Failed to fetch data from Meetup API", err);
      }
    }),
  getEventById: publicProcedure.input(z.string()).query(async ({ input }) => {
    try {
      return await fetchEventById(input);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw new Error("Failed to fetch data from Meetup API", err);
    }
  }),
  getEventByTitle: publicProcedure
    .input(z.object({ title: z.string().trim().min(1) }))
    .query(async ({ input }) => {
      try {
        const eventId = await findEventIdByTitle(input.title);

        if (!eventId) {
          return null;
        }

        return await fetchEventById(eventId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        throw new Error("Failed to fetch data from Meetup API", err);
      }
    }),
});
