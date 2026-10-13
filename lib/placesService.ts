import { Place, FilterOptions } from '@/types';
import { getSupabase, isSupabaseConfigured } from './supabase';
import { mockPlaces } from './data/mockPlaces';

/**
 * Mekanları Supabase'den veya yapılandırma yoksa mock verilerden okur.
 * Salt okunur mimari: Frontend doğrudan dış portallara gitmez, Supabase'den okur.
 */
export async function getPlaces(filters?: FilterOptions): Promise<Place[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase();
      let query = supabase.from('places').select('*');

      if (filters?.district && filters.district !== 'all') {
        query = query.eq('district', filters.district);
      }

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query.order('name', { ascending: true });

      if (error) {
        console.warn('Supabase sorgu hatası, mock verilere dönülüyor:', error.message);
        return filterMockPlaces(filters);
      }

      if (data && data.length > 0) {
        return data as Place[];
      }
    } catch (err) {
      console.warn('Supabase bağlantı hatası, mock verilere dönülüyor:', err);
    }
  }

  // Supabase henüz kurulmadıysa veya veri boşsa mock verileri kullan
  return filterMockPlaces(filters);
}

function filterMockPlaces(filters?: FilterOptions): Place[] {
  let result = [...mockPlaces];

  if (filters?.district && filters.district !== 'all') {
    result = result.filter((p) => p.district.toLowerCase() === filters.district?.toLowerCase());
  }

  if (filters?.category && filters.category !== 'all') {
    result = result.filter((p) => p.category.toLowerCase() === filters.category?.toLowerCase());
  }

  if (filters?.searchQuery) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.address_detail?.toLowerCase().includes(q)
    );
  }

  return result;
}
