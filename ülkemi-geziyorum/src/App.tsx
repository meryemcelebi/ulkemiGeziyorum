import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { InteractiveHero } from './components/InteractiveHero';
import { PopularRoutesSection } from './components/PopularRoutesSection';
import { CityDetailModal } from './components/CityDetailModal';
import { ExploreProvincesModal } from './components/ExploreProvincesModal';
import { RoutePlannerModal } from './components/RoutePlannerModal';
import { ImageSettingsModal } from './components/ImageSettingsModal';
import { LandmarkSpot, REGIONS_DATA } from './data/regionsData';
import { DEFAULT_HERO_CONFIG, HeroConfig } from './config/heroImagesConfig';

export default function App() {
  const [activePhase, setActivePhase] = useState<number>(1);
  const [selectedSpot, setSelectedSpot] = useState<LandmarkSpot | null>(null);
  const [isExploreModalOpen, setIsExploreModalOpen] = useState<boolean>(false);
  const [isPlannerModalOpen, setIsPlannerModalOpen] = useState<boolean>(false);
  const [isImageSettingsOpen, setIsImageSettingsOpen] = useState<boolean>(false);

  // User Custom Hero Images Configuration
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(() => {
    try {
      const stored = localStorage.getItem('ulkemi_geziyorum_hero_config');
      return stored ? JSON.parse(stored) : DEFAULT_HERO_CONFIG;
    } catch {
      return DEFAULT_HERO_CONFIG;
    }
  });

  // Flag to hide text overlay if the uploaded image already contains printed titles
  const [hideTextOverlay, setHideTextOverlay] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('ulkemi_geziyorum_hide_text');
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  const handleSaveHeroConfig = (newConfig: HeroConfig) => {
    setHeroConfig(newConfig);
    try {
      localStorage.setItem('ulkemi_geziyorum_hero_config', JSON.stringify(newConfig));
    } catch {}
  };

  const handleToggleHideText = (val: boolean) => {
    setHideTextOverlay(val);
    try {
      localStorage.setItem('ulkemi_geziyorum_hide_text', JSON.stringify(val));
    } catch {}
  };

  // Saved travel destinations
  const [savedSpots, setSavedSpots] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('ulkemi_geziyorum_saved');
      return stored ? JSON.parse(stored) : ['istanbul', 'kapadokya'];
    } catch {
      return ['istanbul', 'kapadokya'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ulkemi_geziyorum_saved', JSON.stringify(savedSpots));
    } catch {}
  }, [savedSpots]);

  const handleToggleSaveSpot = (spotId: string) => {
    const lowerId = spotId.toLowerCase();
    setSavedSpots((prev) =>
      prev.includes(lowerId)
        ? prev.filter((id) => id !== lowerId)
        : [...prev, lowerId]
    );
  };

  const handleRemoveSpot = (spotId: string) => {
    const lowerId = spotId.toLowerCase();
    setSavedSpots((prev) => prev.filter((id) => id !== lowerId));
  };

  const handleClearAllSpots = () => {
    setSavedSpots([]);
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
      // Create a virtual spot for any of the 81 cities
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
        color: '#0284c7',
      });
    }
  };

  const handleJumpToPhase = (phase: number) => {
    setActivePhase(phase);
    if (phase === 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = window.innerHeight * 1.2;
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#040d1a] text-white flex flex-col font-sans-main antialiased selection:bg-cyan-500 selection:text-white">
      {/* Top Floating Navigation */}
      <Navbar
        onOpenPlanner={() => setIsPlannerModalOpen(true)}
        onOpenAllProvinces={() => setIsExploreModalOpen(true)}
        onOpenImageSettings={() => setIsImageSettingsOpen(true)}
        savedSpotsCount={savedSpots.length}
        currentPhase={activePhase}
        onJumpToPhase={handleJumpToPhase}
      />

      {/* Main Interactive Hero Section */}
      <main className="flex-1">
        <InteractiveHero
          onSelectSpot={(spot) => setSelectedSpot(spot)}
          selectedSpot={selectedSpot}
          savedSpots={savedSpots}
          onToggleSaveSpot={handleToggleSaveSpot}
          onExploreAllCities={() => setIsExploreModalOpen(true)}
          activePhase={activePhase}
          setActivePhase={setActivePhase}
          heroConfig={heroConfig}
          hideTextOverlay={hideTextOverlay}
        />

        {/* Discovery & Popular Routes Section */}
        <PopularRoutesSection
          onSelectSpot={(spot) => setSelectedSpot(spot)}
          onOpenAllProvinces={() => setIsExploreModalOpen(true)}
          onOpenPlanner={() => setIsPlannerModalOpen(true)}
          savedSpots={savedSpots}
          onToggleSaveSpot={handleToggleSaveSpot}
        />
      </main>

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

      {/* User Custom Images Modal */}
      <ImageSettingsModal
        isOpen={isImageSettingsOpen}
        onClose={() => setIsImageSettingsOpen(false)}
        config={heroConfig}
        onSaveConfig={handleSaveHeroConfig}
        hideTextOverlay={hideTextOverlay}
        onToggleHideTextOverlay={handleToggleHideText}
      />
    </div>
  );
}
