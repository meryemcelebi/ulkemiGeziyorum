import React, { useState, useMemo } from 'react';
import { X, Search, MapPin, Plus, Check, Filter } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExploreProvincesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedSpots: string[];
  onToggleSaveSpot: (spotId: string) => void;
  onSelectCity: (cityName: string) => void;
}

interface ProvinceItem {
  plate: string;
  name: string;
  region: string;
  highlight: string;
}

const PROVINCES_81: ProvinceItem[] = [
  { plate: '01', name: 'Adana', region: 'Akdeniz', highlight: 'Taşköprü, Varda Köprüsü, Kebap' },
  { plate: '02', name: 'Adıyaman', region: 'Güneydoğu Anadolu', highlight: 'Nemrut Dağı, Cendere Köprüsü' },
  { plate: '03', name: 'Afyonkarahisar', region: 'Ege', highlight: 'Afyon Kalesi, Frig Vadisi, Termal' },
  { plate: '04', name: 'Ağrı', region: 'Doğu Anadolu', highlight: 'İshak Paşa Sarayı, Ağrı Dağı' },
  { plate: '05', name: 'Amasya', region: 'Karadeniz', highlight: 'Kral Kaya Mezarları, Yalıboyu Evleri' },
  { plate: '06', name: 'Ankara', region: 'İç Anadolu', highlight: 'Anıtkabir, Anadolu Medeniyetleri Müzesi' },
  { plate: '07', name: 'Antalya', region: 'Akdeniz', highlight: 'Kaleiçi, Düden Şelalesi, Aspendos, Kaş' },
  { plate: '08', name: 'Artvin', region: 'Karadeniz', highlight: 'Karagöl, Borçka, Çoruh Vadisi' },
  { plate: '09', name: 'Aydın', region: 'Ege', highlight: 'Didim Apollon, Kuşadası, Afrodisias' },
  { plate: '10', name: 'Balıkesir', region: 'Marmara', highlight: 'Cunda Adası, Ayvalık, Kaz Dağları' },
  { plate: '11', name: 'Bilecik', region: 'Marmara', highlight: 'Şeyh Edebali Türbesi, Söğüt' },
  { plate: '12', name: 'Bingöl', region: 'Doğu Anadolu', highlight: 'Yüzen Adalar, Çır Şelalesi' },
  { plate: '13', name: 'Bitlis', region: 'Doğu Anadolu', highlight: 'Nemrut Krater Gölü, Ahlat Selçuklu Mezarlığı' },
  { plate: '14', name: 'Bolu', region: 'Karadeniz', highlight: 'Abant Gölü, Yedigöller, Gölcük' },
  { plate: '15', name: 'Burdur', region: 'Akdeniz', highlight: 'Salda Gölü, Sagalassos Antik Kenti' },
  { plate: '16', name: 'Bursa', region: 'Marmara', highlight: 'Uludağ, Ulu Camii, Cumalıkızık Köyü' },
  { plate: '17', name: 'Çanakkale', region: 'Marmara', highlight: 'Gelibolu Şehitliği, Troya Antik Kenti, Assos' },
  { plate: '18', name: 'Çankırı', region: 'İç Anadolu', highlight: 'Tuz Mağarası, Çankırı Kalesi' },
  { plate: '19', name: 'Çorum', region: 'Karadeniz', highlight: 'Hattuşaş Hitit Başkenti, Alacahöyük' },
  { plate: '20', name: 'Denizli', region: 'Ege', highlight: 'Pamukkale Travertenleri, Hierapolis' },
  { plate: '21', name: 'Diyarbakır', region: 'Güneydoğu Anadolu', highlight: 'Diyarbakır Surları, Hevsel Bahçeleri, On Gözlü Köprü' },
  { plate: '22', name: 'Edirne', region: 'Marmara', highlight: 'Selimiye Camii, Meriç Köprüsü' },
  { plate: '23', name: 'Elazığ', region: 'Doğu Anadolu', highlight: 'Harput Kalesi, Hazar Gölü' },
  { plate: '24', name: 'Erzincan', region: 'Doğu Anadolu', highlight: 'Girlevik Şelalesi, Kemaliye Karanlık Kanyon' },
  { plate: '25', name: 'Erzurum', region: 'Doğu Anadolu', highlight: 'Çifte Minareli Medrese, Palandöken, Tortum Şelalesi' },
  { plate: '26', name: 'Eskişehir', region: 'İç Anadolu', highlight: 'Odunpazarı Tarihi Evleri, Porsuk Çayı' },
  { plate: '27', name: 'Gaziantep', region: 'Güneydoğu Anadolu', highlight: 'Zeugma Mozaik Müzesi, Bakırcılar Çarşısı, Gastronomi' },
  { plate: '28', name: 'Giresun', region: 'Karadeniz', highlight: 'Giresun Adası, Kümbet Yaylası' },
  { plate: '29', name: 'Gümüşhane', region: 'Karadeniz', highlight: 'Karaca Mağarası, Tomara Şelalesi' },
  { plate: '30', name: 'Hakkari', region: 'Doğu Anadolu', highlight: 'Cilo Buzul Gölleri, Zap Vadisi' },
  { plate: '31', name: 'Hatay', region: 'Akdeniz', highlight: 'St. Pierre Kilisesi, Arkeoloji Müzesi, Harbiye Şelaleleri' },
  { plate: '32', name: 'Isparta', region: 'Akdeniz', highlight: 'Kuyucak Lavanta Köyü, Eğirdir Gölü' },
  { plate: '33', name: 'Mersin', region: 'Akdeniz', highlight: 'Kızkalesi, Cennet-Cehennem Obrukları' },
  { plate: '34', name: 'İstanbul', region: 'Marmara', highlight: 'Tarihi Yarımada, Boğaziçi, Galata, Ayasofya' },
  { plate: '35', name: 'İzmir', region: 'Ege', highlight: 'Saat Kulesi, Efes, Şirince, Alaçatı, Kemeraltı' },
  { plate: '36', name: 'Kars', region: 'Doğu Anadolu', highlight: 'Ani Harabeleri, Çıldır Gölü, Kars Kalesi' },
  { plate: '37', name: 'Kastamonu', region: 'Karadeniz', highlight: 'Valla Kanyonu, Ilgaz Dağı, Taşköprü' },
  { plate: '38', name: 'Kayseri', region: 'İç Anadolu', highlight: 'Erciyes Dağı, Kapuzbaşı Şelaleleri, Hunat Hatun' },
  { plate: '39', name: 'Kırklareli', region: 'Marmara', highlight: 'İğneada Longoz Ormanları, Dupnisa Mağarası' },
  { plate: '40', name: 'Kırşehir', region: 'İç Anadolu', highlight: 'Cacabey Medresesi, Ahi Evran Türbesi' },
  { plate: '41', name: 'Kocaeli', region: 'Marmara', highlight: 'Kartepe, Ormanya Doğal Yaşam Parkı' },
  { plate: '42', name: 'Konya', region: 'İç Anadolu', highlight: 'Mevlana Müzesi, Çatalhöyük, Beyşehir Gölü' },
  { plate: '43', name: 'Kütahya', region: 'Ege', highlight: 'Aizanoi Antik Kenti, Çini Müzesi' },
  { plate: '44', name: 'Malatya', region: 'Doğu Anadolu', highlight: 'Arslantepe Höyüğü, Battalgazi Ulu Camii' },
  { plate: '45', name: 'Manisa', region: 'Ege', highlight: 'Spil Dağı Milli Parkı, Sardes Antik Kenti' },
  { plate: '46', name: 'Kahramanmaraş', region: 'Akdeniz', highlight: 'Başkonuş Yaylası, Taş Medrese, Dövme Dondurma' },
  { plate: '47', name: 'Mardin', region: 'Güneydoğu Anadolu', highlight: 'Tarihi Taş Evler, Deyrulzafaran, Dara Antik Kenti' },
  { plate: '48', name: 'Muğla', region: 'Ege', highlight: 'Bodrum, Fethiye, Marmaris, Ölüdeniz, Saklıkent' },
  { plate: '49', name: 'Muş', region: 'Doğu Anadolu', highlight: 'Tarihi Murat Köprüsü, Malazgirt Ovası' },
  { plate: '50', name: 'Nevşehir', region: 'İç Anadolu', highlight: 'Kapadokya, Göreme, Peri Bacaları, Uçhisar' },
  { plate: '51', name: 'Niğde', region: 'İç Anadolu', highlight: 'Aladağlar Milli Parkı, Gümüşler Manastırı' },
  { plate: '52', name: 'Ordu', region: 'Karadeniz', highlight: 'Boztepe Teleferik, Perşembe Yaylası' },
  { plate: '53', name: 'Rize', region: 'Karadeniz', highlight: 'Ayder Yaylası, Pokut Yaylası, Fırtına Deresi' },
  { plate: '54', name: 'Sakarya', region: 'Marmara', highlight: 'Sapanca Gölü, Acarlar Longozu' },
  { plate: '55', name: 'Samsun', region: 'Karadeniz', highlight: 'Bandırma Vapuru, Şahinkaya Kanyonu' },
  { plate: '56', name: 'Siirt', region: 'Güneydoğu Anadolu', highlight: 'Botan Kanyonu, Veysel Karani Türbesi' },
  { plate: '57', name: 'Sinop', region: 'Karadeniz', highlight: 'Tarihi Sinop Cezaevi, Hamsilos Koyu, İnceburun' },
  { plate: '58', name: 'Sivas', region: 'İç Anadolu', highlight: 'Divriği Ulu Camii (UNESCO), Çifte Minareli Medrese' },
  { plate: '59', name: 'Tekirdağ', region: 'Marmara', highlight: 'Uçmakdere Yamaç Paraşütü, Rakoczi Müzesi' },
  { plate: '60', name: 'Tokat', region: 'Karadeniz', highlight: 'Ballıca Mağarası, Tokat Kalesi' },
  { plate: '61', name: 'Trabzon', region: 'Karadeniz', highlight: 'Sümela Manastırı, Atatürk Köşkü, Uzungöl' },
  { plate: '62', name: 'Tunceli', region: 'Doğu Anadolu', highlight: 'Munzur Vadisi Milli Parkı, Munzur Gözeleri' },
  { plate: '63', name: 'Şanlıurfa', region: 'Güneydoğu Anadolu', highlight: 'Göbeklitepe, Balıklıgöl, Harran Kümbet Evleri' },
  { plate: '64', name: 'Uşak', region: 'Ege', highlight: 'Ulubey Kanyonu, Clandras Köprüsü' },
  { plate: '65', name: 'Van', region: 'Doğu Anadolu', highlight: 'Van Gölü, Akdamar Adası, Van Kalesi, Muradiye Şelalesi' },
  { plate: '66', name: 'Yozgat', region: 'İç Anadolu', highlight: 'Yozgat Çamlığı Milli Parkı, Basilica Therma' },
  { plate: '67', name: 'Zonguldak', region: 'Karadeniz', highlight: 'Gökgöl Mağarası, Maden Müzesi, Filyos' },
  { plate: '68', name: 'Aksaray', region: 'İç Anadolu', highlight: 'Ihlara Vadisi, Selime Katedrali' },
  { plate: '69', name: 'Bayburt', region: 'Karadeniz', highlight: 'Baksı Müzesi, Bayburt Kalesi' },
  { plate: '70', name: 'Karaman', region: 'İç Anadolu', highlight: 'İncesu Mağarası, Hatuniye Medresesi' },
  { plate: '71', name: 'Kırıkkale', region: 'İç Anadolu', highlight: 'Çeşnigir Köprüsü ve Kanyonu' },
  { plate: '72', name: 'Batman', region: 'Güneydoğu Anadolu', highlight: 'Hasankeyf Antik Kenti, Malabadi Köprüsü' },
  { plate: '73', name: 'Şırnak', region: 'Güneydoğu Anadolu', highlight: 'Cudi Dağı, Kasrik Boğazı' },
  { plate: '74', name: 'Bartın', region: 'Karadeniz', highlight: 'Amasra Tarihi Kalesi, Gürcüoluk Mağarası' },
  { plate: '75', name: 'Ardahan', region: 'Doğu Anadolu', highlight: 'Şeytan Kalesi, Çıldır Gölü Kıyısı' },
  { plate: '76', name: 'Iğdır', region: 'Doğu Anadolu', highlight: 'Tuzluca Tuz Mağaraları, Ağrı Dağı Etekleri' },
  { plate: '77', name: 'Yalova', region: 'Marmara', highlight: 'Yürüyen Köşk, Termal Kaplıcaları, Çınarcık' },
  { plate: '78', name: 'Karabük', region: 'Karadeniz', highlight: 'Safranbolu Tarihi Konakları (UNESCO)' },
  { plate: '79', name: 'Kilis', region: 'Güneydoğu Anadolu', highlight: 'Ravanda Kalesi, Oylum Höyük' },
  { plate: '80', name: 'Osmaniye', region: 'Akdeniz', highlight: 'Kastabala Antik Kenti, Karatepe Aslantaş' },
  { plate: '81', name: 'Düzce', region: 'Karadeniz', highlight: 'Güzeldere Şelalesi, Akçakoca Kalesi' },
];

