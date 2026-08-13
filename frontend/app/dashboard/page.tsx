import AppShell from "@/components/layout/AppShell";
import ComingSoon from "@/components/ui/ComingSoon";

export default function DashboardPage() {
  return (
    <AppShell>
      <ComingSoon
        title="Dashboard"
        description="The Route 53 dashboard experience will be available in a future update."
      />
    </AppShell>
  );
}