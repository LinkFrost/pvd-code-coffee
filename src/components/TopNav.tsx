"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import Image from "next/image";
import { usePathname } from "next/navigation";

const ActiveLink = ({ href, name }: { href: string; name: string }) => {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <NavigationMenuLink
      className={navigationMenuTriggerStyle()}
      active={isActive}
      asChild
    >
      <Link href={href} passHref>
        <span className="font-din text-lg">{name}</span>
      </Link>
    </NavigationMenuLink>
  );
};

export const TopNav = ({ font }: { font: string }) => {
  return (
    <NavigationMenu>
      <NavigationMenuItem>
        <Link href="/" passHref legacyBehavior>
          <div className="flex flex-row items-center gap-4 hover:cursor-pointer md:mr-auto">
            <span
              className={`text-2xl font-semibold text-accent sm:text-5xl ${font} font-din`}
            >
              PROVIDENCE
            </span>

            <Image
              src="./Code-and-Coffee_white_ampersand.svg"
              alt="Code & Coffee"
              width={0}
              height={0}
              style={{ width: "auto", height: "75px" }}
            />
          </div>
        </Link>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <ActiveLink href="/about" name="About"></ActiveLink>
      </NavigationMenuItem>
    </NavigationMenu>
  );
};
