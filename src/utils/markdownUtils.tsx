import type { Components } from "react-markdown";

export const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="font-din text-2xl font-bold sm:text-3xl">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-din text-xl font-semibold sm:text-2xl">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-din text-lg font-semibold sm:text-xl">{children}</h3>
  ),
  p: ({ children }) => <p className="leading-7">{children}</p>,
  a: ({ children, href }) => (
    <a
      className="leading-7 underline hover:cursor-pointer hover:text-accentRed"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      {children}
    </a>
  ),
};
