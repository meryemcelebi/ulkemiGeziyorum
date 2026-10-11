import { Place } from '@/types';

/**
 * İzmir Büyükşehir Belediyesi Açık Veri Portalı ham veri tipi taslağı.
 * Açık veri setlerinden gelen nesnelerin olası alanlarını temsil eder.
 */
export interface RawIzmirPlace {
  ADI?: string;
  KATEGORI?: string;
  ILCE?: string;
  MAHALLE?: string;
  ADRES?: string;
  ACIKLAMA?: string;
  ENLEM?: number | string;
  BOYLAM?: number | string;
  ID?: string | number;
  [key: string]: unknown;
}

/**
 * Mükerrer kayıtları önlemek için bu adapter, mekan adı ve ilçe kimliğini
 * (veya varsa belediye sistemindeki benzersiz ID'yi) birleştirerek
 * benzersiz bir `source_id` üretir (Örn: `izmir_${ilce}_${mekan_adi}`).
 *
 * @param rawData İzmir Açık Veri Portalı'ndan gelen tekil mekan verisi
 * @returns Veritabanımız için standardize edilmiş Place modeli veya null
 */
export function transformIzmirPlace(rawData: RawIzmirPlace): Place | null {
  // TODO: İzmir Açık Veri Portalı API / JSON şemasına göre dönüşüm mantığını tamamla.
  if (!rawData || !rawData.ADI) {
    return null;
  }

  const district = rawData.ILCE || 'Bilinmiyor';
  const name = rawData.ADI;

  // Benzersiz source_id üretimi: Mekan adı ve ilçe birleştirilerek mükerrer kayıtlar engellenir
  const sanitizedDistrict = district.trim().toLowerCase().replace(/\s+/g, '-');
  const sanitizedName = name.trim().toLowerCase().replace(/[^a-z0-9ğüşıöç-]/gi, '-');
  const sourceId = `izmir_${sanitizedDistrict}_${sanitizedName}`;

  return {
    id: String(rawData.ID || sourceId),
    name: name.trim(),
    category: rawData.KATEGORI || 'Kültür & Sanat',
    city: 'İzmir',
    district: district.trim(),
    neighborhood: rawData.MAHALLE?.trim(),
    address_detail: rawData.ADRES?.trim(),
    description: rawData.ACIKLAMA?.trim(),
    latitude: rawData.ENLEM ? Number(rawData.ENLEM) : undefined,
    longitude: rawData.BOYLAM ? Number(rawData.BOYLAM) : undefined,
    source: 'İzmir Büyükşehir Belediyesi Açık Veri Portalı',
    source_id: sourceId,
  };
}

/**
 * Toplu veri dönüşümü için stub fonksiyon
 */
export function transformIzmirPlacesBatch(rawItems: RawIzmirPlace[]): Place[] {
  return rawItems
    .map(transformIzmirPlace)
    .filter((item): item is Place => item !== null);
}
