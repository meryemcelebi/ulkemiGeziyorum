'use client';

import React from 'react';
import { X, MapPin, Trash2, Compass, Printer, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RoutePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedSpots: string[];
  onRemoveSpot: (spotId: string) => void;
  onClearAll: () => void;
}

export const RoutePlannerModal: React.FC<RoutePlannerModalProps> = ({
  isOpen,
  onClose,
  savedSpots,
  onRemoveSpot,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const estimatedDays = Math.max(1, Math.ceil(savedSpots.length * 1.5));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-blue-600 tracking-wider uppercase block">
                Özelleştirilmiş Gezi Planı
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                Türkiye Yolculuk Rotam
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          {savedSpots.length === 0 ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center">
              <MapPin className="w-12 h-12 text-slate-300 mb-3 stroke-[1.5]" />
              <p className="text-base font-semibold text-slate-800">
                Henüz rotanıza şehir eklemediniz
              </p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                81 İl kataloğundan veya mekan kartlarından dilediğiniz destinasyonları ekleyin.
              </p>
            </div>
          ) : (
            <>
              {/* Trip Summary Stat Bar */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-500 block font-medium">Toplam Durak</span>
                  <span className="text-lg font-bold text-blue-600">
                    {savedSpots.length} Destinasyon
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Önerilen Seyahat Süresi</span>
                  <span className="text-lg font-bold text-amber-600">
                    ~ {estimatedDays} Gün
                  </span>
                </div>
              </div>

              {/* Spots List */}
              <div className="space-y-2">
                {savedSpots.map((spot, idx) => (
                  <div
                    key={spot}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-semibold capitalize text-slate-800">
                        {spot}
                      </span>
                    </div>

                    <button
                      onClick={() => onRemoveSpot(spot)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Rotadan Çıkar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {savedSpots.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={onClearAll}
              className="text-xs text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
            >
              Tümünü Temizle
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Yazdır / PDF</span>
              </button>

              <button
                onClick={() => {
                  confetti({ particleCount: 60, spread: 70 });
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Rotayı Kaydet</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
