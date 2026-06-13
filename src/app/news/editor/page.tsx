import { NewsEditor } from "~/components/news/newsEditor";

export default async function NewsEditorPage() {
  return (
    <div className="flex flex-col justify-center align-middle">
      <section className="h-72 bg-accent md:h-56">
        <div className="responsiveContainer flex h-full flex-col items-center justify-between py-12">
          <h1 className="break-words text-center font-din text-3xl font-bold">
            News Editor
          </h1>

          <p className="max-w-3xl text-center text-2xl">Editor</p>
        </div>
      </section>

      <section className="bg-gray-100">
        <div className="responsiveContainer flex flex-col gap-8 py-12">
          <NewsEditor />
        </div>
      </section>
    </div>
  );
}
