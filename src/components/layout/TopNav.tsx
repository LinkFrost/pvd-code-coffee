"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, User } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/nextjs";

type NestedNavItem = {
  href: string;
  name: string;
};

const adminNavItems: NestedNavItem[] = [
  {
    href: "/admin/dashboard",
    name: "Dashboard",
  },
  {
    href: "/admin/social-media",
    name: "Social Media",
  },
];

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
      <Link href={href}>
        <span className="font-din text-xl" onClick={handleClick}>
          {name}
        </span>
      </Link>
    </NavigationMenuLink>
  );
};

const NavDropdown = ({
  name,
  items,
}: {
  name: string;
  items: NestedNavItem[];
}) => {
  const pathname = usePathname();
  const isActive = items.some(
    ({ href }) => pathname === href || pathname.startsWith(`${href}/`),
  );

  return (
    <NavigationMenuItem className="relative">
      <NavigationMenuTrigger
        className="font-din text-xl"
        data-active={isActive ? "" : undefined}
      >
        {name}
      </NavigationMenuTrigger>

      <NavigationMenuContent className="top-full z-50 mt-1.5 w-auto overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
        <ul className="w-48 p-2">
          {items.map((item) => (
            <li key={item.href}>
              <NavigationMenuLink
                active={
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                }
                asChild
              >
                <Link
                  href={item.href}
                  className="block rounded-md px-4 py-3 font-din text-lg transition-colors hover:bg-accent hover:text-accent-foreground data-[active]:bg-accent data-[active]:text-accent-foreground"
                >
                  {item.name}
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export const TopNav = ({ font }: { font: string }) => {
  const user = useUser();
  const isAdmin = user.user?.publicMetadata.role === "admin";

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black text-white">
      <NavigationMenu>
        <Link href="/">
          <div className="flex flex-row items-center gap-2 hover:cursor-pointer md:mr-auto md:gap-4">
            <span
              className={`text-2xl font-semibold text-accent md:text-5xl ${font} font-din`}
            >
              PROVIDENCE
            </span>

            <Image
              src="/Code-and-Coffee_white_ampersand.svg"
              alt="Code & Coffee"
              width={0}
              height={0}
              style={{ width: "auto", height: "75px" }}
              className="!h-[50px] md:!h-[75px]"
            />
          </div>
        </Link>

        <nav className="hidden items-center lg:flex">
          <NavigationMenuList className="gap-6 space-x-0">
            <NavigationMenuItem>
              <NavLink href="/news" name="News" />
            </NavigationMenuItem>

            <SignedIn>
              <NavigationMenuItem>
                <NavLink href="/projects" name="Projects" />
              </NavigationMenuItem>
            </SignedIn>

            {isAdmin && (
              <SignedIn>
                <NavDropdown name="Admin" items={adminNavItems} />
              </SignedIn>
            )}

            <NavigationMenuItem>
              <NavLink href="/about" name="About" />
            </NavigationMenuItem>

            <SignedOut>
              <NavigationMenuItem>
                <SignInButton mode="modal">
                  <span className="font-din text-xl hover:cursor-pointer">
                    Sign In
                  </span>
                </SignInButton>
              </NavigationMenuItem>
            </SignedOut>

            <SignedIn>
              <NavigationMenuItem>
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="My Profile"
                      href={`/profile/${user.user?.username}`}
                      labelIcon={<User className="!h-4 !w-4" />}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </NavigationMenuItem>
            </SignedIn>
          </NavigationMenuList>
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
          <SheetTitle className="sr-only">NavBar Menu</SheetTitle>

          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="!h-8 !w-8 text-accent" />

              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="top" className="border-0 bg-black text-white">
            <div className="mt-8 flex w-full flex-col items-center gap-6">
              <SignedOut>
                <SignInButton mode="modal">
                  <span className="font-din text-xl hover:cursor-pointer">
                    Sign In
                  </span>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="My Profile"
                      href={`/profile/${user.user?.username}`}
                      labelIcon={<User className="!h-4 !w-4" />}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </SignedIn>

              <SheetClose asChild>
                <NavLink
                  href="/"
                  name="Home"
                  handleClick={() => handleNavigation("/")}
                />
              </SheetClose>

              <SheetClose asChild>
                <NavLink
                  href="/news"
                  name="News"
                  handleClick={() => handleNavigation("/news")}
                />
              </SheetClose>

              <SheetClose asChild>
                <NavLink
                  href="/projects"
                  name="Projects"
                  handleClick={() => handleNavigation("/projects")}
                />
              </SheetClose>

              {isAdmin && (
                <SignedIn>
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-din text-xl text-gray-300 !underline">
                      Admin
                    </span>

                    {adminNavItems.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <NavLink
                          href={item.href}
                          name={item.name}
                          handleClick={() => handleNavigation(item.href)}
                        />
                      </SheetClose>
                    ))}
                  </div>
                </SignedIn>
              )}

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
