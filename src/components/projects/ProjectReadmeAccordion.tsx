"use client";

import type { Components } from "react-markdown";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

const markdownComponents: Components = {
  h1: ({ children }) => <h1 className="text-2xl font-bold">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-medium">{children}</h3>,
  h4: ({ children }) => <h4 className="text-sm font-medium">{children}</h4>,
  p: ({ children }) => <p className="text-base">{children}</p>,
};

export function ProjectReadmeAccordion({ readme }: { readme: string }) {
  console.log(readme);

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950">
      <Accordion type="single" collapsible defaultValue="readme">
        <AccordionItem value="readme" className="border-b-0">
          <AccordionTrigger className="px-4 font-din text-xl font-semibold hover:no-underline">
            README.md
          </AccordionTrigger>

          <AccordionContent className="border-t border-neutral-200 px-4 pb-4 pt-4 text-neutral-800 dark:border-neutral-600">
            <div className="flex max-w-none flex-col gap-2 [&_a]:text-blue-600 [&_a]:underline [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-neutral-100 [&_pre]:p-3 dark:[&_pre]:bg-neutral-900">
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents}
              >
                {readme}
              </Markdown>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
