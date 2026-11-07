import { Skeleton } from "~/components/ui/skeleton";

export function ProfileHeader_Loading() {
  return (
    <section className="bg-accent">
      <div className="responsiveContainer flex h-full flex-col items-start gap-8 py-12">
        <div className="flex w-full flex-col items-center gap-8 md:flex-row md:justify-between md:gap-0">
          <div className="flex items-center gap-8">
            <Skeleton className="h-[100px] w-[100px] rounded-full" />

            <div className="flex flex-col gap-3">
              <Skeleton className="h-9 w-56" />
              <Skeleton className="h-7 w-40" />
            </div>
          </div>

          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-20 w-full rounded-md" />
      </div>
    </section>
  );
}
