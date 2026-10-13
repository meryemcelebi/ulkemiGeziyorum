export interface Place {
  id?: string;
  name: string;
  category: string;
  city: string;
  district: string;
  neighborhood?: string;
  address_detail?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  source: string;
  source_id: string;
}

export interface FilterOptions {
  district?: string;
  category?: string;
  searchQuery?: string;
}

export interface SyncResult {
  success: boolean;
  count: number;
  message?: string;
  error?: string;
  data?: Place[];
}
