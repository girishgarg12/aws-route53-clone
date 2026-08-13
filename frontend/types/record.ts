export const RECORD_TYPES = [
  "A",
  "AAAA",
  "CNAME",
  "TXT",
  "MX",
  "NS",
  "PTR",
  "SRV",
  "CAA",
] as const;

export type RecordType =
  (typeof RECORD_TYPES)[number];

export interface DNSRecord {
  id: number;
  hosted_zone_id: number;
  name: string;
  type: RecordType;
  ttl: number;
  value: string;
  created_at: string;
}

export interface DNSRecordListResponse {
  items: DNSRecord[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface CreateDNSRecordRequest {
  name: string;
  type: RecordType;
  ttl: number;
  value: string;
}

export interface UpdateDNSRecordRequest {
  name?: string;
  type?: RecordType;
  ttl?: number;
  value?: string;
}