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
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import "./MDXEditor.css";

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
        toolbarPlugin({
          toolbarClassName: "mdxeditor-toolbar",
          toolbarContents: () => (
            <>
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
            </>
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
