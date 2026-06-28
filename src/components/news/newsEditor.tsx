"use client";
import { useRef } from "react";
import { ForwardRefEditor } from "../mdx/ForwardRedEditor";
import type { MDXEditorMethods } from "@mdxeditor/editor";

export function NewsEditor() {
  const markdown = `
Hello **world**!
# HI!
`;

  const editorRef = useRef<MDXEditorMethods>(null);
  // console.log("markdown", editorRef.current?.getMarkdown());

  return (
    <>
      <button onClick={() => console.log(editorRef.current?.getMarkdown())}>
        Get markdown
      </button>

      <ForwardRefEditor ref={editorRef} markdown={markdown} />
    </>
  );
}
