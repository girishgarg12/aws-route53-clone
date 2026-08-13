import { api } from "./api";

import type {
  CreateDNSRecordRequest,
  DNSRecord,
  DNSRecordListResponse,
  UpdateDNSRecordRequest,
} from "@/types/record";

export async function getRecords(
  hostedZoneId: number,
  search = "",
  type = "",
  page = 1,
  limit = 10
) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (type) {
    params.set("type", type);
  }

  params.set("page", String(page));
  params.set("limit", String(limit));

  return api<DNSRecordListResponse>(
    `/api/hosted-zones/${hostedZoneId}/records?${params.toString()}`
  );
}

export async function getRecord(
  hostedZoneId: number,
  recordId: number
) {
  return api<DNSRecord>(
    `/api/hosted-zones/${hostedZoneId}/records/${recordId}`
  );
}

export async function createRecord(
  hostedZoneId: number,
  data: CreateDNSRecordRequest
) {
  return api<DNSRecord>(
    `/api/hosted-zones/${hostedZoneId}/records`,
    {
      method: "POST",
      body: data,
    }
  );
}

export async function updateRecord(
  hostedZoneId: number,
  recordId: number,
  data: UpdateDNSRecordRequest
) {
  return api<DNSRecord>(
    `/api/hosted-zones/${hostedZoneId}/records/${recordId}`,
    {
      method: "PUT",
      body: data,
    }
  );
}

export async function deleteRecord(
  hostedZoneId: number,
  recordId: number
) {
  return api<{ message: string }>(
    `/api/hosted-zones/${hostedZoneId}/records/${recordId}`,
    {
      method: "DELETE",
    }
  );
}