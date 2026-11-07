"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
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
import { api } from "~/trpc/react";
import { Spinner } from "../ui/spinner";

export function EditProfileDialog({
  username,
  bio,
}: {
  username: string;
  bio: string | null;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const updateProfile = api.users.updateUserProfile.useMutation({
    onSuccess: () => {
      setOpen(false);
      router.refresh();
    },
  });

  const form = useForm({
    defaultValues: {
      bio: bio ?? "",
    },
    onSubmit: async ({ value }) => {
      await updateProfile.mutateAsync({
        username,
        bio: value.bio,
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="cncDefault" className="self-end sm:self-auto">
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>

          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={async (event) => {
            event.preventDefault();
            event.stopPropagation();
            await form.handleSubmit();
          }}
        >
          <form.Field name="bio">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>

                <Textarea
                  id="bio"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  rows={4}
                />
              </div>
            )}
          </form.Field>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="cncDefault"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                  {isSubmitting && <Spinner />}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
