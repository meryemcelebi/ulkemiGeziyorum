'use client';

import { useState, useMemo } from 'react';
import { PlaceCard } from '@/components/PlaceCard';
import { mockPlaces } from '@/lib/data/mockPlaces';
import { Compass, Filter, Search, RotateCcw, MapPin, Building, Info } from 'lucide-react';

export default function HomePage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Veriden benzersiz ilçe ve kategorileri otomatik çıkar
  const districts = useMemo(() => {
    const list = Array.from(new Set(mockPlaces.map((p) => p.district))).sort();
    return ['all', ...list];
  }, []);

  const categories = useMemo(() => {
    const list = Array.from(new Set(mockPlaces.map((p) => p.category))).sort();
    return ['all', ...list];
  }, []);

  // Filtreleme mantığı
  const filteredPlaces = useMemo(() => {
    return mockPlaces.filter((place) => {
      const matchDistrict =
        selectedDistrict === 'all' ||
        place.district.toLowerCase() === selectedDistrict.toLowerCase();

      const matchCategory =
        selectedCategory === 'all' ||
        place.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchSearch =
        !searchQuery.trim() ||
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address_detail?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchDistrict && matchCategory && matchSearch;
    });
  }, [selectedDistrict, selectedCategory, searchQuery]);

  const hasActiveFilters =
    selectedDistrict !== 'all' || selectedCategory !== 'all' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedDistrict('all');
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Üst Navigasyon / Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white shadow-md shadow-sky-500/20">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Ülkemi Geziyorum
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Belediye Açık Veri Portalı Rehberi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-700/10 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-700/30">
                Pilot Şehir: İzmir
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Alanı */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/60 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50/80 px-3 py-1 text-xs font-semibold text-sky-800 shadow-sm dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300 mb-4">
            <Info className="h-3.5 w-3.5" />
            Ücretsiz, Açık Veri Odaklı ve Salt Okunur Şehir Rehberi
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
            İzmir&apos;in Tarihini ve Kültürünü <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">
              Açık Veriyle Keşfedin
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
            Belediye açık veri portallarından derlenen müzeler, antik kentler, tarihi kalıntılar
            ve kültür merkezlerini ilçe ve kategoriye göre kolayca filtreleyin.
          </p>
        </div>

        {/* Filtre ve Arama Alanı */}
        <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            {/* Metin Arama */}
            <div className="relative md:col-span-5">
              <label htmlFor="search" className="sr-only">Mekan Ara</label>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mekan adı, açıklama veya adres ara..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              />
            </div>

            {/* İlçe Filtresi */}
            <div className="relative md:col-span-3">
              <label htmlFor="district-select" className="sr-only">İlçe Seçin</label>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <MapPin className="h-4 w-4" />
              </div>
              <select
                id="district-select"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-8 text-sm font-medium text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="all">Tüm İlçeler</option>
                {districts
                  .filter((d) => d !== 'all')
                  .map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
              </select>
            </div>

            {/* Kategori Filtresi */}
            <div className="relative md:col-span-3">
              <label htmlFor="category-select" className="sr-only">Kategori Seçin</label>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Building className="h-4 w-4" />
              </div>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-8 text-sm font-medium text-slate-800 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="all">Tüm Kategoriler</option>
                {categories
                  .filter((c) => c !== 'all')
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>

            {/* Sıfırla Butonu */}
            <div className="md:col-span-1 flex items-center">
              <button
                type="button"
                onClick={handleResetFilters}
                disabled={!hasActiveFilters}
                title="Filtreleri Temizle"
                className={`flex h-10 w-full items-center justify-center rounded-xl border text-sm font-medium transition-all ${
                  hasActiveFilters
                    ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-red-400'
                    : 'border-slate-200 bg-slate-100/50 text-slate-400 cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-600'
                }`}
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Aktif Filtre İstatistiği */}
          <div className="mt-4 flex flex-wrap items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span>
                Bulunan mekan sayısı:{' '}
                <strong className="text-slate-800 dark:text-white font-semibold">
                  {filteredPlaces.length}
                </strong>
                {hasActiveFilters && (
                  <span className="ml-1 text-slate-400">
                    (Toplam {mockPlaces.length} mekandan filtrelendi)
                  </span>
                )}
              </span>
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-sky-600 hover:text-sky-700 hover:underline dark:text-sky-400"
              >
                Tüm filtreleri kaldır
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Mekanlar Listesi (Grid) */}
      <main className="flex-1 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 w-full">
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-16 px-4 text-center dark:border-slate-800">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
              Eşleşen mekan bulunamadı
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
              Arama kriterlerinize veya seçilen filtrelere uygun mekan kaydı bulunmuyor. Farklı bir ilçe ya da kategori deneyebilirsiniz.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 transition"
            >
              <RotateCcw className="h-4 w-4" />
              Filtreleri Sıfırla
            </button>
          </div>
        )}
      </main>

      {/* Alt Bilgi / Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <div className="mx-auto max-w-7xl px-4">
          <p className="font-medium text-slate-700 dark:text-slate-300">
            Ülkemi Geziyorum — Açık Veri Kültür Rehberi
          </p>
          <p className="mt-1">
            Veriler belediye açık veri portallarından periyodik olarak senkronize edilir. Haritasız, hızlı ve salt okunur mimari.
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            Next.js 14+ (App Router) • TypeScript • Tailwind CSS • Supabase
          </p>
        </div>
      </footer>
    </div>
  );
}
