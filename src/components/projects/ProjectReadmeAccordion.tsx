"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

export function ProjectReadmeAccordion({ readme }: { readme: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950">
      <Accordion type="single" collapsible defaultValue="readme">
        <AccordionItem value="readme" className="border-b-0">
          <AccordionTrigger className="px-4 font-din text-xl font-semibold hover:no-underline">
            README.md
          </AccordionTrigger>

          <AccordionContent className="border-t border-neutral-200 px-4 pb-4 pt-4 text-base text-neutral-800 dark:border-neutral-600">
            <div className="max-w-none [&_a]:text-blue-600 [&_a]:underline [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-neutral-100 [&_pre]:p-3 dark:[&_pre]:bg-neutral-900">
              <Markdown remarkPlugins={[remarkGfm]}>{readme}</Markdown>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
