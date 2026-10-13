'use client';

import { useState, useMemo, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { ModernHero } from '@/components/ModernHero';
import { PopularRoutesSection } from '@/components/PopularRoutesSection';
import { CityDetailModal } from '@/components/CityDetailModal';
import { ExploreProvincesModal } from '@/components/ExploreProvincesModal';
import { RoutePlannerModal } from '@/components/RoutePlannerModal';
import { LandmarkSpot, REGIONS_DATA } from '@/data/regionsData';

import { PlaceCard } from '@/components/PlaceCard';
import { getPlaces } from '@/lib/placesService';
import { mockPlaces } from '@/lib/data/mockPlaces';
import { Place } from '@/types';
import { Filter, Search, RotateCcw, MapPin, Building, Info, Compass } from 'lucide-react';

export default function HomePage() {
  const [selectedSpot, setSelectedSpot] = useState<LandmarkSpot | null>(null);
  const [isExploreModalOpen, setIsExploreModalOpen] = useState<boolean>(false);
  const [isPlannerModalOpen, setIsPlannerModalOpen] = useState<boolean>(false);
  const [savedSpots, setSavedSpots] = useState<string[]>(['istanbul', 'kapadokya']);

  // İzmir Open Data places state
  const [places, setPlaces] = useState<Place[]>(mockPlaces);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Hydration-safe localStorage sync
  useEffect(() => {
    try {
      const storedSaved = localStorage.getItem('ulkemi_geziyorum_saved');
      if (storedSaved) setSavedSpots(JSON.parse(storedSaved));
    } catch {}
  }, []);

  const handleToggleSaveSpot = (spotId: string) => {
    const lowerId = spotId.toLowerCase();
    setSavedSpots((prev) => {
      const next = prev.includes(lowerId)
        ? prev.filter((id) => id !== lowerId)
        : [...prev, lowerId];
      try {
        localStorage.setItem('ulkemi_geziyorum_saved', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleRemoveSpot = (spotId: string) => {
    const lowerId = spotId.toLowerCase();
    setSavedSpots((prev) => {
      const next = prev.filter((id) => id !== lowerId);
      try {
        localStorage.setItem('ulkemi_geziyorum_saved', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleClearAllSpots = () => {
    setSavedSpots([]);
    try {
      localStorage.setItem('ulkemi_geziyorum_saved', JSON.stringify([]));
    } catch {}
  };

  const handleSelectCityByName = (cityName: string) => {
    const lower = cityName.toLowerCase();
    const matched = REGIONS_DATA.find(
      (r) =>
        r.id.toLowerCase() === lower ||
        r.name.toLowerCase() === lower ||
        r.badgeText.toLowerCase() === lower
    );

    if (matched) {
      setSelectedSpot(matched);
    } else {
      setSelectedSpot({
        id: lower,
        name: cityName,
        region: 'Türkiye',
        category: 'Kültür',
        xPercent: 50,
        yPercent: 50,
        title: `${cityName} Keşif Rehberi`,
        tagline: `${cityName} ve çevresindeki tarihi ve doğal güzellikler`,
        description: `${cityName}, Anadolu'nun zengin kültürel mozaiğinde kendine has tarihi dokusu, eşsiz lezzetleri ve misafirperver halkıyla ziyaretçilerini bekliyor.`,
        highlights: [
          `${cityName} Tarihi Kent Merkezi`,
          `${cityName} Yöresel Çarşıları`,
          'Doğa Yürüyüş Rotaları',
          'Yerel Kültür ve Müzeler',
        ],
        bestSeason: 'İlkbahar ve Sonbahar Ayları',
        foodHighlight: `${cityName} Meşhur Yöresel Mutfağı`,
        badgeText: cityName,
        color: '#2563eb',
      });
    }
  };

  // Load municipal places
  useEffect(() => {
    async function loadPlaces() {
      try {
        const data = await getPlaces();
        if (data && data.length > 0) {
          setPlaces(data);
        }
      } catch (err) {
        console.warn('Veri yüklenemedi:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPlaces();
  }, []);

  // Filter districts and categories
  const districts = useMemo(() => {
    const list = Array.from(new Set(places.map((p) => p.district))).filter(Boolean).sort();
    return ['all', ...list];
  }, [places]);

  const categories = useMemo(() => {
    const list = Array.from(new Set(places.map((p) => p.category))).filter(Boolean).sort();
    return ['all', ...list];
  }, [places]);

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const matchDistrict =
        selectedDistrict === 'all' ||
        place.district?.toLowerCase() === selectedDistrict.toLowerCase();

      const matchCategory =
        selectedCategory === 'all' ||
        place.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchSearch =
        !searchQuery.trim() ||
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address_detail?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchDistrict && matchCategory && matchSearch;
    });
  }, [places, selectedDistrict, selectedCategory, searchQuery]);

  const hasActiveFilters =
    selectedDistrict !== 'all' || selectedCategory !== 'all' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedDistrict('all');
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const handleScrollToPlaces = () => {
    const el = document.getElementById('places-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans-main antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Floating Navigation (Terra Style from Image 2) */}
      <Navbar
        onOpenPlanner={() => setIsPlannerModalOpen(true)}
        onOpenAllProvinces={() => setIsExploreModalOpen(true)}
        savedSpotsCount={savedSpots.length}
        onExploreClick={handleScrollToPlaces}
      />

      {/* Main Modern Hero Section (Matches Image 2 Text & Video Showcase Stage) */}
      <main className="flex-1">
        <ModernHero
          onExploreClick={handleScrollToPlaces}
          onOpenAllProvinces={() => setIsExploreModalOpen(true)}
        />

        {/* Discovery & Popular Routes Section */}
        <PopularRoutesSection
          onSelectSpot={(spot) => setSelectedSpot(spot)}
          onOpenAllProvinces={() => setIsExploreModalOpen(true)}
          onOpenPlanner={() => setIsPlannerModalOpen(true)}
          savedSpots={savedSpots}
          onToggleSaveSpot={handleToggleSaveSpot}
        />

        {/* Pilot City: İzmir Open Data Places Explorer */}
        <section
          id="places-section"
          className="relative bg-slate-50/50 pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-t border-slate-100"
        >
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-xs mb-4">
              <Info className="h-3.5 w-3.5" />
              Pilot Şehir: İzmir — Belediye Açık Veri Portalı Rehberi
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              İzmir&apos;in Tarihini ve Kültürünü <br className="hidden sm:inline" />
              <span className="text-blue-600">
                Açık Veriyle Keşfedin
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
              Belediye açık veri portallarından derlenen müzeler, antik kentler, tarihi kalıntılar
              ve kültür merkezlerini ilçe ve kategoriye göre kolayca filtreleyin.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              {/* Text Search */}
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* District Filter */}
              <div className="relative md:col-span-3">
                <label htmlFor="district-select" className="sr-only">İlçe Seçin</label>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <select
                  id="district-select"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-8 text-sm font-medium text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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

              {/* Category Filter */}
              <div className="relative md:col-span-3">
                <label htmlFor="category-select" className="sr-only">Kategori Seçin</label>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Building className="h-4 w-4" />
                </div>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-8 text-sm font-medium text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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

              {/* Reset Filter Button */}
              <div className="md:col-span-1 flex items-center">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  disabled={!hasActiveFilters}
                  title="Filtreleri Temizle"
                  className={`flex h-10 w-full items-center justify-center rounded-xl border text-sm font-medium transition-all ${
                    hasActiveFilters
                      ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-red-600'
                      : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Filter Stats */}
            <div className="mt-4 flex flex-wrap items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  Bulunan mekan sayısı:{' '}
                  <strong className="text-slate-900 font-semibold">
                    {filteredPlaces.length}
                  </strong>
                  {hasActiveFilters && (
                    <span className="ml-1 text-slate-400">
                      (Toplam {places.length} mekandan filtrelendi)
                    </span>
                  )}
                </span>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Tüm filtreleri kaldır
                </button>
              )}
            </div>
          </div>

          {/* Place Cards Grid */}
          <div className="mx-auto max-w-7xl px-0 pt-10 sm:px-6 lg:px-8 w-full">
            {filteredPlaces.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {filteredPlaces.map((place) => (
                  <PlaceCard key={place.id || place.source_id} place={place} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-16 px-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Search className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  Eşleşen mekan bulunamadı
                </h3>
                <p className="mt-2 text-sm text-slate-500 max-w-md">
                  Arama kriterlerinize veya seçilen filtrelere uygun mekan kaydı bulunmuyor. Farklı bir ilçe ya da kategori deneyebilirsiniz.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition"
                >
                  <RotateCcw className="h-4 w-4" />
                  Filtreleri Sıfırla
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Clean Modern Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-12 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900 text-sm">Ülkemi Geziyorum</span>
            <span className="text-slate-400">— Açık Veri Kültür ve Mekan Rehberi</span>
          </div>

          <p className="text-slate-500">
            Belediye açık veri portallarından derlenen ücretsiz kültür ve mekan rehberi.
          </p>

          <p className="text-slate-400">
            © 2026 Ülkemi Geziyorum • Tüm hakları saklıdır
          </p>
        </div>
      </footer>

      {/* City Detail Modal */}
      <CityDetailModal
        spot={selectedSpot}
        onClose={() => setSelectedSpot(null)}
        isSaved={selectedSpot ? savedSpots.includes(selectedSpot.id.toLowerCase()) : false}
        onToggleSave={handleToggleSaveSpot}
      />

      {/* 81 Provinces Directory Modal */}
      <ExploreProvincesModal
        isOpen={isExploreModalOpen}
        onClose={() => setIsExploreModalOpen(false)}
        savedSpots={savedSpots}
        onToggleSaveSpot={handleToggleSaveSpot}
        onSelectCity={handleSelectCityByName}
      />

      {/* Personalized Route Planner Modal */}
      <RoutePlannerModal
        isOpen={isPlannerModalOpen}
        onClose={() => setIsPlannerModalOpen(false)}
        savedSpots={savedSpots}
        onRemoveSpot={handleRemoveSpot}
        onClearAll={handleClearAllSpots}
      />
    </div>
  );
}
