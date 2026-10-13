import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Video, Check, RefreshCw, Eye, EyeOff, Sparkles, HelpCircle, Film, Sliders } from 'lucide-react';
import { HeroConfig } from '../config/heroImagesConfig';

interface ImageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: HeroConfig;
  onSaveConfig: (newConfig: HeroConfig) => void;
  hideTextOverlay: boolean;
  onToggleHideTextOverlay: (val: boolean) => void;
}

export const ImageSettingsModal: React.FC<ImageSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  hideTextOverlay,
  onToggleHideTextOverlay,
}) => {
  const [localConfig, setLocalConfig] = useState<HeroConfig>(config);
  const [activeTab, setActiveTab] = useState<'upload' | 'guide'>('upload');

  if (!isOpen) return null;

  // Handle video or image file upload
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'video' | 'image1' | 'image2'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (type === 'video') {
        setLocalConfig((prev) => ({
          ...prev,
          scene1: { ...prev.scene1, videoUrl: dataUrl },
        }));
      } else if (type === 'image1') {
        setLocalConfig((prev) => ({
          ...prev,
          scene1: { ...prev.scene1, imageUrl: dataUrl },
        }));
      } else if (type === 'image2') {
        setLocalConfig((prev) => ({
          ...prev,
          scene2: { ...prev.scene2, imageUrl: dataUrl },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSaveConfig(localConfig);
    onClose();
  };

  const handleReset = () => {
    const emptyConfig: HeroConfig = {
      ...config,
      scene1: { ...config.scene1, videoUrl: '', imageUrl: '' },
      scene2: { ...config.scene2, imageUrl: '' },
    };
    setLocalConfig(emptyConfig);
    onSaveConfig(emptyConfig);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#081322] border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-950/60 to-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-cyan-400 tracking-wider uppercase block">
                Hero Video & Görsel Yöneticisi
              </span>
              <h2 className="text-xl font-extrabold text-white">
                Başlangıç Videosu ve Türkiye Görseli
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

        {/* Tabs */}
        <div className="flex border-b border-white/10 px-5 pt-3 bg-white/[0.02]">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Video / Görsel Yükle
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Klasöre Ekleme Rehberi (public/)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[65vh] space-y-6">
          {activeTab === 'upload' ? (
            <>
              {/* Option: Hide text overlay */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  {hideTextOverlay ? (
                    <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Görsel/Video Üzerindeki Başlık Yazılarını Gizle
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Videonuzda veya görselinizde başlıklar zaten yazılıysa, çift görünmemesi için kapatabilirsiniz.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onToggleHideTextOverlay(!hideTextOverlay)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                    hideTextOverlay
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  {hideTextOverlay ? 'Gizlendi' : 'Gösteriliyor'}
                </button>
              </div>

              {/* 1. Aşama: Başlangıç Videosu (Dünya Dönüşü & Türkiye'ye İniş) */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                    <Video className="w-4 h-4 text-cyan-400" />
                    1. Aşama: Başlangıç Videosu (Dünya Dönüşü & Yakınlaşma)
                  </h3>
                  {localConfig.scene1.videoUrl && (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                      <Check className="w-3.5 h-3.5" /> Video Aktif
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300">
                  Aşağı kaydırdıkça dünyanın dönüp Türkiye'ye doğru yaklaştığı videonuzu buradan yükleyin veya yolunu girin.
                </p>

                {/* Upload or URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col items-center justify-center p-4 border border-dashed border-cyan-500/50 rounded-xl hover:bg-cyan-500/10 cursor-pointer transition-colors group">
                    <Upload className="w-5 h-5 text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-white">Video Dosyası Seç</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">MP4, WEBM veya MOV</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'video')}
                    />
                  </label>

                  <div className="flex flex-col justify-center">
                    <span className="text-xs text-slate-300 font-medium mb-1">Veya Video URL / Dosya Yolu:</span>
                    <input
                      type="text"
                      placeholder="Örn: /videos/earth-zoom.mp4 veya https://..."
                      value={localConfig.scene1.videoUrl}
                      onChange={(e) =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          scene1: { ...prev.scene1, videoUrl: e.target.value },
                        }))
                      }
                      className="px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Video Playback Mode Toggle */}
                <div className="pt-2 flex items-center justify-between border-t border-cyan-500/20 text-xs">
                  <span className="text-slate-300 font-medium">
                    Aşağı kaydırdıkça video kare kare ilerlesin (Scroll Scrubbing)
                  </span>
                  <button
                    onClick={() =>
                      setLocalConfig((prev) => ({
                        ...prev,
                        scene1: {
                          ...prev.scene1,
                          videoScrollControlled: !prev.scene1.videoScrollControlled,
                        },
                      }))
                    }
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      localConfig.scene1.videoScrollControlled
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {localConfig.scene1.videoScrollControlled ? 'Açık (Önerilen)' : 'Otomatik Oynat'}
                  </button>
                </div>

                {/* Video Preview */}
                {localConfig.scene1.videoUrl && (
                  <div className="relative h-32 w-full rounded-lg overflow-hidden border border-cyan-500/30 mt-2 bg-black">
                    <video
                      src={localConfig.scene1.videoUrl}
                      className="w-full h-full object-cover"
                      controls
                      muted
                    />
                    <button
                      onClick={() =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          scene1: { ...prev.scene1, videoUrl: '' },
                        }))
                      }
                      className="absolute top-2 right-2 px-2 py-1 rounded bg-black/70 text-[10px] text-red-300 hover:text-white cursor-pointer z-10"
                    >
                      Videoyu Kaldır
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Aşama: Türkiye Haritası & Yakınlaşma (Zoom-In) */}
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    2. Aşama: Türkiye Haritası Görseli (Yaklaşma Animasyonlu)
                  </h3>
                  {localConfig.scene2.imageUrl && (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                      <Check className="w-3.5 h-3.5" /> Görsel Aktif
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300">
                  Video tamamlandığında ekrana gelecek ve aşağı kaydırdıkça size doğru yaklaşacak 3D Türkiye haritası görseliniz.
                </p>

                {/* Upload or URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col items-center justify-center p-4 border border-dashed border-amber-500/50 rounded-xl hover:bg-amber-500/10 cursor-pointer transition-colors group">
                    <Upload className="w-5 h-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-white">Görsel Seç</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG veya WEBP</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'image2')}
                    />
                  </label>

                  <div className="flex flex-col justify-center">
                    <span className="text-xs text-slate-300 font-medium mb-1">Veya Görsel URL / Dosya Yolu:</span>
                    <input
                      type="text"
                      placeholder="Örn: /images/turkey-map.jpg veya https://..."
                      value={localConfig.scene2.imageUrl}
                      onChange={(e) =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          scene2: { ...prev.scene2, imageUrl: e.target.value },
                        }))
                      }
                      className="px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Zoom Intensity Selection */}
                <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">
                    Türkiye Görseli Yakınlaşma (Zoom-In) Şiddeti:
                  </span>
                  <div className="flex items-center gap-1">
                    {(['subtle', 'cinematic', 'dramatic'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() =>
                          setLocalConfig((prev) => ({
                            ...prev,
                            scene2: { ...prev.scene2, zoomIntensity: lvl },
                          }))
                        }
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                          localConfig.scene2.zoomIntensity === lvl
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                      >
                        {lvl === 'subtle'
                          ? 'Hafif'
                          : lvl === 'cinematic'
                          ? 'Sinematik'
                          : 'Güçlü'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                {localConfig.scene2.imageUrl && (
                  <div className="relative h-28 w-full rounded-lg overflow-hidden border border-amber-500/30 mt-2">
                    <img
                      src={localConfig.scene2.imageUrl}
                      alt="2. Görsel Önizleme"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          scene2: { ...prev.scene2, imageUrl: '' },
                        }))
                      }
                      className="absolute top-2 right-2 px-2 py-1 rounded bg-black/70 text-[10px] text-red-300 hover:text-white cursor-pointer"
                    >
                      Kaldır
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/40">
                <h4 className="font-bold text-cyan-200 text-sm mb-1">
                  Proje Klasörlerine Dosya Nasıl Eklenir?
                </h4>
                <p>
                  Projenizde <code className="px-1.5 py-0.5 rounded bg-black/50 text-cyan-300">public/videos/</code> ve <code className="px-1.5 py-0.5 rounded bg-black/50 text-cyan-300">public/images/</code> klasörleri oluşturuldu.
                </p>
              </div>

              <ol className="list-decimal list-inside space-y-3 p-2">
                <li>
                  <strong className="text-white">Başlangıç Videosu:</strong> Videonuzu <code className="text-cyan-300">public/videos/earth-zoom.mp4</code> olarak kaydedin.
                </li>
                <li>
                  <strong className="text-white">Türkiye Haritası Görseli:</strong> İkinci görselinizi <code className="text-amber-300">public/images/turkey-map.jpg</code> olarak kaydedin.
                </li>
                <li>
                  Ardından <code className="text-cyan-300">src/config/heroImagesConfig.ts</code> dosyasında:
                  <pre className="mt-1.5 p-3 rounded bg-black/60 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
{`scene1: {
  videoUrl: '/videos/earth-zoom.mp4',
  videoScrollControlled: true, // Scroll ile kare kare ilerler
},
scene2: {
  imageUrl: '/images/turkey-map.jpg',
  zoomIntensity: 'cinematic', // Yakınlaşma şiddeti
}`}
                  </pre>
                </li>
                <li>
                  Böylece aşağı kaydırdıkça video oynar, dünya döner ve Türkiye üzerine iner inmez ikinci harita görseli sinematik bir şekilde yaklaşır!
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/60 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Varsayılan Görünüme Dön</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/15 text-slate-300 transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-white shadow-md shadow-cyan-500/30 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Kaydet ve Uygula</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
