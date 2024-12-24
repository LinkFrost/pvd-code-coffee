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

const ActiveLink = ({ href }: { href: string }) => {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <NavigationMenuLink
      className={navigationMenuTriggerStyle()}
      active={isActive}
      asChild
    >
      <Link href={href} passHref>
        About
      </Link>
    </NavigationMenuLink>
  );
};

export const TopNav = () => {
  return (
    <NavigationMenu>
      <Link href="/" passHref legacyBehavior>
        <div className="mr-auto flex flex-row items-center gap-4 hover:cursor-pointer">
          <span className="text-accent text-2xl font-semibold sm:text-5xl">
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

      <NavigationMenuItem>
        <ActiveLink href="/about"></ActiveLink>
      </NavigationMenuItem>
    </NavigationMenu>
  );
};
