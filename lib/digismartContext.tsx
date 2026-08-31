'use client';

import React, { createContext, useContext, useState } from 'react';
import { 
  StatItem, 
  INITIAL_STATS, 
  INITIAL_TREND_DATA, 
  INITIAL_SENTIMENT, 
  IssueTrendPoint, 
  SentimentBreakdown,
  SocialListeningPost,
  SIMULATED_SOCIAL_FEED,
  TRENDING_KEYWORDS
} from './digismartData';

export interface GeneratedArticle {
  id: string;
  title: string;
  topic: string;
  tone: string;
  content: string;
  leadParagraph: string;
  quotes: string;
  timestamp: string;
  keywords: string[];
}

export interface SentimentResult {
  id: string;
  inputText: string;
  polarity: 'positif' | 'netral' | 'negatif';
  score: number; // -1 to 1 or 0-100%
  dominantEmotion: string;
  positiveKeywords: string[];
  negativeKeywords: string[];
  recommendation: string;
  timestamp: string;
}

export interface DigismartContextType {
  stats: StatItem[];
  trendData: IssueTrendPoint[];
  sentiment: SentimentBreakdown;
  socialPosts: SocialListeningPost[];
  trendingKeywords: typeof TRENDING_KEYWORDS;
  articles: GeneratedArticle[];
  sentimentHistory: SentimentResult[];
  activeScenario: string;
  setActiveScenario: (scenario: string) => void;
  addArticle: (article: Omit<GeneratedArticle, 'id' | 'timestamp'>) => void;
  analyzeText: (text: string) => SentimentResult;
  addSocialPost: (post: Omit<SocialListeningPost, 'id' | 'timestamp'>) => void;
  resetSimulation: () => void;
}

const DigismartContext = createContext<DigismartContextType | undefined>(undefined);

