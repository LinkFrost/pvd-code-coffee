import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TopNav } from "~/components/TopNav";

export const metadata: Metadata = {
  title: "PVD Code & Coffee",
  description:
    "Providence chapter for the community-led meetup for devs to make friends, do projects and professionally grow.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="flex flex-col">
        <TopNav />
        {children}
      </body>
    </html>
  );
}
