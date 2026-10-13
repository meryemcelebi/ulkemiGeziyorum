import { createClient } from '@supabase/supabase-js';
import { Place, SyncResult } from '@/types';

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'placeholder-anon-key';

  return createClient(url, key);
}

export const supabase = getSupabaseClient();

/**
 * İzmir Açık Veri Portalı Müze JSON formatı
 */
export interface RawIzmirMuseum {
  ADI?: string;
  ILCEID?: string | number;
  ILCE?: string;
  MAHALLE?: string;
  MAHALLEID?: string | number | null;
  YOL?: string;
  KAPINO?: string | number;
  ENLEM?: string | number;
  BOYLAM?: string | number;
  ACIKLAMA?: string;
  [key: string]: unknown;
}

/**
 * Türkçe karakterleri temizleyip metni URL/ID dostu slug formatına çevirir
 */
export function slugify(text: string): string {
  const trMap: Record<string, string> = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u',
  };

  return text
    .split('')
    .map((char) => trMap[char] || char)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * İzmir Açık Veri Portalı'ndan müzeleri çeker ve Supabase 'places' tablosuna
 * source_id üzerinden upsert ederek eşitler.
 */
export async function syncIzmirMuseums(): Promise<SyncResult> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      '';

    // Supabase ortam değişkeni kontrolü
    if (!url || !key || url.includes('placeholder')) {
      return {
        success: false,
        count: 0,
        error: 'Supabase yapılandırması eksik! Lütfen .env.local dosyasına geçerli NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY değerlerini girin.',
      };
    }

    // 1. Dış API'den veriyi çek (İzmir Belediyesi sunucusu ~10sn sürebildiği için 35sn zaman aşımı tanımlanır)
    const apiUrl = 'https://openapi.izmir.bel.tr/api/ibb/cbs/muzeler';
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(35000),
    });

    if (!response.ok) {
      throw new Error(`İzmir Açık Veri API yanıt vermedi: HTTP ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    // API nesne { onemliyer: [...] } veya doğrudan dizi döndürebilir
    const rawList: RawIzmirMuseum[] = Array.isArray(json)
      ? json
      : Array.isArray(json?.onemliyer)
        ? json.onemliyer
        : [];

    if (rawList.length === 0) {
      return {
        success: true,
        count: 0,
        message: 'İzmir Açık Veri Portalı\'ndan kayıt dönmedi.',
      };
    }

    // 2. Gelen veriyi Place tipimize uyarla (.map)
    const places: Place[] = rawList
      .filter((item) => item && item.ADI)
      .map((item) => {
        // Benzersiz source_id üretimi: ADI ve ILCEID slugify edilerek birleştirilir
        const nameSlug = slugify(String(item.ADI));
        const districtId = item.ILCEID ? slugify(String(item.ILCEID)) : '0';
        const sourceId = `izmir-muze-${nameSlug}-${districtId}`;

        // YOL ve KAPINO alanlarını birleştirerek address_detail oluştur
        const yol = item.YOL ? String(item.YOL).trim() : '';
        const kapiNo = item.KAPINO ? String(item.KAPINO).trim() : '';
        let addressDetail = '';

        if (yol && kapiNo) {
          addressDetail = `${yol} No:${kapiNo}`;
        } else if (yol) {
          addressDetail = yol;
        } else if (kapiNo) {
          addressDetail = `No:${kapiNo}`;
        }

        return {
          name: String(item.ADI).trim(),
          category: 'Müze',
          city: 'İzmir',
          district: item.ILCE ? String(item.ILCE).trim() : 'İzmir',
          neighborhood: item.MAHALLE ? String(item.MAHALLE).trim() : undefined,
          address_detail: addressDetail || undefined,
          description: item.ACIKLAMA ? String(item.ACIKLAMA).trim() : undefined,
          latitude: item.ENLEM ? Number(item.ENLEM) : undefined,
          longitude: item.BOYLAM ? Number(item.BOYLAM) : undefined,
          source: 'izmir_acik_veri',
          source_id: sourceId,
        };
      });

    // 3. Supabase 'places' tablosuna upsert et (onConflict: source_id)
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('places')
      .upsert(places, { onConflict: 'source_id' })
      .select();

    if (error) {
      throw new Error(`Supabase upsert hatası: ${error.message}`);
    }

    const affectedCount = data ? data.length : places.length;

    return {
      success: true,
      count: affectedCount,
      message: `${affectedCount} adet İzmir müze kaydı Supabase 'places' tablosuna başarıyla eşitlendi.`,
      data: data as Place[],
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.';
    return {
      success: false,
      count: 0,
      error: errorMessage,
    };
  }
}
