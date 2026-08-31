export interface StatItem {
  id: string;
  title: string;
  value: number;
  change: string;
  isPositive: boolean;
  iconName: string;
}

export interface IssueTrendPoint {
  day: string;
  isu: number;
  berita: number;
}

export interface SentimentBreakdown {
  positif: number;
  netral: number;
  negatif: number;
}

export interface SocialListeningPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'tiktok' | 'news';
  author: string;
  handle: string;
  avatar: string;
  content: string;
  timestamp: string;
  sentiment: 'positif' | 'netral' | 'negatif';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  crisisLevel: 'low' | 'medium' | 'high';
  topic: string;
}

export interface LearningModule {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
}

export interface CrisisCaseStudy {
  id: string;
  caseTitle: string;
  organization: string;
  crisisSummary: string;
  challenge: string;
  goodResponse: string;
  badResponse: string;
  learningPoints: string[];
}

export const INITIAL_STATS: StatItem[] = [
  {
    id: 'berita',
    title: 'Total Berita Dibuat',
    value: 5,
    change: '+2%',
    isPositive: true,
    iconName: 'FileText',
  },
  {
    id: 'isu',
    title: 'Isu Dipantau',
    value: 5,
    change: '+8%',
    isPositive: true,
    iconName: 'Radio',
  },
  {
    id: 'sentimen',
    title: 'Analisis Sentimen',
    value: 12,
    change: '-1%',
    isPositive: false,
    iconName: 'Activity',
  },
  {
    id: 'aktivitas',
    title: 'Aktivitas AI Hari Ini',
    value: 17,
    change: '+15%',
    isPositive: true,
    iconName: 'Zap',
  },
];

export const INITIAL_TREND_DATA: IssueTrendPoint[] = [
  { day: 'Sen', isu: 12, berita: 8 },
  { day: 'Sel', isu: 19, berita: 13 },
  { day: 'Rab', isu: 15, berita: 14 },
  { day: 'Kam', isu: 25, berita: 18 },
  { day: 'Jum', isu: 21, berita: 20 },
  { day: 'Sab', isu: 14, berita: 11 },
  { day: 'Min', isu: 7, berita: 5 },
];

export const INITIAL_SENTIMENT: SentimentBreakdown = {
  positif: 45,
  netral: 35,
  negatif: 20,
};

export const TRENDING_KEYWORDS = [
  { keyword: 'Transformasi Digital Kampus', count: '1.4k sebutan', sentiment: 'positif' },
  { keyword: 'Kebijakan Beasiswa Prestasi', count: '980 sebutan', sentiment: 'positif' },
  { keyword: 'Klarifikasi Isu Fasilitas Lab', count: '640 sebutan', sentiment: 'negatif' },
  { keyword: 'Pendaftaran Mahasiswa Baru 2026', count: '520 sebutan', sentiment: 'netral' },
  { keyword: 'Inovasi AI Komunikasi Publik', count: '430 sebutan', sentiment: 'positif' },
  { keyword: 'Jadwal Ujian Akhir Semester', count: '310 sebutan', sentiment: 'netral' },
];

