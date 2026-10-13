# Ülkemi Geziyorum

Türkiye'deki belediye açık veri portallarından (ilk aşamada **İzmir Büyükşehir Belediyesi Açık Veri Portalı**) derlenen müzeler, tarihi yerler ve kültür merkezleri gibi turistik mekanları listeleyen, ilçe ve kategori bazlı filtreleme yapılabilen ücretsiz ve salt okunur web rehberi.

Proje, harita karmaşasından uzak; hızlı, sade ve liste/kart görünümü odaklı modern bir arayüz sunar.

---

## 🛠️ Teknoloji Yığını

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Dil**: [TypeScript](https://www.typescriptlang.org/)
- **Stil & Tasarım**: [Tailwind CSS](https://tailwindcss.com/)
- **Veritabanı / Backend**: [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- **İkon Kütüphanesi**: [Lucide React](https://lucide.dev/)

---

## 🏗️ Mimari ve Tasarım Prensipleri

1. **Salt Okunur (Read-Only) Mimari**:
   - Ziyaretçiler web uygulamasını kullandığında dış belediye API'lerine canlı istek atılmaz.
   - Veriler arka planda Supabase veritabanında toplanır ve frontend yalnızca Supabase'den optimize edilmiş veriyi okur. Supabase yapılandırılmamışsa zengin yerel mock verileri devreye girer.

2. **Adapter Pattern (`lib/adapters/izmirAdapter.ts`)**:
   - Farklı belediyelerden ve açık veri kaynaklarından gelecek düzensiz şemaları ortak `Place` veri modelimize çevirmek için Adapter deseni uygulanmıştır.
   - Mükerrer (duplicate) kayıtları engellemek amacıyla mekan adı ve ilçe kimliği temizlenip birleştirilerek benzersiz bir `source_id` üretilir (`izmir_{ilce}_{mekan_adi}`).

3. **Modern ve Modüler Bileşen Mimarisi**:
   - **`components/PlaceCard.tsx`**: Mekanın kategorisine (Müze, Tarihi Yer, Kültür Merkezi) göre dinamik renk rozetleri, koordinat bilgisi, adres detayı ve açık veri kaynak atfı içeren duyarlı (responsive) kart bileşeni.
   - **`app/page.tsx`**: İlçe seçimi, kategori seçimi ve anlık arama desteğine sahip dinamik filtreleme ve kart grid sayfası.

---

## 📁 Proje Dosya ve Klasör Yapısı

```text
ulkemiGeziyorum/
├── app/
│   ├── api/
│   │   └── sync/
│   │       └── route.ts       # Veri eşitleme API rotası (GET /api/sync)
│   ├── favicon.ico
│   ├── globals.css            # Tailwind CSS direktifleri ve temel tema
│   ├── layout.tsx             # Kök layout, Türkçe meta etiketleri ve fontlar
│   └── page.tsx               # Ana sayfa: Filtreleme çubuğu, arama ve mekanlar grid'i
├── components/
│   └── PlaceCard.tsx          # Tekil mekan kartı bileşeni
├── lib/
│   ├── adapters/
│   │   └── izmirAdapter.ts    # İzmir Açık Veri Portalı Adapter taslağı (source_id üretimi)
│   ├── data/
│   │   └── mockPlaces.ts      # Başlangıç ve test için zengin İzmir mekan verileri
│   ├── placesService.ts       # Supabase ve fallback veri okuma servisi
│   └── supabase.ts            # Supabase istemcisi başlatma ve kontrol mekanizması
├── types/
│   └── index.ts               # Place ve FilterOptions TypeScript tipleri
├── .env.example               # Ortam değişkenleri örnek şablonu
├── .env.local                 # Yerel geliştirme ortam değişkenleri
├── baslangic.md               # Proje başlangıç gereksinim dokümanı
├── package.json               # Bağımlılıklar ve npm scriptleri
├── tsconfig.json              # TypeScript yapılandırması (path alias: @/*)
└── README.md                  # Proje dokümantasyonu
```

---

## 📋 `baslangic.md` Kapsamında Yapılanlar

- [x] **Next.js & TypeScript Kurulumu**: App Router ve Tailwind CSS yapılandırmasıyla proje temeli atıldı.
- [x] **Supabase Yapılandırması (`lib/supabase.ts`)**:
  - `@supabase/supabase-js` paketi kuruldu.
  - `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` ortam değişkenleriyle istemci başlatıldı.
- [x] **Tip Tanımlamaları (`types/index.ts`)**:
  - `Place` interface'i tanımlandı: `id`, `name`, `category`, `city`, `district`, `neighborhood`, `address_detail`, `description`, `latitude`, `longitude`, `source`, `source_id`.
- [x] **Adapter Mimarisi (`lib/adapters/izmirAdapter.ts`)**:
  - Dış API'lerden gelecek ham verileri `Place` formatına dönüştüren adapter taslağı hazırlandı.
  - Mükerrer kayıtların önüne geçmek için `source_id` üretim algoritması uygulandı.
- [x] **UI Bileşenleri ve Sayfalar**:
  - `components/PlaceCard.tsx`: Modern, rozetli ve detaylı mekan kart tasarımı geliştirildi.
  - `app/page.tsx`: İlçe ve Kategori Dropdown'ları, serbest arama kutusu, aktif filtre sayacı ve responsive grid yapısı oluşturuldu.
- [x] **Ortam Değişkenleri Taslağı**:
  - `.env.local` ve `.env.example` dosyaları oluşturuldu, `.gitignore` güncellendi.
- [x] **Build & Derleme Doğrulaması**:
  - `npm run build` ve `npx tsc --noEmit` çalıştırılarak sıfır hata ile üretim derlemesi alındığı doğrulandı.

---

## 🚀 Başlangıç ve Çalıştırma

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Ortam Değişkenlerini Tanımlayın

`.env.example` dosyasını referans alarak `.env.local` dosyanıza Supabase bilgilerinizi ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

*(Not: Supabase tanımlı olmadığında sistem otomatik olarak `lib/data/mockPlaces.ts` içerisindeki örnek mekan verilerini kullanır).*

### 3. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek uygulamayı görüntüleyebilirsiniz.

### 4. Açık Veri Senkronizasyonu (Sync)

İzmir Açık Veri Portalı'ndaki müzeleri Supabase `places` tablosuna çekip eşitlemek için:

Tarayıcınızda veya cURL ile şu adrese istek atabilirsiniz:
```bash
curl http://localhost:3000/api/sync
```
veya tarayıcıdan `http://localhost:3000/api/sync` adresine gidebilirsiniz. Başarılı işlem sonucunda:
```json
{
  "success": true,
  "message": "26 adet İzmir müze kaydı Supabase 'places' tablosuna başarıyla eşitlendi.",
  "count": 26
}
```

### 5. Üretim Derlemesi (Build)

```bash
npm run build
npm run start
```