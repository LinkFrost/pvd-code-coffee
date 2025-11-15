import { auth, clerkClient } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";
import Image from "next/image";
import { provider } from "~/lib/constants";

export default async function Profile({
  params,
}: {
  params: { username: string };
}) {
  const session = await auth();
  const clerk = await clerkClient();

  const user = await api.users.getUserByUsername({ username: params.username });

  let clerkResponse;
  let accessToken;

  try {
    clerkResponse = await clerk.users.getUserOauthAccessToken(
      session?.userId ?? "",
      provider,
    );

    accessToken = clerkResponse.data[0]?.token;
  } catch (error) {
    console.log("Clerk OAuth token not found:", error);
  }

  const isLoggedInUser = user?.clerk_id === session?.userId;

  const response = await fetch("https://api.github.com/user/repos", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  const projects = await response.json();

  console.log(projects);

  // console.log(await session.getToken());

  return user === undefined ? (
    <div>User not found</div>
  ) : (
    <div className="flex flex-col justify-center align-middle">
      <section className="bg-accent">
        <div className="responsiveContainer flex h-full flex-col items-start gap-8 py-12">
          <div className="flex items-center gap-8">
            <Image
              src={user.image_url ?? "./placeholder.svg"}
              alt={user.username ?? "Profile Image"}
              width={100}
              height={100}
              className="rounded-full"
            />

            <div className="flex flex-col items-start justify-center">
              <span className="text-center font-din text-4xl">
                {user.first_name} {user.last_name}
              </span>

              <span className="text-center font-din text-2xl">
                {user.username}
              </span>
            </div>
          </div>

          <p className="text-xl">
            Qui ea minim velit consectetur consequat magna fugiat. Adipisicing
            id duis irure et sit enim pariatur nostrud proident. Aute aliqua do
            eu exercitation duis qui pariatur fugiat ipsum velit esse nostrud.
            Id ullamco laborum sit non tempor eiusmod ex eu enim culpa est enim.
          </p>
        </div>
      </section>

      {/* <div className="responsiveContainer">
        <ul>
          {projects.map((p) => (
            <li>{p.name}</li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}
