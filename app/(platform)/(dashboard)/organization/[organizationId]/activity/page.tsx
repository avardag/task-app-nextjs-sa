import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import ActivityList from "./_components/ActivityList";
import { Info } from "../_components/info";

export default function ActivityPage() {
  return (
    <div className="w-full">
      <Info />
      <Separator className="my-2" />
      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  );
}
