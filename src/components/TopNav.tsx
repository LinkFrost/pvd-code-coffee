import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "./ui/navigation-menu";
import { navigationMenuTriggerStyle } from "./ui/navigation-menu";

export const TopNav = () => {
  return (
    <NavigationMenu className="">
      <NavigationMenuItem>
        <Link href="/" passHref legacyBehavior>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Home
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <Link href="/test" passHref legacyBehavior>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Test
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </NavigationMenu>
  );
};
