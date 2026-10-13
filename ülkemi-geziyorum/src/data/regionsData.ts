export interface LandmarkSpot {
  id: string;
  name: string;
  region: string;
  category: 'Tarih' | 'Doğa' | 'Kültür' | 'Gastronomi';
  xPercent: number; // Position on Turkey landscape (0-100)
  yPercent: number; // Position on Turkey landscape (0-100)
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  bestSeason: string;
  foodHighlight: string;
  badgeText: string;
  imageUrl?: string;
  color: string;
}

export const REGIONS_DATA: LandmarkSpot[] = [
  {
    id: 'istanbul',
    name: 'İstanbul',
    region: 'Marmara',
    category: 'Tarih',
    xPercent: 32,
    yPercent: 44,
    title: 'İki Kıtanın Buluştuğu Efsane',
    tagline: 'Galata Kulesi, Ayasofya ve Boğazın Büyüsü',
    description: 'Binlerce yıllık Roma, Bizans ve Osmanlı mirasının eşsiz Boğaz manzarasıyla kucaklaştığı dünya başkenti. Tarihi Yarımada, vapurların martılara eşlik ettiği eşsiz bir yolculuk sunar.',
    highlights: ['Galata Kulesi & Tarihi Yarımada', 'Ayasofya-i Kebir Camii & Sultanahmet', 'Boğaz Vapuru & Balat Sokakları', 'Topkapı Sarayı & Kapalıçarşı'],
    bestSeason: 'İlkbahar ve Sonbahar (Nisan-Mayıs, Eylül-Ekim)',
    foodHighlight: 'Tarihi Sultanahmet Köftesi, Balık Ekmek & Türk Kahvesi',
    badgeText: 'İstanbul',
    color: '#0284c7',
  },
  {
    id: 'kapadokya',
    name: 'Kapadokya',
    region: 'İç Anadolu',
    category: 'Doğa',
    xPercent: 51,
    yPercent: 52,
    title: 'Masallar Diyarı & Gökyüzü Balonları',
    tagline: 'Peri Bacaları, Vadiler ve Gün Doğumu Rüyası',
    description: 'Milyonlarca yıl önce volkanik küllerle şekillenen, sabahın ilk ışıklarıyla gökyüzüne süzülen yüzlerce sıcak hava balonuyla büyülü bir rüyaya dönüşen masalsı coğrafya.',
    highlights: ['Gün Doğumu Sıcak Hava Balon Turu', 'Göreme Açık Hava Müzesi & Peri Bacaları', 'Derinkuyu Yeraltı Şehri', 'Aşk Vadisi & Kızılçukur Gün Batımı'],
    bestSeason: 'İlkbahar ve Sonbahar (Nisan-Haziran, Eylül-Kasım)',
    foodHighlight: 'Testi Kebabı, Nevşehir Tavası & Kapadokya Şarapları',
    badgeText: 'Kapadokya',
    color: '#ea580c',
  },
  {
    id: 'ege',
    name: 'Ege',
    region: 'Ege Bölgesi',
    category: 'Tarih',
    xPercent: 23,
    yPercent: 62,
    title: 'Zeytin Ağaçları & Antik Mermer Kentler',
    tagline: 'Efes Antik Kenti, Şirince ve Turkuaz Koylar',
    description: 'Ege’nin meltemiyle serinleyen kıyılarda, dünyanın yedi harikasından biri olan Artemis Tapınağı’nın yanı başında Efes antik tiyatrosu ve masmavi taş evli köyler sizi bekliyor.',
    highlights: ['Efes Antik Kenti & Celsus Kütüphanesi', 'Hierapolis & Pamukkale Travertenleri', 'Şirince Köyü & Alaçatı Taş Sokakları', 'Meryem Ana Evi & Assos'],
    bestSeason: 'Mayıs - Ekim Arası',
    foodHighlight: 'Zeytinyağlı Enginar, Sakızlı Kurabiye & Ege Otları',
    badgeText: 'Ege',
    color: '#0d9488',
  },
  {
    id: 'akdeniz',
    name: 'Akdeniz',
    region: 'Akdeniz Bölgesi',
    category: 'Doğa',
    xPercent: 41,
    yPercent: 78,
    title: 'Turkuaz Kıyılar & Likya Yolu',
    tagline: 'Antik Tiyatrolar, Kaş, Ölüdeniz ve Toroslar',
    description: 'Antik korsan koyları, Akdeniz’in berrak turkuaz suları ve Toros Dağları’nın gölgesinde uzanan Likya Yolu patikalarıyla doğa ve tarihin kusursuz uyumu.',
    highlights: ['Ölüdeniz & Kelebekler Vadisi', 'Kaş-Kalkan & Kekova Batık Şehir', 'Aspendos Antik Tiyatrosu', 'Olimpos & Çıralı Yanartaş'],
    bestSeason: 'Nisan - Kasım Arası',
    foodHighlight: 'Tahinli Piyaz, Turunç Reçeli & Akdeniz Balıkları',
    badgeText: 'Akdeniz',
    color: '#06b6d4',
  },
  {
    id: 'guneydogu',
    name: 'Güneydoğu Anadolu',
    region: 'Güneydoğu Anadolu',
    category: 'Kültür',
    xPercent: 68,
    yPercent: 68,
    title: 'Medeniyetlerin Beşiği & Taşın Dili',
    tagline: 'Göbeklitepe, Mardin Konakları ve Nemrut Dağı',
    description: 'Tarihin sıfır noktası Göbeklitepe’den Mezopotamya ovasına bakan altın sarısı taş konaklarıyla Mardin’e, güneşin en görkemli battığı Nemrut heykellerine uzanan derin yolculuk.',
    highlights: ['Göbeklitepe (Tarihin Sıfır Noktası)', 'Mardin Tarihi Taş Evleri & Deyrulzafaran', 'Nemrut Dağı Heykelleri', 'Halfeti Batık Şehir & Zeugma Mozaikleri'],
    bestSeason: 'Mart - Mayıs & Eylül - Kasım',
    foodHighlight: 'Gaziantep Baklavası, Ali Nazik, Mardin Süryani Çöreği',
    badgeText: 'Güneydoğu Anadolu',
    color: '#d97706',
  },
  {
    id: 'dogu_anadolu',
    name: 'Doğu Anadolu',
    region: 'Doğu Anadolu',
    category: 'Doğa',
    xPercent: 76,
    yPercent: 44,
    title: 'Görkemli Zirveler & Masalsı Saraylar',
    tagline: 'Ağrı Dağı, İshak Paşa Sarayı ve Çıldır Gölü',
    description: 'Türkiye’nin çatısı Ağrı Dağı’nın karlı zirvesi, ovaya tepeden bakan masalsı İshak Paşa Sarayı, kışın buz tutan Çıldır Gölü ve Ani Harabeleri ile destansı bir rota.',
    highlights: ['Ağrı Dağı (5137m Zirvesi)', 'İshak Paşa Sarayı (Doğubayazıt)', 'Ani Harabeleri (Kars)', 'Van Gölü & Akdamar Kilisesi'],
    bestSeason: 'Yazın Doğa (Haziran-Ağustos), Kışın Kar & Tren Turu (Aralık-Şubat)',
    foodHighlight: 'Kars Gravyeri & Kaz Eti, Van Kahvaltısı, Cağ Kebabı',
    badgeText: 'Doğu Anadolu',
    color: '#8b5cf6',
  },
  {
    id: 'karadeniz',
    name: 'Karadeniz',
    region: 'Karadeniz Bölgesi',
    category: 'Doğa',
    xPercent: 60,
    yPercent: 32,
    title: 'Zümrüt Yeşili Yaylalar & Sisli Vadiler',
    tagline: 'Sümela Manastırı, Fırtına Vadisi ve Ayder',
    description: 'Bulut denizlerinin üzerinde horon tepilen yaylalar, dik kayalıklara asılı duran tarihi Sümela Manastırı ve yemyeşil çay tarlalarıyla doğanın saf enerjisi.',
    highlights: ['Sümela Manastırı (Trabzon)', 'Fırtına Vadisi & Pokut Yaylası (Rize)', 'Uzungöl & Ayder', 'Macahel Biyosfer Rezervi (Artvin)'],
    bestSeason: 'Haziran - Eylül Arası',
    foodHighlight: 'Karadeniz Mıhlaması (Kuymak), Hamsili Pilav, Laz Böreği',
    badgeText: 'Karadeniz',
    color: '#16a34a',
  },
  {
    id: 'ic_anadolu',
    name: 'İç Anadolu',
    region: 'İç Anadolu',
    category: 'Tarih',
    xPercent: 45,
    yPercent: 48,
    title: 'Cumhuriyetin Kalbi & Bozkırın Ruhu',
    tagline: 'Anıtkabir, Mevlana Türbesi ve Çatalhöyük',
    description: 'Başkent Ankara’nın gururu Anıtkabir’den, hoşgörünün simgesi Konya Mevlana Müzesi’ne ve Neolitik çağın ilk kenti Çatalhöyük’e uzanan köklü tarih.',
    highlights: ['Anıtkabir (Ankara)', 'Mevlana Müzesi & Sema Ayini (Konya)', 'Çatalhöyük Neolitik Kenti', 'Eskişehir Tarihi Odunpazarı Evleri'],
    bestSeason: 'Nisan - Haziran, Eylül - Ekim',
    foodHighlight: 'Ankara Tavası, Konya Etli Ekmek, Çibörek',
    badgeText: 'İç Anadolu',
    color: '#6366f1',
  }
];