const REGIONS_LIST = [
  'Tümü',
  'Marmara',
  'Ege',
  'Akdeniz',
  'İç Anadolu',
  'Karadeniz',
  'Doğu Anadolu',
  'Güneydoğu Anadolu',
];

export const ExploreProvincesModal: React.FC<ExploreProvincesModalProps> = ({
  isOpen,
  onClose,
  savedSpots,
  onToggleSaveSpot,
  onSelectCity,
}) => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Tümü');

  const filteredProvinces = useMemo(() => {
    return PROVINCES_81.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.plate.includes(search) ||
        p.highlight.toLowerCase().includes(search.toLowerCase());
      const matchesRegion =
        selectedRegion === 'Tümü' || p.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [search, selectedRegion]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[85vh] bg-[#081322] border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase block">
              Türkiye Keşif Rehberi
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              81 İl & Rota Kataloğu
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-slate-900/40 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Şehir adı, plaka (örn: 34, 06) veya mekan ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {REGIONS_LIST.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedRegion === r
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Provinces */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredProvinces.map((prov) => {
            const isSaved = savedSpots.includes(prov.name.toLowerCase());
            return (
              <div
                key={prov.plate}
                className="group p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                      {prov.plate}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {prov.region}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {prov.name}
                  </h3>
                  <p className="text-xs text-slate-300/80 mt-1 line-clamp-2 leading-relaxed">
                    {prov.highlight}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => {
                      onSelectCity(prov.name);
                      onClose();
                    }}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1"
                  >
                    <span>İncele</span>
                  </button>

                  <button
                    onClick={() => {
                      onToggleSaveSpot(prov.name.toLowerCase());
                      if (!isSaved) {
                        confetti({ particleCount: 30, spread: 45 });
                      }
                    }}
                    className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-pink-600/20 text-pink-400 border border-pink-500/30'
                        : 'bg-white/10 text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-300'
                    }`}
                    title={isSaved ? 'Rotadan Çıkar' : 'Rotama Ekle'}
                  >
                    {isSaved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isSaved ? 'Eklendi' : 'Rotama Ekle'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950/60 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Toplam 81 il arasından {filteredProvinces.length} il listelendi</span>
          <span>Türkiye'yi keşfetmeye devam edin</span>
        </div>
      </div>
    </div>
  );
};
