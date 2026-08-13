"use client";

import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import AppShell from "@/components/layout/AppShell";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import RecordForm from "@/components/records/RecordForm";

import {
  createRecord,
  deleteRecord,
  getRecord,
  getRecords,
  updateRecord,
} from "@/lib/records";

import { getHostedZone } from "@/lib/hosted-zones";

import {
  RECORD_TYPES,
  type DNSRecord,
  type RecordType,
} from "@/types/record";

import type { HostedZone } from "@/types/hosted-zone";

const PAGE_SIZE = 10;

export default function HostedZoneRecordsPage() {
  const params = useParams();

  const zoneId = Number(params.id);

  const [zone, setZone] =
    useState<HostedZone | null>(null);

  const [records, setRecords] = useState<
    DNSRecord[]
  >([]);

  const [search, setSearch] = useState("");
  const [recordType, setRecordType] =
    useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [showCreate, setShowCreate] =
    useState(false);

  const [editingRecord, setEditingRecord] =
    useState<DNSRecord | null>(null);

  const [deletingRecord, setDeletingRecord] =
    useState<DNSRecord | null>(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [toast, setToast] =
    useState<string | null>(null);

  const loadZone = useCallback(async () => {
    try {
      const data =
        await getHostedZone(zoneId);

      setZone(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load hosted zone."
      );
    }
  }, [zoneId]);

  const loadRecords = useCallback(
    async (
      currentSearch = search,
      currentType = recordType,
      currentPage = page
    ) => {
      try {
        setLoading(true);
        setError("");

        const data = await getRecords(
          zoneId,
          currentSearch,
          currentType,
          currentPage,
          PAGE_SIZE
        );

        setRecords(data.items);
        setTotal(data.total);
        setTotalPages(data.total_pages);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load DNS records."
        );
      } finally {
        setLoading(false);
      }
    },
    [zoneId, search, recordType, page]
  );

  useEffect(() => {
    if (!Number.isNaN(zoneId)) {
      loadZone();
    }
  }, [zoneId, loadZone]);

  useEffect(() => {
    if (!Number.isNaN(zoneId)) {
      loadRecords();
    }
  }, [zoneId, loadRecords]);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleTypeChange(value: string) {
    setRecordType(value);
    setPage(1);
  }

  async function handleCreate(data: {
    name: string;
    type: RecordType;
    ttl: number;
    value: string;
  }) {
    setActionLoading(true);

    try {
      await createRecord(zoneId, data);

      setShowCreate(false);
      setPage(1);

      await loadRecords(
        search,
        recordType,
        1
      );

      setToast(
        "DNS record created successfully"
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleEdit(data: {
    name: string;
    type: RecordType;
    ttl: number;
    value: string;
  }) {
    if (!editingRecord) return;

    setActionLoading(true);

    try {
      await updateRecord(
        zoneId,
        editingRecord.id,
        data
      );

      setEditingRecord(null);

      await loadRecords();

      setToast(
        "DNS record updated successfully"
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingRecord) return;

    setActionLoading(true);

    try {
      await deleteRecord(
        zoneId,
        deletingRecord.id
      );

      setDeletingRecord(null);

      const newPage =
        records.length === 1 && page > 1
          ? page - 1
          : page;

      setPage(newPage);

      await loadRecords(
        search,
        recordType,
        newPage
      );

      setToast(
        "DNS record deleted successfully"
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function openEdit(
    record: DNSRecord
  ) {
    try {
      setActionLoading(true);

      const fullRecord =
        await getRecord(
          zoneId,
          record.id
        );

      setEditingRecord(fullRecord);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load DNS record."
      );
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-sm text-[#5f6b75]">
          <Link
            href="/hosted-zones"
            className="hover:text-[#0073bb] hover:underline"
          >
            Hosted zones
          </Link>

          <ChevronRight size={14} />

          <span className="text-[#161e2d]">
            {zone?.name || "Hosted zone"}
          </span>
        </div>

        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/hosted-zones"
                className="rounded-sm p-1 hover:bg-[#eaeded]"
                aria-label="Back to hosted zones"
              >
                <ChevronLeft size={20} />
              </Link>

              <h2 className="text-2xl font-semibold text-[#161e2d]">
                {zone?.name || "Hosted zone"}
              </h2>
            </div>

            <p className="mt-2 ml-9 text-sm text-[#5f6b75]">
              Manage DNS records for this hosted
              zone.
            </p>
          </div>

          <button
            onClick={() =>
              setShowCreate(true)
            }
            className="flex items-center gap-2 rounded-sm bg-[#ff9900] px-4 py-2 text-sm font-semibold text-[#161e2d] hover:bg-[#ec8b00]"
          >
            <Plus size={16} />
            Create record
          </button>
        </div>

        {/* Zone information */}
        {zone && (
          <div className="mb-5 border border-[#d5dbdb] bg-white p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#687078]">
                  Hosted zone
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {zone.name}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-[#687078]">
                  Type
                </p>

                <p className="mt-1 flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-[#1d8102]" />

                  {zone.visibility ===
                  "public"
                    ? "Public"
                    : "Private"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-[#687078]">
                  Description
                </p>

                <p className="mt-1 text-sm text-[#5f6b75]">
                  {zone.description || "—"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Records */}
        <div className="border border-[#d5dbdb] bg-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#eaeded] px-5 py-4">
            <div>
              <h3 className="text-lg font-semibold">
                Records
              </h3>

              <p className="mt-1 text-xs text-[#687078]">
                {total}{" "}
                {total === 1
                  ? "record"
                  : "records"}
              </p>
            </div>

            <button
              onClick={() =>
                loadRecords()
              }
              disabled={loading}
              className="rounded-sm border border-[#879596] p-2 hover:bg-[#f2f3f3] disabled:opacity-50"
              aria-label="Refresh records"
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

          {/* Filters */}
          <div className="flex flex-col gap-3 border-b border-[#eaeded] p-4 md:flex-row">
            <div className="flex max-w-xl flex-1 items-center border border-[#879596]">
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
                placeholder="Search records"
                className="w-full px-3 py-2 text-sm outline-none"
              />
            </div>

            <select
              value={recordType}
              onChange={(event) =>
                handleTypeChange(
                  event.target.value
                )
              }
              className="border border-[#879596] bg-white px-3 py-2 text-sm outline-none focus:border-[#0073bb]"
            >
              <option value="">
                All record types
              </option>

              {RECORD_TYPES.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="m-4 border border-[#d13212] bg-[#fff4f2] px-4 py-3 text-sm text-[#d13212]">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f7f8f8] text-xs uppercase tracking-wide text-[#5f6b75]">
                <tr>
                  <th className="px-5 py-3 font-semibold">
                    Name
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Type
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Value
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    TTL
                  </th>

                  <th className="w-12 px-3 py-3" />
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({
                    length: 5,
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
                ) : records.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-16 text-center"
                    >
                      <p className="font-medium">
                        {search ||
                        recordType
                          ? "No matching records"
                          : "No records"}
                      </p>

                      <p className="mt-1 text-sm text-[#687078]">
                        {search ||
                        recordType
                          ? "Try changing your filters."
                          : "Create a DNS record to get started."}
                      </p>

                      {!search &&
                        !recordType && (
                          <button
                            onClick={() =>
                              setShowCreate(
                                true
                              )
                            }
                            className="mt-4 text-sm font-semibold text-[#0073bb] hover:underline"
                          >
                            Create record
                          </button>
                        )}
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr
                      key={record.id}
                      className="border-t border-[#eaeded] hover:bg-[#f7f8f8]"
                    >
                      <td className="max-w-xs px-5 py-4 font-medium">
                        <span className="break-all">
                          {record.name}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-sm border border-[#d5dbdb] bg-[#f7f8f8] px-2 py-1 font-mono text-xs font-semibold">
                          {record.type}
                        </span>
                      </td>

                      <td className="max-w-lg px-5 py-4">
                        <span className="block max-w-xl whitespace-pre-wrap break-all font-mono text-xs text-[#414a52]">
                          {record.value}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-[#5f6b75]">
                        {record.ttl}
                      </td>

                      <td className="px-3 py-4">
                        <div className="group relative">
                          <button
                            className="rounded-sm p-1.5 hover:bg-[#eaeded]"
                            aria-label={`Actions for ${record.name}`}
                          >
                            <MoreVertical
                              size={17}
                            />
                          </button>

                          <div className="absolute right-0 top-full z-10 hidden w-40 border border-[#d5dbdb] bg-white py-1 shadow-lg group-hover:block">
                            <button
                              onClick={() =>
                                openEdit(
                                  record
                                )
                              }
                              className="w-full px-4 py-2 text-left text-sm hover:bg-[#f2f3f3]"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                setDeletingRecord(
                                  record
                                )
                              }
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[#d13212] hover:bg-[#fff4f2]"
                            >
                              <Trash2
                                size={14}
                              />
                              Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading &&
            records.length > 0 && (
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
                    className="border border-[#879596] px-3 py-1.5 text-sm hover:bg-[#f2f3f3] disabled:cursor-not-allowed disabled:opacity-40"
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
                    className="border border-[#879596] px-3 py-1.5 text-sm hover:bg-[#f2f3f3] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Create */}
      <Modal
        open={showCreate}
        title="Create record"
        onClose={() =>
          !actionLoading &&
          setShowCreate(false)
        }
      >
        <RecordForm
          loading={actionLoading}
          onSubmit={handleCreate}
          onCancel={() =>
            setShowCreate(false)
          }
        />
      </Modal>

      {/* Edit */}
      <Modal
        open={Boolean(editingRecord)}
        title="Edit record"
        onClose={() =>
          !actionLoading &&
          setEditingRecord(null)
        }
      >
        <RecordForm
          record={editingRecord}
          loading={actionLoading}
          onSubmit={handleEdit}
          onCancel={() =>
            setEditingRecord(null)
          }
        />
      </Modal>

      {/* Delete */}
      <Modal
        open={Boolean(deletingRecord)}
        title="Delete record"
        onClose={() =>
          !actionLoading &&
          setDeletingRecord(null)
        }
      >
        <div>
          <p className="text-sm text-[#414a52]">
            Are you sure you want to delete this
            DNS record?
          </p>

          <div className="mt-4 border border-[#eaeded] bg-[#f7f8f8] px-4 py-3">
            <p className="font-mono text-sm font-semibold">
              {deletingRecord?.name}
            </p>

            <p className="mt-1 font-mono text-xs text-[#687078]">
              {deletingRecord?.type}{" "}
              {deletingRecord?.value}
            </p>
          </div>

          <div className="mt-5 flex justify-end gap-3 border-t border-[#eaeded] pt-5">
            <button
              onClick={() =>
                setDeletingRecord(null)
              }
              disabled={actionLoading}
              className="border border-[#879596] px-4 py-2 text-sm font-semibold hover:bg-[#f2f3f3]"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="bg-[#d13212] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ba2a0b] disabled:opacity-50"
            >
              {actionLoading
                ? "Deleting..."
                : "Delete record"}
            </button>
          </div>
        </div>
      </Modal>

      {toast && (
        <Toast
          message={toast}
          onClose={() => setToast(null)}
        />
      )}
    </AppShell>
  );
}