import { ManageableNewsPosts } from "~/components/news/ManageableNewsPosts";
import { NewsEditor } from "~/components/news/NewsEditor";
import { requireNewsAuthor } from "~/server/auth/news";

export default async function NewsEditorPage() {
  await requireNewsAuthor();

  return (
    <div className="flex flex-col justify-center align-middle">
      <section className="bg-accent">
        <div className="responsiveContainer flex h-full flex-col items-center justify-between gap-6 py-12 sm:py-16">
          <h1 className="break-words text-center font-din text-3xl font-bold">
            News Editor Dashboard
          </h1>

          <p className="max-w-3xl text-center text-lg sm:text-2xl">
            Draft and publish news posts for the PVD Code &amp; Coffee
            community.
          </p>
        </div>
      </section>

      <section className="bg-gray-100">
        <div className="responsiveContainer flex flex-col gap-10 py-10">
          <div className="space-y-5">
            <h2 className="font-din text-3xl font-semibold">My Posts</h2>
            <ManageableNewsPosts />
          </div>

          <NewsEditor />
        </div>
      </section>
    </div>
  );
}
