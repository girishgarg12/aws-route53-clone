"use client";

import { FormEvent, useEffect, useState } from "react";

import type {
  HostedZone,
  Visibility,
} from "@/types/hosted-zone";

interface HostedZoneFormProps {
  zone?: HostedZone | null;
  loading?: boolean;
  onSubmit: (data: {
    name: string;
    description: string;
    visibility: Visibility;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function HostedZoneForm({
  zone,
  loading = false,
  onSubmit,
  onCancel,
}: HostedZoneFormProps) {
  const [name, setName] = useState(
    zone?.name ?? ""
  );

  const [description, setDescription] =
    useState(zone?.description ?? "");

  const [visibility, setVisibility] =
    useState<Visibility>(
      zone?.visibility ?? "public"
    );

  const [error, setError] = useState("");

  useEffect(() => {
    setName(zone?.name ?? "");
    setDescription(zone?.description ?? "");
    setVisibility(
      zone?.visibility ?? "public"
    );
    setError("");
  }, [zone]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Hosted zone name is required.");
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        visibility,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save hosted zone."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {error && (
        <div className="border border-[#d13212] bg-[#fff4f2] px-4 py-3 text-sm text-[#d13212]">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="zone-name"
          className="mb-1.5 block text-sm font-semibold"
        >
          Domain name
        </label>

        <input
          id="zone-name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="example.com"
          className="w-full border border-[#879596] px-3 py-2 text-sm outline-none focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb]"
          required
        />

        <p className="mt-1 text-xs text-[#687078]">
          Enter the domain name for this hosted
          zone.
        </p>
      </div>

      <div>
        <label
          htmlFor="zone-description"
          className="mb-1.5 block text-sm font-semibold"
        >
          Description
        </label>

        <textarea
          id="zone-description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          rows={3}
          placeholder="Optional description"
          className="w-full resize-none border border-[#879596] px-3 py-2 text-sm outline-none focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb]"
        />
      </div>

      <div>
        <label
          htmlFor="zone-visibility"
          className="mb-1.5 block text-sm font-semibold"
        >
          Hosted zone type
        </label>

        <select
          id="zone-visibility"
          value={visibility}
          onChange={(event) =>
            setVisibility(
              event.target.value as Visibility
            )
          }
          className="w-full border border-[#879596] bg-white px-3 py-2 text-sm outline-none focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb]"
        >
          <option value="public">
            Public hosted zone
          </option>

          <option value="private">
            Private hosted zone
          </option>
        </select>
      </div>

      <div className="flex justify-end gap-3 border-t border-[#eaeded] pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="border border-[#879596] px-4 py-2 text-sm font-semibold hover:bg-[#f2f3f3] disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#ff9900] px-4 py-2 text-sm font-semibold text-[#161e2d] hover:bg-[#ec8b00] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : zone
              ? "Save changes"
              : "Create hosted zone"}
        </button>
      </div>
    </form>
  );
}