export function DigismartProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<StatItem[]>(INITIAL_STATS);
  const [trendData, setTrendData] = useState<IssueTrendPoint[]>(INITIAL_TREND_DATA);
  const [sentiment, setSentiment] = useState<SentimentBreakdown>(INITIAL_SENTIMENT);
  const [socialPosts, setSocialPosts] = useState<SocialListeningPost[]>(SIMULATED_SOCIAL_FEED);
  const [trendingKeywords, setTrendingKeywords] = useState(TRENDING_KEYWORDS);
  const [articles, setArticles] = useState<GeneratedArticle[]>([
    {
      id: 'art-1',
      title: 'Optimalisasi Infrastruktur Server Akademik: Layanan KRS Mahasiswa Kini Lebih Cepat',
      topic: 'Layanan Teknologi Kampus',
      tone: 'Formal & Informatif',
      leadParagraph: 'Pusat Teknologi Informasi dan Komunikasi mengumumkan keberhasilan migrasi sistem komputasi awan yang melipatgandakan kapasitas throughput server akademik hingga 300%.',
      quotes: '"Peningkatan kapasitas ini memastikan seluruh mahasiswa dapat memproses registrasi semester secara lancar tanpa hambatan teknis," tegas Kepala Biro Humas.',
      content: 'Langkah strategis ini dilakukan menyusul evaluasi berkala terhadap beban puncak lalu lintas jaringan. Selain peningkatan server, tim teknis juga menyiagakan posko pendampingan teknis 24 jam selama masa registrasi.',
      timestamp: 'Hari ini, 09:30 WIB',
      keywords: ['Infrastruktur IT', 'KRS Mahasiswa', 'Cloud Server'],
    }
  ]);
  const [sentimentHistory, setSentimentHistory] = useState<SentimentResult[]>([]);
  const [activeScenario, setActiveScenarioState] = useState<string>('Umum (Default)');

  const setActiveScenario = (scenario: string) => {
    setActiveScenarioState(scenario);
    if (scenario === 'Krisis Server KRS') {
      setStats([
        { id: 'berita', title: 'Total Berita Dibuat', value: 7, change: '+40%', isPositive: true, iconName: 'FileText' },
        { id: 'isu', title: 'Isu Dipantau', value: 14, change: '+180%', isPositive: false, iconName: 'Radio' },
        { id: 'sentimen', title: 'Analisis Sentimen', value: 28, change: '+133%', isPositive: false, iconName: 'Activity' },
        { id: 'aktivitas', title: 'Aktivitas AI Hari Ini', value: 34, change: '+100%', isPositive: true, iconName: 'Zap' },
      ]);
      setSentiment({ positif: 20, netral: 25, negatif: 55 });
      setTrendData([
        { day: 'Sen', isu: 10, berita: 5 },
        { day: 'Sel', isu: 14, berita: 8 },
        { day: 'Rab', isu: 35, berita: 22 },
        { day: 'Kam', isu: 48, berita: 31 },
        { day: 'Jum', isu: 40, berita: 28 },
        { day: 'Sab', isu: 22, berita: 18 },
        { day: 'Min', isu: 15, berita: 12 },
      ]);
    } else if (scenario === 'Peluncuran Beasiswa Prestasi') {
      setStats([
        { id: 'berita', title: 'Total Berita Dibuat', value: 8, change: '+60%', isPositive: true, iconName: 'FileText' },
        { id: 'isu', title: 'Isu Dipantau', value: 6, change: '+20%', isPositive: true, iconName: 'Radio' },
        { id: 'sentimen', title: 'Analisis Sentimen', value: 19, change: '+58%', isPositive: true, iconName: 'Activity' },
        { id: 'aktivitas', title: 'Aktivitas AI Hari Ini', value: 24, change: '+41%', isPositive: true, iconName: 'Zap' },
      ]);
      setSentiment({ positif: 70, netral: 22, negatif: 8 });
      setTrendData([
        { day: 'Sen', isu: 8, berita: 6 },
        { day: 'Sel', isu: 12, berita: 10 },
        { day: 'Rab', isu: 20, berita: 18 },
        { day: 'Kam', isu: 28, berita: 24 },
        { day: 'Jum', isu: 30, berita: 26 },
        { day: 'Sab', isu: 18, berita: 15 },
        { day: 'Min', isu: 10, berita: 8 },
      ]);
    } else {
      setStats(INITIAL_STATS);
      setSentiment(INITIAL_SENTIMENT);
      setTrendData(INITIAL_TREND_DATA);
    }
  };

  const addArticle = (art: Omit<GeneratedArticle, 'id' | 'timestamp'>) => {
    const newArt: GeneratedArticle = {
      ...art,
      id: `art-${Date.now()}`,
      timestamp: 'Baru saja',
    };
    setArticles([newArt, ...articles]);
    setStats((prev) =>
      prev.map((s) => (s.id === 'berita' ? { ...s, value: s.value + 1 } : s.id === 'aktivitas' ? { ...s, value: s.value + 1 } : s))
    );
  };

  const analyzeText = (text: string): SentimentResult => {
    const lower = text.toLowerCase();
    const posWords = ['bagus', 'keren', 'terima kasih', 'cepat', 'lancar', 'puas', 'mantap', 'bermanfaat', 'apresiasi', 'sukses', 'solutif', 'transparan'];
    const negWords = ['lambat', 'kecewa', 'down', 'eror', 'rusak', 'sulit', 'mahal', 'buruk', 'parah', 'bingung', 'tidak jelas', 'gagal', 'keluhan'];

    const foundPos = posWords.filter((w) => lower.includes(w));
    const foundNeg = negWords.filter((w) => lower.includes(w));

    let polarity: 'positif' | 'netral' | 'negatif' = 'netral';
    let score = 50;
    let dominantEmotion = 'Netral & Objektif';
    let recommendation = 'Pertahankan penyampaian informasi yang berimbang dan pantau respon lanjutan publik.';

    if (foundPos.length > foundNeg.length) {
      polarity = 'positif';
      score = Math.min(95, 60 + foundPos.length * 12);
      dominantEmotion = 'Apresiasi & Kepuasan Publik';
      recommendation = 'Jadikan sentimen positif ini sebagai materi penguatan reputasi di kanal publikasi resmi.';
    } else if (foundNeg.length > foundPos.length) {
      polarity = 'negatif';
      score = Math.max(10, 40 - foundNeg.length * 10);
      dominantEmotion = 'Kekhawatiran / Kekecewaan';
      recommendation = 'Segera siapkan tanggapan resmi (Holding Statement) dan mitigasi kendala teknis dalam 60 menit.';
    }

    const result: SentimentResult = {
      id: `sent-${Date.now()}`,
      inputText: text,
      polarity,
      score,
      dominantEmotion,
      positiveKeywords: foundPos.length > 0 ? foundPos : ['informatif', 'terkait'],
      negativeKeywords: foundNeg.length > 0 ? foundNeg : [],
      recommendation,
      timestamp: 'Baru saja',
    };

    setSentimentHistory([result, ...sentimentHistory]);
    setStats((prev) =>
      prev.map((s) => (s.id === 'sentimen' ? { ...s, value: s.value + 1 } : s.id === 'aktivitas' ? { ...s, value: s.value + 1 } : s))
    );

    return result;
  };

  const addSocialPost = (post: Omit<SocialListeningPost, 'id' | 'timestamp'>) => {
    const newPost: SocialListeningPost = {
      ...post,
      id: `post-${Date.now()}`,
      timestamp: 'Baru saja',
    };
    setSocialPosts([newPost, ...socialPosts]);
    setStats((prev) =>
      prev.map((s) => (s.id === 'isu' ? { ...s, value: s.value + 1 } : s))
    );
  };

  const resetSimulation = () => {
    setActiveScenarioState('Umum (Default)');
    setStats(INITIAL_STATS);
    setTrendData(INITIAL_TREND_DATA);
    setSentiment(INITIAL_SENTIMENT);
    setSocialPosts(SIMULATED_SOCIAL_FEED);
    setSentimentHistory([]);
  };

  return (
    <DigismartContext.Provider
      value={{
        stats,
        trendData,
        sentiment,
        socialPosts,
        trendingKeywords,
        articles,
        sentimentHistory,
        activeScenario,
        setActiveScenario,
        addArticle,
        analyzeText,
        addSocialPost,
        resetSimulation,
      }}
    >
      {children}
    </DigismartContext.Provider>
  );
}

export function useDigismart() {
  const context = useContext(DigismartContext);
  if (!context) {
    throw new Error('useDigismart must be used within a DigismartProvider');
  }
  return context;
}
