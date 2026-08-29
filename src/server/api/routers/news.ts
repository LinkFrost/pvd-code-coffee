import { and, asc, desc, eq, ne, or, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  type NewsPostStatus,
  newsPostContentSchema,
  newsPostStatusSchema,
} from "~/utils/newsUtils";
import { db } from "~/server/db";
import { news_posts_table, users_table } from "~/server/db/schema";
import {
  createTRPCRouter,
  newsAuthorProcedure,
  publicProcedure,
} from "../trpc";

const newsPostIdSchema = z.object({
  postId: z.number().int().positive(),
});

export const getPublishedPostsInputSchema = z.object({
  search: z.string().trim().max(500).optional(),
  sortBy: z.enum(["updated_on", "created_on", "title"]).default("updated_on"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

const getDbUser = async (clerkUserId: string) => {
  const rows = await db
    .select({ id: users_table.id })
    .from(users_table)
    .where(eq(users_table.clerk_id, clerkUserId))
    .limit(1);

  const user = rows[0];

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Your user profile could not be found",
    });
  }

  return user;
};

const isTitleAvailable = async (title: string, excludePostId?: number) => {
  const titleClause = eq(news_posts_table.title, title);
  const whereClause =
    excludePostId === undefined
      ? titleClause
      : and(titleClause, ne(news_posts_table.id, excludePostId));

  const rows = await db
    .select({ id: news_posts_table.id })
    .from(news_posts_table)
    .where(whereClause)
    .limit(1);

  return rows.length === 0;
};

