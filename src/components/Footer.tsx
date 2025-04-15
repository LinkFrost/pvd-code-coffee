import { Github, Linkedin, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Footer = ({ font }: { font: string }) => {
  return (
    <footer className="bg-black py-4 text-white">
      <div className="responsiveContainer">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
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

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="https://github.com/LinkFrost/pvd-code-coffee"
              className="text-gray-300 hover:text-accent"
            >
              <Github className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </Link>

            <Link
              href="https://www.instagram.com/pvdcodecoffee/"
              className="text-gray-300 hover:text-[#fccb05]"
            >
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </Link>

            <Link
              href="https://www.linkedin.com/company/pvd-code-coffee"
              className="text-gray-300 hover:text-accent"
            >
              <Linkedin className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Code & Coffee. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
