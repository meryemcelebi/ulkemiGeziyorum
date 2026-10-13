'use client';

import React from 'react';
import { POPULAR_ROUTES, REGIONS_DATA, LandmarkSpot } from '@/data/regionsData';
import { Star, Clock, ArrowRight, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PopularRoutesSectionProps {
  onSelectSpot: (spot: LandmarkSpot) => void;
  onOpenAllProvinces: () => void;
  onOpenPlanner: () => void;
  savedSpots: string[];
  onToggleSaveSpot: (spotId: string) => void;
}

export const PopularRoutesSection: React.FC<PopularRoutesSectionProps> = ({
  onSelectSpot,
  onOpenAllProvinces,
  onOpenPlanner,
  savedSpots,
  onToggleSaveSpot,
}) => {
  return (
    <section id="routes-section" className="relative z-30 bg-slate-50/50 py-20 px-4 sm:px-8 border-t border-slate-100">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Statistics Bar (Clean White & Slate) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-center sm:text-left">
            <span className="text-3xl sm:text-4xl font-extrabold text-blue-600">
              81
            </span>
            <span className="text-xs sm:text-sm text-slate-600 block font-medium mt-1">
              Keşfedilmeyi Bekleyen İl
            </span>
          </div>

          <div className="text-center sm:text-left">
            <span className="text-3xl sm:text-4xl font-extrabold text-blue-600">
              7
            </span>
            <span className="text-xs sm:text-sm text-slate-600 block font-medium mt-1">
              Eşsiz Coğrafi Bölge
            </span>
          </div>

          <div className="text-center sm:text-left">
            <span className="text-3xl sm:text-4xl font-extrabold text-blue-600">
              21+
            </span>
            <span className="text-xs sm:text-sm text-slate-600 block font-medium mt-1">
              UNESCO Dünya Mirası Alanı
            </span>
          </div>

          <div className="text-center sm:text-left">
            <span className="text-3xl sm:text-4xl font-extrabold text-blue-600">
              400+
            </span>
            <span className="text-xs sm:text-sm text-slate-600 block font-medium mt-1">
              Kültürel & Tarihi Rota
            </span>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
              SEÇİLMİŞ YOLCULUKLAR
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              Türkiye&apos;nin En Çok Tercih Edilen Rotaları
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl">
              Doğadan tarihe, gastronomi macerasından antik kıyılara kadar özenle hazırlanmış seyahat rotaları.
            </p>
          </div>

          <button
            onClick={onOpenAllProvinces}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-200 shadow-xs transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>Tüm Şehirleri İncele</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </button>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_ROUTES.map((route) => (
            <div
              key={route.id}
              className="group relative p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Emoji Icon & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    {route.image}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                    {route.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {route.title}
                </h3>

                {/* Duration & Rating */}
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {route.duration}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-amber-600 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {route.rating}
                  </span>
                </div>

                {/* Highlights */}
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {route.highlights}
                </p>

                {/* Cities in Route */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {route.cities.map((city) => (
                    <span
                      key={city}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/60"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    const matched = REGIONS_DATA.find((r) =>
                      route.title.toLowerCase().includes(r.name.toLowerCase())
                    );
                    if (matched) onSelectSpot(matched);
                    else onOpenAllProvinces();
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Detayları Gör</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    route.cities.forEach((c) => onToggleSaveSpot(c.toLowerCase()));
                    confetti({ particleCount: 40, spread: 50 });
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-pink-500 hover:bg-pink-50 transition-colors cursor-pointer"
                  title="Tüm Şehirleri Rotama Ekle"
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Region Cards Horizontal Highlight */}
        <div className="pt-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            7 Coğrafi Bölgenin Kalbine Yolculuk
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {REGIONS_DATA.map((spot) => (
              <button
                key={spot.id}
                onClick={() => onSelectSpot(spot)}
                className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-blue-400 shadow-xs text-left transition-all cursor-pointer group"
              >
                <span className="text-[10px] text-blue-600 font-semibold block uppercase tracking-wider">
                  {spot.region}
                </span>
                <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors block mt-0.5">
                  {spot.name}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1 truncate">
                  {spot.tagline}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
