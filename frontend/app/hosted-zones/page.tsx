"use client";

import {
  ChevronRight,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"; 

import AppShell from "@/components/layout/AppShell";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import HostedZoneForm from "@/components/hosted-zones/HostedZoneForm";

import {
  createHostedZone,
  deleteHostedZone,
  getHostedZone,
  getHostedZones,
  updateHostedZone,
} from "@/lib/hosted-zones";

import type {
  HostedZone,
  HostedZoneListItem,
  Visibility,
} from "@/types/hosted-zone";

const PAGE_SIZE = 10;

export default function HostedZonesPage() {
  const [zones, setZones] = useState<
    HostedZoneListItem[]
  >([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] =
    useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreate, setShowCreate] =
    useState(false);

  const [editingZone, setEditingZone] =
    useState<HostedZone | null>(null);

  const [deletingZone, setDeletingZone] =
    useState<HostedZoneListItem | null>(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [toast, setToast] =
    useState<string | null>(null);

  /*
   * Action menu state.
   *
   * We render the menu outside the table using
   * position: fixed so it cannot be clipped by
   * the table's overflow container.
   */
  const [openMenuId, setOpenMenuId] =
    useState<number | null>(null);

  const [menuPosition, setMenuPosition] =
    useState<{
      top: number;
      left: number;
    } | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const loadZones = useCallback(
    async (
      currentSearch = search,
      currentPage = page
    ) => {
      try {
        setLoading(true);
        setError("");

        const data = await getHostedZones(
          currentSearch,
          currentPage,
          PAGE_SIZE
        );

        setZones(data.items);
        setTotal(data.total);
        setTotalPages(data.total_pages);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load hosted zones."
        );
      } finally {
        setLoading(false);
      }
    },
    [search, page]
  );

  useEffect(() => {
    loadZones();
  }, [loadZones]);

  useEffect(() => {
  if (openMenuId === null) return;

  function handleOutsideClick(
    event: MouseEvent
  ) {
    const target = event.target as Node;

    if (
      menuRef.current &&
      !menuRef.current.contains(target)
    ) {
      closeActionMenu();
    }
  }

  document.addEventListener(
    "mousedown",
    handleOutsideClick
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleOutsideClick
    );
  };
}, [openMenuId]);

  async function handleCreate(data: {
    name: string;
    description: string;
    visibility: Visibility;
  }) {
    setActionLoading(true);

    try {
      await createHostedZone(data);

      setShowCreate(false);
      setPage(1);

      await loadZones("", 1);

      setSearch("");

      setToast(
        "Hosted zone created successfully"
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleEdit(data: {
    name: string;
    description: string;
    visibility: Visibility;
  }) {
    if (!editingZone) return;

    setActionLoading(true);

    try {
      await updateHostedZone(
        editingZone.id,
        data
      );

      setEditingZone(null);

      await loadZones();

      setToast(
        "Hosted zone updated successfully"
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingZone) return;

    setActionLoading(true);

    try {
      await deleteHostedZone(
        deletingZone.id
      );

      setDeletingZone(null);

      const newPage =
        zones.length === 1 && page > 1
          ? page - 1
          : page;

      setPage(newPage);

      await loadZones(search, newPage);

      setToast(
        "Hosted zone deleted successfully"
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function openEdit(
    zone: HostedZoneListItem
  ) {
    try {
      setActionLoading(true);

      const fullZone =
        await getHostedZone(zone.id);

      setEditingZone(fullZone);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load hosted zone."
      );
    } finally {
      setActionLoading(false);
    }
  }

  function handleSearch(
    value: string
  ) {
    setSearch(value);
    setPage(1);
  }

  function toggleActionMenu(
    event: React.MouseEvent<HTMLButtonElement>,
    zoneId: number
  ) {
    if (openMenuId === zoneId) {
      setOpenMenuId(null);
      setMenuPosition(null);
      return;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    const menuWidth = 160;
    const menuHeight = 84;
    const spacing = 6;

    const left = Math.min(
      rect.right - menuWidth,
      window.innerWidth - menuWidth - 12
    );

    const hasSpaceBelow =
      window.innerHeight -
        rect.bottom >
      menuHeight + spacing;

    const top = hasSpaceBelow
      ? rect.bottom + spacing
      : rect.top - menuHeight - spacing;

    setOpenMenuId(zoneId);

    setMenuPosition({
      top,
      left: Math.max(12, left),
    });
  }

  function closeActionMenu() {
    setOpenMenuId(null);
    setMenuPosition(null);
  }

  function handleEditFromMenu() {
    if (openMenuId === null) return;

    const zone = zones.find(
      (item) => item.id === openMenuId
    );

    if (!zone) return;

    closeActionMenu();
    openEdit(zone);
  }

  function handleDeleteFromMenu() {
    if (openMenuId === null) return;

    const zone = zones.find(
      (item) => item.id === openMenuId
    );

    if (!zone) return;

    closeActionMenu();
    setDeletingZone(zone);
  }

  return (
    <AppShell>
      <div>
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-sm text-[#5f6b75]">
          <span>Route 53</span>

          <ChevronRight size={14} />

          <span className="text-[#161e2d]">
            Hosted zones
          </span>
        </div>

        {/* Page Header */}
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

          <button
            onClick={() =>
              setShowCreate(true)
            }
            className="flex items-center gap-2 rounded-sm bg-[#ff9900] px-4 py-2 text-sm font-semibold text-[#161e2d] transition-colors hover:bg-[#ec8b00] cursor-pointer"
          >
            <Plus size={16} />

            Create hosted zone
          </button>
        </div>

        {/* Information panel */}
        <div className="mb-5 border border-[#d5dbdb] bg-white p-5">
          <h3 className="text-base font-semibold">
            Hosted zones
          </h3>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6b75]">
            A hosted zone contains records that
            define how traffic is routed for a
            domain and its subdomains.
          </p>
        </div>

        {/* Main table */}
        <div className="border border-[#d5dbdb] bg-white">
          {/* Table header */}
          <div className="flex items-center justify-between border-b border-[#eaeded] px-5 py-4">
            <div>
              <h3 className="text-lg font-semibold">
                Hosted zones
              </h3>

              <p className="mt-1 text-xs text-[#687078]">
                {total}{" "}
                {total === 1
                  ? "hosted zone"
                  : "hosted zones"}
              </p>
            </div>

            <button
              onClick={() =>
                loadZones()
              }
              disabled={loading}
              className="rounded-sm border border-[#879596] p-2 transition-colors hover:bg-[#f2f3f3] disabled:opacity-50 cursor-pointer"
              aria-label="Refresh"
            >
              <RefreshCw
                size={16}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>

          {/* Search */}
          <div className="border-b border-[#eaeded] p-4">
            <div className="flex max-w-xl items-center border border-[#879596] bg-white">
              <Search
                size={17}
                className="ml-3 text-[#687078]"
              />

              <input
                value={search}
                onChange={(event) =>
                  handleSearch(
                    event.target.value
                  )
                }
                className="w-full px-3 py-2 text-sm outline-none"
                placeholder="Filter hosted zones by name"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="m-4 flex items-center justify-between border border-[#d13212] bg-[#fff4f2] px-4 py-3 text-sm text-[#d13212]">
              <span>{error}</span>

              <button
                onClick={() =>
                  loadZones()
                }
                className="font-semibold underline transition-opacity hover:opacity-70 cursor-pointer"
              >
                Try again
              </button>
            </div>
          )}

          {/* Table */}
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

                  <th className="w-12 px-3 py-3" />
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({
                    length: 4,
                  }).map((_, index) => (
                    <tr
                      key={index}
                      className="border-t border-[#eaeded]"
                    >
                      <td
                        colSpan={5}
                        className="px-5 py-4"
                      >
                        <div className="h-4 w-full animate-pulse bg-[#eaeded]" />
                      </td>
                    </tr>
                  ))
                ) : zones.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-16 text-center"
                    >
                      <p className="font-medium">
                        {search
                          ? "No matching hosted zones"
                          : "No hosted zones"}
                      </p>

                      <p className="mt-1 text-sm text-[#687078]">
                        {search
                          ? "Try a different search term."
                          : "Create a hosted zone to get started."}
                      </p>

                      {!search && (
                        <button
                          onClick={() =>
                            setShowCreate(
                              true
                            )
                          }
                          className="mt-4 text-sm font-semibold text-[#0073bb] transition-colors hover:text-[#005a8c] hover:underline cursor-pointer"
                        >
                          Create hosted zone
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  zones.map((zone) => (
                    <tr
                      key={zone.id}
                      className="border-t border-[#eaeded] hover:bg-[#f7f8f8]"
                    >
                      {/* Name */}
                      <td className="px-5 py-4">
                        <Link
                          href={`/hosted-zones/${zone.id}`}
                          className="font-semibold text-[#0073bb] transition-colors hover:text-[#005a8c] hover:underline"
                        >
                          {zone.name}
                        </Link>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[#1d8102]" />

                          {zone.visibility ===
                          "public"
                            ? "Public"
                            : "Private"}
                        </span>
                      </td>

                      {/* Record count */}
                      <td className="px-5 py-4">
                        {zone.record_count}
                      </td>

                      {/* Description */}
                      <td className="max-w-xs px-5 py-4 text-[#5f6b75]">
                        <span className="line-clamp-2">
                          {zone.description ||
                            "—"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-4">
                        <button
                          onClick={(event) =>
                            toggleActionMenu(
                              event,
                              zone.id
                            )
                          }
                          className={`rounded-sm p-1.5 transition-colors hover:bg-[#eaeded] cursor-pointer ${
                            openMenuId ===
                            zone.id
                              ? "bg-[#eaeded]"
                              : ""
                          }`}
                          aria-label={`Actions for ${zone.name}`}
                          aria-expanded={
                            openMenuId ===
                            zone.id
                          }
                        >
                          <MoreVertical
                            size={17}
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading &&
            zones.length > 0 && (
              <div className="flex items-center justify-between border-t border-[#eaeded] px-5 py-3">
                <span className="text-xs text-[#687078]">
                  Showing{" "}
                  {(page - 1) *
                    PAGE_SIZE +
                    1}{" "}
                  -{" "}
                  {Math.min(
                    page * PAGE_SIZE,
                    total
                  )}{" "}
                  of {total}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() =>
                      setPage(
                        (value) =>
                          value - 1
                      )
                    }
                    className="border border-[#879596] px-3 py-1.5 text-sm transition-colors hover:bg-[#f2f3f3] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="px-2 text-sm">
                    {page} / {totalPages}
                  </span>

                  <button
                    disabled={
                      page >= totalPages
                    }
                    onClick={() =>
                      setPage(
                        (value) =>
                          value + 1
                      )
                    }
                    className="border border-[#879596] px-3 py-1.5 text-sm transition-colors hover:bg-[#f2f3f3] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Fixed hosted zone action menu */}
      {openMenuId !== null &&
        menuPosition !== null && (
          <div
            ref={menuRef}
            className="fixed z-[100] w-40 border border-[#d5dbdb] bg-white py-1 shadow-lg cursor-pointer"
            style={{
                top: menuPosition.top,
                left: menuPosition.left,
            }}
            >
            <button
              onClick={handleEditFromMenu}
              className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[#f2f3f3] cursor-pointer"
            >
              Edit
            </button>

            <button
              onClick={handleDeleteFromMenu}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[#d13212] transition-colors hover:bg-[#fff4f2] cursor-pointer"
            >
              <Trash2 size={14} />

              Delete
            </button>
          </div>
        )}

      {/* Create modal */}
      <Modal
        open={showCreate}
        title="Create hosted zone"
        onClose={() =>
          !actionLoading &&
          setShowCreate(false)
        }
      >
        <HostedZoneForm
          loading={actionLoading}
          onSubmit={handleCreate}
          onCancel={() =>
            setShowCreate(false)
          }
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={Boolean(editingZone)}
        title="Edit hosted zone"
        onClose={() =>
          !actionLoading &&
          setEditingZone(null)
        }
      >
        <HostedZoneForm
          zone={editingZone}
          loading={actionLoading}
          onSubmit={handleEdit}
          onCancel={() =>
            setEditingZone(null)
          }
        />
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={Boolean(deletingZone)}
        title="Delete hosted zone"
        onClose={() =>
          !actionLoading &&
          setDeletingZone(null)
        }
      >
        <div>
          <p className="text-sm text-[#414a52]">
            Are you sure you want to delete this
            hosted zone?
          </p>

          <div className="mt-4 border border-[#eaeded] bg-[#f7f8f8] px-4 py-3">
            <p className="text-sm font-semibold">
              {deletingZone?.name}
            </p>

            <p className="mt-1 text-xs text-[#687078]">
              This action cannot be undone.
            </p>
          </div>

          <div className="mt-5 flex justify-end gap-3 border-t border-[#eaeded] pt-5">
            <button
              onClick={() =>
                setDeletingZone(null)
              }
              disabled={actionLoading}
              className="border border-[#879596] px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#f2f3f3]"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="bg-[#d13212] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#ba2a0b] disabled:opacity-50"
            >
              {actionLoading
                ? "Deleting..."
                : "Delete hosted zone"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast}
          onClose={() => setToast(null)}
        />
      )}
    </AppShell>
  );
}