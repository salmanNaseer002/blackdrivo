import { redirect } from "next/navigation";
export default function OnboardingPersonalRedirect() {
  redirect("/driver/dashboard/profile");
}
