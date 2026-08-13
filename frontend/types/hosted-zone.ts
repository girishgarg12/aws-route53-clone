export type Visibility = "public" | "private";

export interface HostedZone {
  id: number;
  name: string;
  description: string | null;
  visibility: Visibility;
  user_id: number;
  created_at: string;
}

export interface HostedZoneListItem {
  id: number;
  name: string;
  description: string | null;
  visibility: Visibility;
  record_count: number;
  created_at: string;
}

export interface HostedZoneListResponse {
  items: HostedZoneListItem[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface CreateHostedZoneRequest {
  name: string;
  description?: string;
  visibility: Visibility;
}

export interface UpdateHostedZoneRequest {
  name?: string;
  description?: string | null;
  visibility?: Visibility;
}