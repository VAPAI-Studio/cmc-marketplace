/**
 * API Client for CMC Backend
 * Wraps fetch with auth headers and error handling
 */
import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return {};
  return {
    Authorization: `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  };
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || 'API request failed');
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

async function uploadFile(path: string, formData: FormData): Promise<unknown> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: HeadersInit = {};
  if (session) headers['Authorization'] = `Bearer ${session.access_token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || 'Upload failed');
  }
  return response.json();
}

// =============================================
// Listings API
// =============================================

export interface ListingCreatePayload {
  title: string;
  tagline?: string;
  description: string;
  genre: string;
  format: string;
  logline?: string;
  tier?: string;
  period?: string;
  location?: string;
  world_type?: string;
  themes?: string[];
  target_audience?: string;
  comparables?: string[];
  rights_holder?: string;
  rights_holder_contact?: string;
  available_rights?: string[];
  available_territories?: string[];
}

export interface Listing {
  id: string;
  creator_id: string;
  title: string;
  tagline?: string;
  description: string;
  slug: string;
  genre: string;
  format: string;
  tier: string;
  period?: string;
  location?: string;
  world_type?: string;
  themes: string[];
  target_audience?: string;
  comparables: string[];
  logline?: string;
  rights_holder?: string;
  rights_holder_contact?: string;
  available_rights: string[];
  available_territories: string[];
  script_url?: string;
  poster_url?: string;
  concept_art_urls: string[];
  ai_analysis_status: string;
  ai_score?: number;
  ai_strengths: string[];
  ai_improvements: string[];
  status: string;
  featured: boolean;
  view_count: number;
  save_count: number;
  inquiry_count: number;
  created_at: string;
  updated_at: string;
}

export interface ListingsFilter {
  genre?: string;
  tier?: string;
  search?: string;
  status?: string;
  sort_by?: string;
  order?: string;
  limit?: number;
  offset?: number;
}

export const listingsApi = {
  create: (data: ListingCreatePayload) =>
    request<Listing>('POST', '/api/listings/', data),

  list: (filters: ListingsFilter = {}) => {
    const params = new URLSearchParams();
    if (filters.genre) params.set('genre', filters.genre);
    if (filters.tier) params.set('tier', filters.tier);
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    if (filters.sort_by) params.set('sort_by', filters.sort_by);
    if (filters.order) params.set('order', filters.order);
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.offset) params.set('offset', String(filters.offset));
    const qs = params.toString();
    return request<Listing[]>('GET', `/api/listings/${qs ? `?${qs}` : ''}`);
  },

  myListings: () =>
    request<Listing[]>('GET', '/api/listings/my-listings'),

  featured: (limit = 6) =>
    request<Listing[]>('GET', `/api/listings/featured?limit=${limit}`),

  getBySlug: (slug: string) =>
    request<Listing>('GET', `/api/listings/by-slug/${slug}`),

  get: (id: string) =>
    request<Listing>('GET', `/api/listings/${id}`),

  update: (id: string, data: Partial<ListingCreatePayload>) =>
    request<Listing>('PUT', `/api/listings/${id}`, data),

  delete: (id: string) =>
    request<void>('DELETE', `/api/listings/${id}`),
};

// =============================================
// Files API
// =============================================

export interface FileUploadResult {
  path: string;
  url: string;
  signed_url: string;
  file_name: string;
  type: string;
}

export const filesApi = {
  upload: (file: File, listingId: string, fileType: 'script' | 'poster' | 'concept_art') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('listing_id', listingId);
    formData.append('file_type', fileType);
    return uploadFile('/api/files/upload', formData) as Promise<FileUploadResult>;
  },
};

// =============================================
// AI API
// =============================================

export interface AnalysisResult {
  listing_id: string;
  status: string;
  analysis?: {
    commercial_score?: number;
    strengths?: string[];
    improvements?: string[];
    comparables?: string[];
    executive_summary?: string;
    target_audience?: string;
    budget_range?: string;
  };
  message: string;
}

export interface OnePagerResult {
  listing_id: string;
  one_pager: string;
  message: string;
}

// =============================================
// Favorites API
// =============================================

export const favoritesApi = {
  getIds: () => request<string[]>('GET', '/api/favorites/'),
  getSavedListings: () => request<Listing[]>('GET', '/api/favorites/listings'),
  save: (listingId: string) => request<{ listing_id: string; saved: boolean }>('POST', `/api/favorites/${listingId}`),
  unsave: (listingId: string) => request<{ listing_id: string; saved: boolean }>('DELETE', `/api/favorites/${listingId}`),
};

// =============================================
// Inquiries API
// =============================================

export interface InquiryCreate {
  listing_id: string;
  message: string;
  buyer_contact_email: string;
  buyer_name?: string;
  company_name?: string;
}

export interface Inquiry {
  id: string;
  listing_id: string;
  buyer_id?: string;
  buyer_name?: string;
  buyer_contact_email: string;
  company_name?: string;
  message: string;
  status: string;
  created_at: string;
  listing_title?: string;
}

export const inquiriesApi = {
  create: (data: InquiryCreate) => request<Inquiry>('POST', '/api/inquiries/', data),
  sent: () => request<Inquiry[]>('GET', '/api/inquiries/sent'),
  received: () => request<Inquiry[]>('GET', '/api/inquiries/received'),
};

// =============================================
// Admin API
// =============================================

export const adminApi = {
  listings: (status?: string) => request<Listing[]>('GET', `/api/admin/listings${status ? `?status=${status}` : ''}`),
  approve: (id: string) => request<{ id: string; status: string }>('PUT', `/api/admin/listings/${id}/approve`),
  reject: (id: string) => request<{ id: string; status: string }>('PUT', `/api/admin/listings/${id}/reject`),
  feature: (id: string, featured: boolean) => request<{ id: string; featured: boolean }>('PUT', `/api/admin/listings/${id}/feature?featured=${featured}`),
  users: () => request<{ id: string; email: string; role: string; display_name: string; created_at: string }[]>('GET', '/api/admin/users'),
  inquiries: () => request<Inquiry[]>('GET', '/api/admin/inquiries'),
  stats: () => request<{ listings: Record<string, number>; total_listings: number; users: Record<string, number>; total_users: number; total_inquiries: number }>('GET', '/api/admin/stats'),
};

export const aiApi = {
  analyze: (listingId: string) =>
    request<AnalysisResult>('POST', `/api/ai/listings/${listingId}/analyze`),

  getAnalysis: (listingId: string) =>
    request<AnalysisResult>('GET', `/api/ai/listings/${listingId}/analysis`),

  generateOnePager: (listingId: string) =>
    request<OnePagerResult>('POST', `/api/ai/listings/${listingId}/generate-onepager`),

  getOnePager: (listingId: string) =>
    request<OnePagerResult>('GET', `/api/ai/listings/${listingId}/onepager`),
};
