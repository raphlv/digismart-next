'use client';

import { MediaArticle, TOP_MEDIA_LIST } from './digismartData';

export interface LexiconAnalysis {
  polarity: 'positif' | 'netral' | 'negatif';
  score: number;
  dominantEmotion: string;
  positiveKeywords: string[];
  negativeKeywords: string[];
  recommendation: string;
}

export interface TenMediaSummary {
  topic: string;
  query: string;
  totalMedia: number;
  liveCount: number;
  positifCount: number;
  netralCount: number;
  negatifCount: number;
  positifPct: number;
  netralPct: number;
  negatifPct: number;
  averageScore: number;
  overallPolarity: 'positif' | 'netral' | 'negatif';
  topPositiveKeywords: string[];
  topNegativeKeywords: string[];
  strategicRecommendation: string;
  generatedAt: string;
}

export interface MediaProfile {
  name: string;
  domain: string;
  angle: string;
  directRss?: string;
  buildSearchUrl: (query: string) => string;
}

const POSITIVE_WORDS = [
  'bagus', 'keren', 'terima kasih', 'makasih', 'cepat', 'lancar', 'puas', 'mantap',
  'bermanfaat', 'apresiasi', 'sukses', 'solutif', 'transparan', 'aman', 'terbaik',
  'hebat', 'positif', 'meningkat', 'efisien', 'optimal', 'inovasi', 'dukungan',
  'keberhasilan', 'akselerasi', 'mempermudah', 'terintegrasi', 'stabil', 'progresif',
  'tumbuh', 'berhasil', 'mendukung', 'menguat', 'prestasi', 'solusi', 'unggul',
];

const NEGATIVE_WORDS = [
  'lambat', 'kecewa', 'down', 'eror', 'error', 'rusak', 'sulit', 'mahal', 'buruk',
  'parah', 'bingung', 'gagal', 'keluhan', 'lemot', 'pungli', 'korupsi', 'hoaks',
  'bohong', 'krisis', 'bocor', 'kritik', 'sorotan', 'kendala', 'terhambat',
  'penolakan', 'polemik', 'terlambat', 'khawatir', 'protes', 'masalah', 'banjir',
  'macet', 'rugi', 'turun', 'merosot', 'ancam', 'darurat', 'korban', 'dugaan',
];

const NEGATION_WORDS = ['tidak', 'bukan', 'kurang', 'belum', 'tanpa', 'tak', 'jangan', 'anti'];

