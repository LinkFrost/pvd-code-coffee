import type { Components } from "react-markdown";

export const markdownComponents: Components = {
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
  a: ({ children }) => (
    <a className="leading-7 underline hover:cursor-pointer hover:text-accentRed">
      {children}
    </a>
  ),
};
