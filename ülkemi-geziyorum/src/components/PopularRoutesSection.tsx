import React from 'react';
import { POPULAR_ROUTES, REGIONS_DATA, LandmarkSpot } from '../data/regionsData';
import { Star, Clock, MapPin, Compass, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
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
    <section className="relative z-30 bg-[#040d1a] py-20 px-4 sm:px-8 border-t border-cyan-900/30">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-sky-950/40 via-cyan-950/40 to-slate-900/40 border border-cyan-500/20 backdrop-blur-md">
          <div className="text-center sm:text-left">
            <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
              81
            </span>
            <span className="text-xs sm:text-sm text-slate-300 block font-medium mt-1">
              Keşfedilmeyi Bekleyen İl
            </span>
          </div>

          <div className="text-center sm:text-left">
            <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
              7
            </span>
            <span className="text-xs sm:text-sm text-slate-300 block font-medium mt-1">
              Eşsiz Coğrafi Bölge
            </span>
          </div>

          <div className="text-center sm:text-left">
            <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
              21+
            </span>
            <span className="text-xs sm:text-sm text-slate-300 block font-medium mt-1">
              UNESCO Dünya Mirası Alanı
            </span>
          </div>

          <div className="text-center sm:text-left">
            <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
              400+
            </span>
            <span className="text-xs sm:text-sm text-slate-300 block font-medium mt-1">
              Kültürel & Tarihi Rota
            </span>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400 uppercase">
              SEÇİLMİŞ YOLCULUKLAR
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Türkiye'nin En Çok Tercih Edilen Rotaları
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Doğadan tarihe, gastronomi macerasından antik kıyılara kadar özenle hazırlanmış unutulmaz seyahat rotaları.
            </p>
          </div>

          <button
            onClick={onOpenAllProvinces}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold border border-white/10 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>Tüm Şehirleri İncele</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_ROUTES.map((route) => (
            <div
              key={route.id}
              className="group relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Emoji Icon & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-2 rounded-xl bg-white/10 backdrop-blur">
                    {route.image}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {route.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {route.title}
                </h3>

                {/* Duration & Rating */}
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {route.duration}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-amber-300 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    {route.rating}
                  </span>
                </div>

                {/* Highlights */}
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  {route.highlights}
                </p>

                {/* Cities in Route */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {route.cities.map((city) => (
                    <span
                      key={city}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => {
                    const matched = REGIONS_DATA.find((r) =>
                      route.title.toLowerCase().includes(r.name.toLowerCase())
                    );
                    if (matched) onSelectSpot(matched);
                    else onOpenAllProvinces();
                  }}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>Detayları Gör</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    route.cities.forEach((c) => onToggleSaveSpot(c.toLowerCase()));
                    confetti({ particleCount: 40, spread: 50 });
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 transition-colors cursor-pointer"
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
          <h3 className="text-lg font-bold text-white mb-4">
            7 Coğrafi Bölgenin Kalbine Yolculuk
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {REGIONS_DATA.map((spot) => (
              <button
                key={spot.id}
                onClick={() => onSelectSpot(spot)}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/40 text-left transition-all cursor-pointer group"
              >
                <span className="text-[10px] text-cyan-400 font-semibold block uppercase tracking-wider">
                  {spot.region}
                </span>
                <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors block mt-0.5">
                  {spot.name}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1 truncate">
                  {spot.tagline}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-500" />
            <span className="font-semibold text-slate-300">Ülkemi Geziyorum</span>
            <span>— Türkiye'yi Adım Adım Keşfet</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onOpenAllProvinces} className="hover:text-slate-300 transition-colors cursor-pointer">
              81 İl Listesi
            </button>
            <button onClick={onOpenPlanner} className="hover:text-slate-300 transition-colors cursor-pointer">
              Seyahat Planlayıcı
            </button>
            <span>© 2026 Tüm Hakları Saklıdır</span>
          </div>
        </footer>
      </div>
    </section>
  );
};
