export default function About() {
  return (
    <div className="flex flex-col justify-center align-middle">
      <section className="bg-accent">
        <div className="responsiveContainer flex flex-col items-center py-12">
          <h1 className="mb-4 break-words font-din text-3xl font-bold">
            A little bit about PVD Code & Coffee
          </h1>

          <p className="max-w-3xl text-center text-xl">
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