export const MEDIA_PROFILES: MediaProfile[] = [
  {
    name: 'Kompas.com',
    domain: 'kompas.com',
    angle: 'liputan mendalam dampak kebijakan publik dan respons masyarakat luas',
    buildSearchUrl: (q) => `https://search.kompas.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    name: 'Detik.com',
    domain: 'detik.com',
    angle: 'laporan cepat perkembangan lapangan dan reaksi warganet',
    directRss: 'https://news.detik.com/berita/rss',
    buildSearchUrl: (q) => `https://www.detik.com/search/searchall?query=${encodeURIComponent(q)}`,
  },
  {
    name: 'Tribunnews.com',
    domain: 'tribunnews.com',
    angle: 'implementasi di tingkat daerah dan pengalaman langsung warga',
    buildSearchUrl: (q) => `https://www.tribunnews.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    name: 'CNN Indonesia',
    domain: 'cnnindonesia.com',
    angle: 'analisis kebijakan nasional dan sikap pemangku kepentingan',
    directRss: 'https://www.cnnindonesia.com/nasional/rss',
    buildSearchUrl: (q) => `https://www.cnnindonesia.com/search/?query=${encodeURIComponent(q)}`,
  },
  {
    name: 'Liputan6.com',
    domain: 'liputan6.com',
    angle: 'edukasi publik, aksesibilitas layanan, dan klarifikasi resmi',
    directRss: 'https://feed.liputan6.com/rss/news',
    buildSearchUrl: (q) => `https://www.liputan6.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    name: 'CNBC Indonesia',
    domain: 'cnbcindonesia.com',
    angle: 'dampak ekonomi, efisiensi anggaran, dan iklim investasi/industri',
    directRss: 'https://www.cnbcindonesia.com/news/rss',
    buildSearchUrl: (q) => `https://www.cnbcindonesia.com/search?query=${encodeURIComponent(q)}`,
  },
  {
    name: 'Okezone.com',
    domain: 'okezone.com',
    angle: 'adopsi digital masyarakat dan dinamika opini publik harian',
    directRss: 'https://sindikasi.okezone.com/index.php/rss/1/RSS2.0',
    buildSearchUrl: (q) => `https://search.okezone.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    name: 'Republika.co.id',
    domain: 'republika.co.id',
    angle: 'perspektif kesejahteraan sosial, etika publik, dan pelayanan warga',
    directRss: 'https://www.republika.co.id/rss',
    buildSearchUrl: (q) => `https://republika.co.id/search/${encodeURIComponent(q)}`,
  },
  {
    name: 'Antara News',
    domain: 'antaranews.com',
    angle: 'rilis resmi pemerintah, pernyataan pejabat berwenang, dan data institusional',
    directRss: 'https://www.antaranews.com/rss/terkini.xml',
    buildSearchUrl: (q) => `https://www.antaranews.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    name: 'Tempo.co',
    domain: 'tempo.co',
    angle: 'pengawasan tata kelola, transparansi, akuntabilitas, dan catatan kritis pengamat',
    directRss: 'https://rss.tempo.co/nasional',
    buildSearchUrl: (q) => `https://www.tempo.co/search?q=${encodeURIComponent(q)}`,
  },
];

/**
 * Deterministic Indonesian NLP lexicon analyzer with negation handling
 * (e.g. "tidak bagus" or "kurang transparan" flips to negative sentiment).
 */
export function analyzeSentimentLexicon(text: string): LexiconAnalysis {
  const clean = text.toLowerCase().replace(/[^\w\s-]/g, ' ');
  const tokens = clean.split(/\s+/).filter(Boolean);

  const foundPos: string[] = [];
  const foundNeg: string[] = [];

  const hasPrecedingNegation = (idx: number) => {
    for (let offset = 1; offset <= 2; offset++) {
      if (idx - offset >= 0 && NEGATION_WORDS.includes(tokens[idx - offset])) {
        return tokens[idx - offset];
      }
    }
    return null;
  };

  tokens.forEach((tok, idx) => {
    const negPrefix = hasPrecedingNegation(idx);
    if (POSITIVE_WORDS.includes(tok)) {
      if (negPrefix) {
        const phrase = `${negPrefix} ${tok}`;
        if (!foundNeg.includes(phrase)) foundNeg.push(phrase);
      } else if (!foundPos.includes(tok)) {
        foundPos.push(tok);
      }
    } else if (NEGATIVE_WORDS.includes(tok)) {
      if (negPrefix) {
        const phrase = `${negPrefix} ${tok}`;
        if (!foundPos.includes(phrase)) foundPos.push(phrase);
      } else if (!foundNeg.includes(tok)) {
        foundNeg.push(tok);
      }
    }
  });

  // Also check multi-word phrases such as "terima kasih"
  if (clean.includes('terima kasih') && !foundPos.includes('terima kasih')) {
    foundPos.push('terima kasih');
  }

  let polarity: 'positif' | 'netral' | 'negatif' = 'netral';
  let score = 55;
  let dominantEmotion = 'Netral & Informatif';
  let recommendation =
    'Pertahankan komunikasi publik yang berimbang, faktual, dan terus pantau perkembangan persepsi di media nasional.';

  if (foundPos.length > foundNeg.length) {
    polarity = 'positif';
    score = Math.min(96, 65 + (foundPos.length - foundNeg.length) * 8);
    dominantEmotion = 'Apresiasi & Dukungan Publik';
    recommendation =
      'Amplifikasi pemberitaan positif melalui kanal resmi, siaran pers lanjutan, dan kutipan capaian terverifikasi.';
  } else if (foundNeg.length > foundPos.length) {
    polarity = 'negatif';
    score = Math.max(12, 42 - (foundNeg.length - foundPos.length) * 8);
    dominantEmotion = 'Sorotan Kritis / Kekhawatiran Publik';
    recommendation =
      'Siapkan klarifikasi berbasis data lapangan, akui kendala teknis secara transparan, dan sampaikan langkah mitigasi terukur.';
  }

  return {
    polarity,
    score,
    dominantEmotion,
    positiveKeywords: foundPos.length > 0 ? foundPos : ['informatif', 'publik'],
    negativeKeywords: foundNeg,
    recommendation,
  };
}

