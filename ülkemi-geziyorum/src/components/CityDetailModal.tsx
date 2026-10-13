import React from 'react';
import { LandmarkSpot } from '../data/regionsData';
import { X, MapPin, Calendar, Utensils, CheckCircle2, Bookmark, BookmarkCheck, Share2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CityDetailModalProps {
  spot: LandmarkSpot | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (spotId: string) => void;
}

export const CityDetailModal: React.FC<CityDetailModalProps> = ({
  spot,
  onClose,
  isSaved,
  onToggleSave,
}) => {
  if (!spot) return null;

  const handleSave = () => {
    onToggleSave(spot.id);
    if (!isSaved) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#091524] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div
          className="relative px-6 py-6 border-b border-white/10 flex items-start justify-between"
          style={{
            background: `linear-gradient(135deg, ${spot.color}33 0%, rgba(9, 21, 36, 0.95) 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: spot.color }}
            >
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-cyan-300">
                  {spot.region}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/15 text-slate-200 font-medium">
                  {spot.category}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                {spot.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Tagline */}
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40">
            <h4 className="text-sm font-semibold text-cyan-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              {spot.title}
            </h4>
            <p className="text-xs text-slate-300 mt-1">{spot.tagline}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {spot.description}
          </p>

          {/* Must-See Highlights */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Öne Çıkan Gezi Rotaları
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {spot.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Meta Information Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Best Season */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">
                  En Uygun Mevsim
                </span>
                <span className="text-xs text-slate-200 mt-0.5 block font-medium">
                  {spot.bestSeason}
                </span>
              </div>
            </div>

            {/* Food Highlight */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">
                  Tadılması Gerekenler
                </span>
                <span className="text-xs text-slate-200 mt-0.5 block font-medium">
                  {spot.foodHighlight}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-900/60 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${spot.name} - Ülkemi Geziyorum`,
                  text: spot.title,
                  url: window.location.href,
                }).catch(() => {});
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Paylaş</span>
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              isSaved
                ? 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-600/30'
                : 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/30'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4" />
                <span>Rotamda Kayıtlı</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Bu Şehri Rotama Ekle</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
