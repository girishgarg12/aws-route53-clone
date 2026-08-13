import AppShell from "@/components/layout/AppShell";
import ComingSoon from "@/components/ui/ComingSoon";

export default function HealthChecksPage() {
  return (
    <AppShell>
      <ComingSoon
        title="Health checks"
        description="Health check management will be available in a future update."
      />
    </AppShell>
  );
}