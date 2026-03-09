import { Skeleton } from "~/components/ui/skeleton";

export function ProfileProjects_Loading() {
  return (
    <section className="bg-gray-100">
      <div className="responsiveContainer flex flex-col gap-8 py-10">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-32" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-neutral-200 bg-white p-6 shadow"
            >
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="mt-3 h-4 w-1/2" />

              <div className="mt-5 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              <Skeleton className="mt-4 h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
