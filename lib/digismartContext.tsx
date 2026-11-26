'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StatItem,
  INITIAL_STATS,
  INITIAL_TREND_DATA,
  INITIAL_SENTIMENT,
  INITIAL_ISSUES,
  MOCK_MEDIA_ARTICLES,
  INITIAL_KNOWLEDGE_DOCS,
  IssueTrendPoint,
  SentimentBreakdown,
  MonitoredIssue,
  MediaArticle,
  KnowledgeDocument,
} from './digismartData';
import {
  analyzeSentimentLexicon,
  TenMediaSummary,
  summarizeTenMedia,
} from './sentimentEngine';

export interface GeneratedArticle {
  id: string;
  title: string;
  topic: string;
  outputType: string;
  content: string;
  leadParagraph?: string;
  quotes?: string;
  keywords?: string[];
  instansi?: string;
  lokasi?: string;
  narasumber?: string;
  timestamp: string;
}

export interface SentimentResult {
  id: string;
  inputText: string;
  polarity: 'positif' | 'netral' | 'negatif';
  score: number; // 0-100%
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
  issues: MonitoredIssue[];
  articles: GeneratedArticle[];
  mediaArticles: MediaArticle[];
  mediaSummary: TenMediaSummary | null;
  knowledgeDocs: KnowledgeDocument[];
  sentimentHistory: SentimentResult[];
  trendingKeywords: { keyword: string; count: string; sentiment: string }[];
  darkMode: boolean;
  toggleDarkMode: () => void;
  resetAllData: () => void;
  addIssue: (issue: Omit<MonitoredIssue, 'id' | 'timestamp'>) => void;
  deleteIssue: (id: string) => void;
  addArticle: (article: Omit<GeneratedArticle, 'id' | 'timestamp'>) => void;
  addKnowledgeDoc: (doc: Omit<KnowledgeDocument, 'id' | 'date'>) => void;
  addMediaArticle: (art: Omit<MediaArticle, 'id' | 'timestamp'>) => void;
  recordTenMediaMonitoring: (articles: MediaArticle[], summary: TenMediaSummary) => void;
  analyzeText: (text: string) => SentimentResult;
}

const DigismartContext = createContext<DigismartContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STATS: 'digismart_v3_fresh_stats',
  TREND: 'digismart_v3_fresh_trend',
  SENTIMENT: 'digismart_v3_fresh_sentiment',
  ISSUES: 'digismart_v3_fresh_issues',
  DOCS: 'digismart_v3_fresh_docs',
  ARTICLES: 'digismart_v3_fresh_articles',
  MEDIA: 'digismart_v3_fresh_media',
  MEDIA_SUMMARY: 'digismart_v3_fresh_media_summary',
  THEME: 'digismart_v3_fresh_theme',
};

