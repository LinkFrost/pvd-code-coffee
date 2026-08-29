import type { Components } from "react-markdown";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="font-din text-3xl font-bold">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-din text-2xl font-semibold">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-din text-xl font-semibold">{children}</h3>
  ),
  p: ({ children }) => <p className="leading-7">{children}</p>,
};

export function NewsPostContent({ content }: { content: string }) {
  return (
    <div className="flex max-w-none flex-col gap-4 text-neutral-800 [&_a]:text-blue-700 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-300 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-neutral-100 [&_code]:px-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-neutral-100 [&_pre]:p-4 [&_ul]:list-disc [&_ul]:pl-6">
      <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </Markdown>
    </div>
  );
}
