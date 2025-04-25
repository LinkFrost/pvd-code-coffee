import { InfoCard } from "~/components/InfoCard";
import { OrganizerCard } from "~/components/OrganizerCard";
import { eventStructureSteps, organizers, principles } from "~/lib/constants";

export default function About() {
  return (
    <div className="flex flex-col justify-center align-middle">
      <section className="bg-accent">
        <div className="responsiveContainer flex flex-col items-center py-20">
          <h1 className="break-words font-din text-3xl font-bold">
            About PVD Code & Coffee
          </h1>
        </div>
      </section>

      <section className="bg-gray-100">
        <div className="responsiveContainer flex flex-col gap-8 py-12">
          <h3 className="font-din text-3xl font-semibold">What we do</h3>

          <p className="text-xl">
            We are the Providence chapter for the community-led meetup for devs
            to get together and professionally grow! Join us as at our events
            where we share projects, ideas, stories, and of course, coffee. From
            complete novices to industry professionals with years of experience,
            everyone is welcome here as we foster an environment focused on the
            community.
          </p>

          <p className="text-xl">
            To learn more about the wider Code & Coffee organization and see how
            you can join this experience in other locations,
            <a
              className="text-accentRed hover:text-red-700"
              target="_blank"
              href="https://codeandcoffee.org/"
            >
              {" "}
              click here.
            </a>
          </p>
        </div>
      </section>

      <section className="bg-yellow-50">
        <div className="responsiveContainer flex flex-col gap-8 py-12">
          <h3 className="font-din text-3xl font-semibold">Event Structure</h3>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {eventStructureSteps.map((eventStructure) => (
              <InfoCard
                title={eventStructure.stepName}
                details={eventStructure.details}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-100">
        <div className="responsiveContainer flex flex-col gap-8 py-12">
          <h3 className="font-din text-3xl font-semibold">Organizers</h3>

          <div className="grid gap-8 md:grid-cols-3">
            {organizers.map((organizer) => (
              <OrganizerCard
                key={organizer.id}
                id={organizer.id}
                name={organizer.name}
                role={organizer.role}
                image={organizer.image}
                bio={organizer.bio}
                links={organizer.links}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-yellow-50">
        <div className="responsiveContainer flex flex-col gap-8 py-12">
          <h3 className="font-din text-3xl font-semibold">
            Guidelines & Principles
          </h3>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {principles.map((principle) => (
              <InfoCard title={principle.title} details={principle.details} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
