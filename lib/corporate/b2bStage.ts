// Single source of truth for "what stage is THIS passenger's B2B trip at" —
// ported from PassApp's src/lib/b2bStage.js so the wording never drifts out
// of sync between the app and the website's own Corporate pages.
export const STAGE_LABEL: Record<string, string> = {
  assigned: "Driver assigned",
  ride_active: "Ride In Progress",
  heading_to_office_pickup: "Driver heading to office",
  at_office: "Driver at office",
  on_the_way: "Arriving",
  arrived: "Arrived",
  picked_up: "Picked up",
  heading_to_office: "Heading to office",
  dropped_off: "Ride Completed",
};

interface Stop {
  stop_type?: string | null;
  actual_pickup_at?: string | null;
  actual_drop_at?: string | null;
  drop_arrived_at?: string | null;
  notified_on_way_at?: string | null;
  arrived_at?: string | null;
}
interface Trip {
  on_the_way_at?: string | null;
  ride_started_at?: string | null;
}

export function deriveB2BStage(myStop: Stop | undefined, allStops: Stop[] | undefined, trip: Trip | undefined, isReturn: boolean): string {
  if (isReturn && myStop?.actual_pickup_at) {
    if (myStop.actual_drop_at) return "dropped_off";
    if (myStop.drop_arrived_at) return "arrived";
    if (myStop.notified_on_way_at) return "on_the_way";
    return "picked_up";
  }

  if (!isReturn) {
    const passengerStops = (allStops || []).filter((s) => s.stop_type === "passenger");
    const allPicked = passengerStops.length > 0 && passengerStops.every((s) => !!s.actual_pickup_at);
    if (allPicked) return "heading_to_office";
  }

  if (myStop?.actual_pickup_at) return "picked_up";
  if (myStop?.arrived_at) return "arrived";
  if (myStop?.notified_on_way_at) return "on_the_way";

  if (isReturn && trip?.on_the_way_at && !trip?.ride_started_at) {
    const officeStop = (allStops || []).find((s) => s.stop_type === "office");
    return officeStop?.arrived_at ? "at_office" : "heading_to_office_pickup";
  }

  if (!isReturn && trip?.on_the_way_at) return "ride_active";

  return "assigned";
}
