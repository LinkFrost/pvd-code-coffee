import { OrganizerCard } from "~/components/OrganizerCard";

export default function About() {
  const organizers = [
    {
      id: 1,
      name: "Joshua Milcette",
      role: "Lead Organizer",
      image:
        "https://media.licdn.com/dms/image/v2/C4E03AQHonR0dBIlh2w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1585598418825?e=1750896000&v=beta&t=_h6eNGGsN76j90UXeX9IourWFx-eukCyoqe1to_-J5A",
      bio: "Ipsum esse laboris adipisicing incididunt nisi excepteur nulla dolor mollit. Quis elit velit adipisicing pariatur velit esse non ad. Aute amet proident eiusmod laboris aute aute veniam adipisicing tempor cupidatat commodo est.",
      links: {
        linkedIn: "https://www.linkedin.com/in/joshua-milcette/",
        github: "https://github.com/Jmilcette2",
      },
    },
    {
      id: 2,
      name: "Ashir Imran",
      role: "Socials and Website Lead",
      image:
        "https://media.licdn.com/dms/image/v2/C4D03AQFxCrur6XpveQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1647353327127?e=1750896000&v=beta&t=8b1TJZNpAqXZb6lvImVUn6KAQEoZawWfUNKxWSspnU0",
      bio: "Working as a Software Engineer at Citizens Bank, Ashir handles the social media and marketing side of PVD Code & Coffee. After studying Computer Science at UMass Amherst and getting started on his career, he's ready to help the community as he works on his software engineering skills!",
      links: {
        github: "https://github.com/LinkFrost",
        linkedIn: "https://github.com/theHarrisCode",
        website: "https://linkfrost.com",
      },
    },
    {
      id: 3,
      name: "Darren Harris",
      role: "Event and Venue Coordinator",
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQHuciwv9HtcXA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1706901520490?e=1750896000&v=beta&t=5MjCQwAd-vN4MSJexJo1-7ooyuoMFX_w42EelG-i0Rs",
      bio: "Ipsum esse laboris adipisicing incididunt nisi excepteur nulla dolor mollit. Quis elit velit adipisicing pariatur velit esse non ad. Aute amet proident eiusmod laboris aute aute veniam adipisicing tempor cupidatat commodo est.",
      links: {
        github: "https://github.com/theHarrisCode",
        linkedin: "https://www.linkedin.com/in/theharriscode/",
      },
    },
  ];

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

      <section className="bg-yellow-100">
        <div className="responsiveContainer flex flex-col gap-8 py-12">
          <h3 className="font-din text-3xl font-semibold">Event Structure</h3>

          <div className="border-accentRed rounded-lg border-l-4 bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-din text-xl">Introductions</h3>

            <p className="text-lg text-gray-700">
              Our events start with the organizers introducing everyone to Code
              & Coffee, followed by some quick announcements. As our community
              is still small, we then usually move into quick round table
              introductions so everyone can get to know each other a little
              better.
            </p>
          </div>

          <div className="border-accentRed rounded-lg border-l-4 bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-din text-xl">Featured Presentation</h3>

            <p className="text-lg text-gray-700">
              If there&apos;s a featured presentation lined up for an event,
              that will be the main item on the agenda that day, taking up 30-90
              minutes. We welcome presentations from anyone in the community!
              The topic can vary, so long as it&apos;ss related to tech in some
              way. If you&apos;re interested in being a headlining presenter,
              please{" "}
              <a
                className="text-accentRed hover:text-red-700"
                target="_blank"
                href="https://codeandcoffee.org/"
              >
                {" "}
                reach out to the organizers!
              </a>
            </p>
          </div>

          <div className="border-accentRed rounded-lg border-l-4 bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-din text-xl">
              Additional Presentations & Showcases
            </h3>

            <p className="text-lg text-gray-700">
              The projector will be available for anyone who wants to share
              something they&apos;re working on, something interesting they
              found, a tool that might be useful for everyone, etc.
            </p>
          </div>

          <div className="border-accentRed rounded-lg border-l-4 bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-din text-xl">Socializing & Networking</h3>

            <p className="text-lg text-gray-700">
              The rest of the time is open for people to talk, hangout, work on
              projects, network, anything!
            </p>
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
    </div>
  );
}