export const POPULAR_ROUTES = [
  {
    id: 'route-1',
    title: 'Kapadokya & Peri Masalı',
    duration: '3 Gün / 2 Gece',
    cities: ['Nevşehir', 'Ürgüp', 'Göreme', 'Avanos'],
    rating: 4.9,
    highlights: 'Sıcak hava balonu, testi kebabı, çömlek atölyesi, yeraltı şehri.',
    badge: 'En Popüler',
    image: '🎈'
  },
  {
    id: 'route-2',
    title: 'Turkuaz Kıyılar & Likya',
    duration: '5 Gün / 4 Gece',
    cities: ['Fethiye', 'Kaş', 'Kalkan', 'Antalya'],
    rating: 4.95,
    highlights: 'Kelebekler Vadisi, batık kent kano turu, Patara kum tepeleri.',
    badge: 'Yaz Favorisi',
    image: '⛵'
  },
  {
    id: 'route-3',
    title: 'Mezopotamya Gizemi',
    duration: '4 Gün / 3 Gece',
    cities: ['Gaziantep', 'Şanlıurfa', 'Mardin', 'Adıyaman'],
    rating: 4.88,
    highlights: 'Göbeklitepe, Nemrut gün batımı, Mardin taş konakları, gastronomi.',
    badge: 'Kültür & Lezzet',
    image: '🏛️'
  },
  {
    id: 'route-4',
    title: 'Karadeniz Bulut Yaylaları',
    duration: '5 Gün / 4 Gece',
    cities: ['Trabzon', 'Rize', 'Artvin'],
    rating: 4.92,
    highlights: 'Sümela Manastırı, Pokut bulut denizi, rafting, yayla kahvaltıları.',
    badge: 'Doğa & Macera',
    image: '🌲'
  }
];
