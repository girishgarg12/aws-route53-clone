import AppShell from "@/components/layout/AppShell";
import {
  ChevronRight,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

export default function HostedZonesPage() {
  return (
    <AppShell>
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-sm text-[#5f6b75]">
          <span>Route 53</span>
          <ChevronRight size={14} />
          <span className="text-[#161e2d]">
            Hosted zones
          </span>
        </div>

        {/* Page heading */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#161e2d]">
              Hosted zones
            </h2>

            <p className="mt-1 text-sm text-[#5f6b75]">
              Manage the hosted zones for your
              domains.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-sm bg-[#ff9900] px-4 py-2 text-sm font-semibold text-[#161e2d] hover:bg-[#ec8b00]">
            <Plus size={16} />
            Create hosted zone
          </button>
        </div>

        {/* Information panel */}
        <div className="mb-5 border border-[#d5dbdb] bg-white p-5">
          <h3 className="text-base font-semibold">
            How hosted zones work
          </h3>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6b75]">
            A hosted zone contains records that
            define how traffic is routed for a
            domain and its subdomains.
          </p>
        </div>

        {/* Table container */}
        <div className="border border-[#d5dbdb] bg-white">
          <div className="flex items-center justify-between border-b border-[#eaeded] px-5 py-4">
            <div>
              <h3 className="text-lg font-semibold">
                Hosted zones
              </h3>

              <p className="mt-1 text-xs text-[#687078]">
                0 hosted zones
              </p>
            </div>

            <button
              className="rounded-sm border border-[#879596] p-2 hover:bg-[#f2f3f3]"
              aria-label="Refresh"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="border-b border-[#eaeded] p-4">
            <div className="flex max-w-xl items-center border border-[#879596] bg-white">
              <Search
                size={17}
                className="ml-3 text-[#687078]"
              />

              <input
                className="w-full px-3 py-2 text-sm outline-none"
                placeholder="Filter hosted zones by property or value"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f7f8f8] text-xs uppercase tracking-wide text-[#5f6b75]">
                <tr>
                  <th className="px-5 py-3 font-semibold">
                    Hosted zone name
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Type
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Record count
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Description
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-16 text-center"
                  >
                    <p className="font-medium">
                      No hosted zones
                    </p>

                    <p className="mt-1 text-sm text-[#687078]">
                      Create a hosted zone to get
                      started.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}