export const SIMULATED_SOCIAL_FEED: SocialListeningPost[] = [
  {
    id: 'post-1',
    platform: 'twitter',
    author: 'Rina Maharani',
    handle: '@rinamhrn',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    content: 'Apresiasi respons cepat humas terkait perbaikan server portal akademik. Sekarang sudah jauh lebih lancar pas mau input KRS! 👍 #KampusDigital',
    timestamp: '10 menit yang lalu',
    sentiment: 'positif',
    engagement: { likes: 142, shares: 28, comments: 12 },
    crisisLevel: 'low',
    topic: 'Layanan Portal Akademik',
  },
  {
    id: 'post-2',
    platform: 'instagram',
    author: 'Suara Mahasiswa Cerdas',
    handle: '@suaramahasiswabl',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    content: 'Mohon kejelasan jadwal seleksi beasiswa riset semester ini min, banyak yang belum dapat notifikasi verifikasi berkas.',
    timestamp: '25 menit yang lalu',
    sentiment: 'netral',
    engagement: { likes: 89, shares: 14, comments: 34 },
    crisisLevel: 'medium',
    topic: 'Beasiswa & Pendanaan Riset',
  },
  {
    id: 'post-3',
    platform: 'tiktok',
    author: 'Dimas Tech Review',
    handle: '@dimastech_id',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    content: 'Keren banget workshop AI Public Communication hari ini! Mahasiswa diajarin langsung cara mitigasi krisis hoaks dan social listening praktis.',
    timestamp: '1 jam yang lalu',
    sentiment: 'positif',
    engagement: { likes: 430, shares: 72, comments: 55 },
    crisisLevel: 'low',
    topic: 'Workshop & Edukasi AI',
  },
  {
    id: 'post-4',
    platform: 'news',
    author: 'Warta Nasional Komunikasi',
    handle: 'wartakomunikasi.id',
    avatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100&auto=format&fit=crop&q=80',
    content: 'Penerapan Teknologi Kecerdasan Buatan dalam Kehumasan Instansi Publik Dinilai Mampu Mempercepat Verifikasi Informasi Krisis hingga 70%.',
    timestamp: '2 jam yang lalu',
    sentiment: 'positif',
    engagement: { likes: 210, shares: 95, comments: 18 },
    crisisLevel: 'low',
    topic: 'Publikasi Riset Kehumasan',
  },
];

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'modul-1',
    title: 'Dasar-Dasar AI Command Center untuk Komunikasi Publik',
    category: 'Konsep Dasar',
    readTime: '6 menit baca',
    summary: 'Memahami peran pusat komando komunikasi berbasis AI dalam menyaring banjir informasi dan menganalisis sentimen masyarakat secara real-time.',
    content: [
      'Komunikasi publik digital di era kecerdasan buatan menuntut praktisi humas tidak hanya reaktif, melainkan proaktif dalam mengidentifikasi anomali opini.',
      'Sistem Social Listening AI bekerja dengan mengekstraksi data berbasis kata kunci, mengelompokkan polaritas sentimen (Positif, Netral, Negatif), dan memprediksi kurva eskalasi isu.',
      'Mahasiswa komunikasi perlu memahami batas etika antara pemanfaatan otomatisasi AI dan sentuhan empati manusia dalam menyusun rilis pers resmi.',
    ],
    keyTakeaways: [
      'AI berfungsi sebagai co-pilot analisis data, keputusan akhir tetap di tangan praktisi PR.',
      'Deteksi dini isu mencegah eskalasi krisis sebelum menjadi viral negatif.',
      'Transparansi dan kecepatan adalah kunci kredibilitas instansi modern.',
    ],
  },
  {
    id: 'modul-2',
    title: 'Strategi Manajemen Krisis & Quick Response PR',
    category: 'Manajemen Krisis',
    readTime: '8 menit baca',
    summary: 'Pedoman taktis menyusun Holding Statement dan tanggapan klarifikasi resmi dalam kurun waktu golden hour (kurang dari 60 menit).',
    content: [
      'Ketika krisis reputasi terjadi, kekosongan informasi akan diisi oleh spekulasi dan hoaks.',
      'Formula 3A dalam Respons Krisis: Acknowledge (Akui adanya peristiwa), Action (Jelaskan langkah investigasi/tindakan yang sedang diambil), dan Assurance (Beri kepastian saluran informasi resmi).',
      'Hindari istilah teknis yang membingungkan masyarakat; gunakan bahasa yang lugas, empatik, dan terukur.',
    ],
    keyTakeaways: [
      'Holding Statement harus dirilis sebelum 60 menit pertama kemunculan isu.',
      'Fokus pada empati terhadap korban/pihak terdampak sebelum menjelaskan data.',
      'Tunjuk juru bicara tunggal untuk menghindari kontradiksi pernyataan.',
    ],
  },
  {
    id: 'modul-3',
    title: 'Prompt Engineering untuk Praktisi Humas & Jurnalis',
    category: 'Praktek AI',
    readTime: '7 menit baca',
    summary: 'Teknik merumuskan instruksi AI agar menghasilkan draf siaran pers yang akurat, bebas bias, dan berstandar jurnalistik 5W+1H.',
    content: [
      'Struktur Prompt Humas Efektif: [Peran] + [Konteks Isu] + [Data Fakta 5W1H] + [Tone & Audiens Target] + [Format Output].',
      'Contoh: "Bertindaklah sebagai Senior PR Officer kementerian. Buat siaran pers 4 paragraf mengumumkan program beasiswa digital, dengan tone optimis dan formal, cantumkan syarat IPK min 3.25 dan tautan pendaftaran."',
      'Selalu lakukan fact-checking dan verifikasi nama pejabat, kutipan langsung, serta angka sebelum publikasi.',
    ],
    keyTakeaways: [
      'AI menghasilkan output berkualitas tinggi hanya jika prompt terstruktur spesifik.',
      'Verifikasi fakta dan nama narasumber merupakan tanggung jawab mutlak manusia.',
      'Kombinasikan gaya piramida terbalik jurnalistik dengan format baku siaran pers.',
    ],
  },
];

export const CRISIS_CASE_STUDIES: CrisisCaseStudy[] = [
  {
    id: 'case-1',
    caseTitle: 'Gangguan Server Portal Pembayaran Uang Kuliah & KRS',
    organization: 'Universitas Terbuka Modern',
    crisisSummary: 'Sistem server pembayaran down di hari terakhir batas registrasi semester, memicu ribuan cuitan frustrasi mahasiswa di media sosial.',
    challenge: 'Waktu tersisa 6 jam sebelum tenggat, kepanikan massal mahasiswa terancam cuti paksa.',
    goodResponse: 'Humas segera merilis pengumuman perpanjangan tenggat 3x24 jam dalam 20 menit, memohon maaf secara tulus, dan menyediakan hotline darurat via WhatsApp.',
    badResponse: 'Menyalahkan lonjakan akses mahasiswa, tidak memberi kepastian perpanjangan waktu, dan mematikan kolom komentar media sosial.',
    learningPoints: [
      'Memberikan solusi praktis langsung (perpanjangan waktu) meredam 90% kemarahan audiens.',
      'Transparansi teknis membangun rasa saling pengertian.',
    ],
  },
  {
    id: 'case-2',
    caseTitle: 'Disinformasi Kebocoran Data Internal Organisasi',
    organization: 'Lembaga Pelayanan Publik',
    crisisSummary: 'Beredar tangkapan layar palsu di grup percakapan yang mengklaim 50.000 data pengguna diperjualbelikan.',
    challenge: 'Isu berkembang liar sebelum tim keamanan siber selesai melakukan audit forensik menyeluruh.',
    goodResponse: 'Menerbitkan Holding Statement bahwa tim keamanan sedang mengaudit sistem secara forensik dan berjanji mengumumkan hasil audit dalam 3 jam.',
    badResponse: 'Membantah tanpa bukti atau diam seribu bahasa hingga isu diberitakan media massa nasional.',
    learningPoints: [
      'Jangan membantah secara mutlak sebelum memiliki bukti forensik digital.',
      'Holding statement melindungi reputasi sementara audit teknis berjalan.',
    ],
  },
];
