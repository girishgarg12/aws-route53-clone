"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  RECORD_TYPES,
  type DNSRecord,
  type RecordType,
} from "@/types/record";

interface RecordFormProps {
  record?: DNSRecord | null;
  loading?: boolean;
  onSubmit: (data: {
    name: string;
    type: RecordType;
    ttl: number;
    value: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function RecordForm({
  record,
  loading = false,
  onSubmit,
  onCancel,
}: RecordFormProps) {
  const [name, setName] = useState(
    record?.name ?? ""
  );

  const [type, setType] =
    useState<RecordType>(
      record?.type ?? "A"
    );

  const [ttl, setTtl] = useState(
    record?.ttl?.toString() ?? "300"
  );

  const [value, setValue] = useState(
    record?.value ?? ""
  );

  const [error, setError] = useState("");

  useEffect(() => {
    setName(record?.name ?? "");
    setType(record?.type ?? "A");
    setTtl(record?.ttl?.toString() ?? "300");
    setValue(record?.value ?? "");
    setError("");
  }, [record]);

  function getValuePlaceholder() {
    switch (type) {
      case "A":
        return "192.0.2.1";

      case "AAAA":
        return "2001:db8::1";

      case "CNAME":
        return "example.com";

      case "MX":
        return "10 mail.example.com";

      case "TXT":
        return '"v=spf1 include:example.com ~all"';

      case "NS":
        return "ns1.example.com";

      case "PTR":
        return "host.example.com";

      case "SRV":
        return "10 5 443 service.example.com";

      case "CAA":
        return '0 issue "letsencrypt.org"';

      default:
        return "Record value";
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Record name is required.");
      return;
    }

    if (!value.trim()) {
      setError("Record value is required.");
      return;
    }

    const parsedTtl = Number(ttl);

    if (
      !Number.isInteger(parsedTtl) ||
      parsedTtl <= 0
    ) {
      setError(
        "TTL must be a positive whole number."
      );
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        type,
        ttl: parsedTtl,
        value: value.trim(),
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save record."
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
          htmlFor="record-name"
          className="mb-1.5 block text-sm font-semibold"
        >
          Record name
        </label>

        <input
          id="record-name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="www.example.com"
          className="w-full border border-[#879596] px-3 py-2 text-sm outline-none focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb]"
          required
        />
      </div>

      <div>
        <label
          htmlFor="record-type"
          className="mb-1.5 block text-sm font-semibold"
        >
          Record type
        </label>

        <select
          id="record-type"
          value={type}
          onChange={(event) =>
            setType(
              event.target.value as RecordType
            )
          }
          className="w-full border border-[#879596] bg-white px-3 py-2 text-sm outline-none focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb]"
        >
          {RECORD_TYPES.map((recordType) => (
            <option
              key={recordType}
              value={recordType}
            >
              {recordType}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="record-ttl"
          className="mb-1.5 block text-sm font-semibold"
        >
          TTL
        </label>

        <input
          id="record-ttl"
          type="number"
          min="1"
          value={ttl}
          onChange={(event) =>
            setTtl(event.target.value)
          }
          className="w-full border border-[#879596] px-3 py-2 text-sm outline-none focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb]"
          required
        />

        <p className="mt-1 text-xs text-[#687078]">
          Time to live, in seconds.
        </p>
      </div>

      <div>
        <label
          htmlFor="record-value"
          className="mb-1.5 block text-sm font-semibold"
        >
          Value
        </label>

        <textarea
          id="record-value"
          value={value}
          onChange={(event) =>
            setValue(event.target.value)
          }
          rows={4}
          placeholder={getValuePlaceholder()}
          className="w-full resize-none border border-[#879596] px-3 py-2 font-mono text-sm outline-none focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb]"
          required
        />

        <p className="mt-1 text-xs text-[#687078]">
          Enter the value appropriate for the
          selected record type.
        </p>
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
            : record
              ? "Save changes"
              : "Create record"}
        </button>
      </div>
    </form>
  );
}