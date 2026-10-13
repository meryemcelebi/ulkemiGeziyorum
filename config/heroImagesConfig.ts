/**
 * ÜLKEMİ GEZİYORUM - HERO GÖRSEL VE VİDEO YAPILANDIRMASI
 */

export interface HeroConfig {
  // 1. Aşama: Başlangıç Videosu / Görseli
  scene1: {
    // Video dosya yolu (örn: '/videos/earth-zoom.mp4') veya dataURL / link
    videoUrl: string;
    // Video yoksa kullanılacak statik görsel
    imageUrl: string;
    // Videoyu aşağı kaydırdıkça kare kare ilerlet (true = Apple tarzı scroll scrubbing)
    videoScrollControlled: boolean;
    // Metinler
    categoryText: string;
    titleMain: string;
    titleHandwritten: string;
    description: string;
    buttonText: string;
    noteText: string;
    scrollText: string;
  };

  // 2. Aşama: Türkiye Haritası (İkinci Görsel & Yakınlaşma Animasyonu)
  scene2: {
    // Görsel dosya yolu (örn: '/images/turkey-map.jpg')
    imageUrl: string;
    // Yakınlaşma (Zoom-in) derinliği: 'cinematic' (orta) | 'dramatic' (güçlü) | 'subtle' (hafif)
    zoomIntensity: 'subtle' | 'cinematic' | 'dramatic';
    // Metinler
    categoryText: string;
    titleMain: string;
    titleHandwritten: string;
    description: string;
    buttonText: string;
    noteText: string;
  };
}

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  scene1: {
    videoUrl: '', // Kendi videonuz için: '/videos/earth-zoom.mp4' veya yüklenen dosya
    imageUrl: '', // Video yüklenmediyse opsiyonel görsel
    videoScrollControlled: true, // Aşağı kaydırdıkça video kare kare ilerlesin
    categoryText: "TÜRKİYE'Yİ VE DÜNYAYI",
    titleMain: 'Keşfetmeye',
    titleHandwritten: 'Hazır mısın?',
    description: 'Binlerce şehir, yüzlerce kültür, unutulmaz rotalar... Hayalindeki yolculuk burada başlıyor.',
    buttonText: 'Keşfetmeye Başla',
    noteText: "Dünyayı\nkeşfet\nTürkiye'yi\nyaşa",
    scrollText: 'Aşağı kaydır',
  },
  scene2: {
    imageUrl: '', // Kendi görseliniz için: '/images/turkey-map.jpg'
    zoomIntensity: 'cinematic',
    categoryText: 'ŞİMDİ SIRA',
    titleMain: "Türkiye'yi",
    titleHandwritten: 'Keşfetmekte',
    description: 'Tarihi, doğası, kültürü ve eşsiz şehirleriyle Türkiye seni bekliyor.',
    buttonText: "Türkiye'yi Keşfet",
    noteText: '81 il\nbinlerce keşif\nseni bekliyor',
  },
};
