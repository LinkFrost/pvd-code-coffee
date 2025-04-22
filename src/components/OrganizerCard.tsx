import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github, Linkedin } from "lucide-react";

export const OrganizerCard = (organizer: {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  links: { linkedIn?: string; github?: string; website?: string };
}) => {
  return (
    <div
      key={organizer.id}
      className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
    >
      <div className="relative h-64 bg-gray-100">
        <Image
          src={organizer.image || "/placeholder.svg"}
          alt={organizer.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-6">
        <h3 className="font-din text-xl">{organizer.name}</h3>

        <p className="mb-3 text-sm font-medium text-[#EB5152]">
          {organizer.role}
        </p>

        <p className="mb-4 text-gray-600">{organizer.bio}</p>

        <div className="flex space-x-3 pt-2">
          {organizer.links.github && (
            <Link
              href={organizer.links.github}
              className="text-gray-500 hover:text-[#fccb05]"
              aria-label={`${organizer.name}'s GitHub`}
            >
              <Github className="h-5 w-5" />
            </Link>
          )}

          {organizer.links.linkedIn && (
            <Link
              href={organizer.links.linkedIn}
              className="text-gray-500 hover:text-[#fccb05]"
              aria-label={`${organizer.name}'s LinkedIn`}
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          )}

          {organizer.links.website && (
            <Link
              href={organizer.links.website}
              className="text-gray-500 hover:text-[#fccb05]"
              aria-label={`${organizer.name}'s Website`}
            >
              <ExternalLink className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
