'use client';

import React from 'react';
import { LandmarkSpot } from '@/data/regionsData';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="relative px-6 py-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/80 via-sky-50/50 to-white flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md text-white"
              style={{ backgroundColor: spot.color || '#2563eb' }}
            >
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-blue-600">
                  {spot.region}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  {spot.category}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {spot.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Tagline */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
            <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              {spot.title}
            </h4>
            <p className="text-xs text-blue-700 mt-1">{spot.tagline}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {spot.description}
          </p>

          {/* Highlights */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Öne Çıkan Gezi Rotaları
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {spot.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Meta Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">
                  En Uygun Mevsim
                </span>
                <span className="text-xs text-slate-700 mt-0.5 block font-medium">
                  {spot.bestSeason}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">
                  Tadılması Gerekenler
                </span>
                <span className="text-xs text-slate-700 mt-0.5 block font-medium">
                  {spot.foodHighlight}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Paylaş</span>
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              isSaved
                ? 'bg-pink-600 hover:bg-pink-500 text-white shadow-md shadow-pink-600/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
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
