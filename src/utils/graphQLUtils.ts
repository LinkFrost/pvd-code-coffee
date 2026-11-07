import { GraphQLClient } from "graphql-request";
import { env } from "../env.js";

export const graphqlClient = new GraphQLClient(env.MEETUP_GRAPHQL_ENDPOINT);
