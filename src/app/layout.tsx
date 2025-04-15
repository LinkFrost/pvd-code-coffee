import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TopNav } from "~/components/TopNav";
import localFont from "next/font/local";

import { TRPCReactProvider } from "~/trpc/react";
import { Footer } from "~/components/Footer";

export const metadata: Metadata = {
  title: "PVD Code & Coffee",
  description:
    "Providence chapter for the community-led meetup for devs to make friends, do projects and professionally grow.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const dinFont = localFont({
  src: "../../public/fonts/DINAlternate-Bold.ttf",
  variable: "--font-din",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className={`${dinFont.variable} flex flex-col`}>
        {/* <body className={`flex flex-col`}> */}
        <TRPCReactProvider>
          <TopNav font={dinFont.variable} />
          {children}
          <Footer font={dinFont.variable} />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
