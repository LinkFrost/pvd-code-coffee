export default async function Projects() {
  return (
    <div className="flex flex-col justify-center align-middle">
      <section className="h-72 bg-accent md:h-56">
        <div className="responsiveContainer flex h-full flex-col items-center justify-between py-16">
          <h1 className="break-words text-center font-din text-3xl font-bold">
            Projects
          </h1>

          <p className="max-w-3xl text-center text-2xl">
            Check out what the community is working on!
          </p>
        </div>

        <div className="responsiveContainer flex flex-col gap-8 py-12">
          <h3 className="font-din text-3xl font-semibold">Latest Projects</h3>
        </div>
      </section>
    </div>
  );
}
