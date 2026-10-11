import React from 'react';
import { Place } from '@/types';
import { MapPin, Landmark, Sparkles, Navigation, Building2 } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  // Kategoriye özel renk ve ikon stilleri
  const getCategoryTheme = (category: string) => {
    switch (category.toLowerCase()) {
      case 'müze':
        return {
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
          icon: <Landmark className="w-3.5 h-3.5 mr-1" />,
        };
      case 'tarihi yer':
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
          icon: <Sparkles className="w-3.5 h-3.5 mr-1" />,
        };
      case 'kültür merkezi':
        return {
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
          icon: <Building2 className="w-3.5 h-3.5 mr-1" />,
        };
      default:
        return {
          badge: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
          icon: <Landmark className="w-3.5 h-3.5 mr-1" />,
        };
    }
  };

  const theme = getCategoryTheme(place.category);

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-sky-700">
      <div>
        {/* Üst Kısım: Rozetler */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${theme.badge}`}
          >
            {theme.icon}
            {place.category}
          </span>

          <span className="inline-flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{place.district}</span>
            <span className="mx-1.5 text-slate-300 dark:text-slate-600">/</span>
            <span>{place.city}</span>
          </span>
        </div>

        {/* Mekan Başlığı */}
        <h3 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 dark:text-white dark:group-hover:text-sky-400">
          {place.name}
        </h3>

        {/* Açıklama */}
        {place.description ? (
          <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-300">
            {place.description}
          </p>
        ) : (
          <p className="mt-3 text-sm italic text-slate-400 dark:text-slate-500">
            Açıklama bilgisi bulunmuyor.
          </p>
        )}
      </div>

      {/* Alt Kısım: Adres ve Bilgi Detayları */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        {place.address_detail && (
          <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
            <MapPin className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-500 mt-0.5" />
            <span className="line-clamp-2 font-medium">{place.address_detail}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 dark:text-slate-500">
          <span className="truncate max-w-[200px]" title={place.source}>
            {place.source}
          </span>

          {place.latitude && place.longitude && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
              <Navigation className="w-2.5 h-2.5" />
              {place.latitude.toFixed(2)}, {place.longitude.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
