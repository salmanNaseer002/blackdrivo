import DriverShell from "@/components/driver/DriverShell";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DriverShell>{children}</DriverShell>;
}
