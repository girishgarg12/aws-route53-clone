import AppShell from "@/components/layout/AppShell";
import ComingSoon from "@/components/ui/ComingSoon";

export default function ResolverPage() {
  return (
    <AppShell>
      <ComingSoon
        title="Resolver"
        description="Route 53 Resolver configuration will be available in a future update."
      />
    </AppShell>
  );
}