"use client";

import type { MDXEditorMethods } from "@mdxeditor/editor";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ForwardRefEditor } from "../mdx/ForwardRedEditor";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  newsPostContentSchema,
  newsPostStatusBadgeClasses,
  newsPostStatusLabels,
  type NewsPostStatus,
} from "~/utils/newsUtils";
import { api, type RouterOutputs } from "~/trpc/react";
import { cn } from "~/utils/tailwindUtils";

type NewsEditorProps = {
  post?: RouterOutputs["news"]["getPostForEditing"];
};

type TitleStatus = "idle" | "checking" | "available" | "taken";

export function NewsEditor({ post }: NewsEditorProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const editorRef = useRef<MDXEditorMethods>(null);
  const [title, setTitle] = useState(post?.title ?? "");
  const [shortDescription, setShortDescription] = useState(
    post?.short_description ?? "",
  );
  const [content, setContent] = useState(post?.content ?? "");
  const [titleStatus, setTitleStatus] = useState<TitleStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const createPost = api.news.createPost.useMutation();
  const updatePost = api.news.updatePost.useMutation();
  const isSaving = createPost.isPending || updatePost.isPending;
  const isComplete = newsPostContentSchema.safeParse({
    title,
    short_description: shortDescription,
    content,
  }).success;
  const isSubmitDisabled =
    isSaving ||
    !isComplete ||
    titleStatus === "checking" ||
    titleStatus === "taken";

  const checkTitleAvailability = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setTitleStatus("idle");
      return false;
    }

    setTitleStatus("checking");

    try {
      const isAvailable = await utils.news.isPostTitleAvailable.fetch({
        title: trimmedTitle,
        ...(post ? { excludePostId: post.id } : {}),
      });

      setTitleStatus(isAvailable ? "available" : "taken");
      return isAvailable;
    } catch {
      setTitleStatus("idle");
      setMessage("The title could not be checked. Please try again.");
      return false;
    }
  };

  const savePost = async (status: NewsPostStatus) => {
    setMessage(null);
    setErrors({});

    const latestContent = editorRef.current?.getMarkdown() ?? content;
    const parsed = newsPostContentSchema.safeParse({
      title,
      short_description: shortDescription,
      content: latestContent,
    });

    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    const isTitleAvailable = await checkTitleAvailability();

    if (!isTitleAvailable) {
      return;
    }

    try {
      if (post) {
        await updatePost.mutateAsync({
          postId: post.id,
          ...parsed.data,
          status,
        });
      } else {
        await createPost.mutateAsync({
          ...parsed.data,
          status,
        });
      }

      await Promise.all([
        utils.news.getManageablePosts.invalidate(),
        utils.news.getPublishedPosts.invalidate(),
        post
          ? utils.news.getPostForEditing.invalidate({ postId: post.id })
          : Promise.resolve(),
      ]);

      setMessage(
        status === "published"
          ? "Post published successfully."
          : "Draft saved successfully.",
      );

      if (!post) {
        setTitle("");
        setShortDescription("");
        setContent("");
        setTitleStatus("idle");
        editorRef.current?.setMarkdown("");
      }

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The post could not be saved. Please try again.",
      );
    }
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-din text-2xl font-semibold">
          {post ? "Edit Post" : "Create a New Post"}
        </h2>

        {post && (
          <Badge className={cn(newsPostStatusBadgeClasses[post.status])}>
            {newsPostStatusLabels[post.status]}
          </Badge>
        )}
      </div>

      <FieldGroup>
        <Field data-invalid={Boolean(errors.title)}>
          <FieldLabel htmlFor="news-title">Title</FieldLabel>
          <Input
            id="news-title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setTitleStatus("idle");
            }}
            onBlur={() => void checkTitleAvailability()}
            maxLength={200}
            disabled={isSaving}
          />
          <FieldError
            errors={errors.title?.map((error) => ({ message: error }))}
          />
          {titleStatus === "checking" && (
            <FieldDescription>Checking title availability…</FieldDescription>
          )}
          {titleStatus === "available" && (
            <FieldDescription className="text-blue-700">
              This title is available.
            </FieldDescription>
          )}
          {titleStatus === "taken" && (
            <FieldError>A news post with this title already exists.</FieldError>
          )}
        </Field>

        <Field data-invalid={Boolean(errors.short_description)}>
          <FieldLabel htmlFor="news-description">Short description</FieldLabel>
          <Textarea
            id="news-description"
            value={shortDescription}
            onChange={(event) => setShortDescription(event.target.value)}
            maxLength={500}
            rows={4}
            disabled={isSaving}
          />
          <FieldDescription>
            This summary appears on the News feed.
          </FieldDescription>
          <FieldError
            errors={errors.short_description?.map((error) => ({
              message: error,
            }))}
          />
        </Field>

        <Field data-invalid={Boolean(errors.content)}>
          <FieldLabel>Post content</FieldLabel>
          <div className="min-h-96 overflow-hidden rounded-md border border-neutral-200">
            <ForwardRefEditor
              ref={editorRef}
              markdown={post?.content ?? ""}
              onChange={setContent}
              readOnly={isSaving}
            />
          </div>
          <FieldDescription>
            Write and format the post using Markdown.
          </FieldDescription>
          <FieldError
            errors={errors.content?.map((error) => ({ message: error }))}
          />
        </Field>
      </FieldGroup>

      {message && (
        <p className="mt-6 text-sm text-neutral-700" role="status">
          {message}
        </p>
      )}

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitDisabled}
          onClick={() => savePost("unpublished")}
        >
          {isSaving ? "Saving…" : "Save as draft"}
        </Button>

        <Button
          type="button"
          variant="cncDefault"
          disabled={isSubmitDisabled}
          onClick={() => savePost("published")}
        >
          {isSaving ? "Publishing…" : "Publish to news feed"}
        </Button>
      </div>
    </div>
  );
}
