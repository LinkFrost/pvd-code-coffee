export default function HomePage() {
  return (
    <main className="font-din flex flex-col justify-center align-middle">
      <div className="bg-accent px-48 py-4">
        <h1 className="mb-4 text-3xl font-bold">WELCOME</h1>
        <p className="mb-4 text-xl">
          We are the Providence chapter for the community-led meetup for devs to
          get together and professionally grow! Join us as at our events where
          we share projects, ideas, stories, and of course, coffee. Everyone is
          welcome, from complete novices to industry professionals with years of
          experience.
        </p>
      </div>

      <div className="bg-gray-100 px-48 py-4">
        <h1 className="font-din mb-4 text-3xl font-bold">Our Events</h1>

        <h1 className="font-din mb-4 text-2xl font-semibold">
          Upcoming Event:
        </h1>
        <p className="mb-8 text-xl">Insert MeetUp embed here</p>

        <h1 className="font-din mb-4 text-2xl font-semibold">Past Events:</h1>
        <p className="mb-4 text-xl">
          Insert MeetUp embeds/photos of previous events, gallery perhaps?
        </p>
      </div>

      <div className="bg-accent px-48 py-4">
        <h1 className="font-din mb-4 text-3xl font-bold">Keep in Touch</h1>
        <p className="mb-4 text-xl">
          Insert social links to MeetUp, Discord, Instagram, LinkedIn
        </p>
      </div>
    </main>
  );
}
