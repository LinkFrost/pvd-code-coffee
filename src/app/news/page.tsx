export default async function News() {
  return (
    <div className="flex flex-col justify-center align-middle">
      <section className="h-72 bg-accent md:h-56">
        <div className="responsiveContainer flex h-full flex-col items-center justify-between py-12">
          <h1 className="break-words text-center font-din text-3xl font-bold">
            News
          </h1>

          <p className="max-w-3xl text-center text-2xl">
            Stay up to date with the latest news and events in the PVD Code &
            Coffee community!
          </p>
        </div>

        <div className="responsiveContainer flex flex-col items-center gap-8 py-12">
          <h3 className="font-din text-3xl font-semibold">Coming Soon</h3>
        </div>
      </section>
    </div>
  );
}