export function formatIndonesianDateTime(date = new Date()): string {
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function summarizeTenMedia(
  articles: MediaArticle[],
  topic: string,
  query: string
): TenMediaSummary {
  const total = articles.length || 1;
  const liveCount = articles.filter((a) => a.sourceMode === 'live-rss').length;
  const positifCount = articles.filter((a) => a.sentiment === 'positif').length;
  const netralCount = articles.filter((a) => a.sentiment === 'netral').length;
  const negatifCount = articles.filter((a) => a.sentiment === 'negatif').length;

  const positifPct = Math.round((positifCount / total) * 100);
  const netralPct = Math.round((netralCount / total) * 100);
  const negatifPct = Math.max(0, 100 - positifPct - netralPct);

  const averageScore = Math.round(
    articles.reduce((acc, a) => acc + (a.score ?? 55), 0) / total
  );

  let overallPolarity: 'positif' | 'netral' | 'negatif' = 'netral';
  if (positifCount > negatifCount && positifCount >= netralCount) {
    overallPolarity = 'positif';
  } else if (negatifCount > positifCount && negatifCount >= netralCount) {
    overallPolarity = 'negatif';
  }

  const posSet = new Set<string>();
  const negSet = new Set<string>();
  articles.forEach((a) => {
    a.positiveKeywords?.forEach((k) => {
      if (k !== 'informatif' && k !== 'publik') posSet.add(k);
    });
    a.negativeKeywords?.forEach((k) => negSet.add(k));
  });

  let strategicRecommendation =
    'Pertahankan komunikasi publik yang konsisten dan faktual, sambil merespons pertanyaan teknis yang muncul di media.';
  if (overallPolarity === 'positif') {
    strategicRecommendation =
      'Sentimen mayoritas media cenderung positif. Perkuat narasi capaian yang terverifikasi dan tetap tanggapi catatan kritis dari media yang bersikap netral/negatif.';
  } else if (overallPolarity === 'negatif') {
    strategicRecommendation =
      'Terdeteksi dominasi sorotan kritis/negatif pada referensi media. Berita atau Siaran Pers harus memprioritaskan klarifikasi faktual, empati, dan solusi konkret tanpa sikap defensif.';
  }

  return {
    topic,
    query,
    totalMedia: articles.length,
    liveCount,
    positifCount,
    netralCount,
    negatifCount,
    positifPct,
    netralPct,
    negatifPct,
    averageScore,
    overallPolarity,
    topPositiveKeywords: Array.from(posSet).slice(0, 8),
    topNegativeKeywords: Array.from(negSet).slice(0, 8),
    strategicRecommendation,
    generatedAt: formatIndonesianDateTime(),
  };
}

function buildFallbackTenMediaArticles(
  targetMedia: MediaProfile[],
  topic: string,
  focusSubject: string,
  searchTerm: string
): MediaArticle[] {
  const topicLower = topic.toLowerCase();
  const timeOffsets = [
    '8 menit lalu',
    '14 menit lalu',
    '21 menit lalu',
    '29 menit lalu',
    '35 menit lalu',
    '42 menit lalu',
    '51 menit lalu',
    '1 jam lalu',
    '1 jam lalu',
    '2 jam lalu',
  ];

  const editorialTemplates = [
    {
      titleFn: () => `Optimalisasi ${focusSubject} pada Sektor ${topic} Dorong Layanan Lebih Cepat dan Transparan`,
      summaryFn: (m: string, angle: string) =>
        `Dalam ${angle}, ${m} menyoroti bahwa implementasi ${focusSubject} menunjukkan progres positif, mempermudah akses masyarakat, serta mendapat apresiasi atas keterbukaan informasi.`,
    },
    {
      titleFn: () => `Respons Netizen atas ${focusSubject}: Warga Harapkan Konsistensi di Lapangan`,
      summaryFn: (m: string, angle: string) =>
        `Berdasarkan ${angle}, ${m} mencatat adanya keluhan dan sorotan netizen mengenai kendala teknis serta keterlambatan penyesuaian di beberapa titik layanan ${topicLower}.`,
    },
    {
      titleFn: () => `Tinjauan Kebijakan ${focusSubject} dalam Konteks ${topic}`,
      summaryFn: (m: string, angle: string) =>
        `Melalui ${angle}, ${m} memaparkan duduk perkara kebijakan ${focusSubject} beserta pandangan pemangku kepentingan terkait tahapan evaluasi regulasi yang sedang berjalan.`,
    },
    {
      titleFn: () => `Peluang dan Tantangan ${focusSubject} di Daerah: Masyarakat Tunggu Bukti Nyata`,
      summaryFn: (m: string, angle: string) =>
        `Mengacu pada ${angle}, ${m} melaporkan bahwa warga daerah menyambut rencana ${focusSubject}, namun masih menghadapi kendala sosialisasi dan berharap perbaikan berkelanjutan.`,
    },
    {
      titleFn: () => `Edukasi Publik Mengenai ${focusSubject} untuk Tingkatkan Kepercayaan Masyarakat`,
      summaryFn: (m: string, angle: string) =>
        `Dalam ${angle}, ${m} mengulas langkah sosialisasi dan panduan akses ${focusSubject} agar publik memperoleh informasi resmi yang akurat dan terhindar dari hoaks.`,
    },
    {
      titleFn: () => `Dampak Ekonomi dan Efisiensi Tata Kelola dari Program ${focusSubject}`,
      summaryFn: (m: string, angle: string) =>
        `Lewat ${angle}, ${m} menilai ${focusSubject} berpotensi meningkatkan efisiensi operasional dan memperkuat iklim kepercayaan ekonomi apabila pengawasan anggaran berjalan optimal.`,
    },
    {
      titleFn: () => `Dinamika Opini Publik Terkini Soal ${focusSubject} di Ruang Digital`,
      summaryFn: (m: string, angle: string) =>
        `Dalam ${angle}, ${m} merangkum percakapan publik mengenai ${focusSubject} yang terbagi antara dukungan atas inovasi layanan dan pertanyaan seputar kesiapan infrastruktur.`,
    },
    {
      titleFn: () => `Aspek Kesejahteraan Warga Jadi Sorotan Utama dalam Implementasi ${focusSubject}`,
      summaryFn: (m: string, angle: string) =>
        `Berdasarkan ${angle}, ${m} menekankan bahwa keberhasilan ${focusSubject} pada bidang ${topicLower} bergantung pada perlindungan hak warga serta pelayanan yang adil dan bermanfaat.`,
    },
    {
      titleFn: () => `Instansi Terkait Pastikan Pengawasan dan Evaluasi Berkala Program ${focusSubject}`,
      summaryFn: (m: string, angle: string) =>
        `Sesuai ${angle}, ${m} memuat keterangan resmi mengenai komitmen instansi untuk menjaga layanan tetap aman, lancar, dan akuntabel melalui koordinasi lintas unit.`,
    },
    {
      titleFn: () => `Catatan Kritis Pengamat atas Tata Kelola dan Transparansi ${focusSubject}`,
      summaryFn: (m: string, angle: string) =>
        `Melalui ${angle}, ${m} mengkritisi potensi masalah akuntabilitas dan menyoroti perlunya audit terbuka agar tidak memicu polemik atau kekecewaan publik di kemudian hari.`,
    },
  ];

  return targetMedia.map((profile, idx) => {
    const globalIdx = TOP_MEDIA_LIST.indexOf(profile.name);
    const tpl = editorialTemplates[(globalIdx >= 0 ? globalIdx : idx) % editorialTemplates.length];
    const title = tpl.titleFn();
    const summary = tpl.summaryFn(profile.name, profile.angle);
    const analysis = analyzeSentimentLexicon(`${title} ${summary}`);

    return {
      id: `media-${Date.now()}-${idx}`,
      media: profile.name,
      title,
      topic,
      timestamp: timeOffsets[idx % timeOffsets.length],
      sentiment: analysis.polarity,
      score: analysis.score,
      dominantEmotion: analysis.dominantEmotion,
      positiveKeywords: analysis.positiveKeywords,
      negativeKeywords: analysis.negativeKeywords,
      summary,
      url: profile.buildSearchUrl(searchTerm),
      sourceMode: 'structured-reference',
    };
  });
}

/**
 * Fetches live news articles from all 10 national media via server route (/api/media-feed
 * on Vercel/Node or /media-feed.php on PHP hosting), falling back gracefully if offline.
 */
export async function generateTenMediaSentimentReferences(options: {
  topic: string;
  customQuery?: string;
  selectedMedia?: string;
}): Promise<{
  articles: MediaArticle[];
  summary: TenMediaSummary;
  engineUsed: string;
}> {
  const { topic, customQuery = '', selectedMedia = 'Semua Media (Top 10)' } = options;
  const focusSubject = customQuery.trim() || topic;
  const searchTerm = customQuery.trim() ? `${customQuery.trim()} ${topic}` : topic;

  const targetProfiles =
    selectedMedia === 'Semua Media (Top 10)'
      ? MEDIA_PROFILES
      : MEDIA_PROFILES.filter((p) => p.name === selectedMedia);

  const queryParams = new URLSearchParams({
    topic,
    query: focusSubject,
    media: selectedMedia,
  }).toString();

  // 1. Try Next.js Server API Route (/api/media-feed/) — works on Vercel & Node.js
  for (const endpoint of [`/api/media-feed/?${queryParams}`, `/media-feed.php?${queryParams}`]) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 14000);
      const res = await fetch(endpoint, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.articles) && data.articles.length > 0) {
          const enriched: MediaArticle[] = data.articles.map((art: MediaArticle, idx: number) => {
            const analysis = analyzeSentimentLexicon(`${art.title} ${art.summary}`);
            return {
              ...art,
              id: art.id || `live-${Date.now()}-${idx}`,
              sentiment: analysis.polarity,
              score: analysis.score,
              dominantEmotion: analysis.dominantEmotion,
              positiveKeywords: analysis.positiveKeywords,
              negativeKeywords: analysis.negativeKeywords,
            };
          });

          const summary = summarizeTenMedia(enriched, topic, focusSubject);
          return {
            articles: enriched,
            summary,
            engineUsed:
              summary.liveCount > 0
                ? `Live RSS ${summary.liveCount}/${enriched.length} Media + NLP Lexicon`
                : 'NLP Lexicon 10 Media Engine',
          };
        }
      }
    } catch (err) {
      console.warn(`Feed endpoint ${endpoint} unavailable:`, err);
    }
  }

  // 2. Fallback when completely offline or static-only without PHP
  const fallbackArticles = buildFallbackTenMediaArticles(
    targetProfiles,
    topic,
    focusSubject,
    searchTerm
  );

  return {
    articles: fallbackArticles,
    summary: summarizeTenMedia(fallbackArticles, topic, focusSubject),
    engineUsed: 'NLP Lexicon 10 Media Engine (Offline Fallback)',
  };
}
