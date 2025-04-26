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
import { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const NavLink = ({
  href,
  name,
  handleClick,
}: {
  href: string;
  name: string;
  handleClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <NavigationMenuLink
      className={navigationMenuTriggerStyle()}
      active={isActive}
      asChild
    >
      <Link href={href} passHref>
        <span className="font-din text-xl" onClick={handleClick}>
          {name}
        </span>
      </Link>
    </NavigationMenuLink>
  );
};

export const TopNav = ({ font }: { font: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black text-white">
      <NavigationMenu>
        <Link href="/" passHref legacyBehavior>
          <div className="flex flex-row items-center gap-2 hover:cursor-pointer md:mr-auto md:gap-4">
            <span
              className={`text-2xl font-semibold text-accent md:text-5xl ${font} font-din`}
            >
              PROVIDENCE
            </span>

            <Image
              src="./Code-and-Coffee_white_ampersand.svg"
              alt="Code & Coffee"
              width={0}
              height={0}
              style={{ width: "auto", height: "75px" }}
              className="!h-[50px] md:!h-[75px]"
            />
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink href="/about" name="About" />
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTitle className="sr-only">NavBar Menu</SheetTitle>

          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="!h-8 !w-8 text-accent" />

              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="top" className="border-0 bg-black text-white">
            <div className="mt-8 flex w-full flex-col items-center gap-6">
              <SheetClose asChild>
                <NavLink
                  href="/"
                  name="Home"
                  handleClick={() => handleNavigation("/")}
                />
              </SheetClose>

              <SheetClose asChild>
                <NavLink
                  href="/about"
                  name="About"
                  handleClick={() => handleNavigation("/about")}
                />
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </NavigationMenu>
    </header>
  );
};
