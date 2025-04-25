import { Skeleton } from "../ui/skeleton";

export const UpcomingEventCard_Loading = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border-2 border-accent border-opacity-50 shadow-md">
      <div className="md:flex">
        <div className="relative h-60 md:h-auto md:w-1/3">
          <Skeleton className="h-full w-full" />
        </div>

        <div className="p-6 md:w-2/3">
          <Skeleton className="mb-4 h-8 w-3/4" />

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-gray-600">
              <Skeleton className="mr-2 h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>

            <div className="flex items-center text-gray-600">
              <Skeleton className="mr-2 h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1 text-gray-700">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="mt-6">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};
