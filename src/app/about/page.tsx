export default function About() {
  return (
    <div className="flex flex-col justify-center align-middle">
      <section className="bg-accent">
        <div className="responsiveContainer flex flex-col items-center py-12">
          <h1 className="mb-4 break-words font-din text-3xl font-bold">
            A little bit about PVD Code & Coffee
          </h1>

          <div className="mx-auto mb-4 h-1 w-48 bg-black"></div>
        </div>
      </section>

      <section className="bg-gray-100">
        <div className="responsiveContainer flex flex-col gap-8 py-12">
          <h3 className="font-din text-2xl font-semibold">What we do</h3>

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
          <h3 className="font-din text-2xl font-semibold">Event Structure</h3>

          <div className="rounded-lg border-l-4 border-[#fccb05] bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-din text-xl">Introductions</h3>

            <p className="text-lg text-gray-700">
              Our events start with the organizers introducing everyone to Code
              & Coffee, followed by some quick announcements. As our community
              is still small, we then usually move into quick round table
              introductions so everyone can get to know each other a little
              better.
            </p>
          </div>

          <div className="rounded-lg border-l-4 border-[#fccb05] bg-white p-6 shadow-sm">
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

          <div className="rounded-lg border-l-4 border-[#fccb05] bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-din text-xl">
              Additional Presentations & Showcases
            </h3>

            <p className="text-lg text-gray-700">
              The projector will be available for anyone who wants to share
              something they&apos;re working on, something interesting they
              found, a tool that might be useful for everyone, etc.
            </p>
          </div>

          <div className="rounded-lg border-l-4 border-[#fccb05] bg-white p-6 shadow-sm">
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
          <h3 className="font-din text-2xl font-semibold">Organizers</h3>

          <p className="text-xl">
            We are the Providence chapter for the community-led meetup for devs
            to get together and professionally grow! Join us as at our events
            where we share projects, ideas, stories, and of course, coffee. From
            complete novices to industry professionals with years of experience,
            everyone is welcome here as we foster an environment focused on the
            community.
          </p>
        </div>
      </section>
    </div>
  );
}
