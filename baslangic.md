Proje Adı: Ülkemi Geziyorum
Teknoloji Yığını: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Supabase (@supabase/supabase-js).

Projenin Amacı: Türkiye'deki belediye açık veri portallarından (ilk aşamada İzmir) çekilen müzeler, tarihi yerler ve kültür merkezleri gibi turistik mekanları listeleyen, ilçe ve kategori bazlı filtreleme yapılabilen ücretsiz ve salt okunur bir web rehberi. Harita kullanılmayacak, liste ve detay görünümü olacak.

Lütfen aşağıdaki dosya ve klasör yapısını kurarak projeyi başlat:

1. Supabase Yapılandırması:
- `lib/supabase.ts` dosyası oluştur ve `NEXT_PUBLIC_SUPABASE_URL` ile `NEXT_PUBLIC_SUPABASE_ANON_KEY` ortam değişkenlerini kullanarak Supabase client'ını başlat.

2. Tip Tanımlamaları (TypeScript):
- `types/index.ts` dosyası oluştur ve veritabanı şemamıza uygun şu interface'i yaz:
  `Place` { id: string, name: string, category: string, city: string, district: string, neighborhood?: string, address_detail?: string, description?: string, latitude?: number, longitude?: number, source: string, source_id: string }

3. Adapter Mimarisi (Veri Dönüşümü için):
- Dış API'lerden gelecek düzensiz verileri kendi `Place` tipimize çevirmek için Adapter Pattern kullanacağız. `lib/adapters/izmirAdapter.ts` adında bir dosya oluştur. İçine şimdilik sadece İzmir'in JSON formatını bizim `Place` modelimize çevirecek boş bir fonksiyon taslağı (stub) ekle. Mükerrer kayıtları önlemek için bu adapter'ın mekan adı ve ilçe kimliğini birleştirerek benzersiz bir `source_id` üreteceğini yoruma ekle.

4. UI Bileşenleri ve Sayfalar:
- `components/PlaceCard.tsx`: Tek bir mekanı gösterecek basit, modern bir kart tasarımı (Tailwind ile).
- `app/page.tsx`: Mekanların listeleneceği ana sayfa. Şimdilik statik mock verilerle (1-2 örnek Place objesi) bir Grid yapısı oluştur. Üst kısımda "İlçe" ve "Kategori" seçimi için basit Dropdown (select) taslakları ekle.

5. Kurallar:
- Sadece ücretsiz, open-source araçlar kullan.
- Kimlik doğrulama (Auth) şu an yok, ekleme.
- Veri çekme işlemleri her ziyaretçide canlı yapılmayacak; kendi Supabase veritabanımızdan okunacak. Bu yüzden frontend sadece Supabase'den veri okumaya odaklanmalı.

Lütfen bu mimariye uygun başlangıç (boilerplate) kodlarını, dosya ağacını ve `.env.local` taslağını oluştur.