import { api } from "./api";

import type {
  CreateHostedZoneRequest,
  HostedZone,
  HostedZoneListResponse,
  UpdateHostedZoneRequest,
} from "@/types/hosted-zone";

export async function getHostedZones(
  search = "",
  page = 1,
  limit = 10
) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  params.set("page", String(page));
  params.set("limit", String(limit));

  return api<HostedZoneListResponse>(
    `/api/hosted-zones?${params.toString()}`
  );
}

export async function getHostedZone(
  id: number
) {
  return api<HostedZone>(
    `/api/hosted-zones/${id}`
  );
}

export async function createHostedZone(
  data: CreateHostedZoneRequest
) {
  return api<HostedZone>(
    "/api/hosted-zones",
    {
      method: "POST",
      body: data,
    }
  );
}

export async function updateHostedZone(
  id: number,
  data: UpdateHostedZoneRequest
) {
  return api<HostedZone>(
    `/api/hosted-zones/${id}`,
    {
      method: "PUT",
      body: data,
    }
  );
}

export async function deleteHostedZone(
  id: number
) {
  return api<{ message: string }>(
    `/api/hosted-zones/${id}`,
    {
      method: "DELETE",
    }
  );
}