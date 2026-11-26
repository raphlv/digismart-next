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

export interface MonitoredIssue {
  id: string;
  title: string;
  description: string;
  platform: 'TikTok' | 'Instagram' | 'Twitter/X' | 'Youtube' | 'Portal Berita';
  mentions: number;
  severity: 'aman' | 'waspada' | 'krisis';
  timestamp: string;
  hashtag?: string;
}

export interface MediaArticle {
  id: string;
  title: string;
  media: string;
  topic: string;
  timestamp: string;
  sentiment: 'positif' | 'netral' | 'negatif';
  score?: number;
  dominantEmotion?: string;
  positiveKeywords?: string[];
  negativeKeywords?: string[];
  summary: string;
  url?: string;
  sourceMode?: 'live-rss' | 'ai-synthesized' | 'structured-reference';
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  date: string;
  author: string;
}

// FRESH ZERO INITIAL DATA FOR REAL-TIME TESTING
export const INITIAL_STATS: StatItem[] = [
  {
    id: 'berita',
    title: 'Total Berita Dibuat',
    value: 0,
    change: '0%',
    isPositive: true,
    iconName: 'FileText',
  },
  {
    id: 'isu',
    title: 'Isu Dipantau',
    value: 0,
    change: '0%',
    isPositive: true,
    iconName: 'Radio',
  },
  {
    id: 'sentimen',
    title: 'Analisis Sentimen',
    value: 0,
    change: '0%',
    isPositive: true,
    iconName: 'Activity',
  },
  {
    id: 'aktivitas',
    title: 'Aktivitas AI Hari Ini',
    value: 0,
    change: '0%',
    isPositive: true,
    iconName: 'Zap',
  },
];

export const INITIAL_TREND_DATA: IssueTrendPoint[] = [
  { day: 'Sen', isu: 0, berita: 0 },
  { day: 'Sel', isu: 0, berita: 0 },
  { day: 'Rab', isu: 0, berita: 0 },
  { day: 'Kam', isu: 0, berita: 0 },
  { day: 'Jum', isu: 0, berita: 0 },
  { day: 'Sab', isu: 0, berita: 0 },
  { day: 'Min', isu: 0, berita: 0 },
];

export const INITIAL_SENTIMENT: SentimentBreakdown = {
  positif: 0,
  netral: 0,
  negatif: 0,
};

// EMPTY ARRAYS FOR FRESH TESTING
export const INITIAL_ISSUES: MonitoredIssue[] = [];

export const TOP_MEDIA_LIST = [
  'Kompas.com',
  'Detik.com',
  'Tribunnews.com',
  'CNN Indonesia',
  'Liputan6.com',
  'CNBC Indonesia',
  'Okezone.com',
  'Republika.co.id',
  'Antara News',
  'Tempo.co',
];

export const TOPIC_LIST = [
  'Politik & Pemerintahan',
  'Ekonomi & Bisnis',
  'Hukum & Kriminal',
  'Sosial & Budaya',
  'Teknologi',
  'Kesehatan',
  'Pendidikan',
  'Lingkungan Hidup',
];

export const MOCK_MEDIA_ARTICLES: MediaArticle[] = [];

export const INITIAL_KNOWLEDGE_DOCS: KnowledgeDocument[] = [];
