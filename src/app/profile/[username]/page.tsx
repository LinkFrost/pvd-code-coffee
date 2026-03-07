import { auth, clerkClient } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";
import Image from "next/image";
import { provider } from "~/lib/constants";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

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

  // const response = await fetch("https://api.github.com/user/repos", {
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //     Accept: "application/vnd.github.v3+json",
  //   },
  // });

  // const projects = await response.json();

  // console.log(projects);

  // console.log(await session.getToken());

  return user === undefined ? (
    <div>User not found</div>
  ) : (
    <div className="flex flex-col justify-center align-middle">
      <section className="bg-accent">
        <div className="responsiveContainer flex h-full flex-col items-start gap-8 py-12">
          <div className="flex w-full flex-col items-center gap-8 md:flex-row md:justify-between md:gap-0">
            <div className="flex items-center gap-8">
              <Image
                src={user.image_url ?? "./placeholder.svg"}
                alt={user.username ?? "Profile Image"}
                width={100}
                height={100}
                className="rounded-full"
              />

              <div className="flex flex-col items-start justify-center">
                <span className="text-center font-din text-3xl md:text-4xl">
                  {user.first_name} {user.last_name}
                </span>

                <span className="text-center font-din text-2xl">
                  {user.username}
                </span>
              </div>
            </div>

            {isLoggedInUser && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="cncDefault">Edit Profile</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>

                    <DialogDescription>
                      Make changes to your profile here. Click save when
                      you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4">
                    <Label htmlFor="bio">Bio</Label>

                    <Textarea
                      id="bio"
                      name="bio"
                      defaultValue={user.bio ?? ""}
                    />
                  </div>

                  {/* <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
          </div> */}

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>

                    <Button type="submit" onClick={() => api.users.updateUserProfile({username})}>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <p className="bg-accentDarker rounded-md p-4 text-lg md:text-xl">
            {/* {user.bio ?? 'Click "Edit Profile" to add a bio'} */}
            {/* Velit anim laborum amet do duis id irure non sit irure esse veniam
            cillum sint. Commodo in incididunt ea sint consequat adipisicing
            aute. Aliquip est nisi duis laboris labore est consequat do do
            veniam elit veniam nisi. Excepteur aliqua veniam pariatur eu est. */}
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
