"use client";
import type { ForwardedRef } from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  codeMirrorPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CodeToggle,
  ChangeCodeMirrorLanguage,
  CreateLink,
  linkPlugin,
  linkDialogPlugin,
  InsertCodeBlock,
  codeBlockPlugin,
  ConditionalContents,
  InsertImage,
  InsertTable,
  imagePlugin,
  tablePlugin,
  InsertThematicBreak,
  ListsToggle,
  DiffSourceToggleWrapper,
  diffSourcePlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import "./MDXEditor.css";

const LINE_BREAK_CONTINUATION = "\u200B";

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      className="mdxeditor-root-contenteditable"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            txt: "Plain Text",
            js: "JavaScript",
            ts: "TypeScript",
            tsx: "TypeScript (React)",
            jsx: "JavaScript (React)",
            css: "CSS",
            html: "HTML",
            json: "JSON",
            bash: "Bash",
            python: "Python",
            go: "Go",
            java: "Java",
            kotlin: "Kotlin",
            php: "PHP",
            ruby: "Ruby",
            scala: "Scala",
            swift: "Swift",
          },
        }),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin(),
        tablePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        listsPlugin(),
        quotePlugin(),
        headingsPlugin(),
        diffSourcePlugin({
          viewMode: "rich-text",
        }),
        toolbarPlugin({
          toolbarClassName: "mdxeditor-toolbar",
          toolbarContents: () => (
            <DiffSourceToggleWrapper options={["rich-text", "source"]}>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <BlockTypeSelect />
              <InsertImage />
              <InsertTable />
              <InsertThematicBreak />
              <ListsToggle />
              <CodeToggle />
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === "codeblock",
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    fallback: () => (
                      <>
                        <InsertCodeBlock />
                      </>
                    ),
                  },
                ]}
              />

              <CreateLink />
            </DiffSourceToggleWrapper>
          ),
        }),
      ]}
      {...props}
      toMarkdownOptions={{
        handlers: {
          text: (node: unknown, _, state, info) => {
            const value =
              typeof node === "object" &&
              node !== null &&
              "value" in node &&
              typeof node.value === "string"
                ? node.value
                : "";

            return state
              .safe(value, info)
              .replace(/\n\u200B?/g, `\\\n${LINE_BREAK_CONTINUATION}`);
          },
        },
      }}
      ref={editorRef}
    />
  );
}