export function DigismartProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<StatItem[]>(INITIAL_STATS);
  const [trendData, setTrendData] = useState<IssueTrendPoint[]>(INITIAL_TREND_DATA);
  const [sentiment, setSentiment] = useState<SentimentBreakdown>(INITIAL_SENTIMENT);
  const [issues, setIssues] = useState<MonitoredIssue[]>(INITIAL_ISSUES);
  const [articles, setArticles] = useState<GeneratedArticle[]>([]);
  const [mediaArticles, setMediaArticles] = useState<MediaArticle[]>(MOCK_MEDIA_ARTICLES);
  const [mediaSummary, setMediaSummary] = useState<TenMediaSummary | null>(null);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>(INITIAL_KNOWLEDGE_DOCS);
  const [sentimentHistory, setSentimentHistory] = useState<SentimentResult[]>([]);
  const [trendingKeywords, setTrendingKeywords] = useState<
    { keyword: string; count: string; sentiment: string }[]
  >([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('digismart_stats_v2');
        localStorage.removeItem('digismart_issues_v2');
        localStorage.removeItem('digismart_docs_v2');
        localStorage.removeItem('digismart_articles_v2');

        const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
        if (storedTheme === 'dark') {
          setDarkMode(true);
          document.documentElement.classList.add('dark');
        } else {
          setDarkMode(false);
          document.documentElement.classList.remove('dark');
        }

        const storedStats = localStorage.getItem(STORAGE_KEYS.STATS);
        if (storedStats) {
          const parsed = JSON.parse(storedStats);
          if (Array.isArray(parsed)) setStats(parsed);
        }

        const storedTrend = localStorage.getItem(STORAGE_KEYS.TREND);
        if (storedTrend) {
          const parsed = JSON.parse(storedTrend);
          if (Array.isArray(parsed)) setTrendData(parsed);
        }

        const storedSentiment = localStorage.getItem(STORAGE_KEYS.SENTIMENT);
        if (storedSentiment) {
          const parsed = JSON.parse(storedSentiment);
          if (parsed && typeof parsed.positif === 'number') setSentiment(parsed);
        }

        const storedIssues = localStorage.getItem(STORAGE_KEYS.ISSUES);
        if (storedIssues) {
          const parsed = JSON.parse(storedIssues);
          if (Array.isArray(parsed)) setIssues(parsed);
        }

        const storedDocs = localStorage.getItem(STORAGE_KEYS.DOCS);
        if (storedDocs) {
          const parsed = JSON.parse(storedDocs);
          if (Array.isArray(parsed)) setKnowledgeDocs(parsed);
        }

        const storedArticles = localStorage.getItem(STORAGE_KEYS.ARTICLES);
        if (storedArticles) {
          const parsed = JSON.parse(storedArticles);
          if (Array.isArray(parsed)) setArticles(parsed);
        }

        const storedMedia = localStorage.getItem(STORAGE_KEYS.MEDIA);
        if (storedMedia) {
          const parsed = JSON.parse(storedMedia);
          if (Array.isArray(parsed)) {
            setMediaArticles(parsed);
            const storedSum = localStorage.getItem(STORAGE_KEYS.MEDIA_SUMMARY);
            if (storedSum) {
              setMediaSummary(JSON.parse(storedSum));
            } else if (parsed.length > 0) {
              setMediaSummary(summarizeTenMedia(parsed, parsed[0].topic || 'Publik', parsed[0].topic || 'Publik'));
            }
          }
        }
      }
    } catch (e) {
      console.warn('Storage reading error:', e);
    }
  }, []);

  const resetAllData = () => {
    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach((k) => {
        if (k !== STORAGE_KEYS.THEME) localStorage.removeItem(k);
      });
    }
    setStats(INITIAL_STATS);
    setTrendData(INITIAL_TREND_DATA);
    setSentiment(INITIAL_SENTIMENT);
    setIssues([]);
    setArticles([]);
    setMediaArticles([]);
    setMediaSummary(null);
    setKnowledgeDocs([]);
    setSentimentHistory([]);
    setTrendingKeywords([]);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        if (next) {
          document.documentElement.classList.add('dark');
          localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem(STORAGE_KEYS.THEME, 'light');
        }
      }
      return next;
    });
  };

  const getTodayDayName = () => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return days[new Date().getDay()];
  };

  const addIssue = (item: Omit<MonitoredIssue, 'id' | 'timestamp'>) => {
    const newIssue: MonitoredIssue = {
      ...item,
      id: `issue-${Date.now()}`,
      timestamp: 'Baru saja',
    };
    setIssues((prev) => {
      const updated = [newIssue, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(updated));
      }
      return updated;
    });

    setStats((prev) => {
      const updated = prev.map((s) => {
        if (s.id === 'isu' || s.id === 'aktivitas') {
          const newVal = s.value + 1;
          return { ...s, value: newVal, change: `+${newVal}` };
        }
        return s;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
      }
      return updated;
    });

    const today = getTodayDayName();
    setTrendData((prev) => {
      const updated = prev.map((pt) =>
        pt.day === today ? { ...pt, isu: pt.isu + 1 } : pt
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.TREND, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteIssue = (id: string) => {
    setIssues((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(updated));
      }
      return updated;
    });
    setStats((prev) => {
      const updated = prev.map((s) =>
        s.id === 'isu' ? { ...s, value: Math.max(0, s.value - 1) } : s
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const addArticle = (art: Omit<GeneratedArticle, 'id' | 'timestamp'>) => {
    const newArt: GeneratedArticle = {
      ...art,
      id: `art-${Date.now()}`,
      timestamp: 'Baru saja',
    };
    setArticles((prev) => {
      const updated = [newArt, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(updated));
      }
      return updated;
    });

    setStats((prev) => {
      const updated = prev.map((s) => {
        if (s.id === 'berita' || s.id === 'aktivitas') {
          const newVal = s.value + 1;
          return { ...s, value: newVal, change: `+${newVal}` };
        }
        return s;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
      }
      return updated;
    });

    const today = getTodayDayName();
    setTrendData((prev) => {
      const updated = prev.map((pt) =>
        pt.day === today ? { ...pt, berita: pt.berita + 1 } : pt
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.TREND, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const addKnowledgeDoc = (doc: Omit<KnowledgeDocument, 'id' | 'date'>) => {
    const newDoc: KnowledgeDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      date: 'Hari ini',
    };
    setKnowledgeDocs((prev) => {
      const updated = [newDoc, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(updated));
      }
      return updated;
    });

    setStats((prev) => {
      const updated = prev.map((s) =>
        s.id === 'aktivitas' ? { ...s, value: s.value + 1, change: `+${s.value + 1}` } : s
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const addMediaArticle = (art: Omit<MediaArticle, 'id' | 'timestamp'>) => {
    const newArt: MediaArticle = {
      ...art,
      id: `med-${Date.now()}`,
      timestamp: 'Baru saja',
    };
    setMediaArticles((prev) => {
      const updated = [newArt, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const recordTenMediaMonitoring = (
    monitoredArticles: MediaArticle[],
    summary: TenMediaSummary
  ) => {
    setMediaArticles(monitoredArticles);
    setMediaSummary(summary);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(monitoredArticles));
      localStorage.setItem(STORAGE_KEYS.MEDIA_SUMMARY, JSON.stringify(summary));
    }

    const posKw = summary.topPositiveKeywords.map((kw) => ({
      keyword: kw,
      count: `${summary.positifCount} media`,
      sentiment: 'positif',
    }));
    const negKw = summary.topNegativeKeywords.map((kw) => ({
      keyword: kw,
      count: `${summary.negatifCount} media`,
      sentiment: 'negatif',
    }));
    setTrendingKeywords([...posKw, ...negKw].slice(0, 8));

    setSentiment((prev) => {
      const updated = {
        positif: prev.positif + summary.positifCount,
        netral: prev.netral + summary.netralCount,
        negatif: prev.negatif + summary.negatifCount,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SENTIMENT, JSON.stringify(updated));
      }
      return updated;
    });

    setStats((prev) => {
      const updated = prev.map((s) => {
        if (s.id === 'sentimen') {
          const newVal = s.value + monitoredArticles.length;
          return { ...s, value: newVal, change: `+${newVal}` };
        }
        if (s.id === 'aktivitas') {
          const newVal = s.value + 1;
          return { ...s, value: newVal, change: `+${newVal}` };
        }
        return s;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const analyzeText = (text: string): SentimentResult => {
    const analysis = analyzeSentimentLexicon(text);

    const result: SentimentResult = {
      id: `sent-${Date.now()}`,
      inputText: text,
      polarity: analysis.polarity,
      score: analysis.score,
      dominantEmotion: analysis.dominantEmotion,
      positiveKeywords: analysis.positiveKeywords,
      negativeKeywords: analysis.negativeKeywords,
      recommendation: analysis.recommendation,
      timestamp: 'Baru saja',
    };

    setSentimentHistory((prev) => [result, ...prev]);

    setSentiment((prev) => {
      const updated = {
        ...prev,
        [analysis.polarity]: prev[analysis.polarity] + 1,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SENTIMENT, JSON.stringify(updated));
      }
      return updated;
    });

    setStats((prev) => {
      const updated = prev.map((s) => {
        if (s.id === 'sentimen' || s.id === 'aktivitas') {
          const newVal = s.value + 1;
          return { ...s, value: newVal, change: `+${newVal}` };
        }
        return s;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
      }
      return updated;
    });

    return result;
  };

  return (
    <DigismartContext.Provider
      value={{
        stats,
        trendData,
        sentiment,
        issues,
        articles,
        mediaArticles,
        mediaSummary,
        knowledgeDocs,
        sentimentHistory,
        trendingKeywords,
        darkMode,
        toggleDarkMode,
        resetAllData,
        addIssue,
        deleteIssue,
        addArticle,
        addKnowledgeDoc,
        addMediaArticle,
        recordTenMediaMonitoring,
        analyzeText,
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
