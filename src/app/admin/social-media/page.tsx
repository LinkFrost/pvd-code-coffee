import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SocialMedia() {
  const { sessionClaims } = await auth();
  const isAdmin = sessionClaims?.metadata?.role === "admin";

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="flex flex-col justify-center align-middle">
      <section className="h-72 bg-accent md:h-56">
        <div className="responsiveContainer flex h-full flex-col items-center justify-between py-12">
          <h1 className="break-words text-center font-din text-3xl font-bold">
            Social Media
          </h1>

          <p className="max-w-3xl text-center text-2xl">TODO</p>
        </div>
      </section>

      <section className="bg-gray-100">
        <div className="responsiveContainer flex flex-col gap-8 py-12">
          <h2 className="font-din text-3xl font-semibold">TODO</h2>
        </div>
      </section>
    </div>
  );
}