export const newsRouter = createTRPCRouter({
  getPublishedPosts: publicProcedure
    .input(getPublishedPostsInputSchema.optional())
    .query(async ({ input }) => {
      const params = getPublishedPostsInputSchema.parse(input ?? {});
      const searchTerm = params.search?.trim().toLowerCase();
      const titleMatch = searchTerm
        ? sql`LOCATE(${searchTerm}, LOWER(${news_posts_table.title})) > 0`
        : null;
      const descriptionMatch = searchTerm
        ? sql`LOCATE(${searchTerm}, LOWER(${news_posts_table.short_description})) > 0`
        : null;
      const searchClause =
        titleMatch && descriptionMatch
          ? or(titleMatch, descriptionMatch)
          : null;
      const whereClause = searchClause
        ? and(eq(news_posts_table.status, "published"), searchClause)
        : eq(news_posts_table.status, "published");
      const orderColumn =
        params.sortBy === "created_on"
          ? news_posts_table.created_on
          : params.sortBy === "title"
            ? sql`LOWER(${news_posts_table.title})`
            : news_posts_table.updated_on;
      const orderFn = params.sortDir === "asc" ? asc : desc;
      const orderBy = searchTerm
        ? [
            asc(
              sql`CASE WHEN LOCATE(${searchTerm}, LOWER(${news_posts_table.title})) > 0 THEN 0 ELSE 1 END`,
            ),
            orderFn(orderColumn),
          ]
        : [orderFn(orderColumn)];

      const rows = await db
        .select({
          id: news_posts_table.id,
          title: news_posts_table.title,
          short_description: news_posts_table.short_description,
          status: news_posts_table.status,
          created_on: news_posts_table.created_on,
          updated_on: news_posts_table.updated_on,
          author_username: users_table.username,
          author_first_name: users_table.first_name,
          author_last_name: users_table.last_name,
        })
        .from(news_posts_table)
        .innerJoin(users_table, eq(news_posts_table.user_id, users_table.id))
        .where(whereClause)
        .orderBy(...orderBy);

      return rows.map((row) => ({
        ...row,
        status: row.status as NewsPostStatus,
      }));
    }),

  getPublishedPostByTitle: publicProcedure
    .input(z.object({ title: z.string().trim().min(1).max(200) }))
    .query(async ({ input }) => {
      const rows = await db
        .select({
          id: news_posts_table.id,
          title: news_posts_table.title,
          short_description: news_posts_table.short_description,
          content: news_posts_table.content,
          status: news_posts_table.status,
          created_on: news_posts_table.created_on,
          updated_on: news_posts_table.updated_on,
          author_username: users_table.username,
          author_first_name: users_table.first_name,
          author_last_name: users_table.last_name,
          author_clerk_id: users_table.clerk_id,
        })
        .from(news_posts_table)
        .innerJoin(users_table, eq(news_posts_table.user_id, users_table.id))
        .where(
          and(
            eq(news_posts_table.title, input.title),
            eq(news_posts_table.status, "published"),
          ),
        )
        .limit(1);

      const post = rows[0];

      return post ? { ...post, status: post.status as NewsPostStatus } : null;
    }),

  isPostTitleAvailable: newsAuthorProcedure
    .input(
      z.object({
        title: z.string().trim().min(1).max(200),
        excludePostId: z.number().int().positive().optional(),
      }),
    )
    .query(({ input }) => isTitleAvailable(input.title, input.excludePostId)),

  getManageablePosts: newsAuthorProcedure.query(async ({ ctx }) => {
    const user = await getDbUser(ctx.clerkUserId);
    const whereClause =
      ctx.role === "admin"
        ? sql`TRUE`
        : eq(news_posts_table.user_id, BigInt(user.id));

    const rows = await db
      .select({
        id: news_posts_table.id,
        title: news_posts_table.title,
        short_description: news_posts_table.short_description,
        status: news_posts_table.status,
        created_on: news_posts_table.created_on,
        updated_on: news_posts_table.updated_on,
        author_username: users_table.username,
        author_first_name: users_table.first_name,
        author_last_name: users_table.last_name,
      })
      .from(news_posts_table)
      .innerJoin(users_table, eq(news_posts_table.user_id, users_table.id))
      .where(whereClause)
      .orderBy(desc(news_posts_table.updated_on));

    return rows.map((row) => ({
      ...row,
      status: row.status as NewsPostStatus,
    }));
  }),

  getPostForEditing: newsAuthorProcedure
    .input(newsPostIdSchema)
    .query(async ({ ctx, input }) => {
      const user = await getDbUser(ctx.clerkUserId);
      const ownershipClause =
        ctx.role === "admin"
          ? eq(news_posts_table.id, input.postId)
          : and(
              eq(news_posts_table.id, input.postId),
              eq(news_posts_table.user_id, BigInt(user.id)),
            );

      const rows = await db
        .select({
          id: news_posts_table.id,
          title: news_posts_table.title,
          short_description: news_posts_table.short_description,
          content: news_posts_table.content,
          status: news_posts_table.status,
          created_on: news_posts_table.created_on,
          updated_on: news_posts_table.updated_on,
        })
        .from(news_posts_table)
        .where(ownershipClause)
        .limit(1);

      const post = rows[0];

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "News post not found",
        });
      }

      return { ...post, status: post.status as NewsPostStatus };
    }),

  createPost: newsAuthorProcedure
    .input(
      newsPostContentSchema.extend({
        status: newsPostStatusSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getDbUser(ctx.clerkUserId);
      const now = new Date();

      if (!(await isTitleAvailable(input.title))) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A news post with this title already exists",
        });
      }

      await db.insert(news_posts_table).values({
        user_id: BigInt(user.id),
        title: input.title,
        short_description: input.short_description,
        content: input.content,
        status: input.status,
        created_on: now,
        updated_on: now,
      });

      return { success: true };
    }),

  updatePost: newsAuthorProcedure
    .input(
      newsPostContentSchema.extend({
        postId: z.number().int().positive(),
        status: newsPostStatusSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getDbUser(ctx.clerkUserId);
      const ownershipClause =
        ctx.role === "admin"
          ? eq(news_posts_table.id, input.postId)
          : and(
              eq(news_posts_table.id, input.postId),
              eq(news_posts_table.user_id, BigInt(user.id)),
            );

      const existingRows = await db
        .select({ id: news_posts_table.id })
        .from(news_posts_table)
        .where(ownershipClause)
        .limit(1);

      if (!existingRows[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "News post not found",
        });
      }

      if (!(await isTitleAvailable(input.title, input.postId))) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A news post with this title already exists",
        });
      }

      await db
        .update(news_posts_table)
        .set({
          title: input.title,
          short_description: input.short_description,
          content: input.content,
          status: input.status,
          updated_on: new Date(),
        })
        .where(ownershipClause);

      return { success: true };
    }),
});
