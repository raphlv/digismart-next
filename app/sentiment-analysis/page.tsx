'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useDigismart } from '@/lib/digismartContext';
import {
  TOP_MEDIA_LIST,
  TOPIC_LIST,
  MediaArticle,
} from '@/lib/digismartData';
import {
  generateTenMediaSentimentReferences,
  summarizeTenMedia,
  TenMediaSummary,
} from '@/lib/sentimentEngine';
import {
  exportMediaSentimentToDocx,
  exportMediaSentimentToPdf,
  exportManualSentimentToDocx,
  exportManualSentimentToPdf,
} from '@/lib/exportUtils';
import {
  BarChart2,
  Globe,
  RefreshCw,
  Smile,
  Meh,
  Frown,
  Copy,
  Check,
  ExternalLink,
  Lightbulb,
  Search,
  Zap,
  BookOpen,
  FileDown,
  FileText,
  Newspaper,
} from 'lucide-react';

export default function SentimentAnalysisPage() {
  const router = useRouter();
  const {
    analyzeText,
    mediaArticles,
    mediaSummary,
    recordTenMediaMonitoring,
    addKnowledgeDoc,
  } = useDigismart();

  const [activeTab, setActiveTab] = useState<'media' | 'manual'>('media');

  // Media Monitoring Tab State
  const [selectedTopic, setSelectedTopic] = useState(TOPIC_LIST[0]);
  const [customQuery, setCustomQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState('Semua Media (Top 10)');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positif' | 'netral' | 'negatif'>('all');
  const [mediaSearchQuery, setMediaSearchQuery] = useState('');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [hasMonitored, setHasMonitored] = useState(false);
  const [monitoredResults, setMonitoredResults] = useState<MediaArticle[]>([]);
  const [currentSummary, setCurrentSummary] = useState<TenMediaSummary | null>(null);
  const [engineLabel, setEngineLabel] = useState('');

  // Manual Analysis Tab State
  const [manualText, setManualText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [manualResult, setManualResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [savedToKb, setSavedToKb] = useState(false);

  // Restore saved 10-media results from context if already run
  useEffect(() => {
    if (mediaArticles.length > 0 && monitoredResults.length === 0) {
      setMonitoredResults(mediaArticles);
      setCurrentSummary(
        mediaSummary ||
          summarizeTenMedia(
            mediaArticles,
            mediaArticles[0].topic || TOPIC_LIST[0],
            mediaArticles[0].topic || TOPIC_LIST[0]
          )
      );
      setHasMonitored(true);
    }
  }, [mediaArticles, mediaSummary, monitoredResults.length]);

  const handleStartMonitoring = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsMonitoring(true);

    try {
      const { articles, summary, engineUsed } = await generateTenMediaSentimentReferences({
        topic: selectedTopic,
        customQuery,
        selectedMedia,
      });

      setMonitoredResults(articles);
      setCurrentSummary(summary);
      setEngineLabel(engineUsed);
      setHasMonitored(true);
      setSentimentFilter('all');
      recordTenMediaMonitoring(articles, summary);
    } catch (err) {
      console.error('Monitoring error:', err);
    } finally {
      setIsMonitoring(false);
    }
  };

  const filteredMediaArticles = monitoredResults.filter((art) => {
    if (sentimentFilter !== 'all' && art.sentiment !== sentimentFilter) {
      return false;
    }
    if (mediaSearchQuery.trim()) {
      const q = mediaSearchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.media.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleManualAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeText(manualText);
      setManualResult(res);
      setSavedToKb(false);
      setIsAnalyzing(false);
    }, 350);
  };

  const copyResult = (res: any) => {
    const text = `HASIL ANALISIS SENTIMEN\nTeks: "${res.inputText}"\nSentimen: ${res.polarity.toUpperCase()} (${res.score}%)\nEmosi Dominan: ${res.dominantEmotion}\nRekomendasi Tindakan: ${res.recommendation}\n---\nDIGISMART AI Sentiment Engine`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAnalysisToKb = (res: any) => {
    addKnowledgeDoc({
      title: `Analisis Sentimen: ${res.polarity.toUpperCase()} (${res.dominantEmotion})`,
      category: 'Protokol Krisis',
      summary: `Hasil analisis sentimen (${res.score}%) atas cuplikan teks opini publik: "${res.inputText.substring(0, 50)}..."`,
      content: `Kutipan Teks:\n"${res.inputText}"\n\nPolaritas: ${res.polarity.toUpperCase()} (${res.score}%)\nEmosi Dominan: ${res.dominantEmotion}\n\nKata Kunci Terdeteksi:\n+ Positif: ${res.positiveKeywords?.join(', ') || '-'}\n- Negatif: ${res.negativeKeywords?.join(', ') || '-'}\n\nRekomendasi Tindakan:\n${res.recommendation}`,
      author: 'AI Sentiment Analyzer',
    });
    setSavedToKb(true);
    setTimeout(() => setSavedToKb(false), 2500);
  };

  const handleGoToQuickResponse = (text: string) => {
    router.push(`/quick-response/?issue=${encodeURIComponent(text)}`);
  };

  const handleUseInNewsGenerator = () => {
    const topicParam = customQuery.trim() || selectedTopic;
    router.push(`/news-generator/?from=sentiment&topic=${encodeURIComponent(topicParam)}`);
  };

  const activeSummary =
    currentSummary ||
    (monitoredResults.length > 0
      ? summarizeTenMedia(monitoredResults, selectedTopic, customQuery.trim() || selectedTopic)
      : null);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#060913] flex flex-col lg:flex-row transition-colors">
      <Sidebar />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header
          title="AI Sentiment Analysis"
          subtitle="Monitoring sentimen berbasis referensi 10 media nasional & analisis NLP"
          icon={BarChart2}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* 2 Navigation Tabs */}
          <div className="flex items-center gap-2 no-print">
            <button
              onClick={() => setActiveTab('media')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'media'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/90 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Media Monitoring (10 Media)</span>
            </button>

            <button
              onClick={() => setActiveTab('manual')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'manual'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/90 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Analisis Manual</span>
            </button>
          </div>

          {/* TAB 1: MEDIA MONITORING */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Controls Card */}
              <form
                onSubmit={handleStartMonitoring}
                className="bg-white dark:bg-[#0B1120] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 no-print"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                  {/* Topik Dropdown */}
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Kategori Topik
                    </label>
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                    >
                      {TOPIC_LIST.map((topik) => (
                        <option key={topik} value={topik}>
                          {topik}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Isu / Kata Kunci Spesifik */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Kata Kunci / Isu Spesifik (Opsional)
                    </label>
                    <input
                      type="text"
                      value={customQuery}
                      onChange={(e) => setCustomQuery(e.target.value)}
                      placeholder="Contoh: Digitalisasi Layanan Publik..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>

                  {/* Sumber Media Dropdown */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Sumber Media
                    </label>
                    <select
                      value={selectedMedia}
                      onChange={(e) => setSelectedMedia(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                    >
                      <option value="Semua Media (Top 10)">Semua Media (Top 10)</option>
                      {TOP_MEDIA_LIST.map((med) => (
                        <option key={med} value={med}>
                          {med}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Button Monitoring Sekarang */}
                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      disabled={isMonitoring}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 active:scale-98 transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isMonitoring ? 'animate-spin' : ''}`} />
                      <span>{isMonitoring ? 'Memantau 10 Media...' : 'Analisis 10 Media'}</span>
                    </button>
                  </div>
                </div>

                {/* Media Badges List */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span
                    onClick={() => setSelectedMedia('Semua Media (Top 10)')}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
                      selectedMedia === 'Semua Media (Top 10)'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    Semua 10 Media
                  </span>
                  {TOP_MEDIA_LIST.map((med) => (
                    <span
                      key={med}
                      onClick={() => setSelectedMedia(med)}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
                        selectedMedia === med
                          ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700'
                          : 'bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {med}
                    </span>
                  ))}
                </div>
              </form>

              {/* Aggregate Summary + Export Bar */}
              {hasMonitored && activeSummary && (
                <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="text-sm sm:text-base font-display font-bold text-slate-900 dark:text-white">
                        Rekap Sentimen {activeSummary.totalMedia} Media: <span className="text-blue-600">{activeSummary.query}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {engineLabel || 'NLP Lexicon 10 Media Engine'} • {activeSummary.liveCount}/{activeSummary.totalMedia} Live RSS • Skor Rata-rata {activeSummary.averageScore}% ({activeSummary.overallPolarity.toUpperCase()})
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 no-print">
                      <button
                        type="button"
                        onClick={() => exportMediaSentimentToDocx(monitoredResults, activeSummary)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-blue-200/70 dark:border-blue-800"
                        title="Tarik Laporan Word (.docx)"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Tarik Word (.docx)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => exportMediaSentimentToPdf(monitoredResults, activeSummary)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-rose-200/70 dark:border-rose-800"
                        title="Tarik Laporan PDF (.pdf)"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Tarik PDF (.pdf)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleUseInNewsGenerator}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Newspaper className="w-3.5 h-3.5" />
                        <span>Generate Berita dari 10 Media ➜</span>
                      </button>
                    </div>
                  </div>

                  {/* Distribution Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50 flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Positif</span>
                      <span className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-300">
                        {activeSummary.positifCount} Media ({activeSummary.positifPct}%)
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50 flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Netral</span>
                      <span className="text-sm font-bold font-mono text-blue-700 dark:text-blue-300">
                        {activeSummary.netralCount} Media ({activeSummary.netralPct}%)
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50 flex items-center justify-between">
                      <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">Negatif</span>
                      <span className="text-sm font-bold font-mono text-rose-700 dark:text-rose-300">
                        {activeSummary.negatifCount} Media ({activeSummary.negatifPct}%)
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <strong>Rekomendasi Strategi Humas:</strong> {activeSummary.strategicRecommendation}
                    </p>
                  </div>
                </div>
              )}

              {/* Filter & Search Bar for Articles */}
              <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={mediaSearchQuery}
                    onChange={(e) => setMediaSearchQuery(e.target.value)}
                    placeholder="Cari dalam referensi 10 media..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
                  <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Sentimen:</span>
                  {(['all', 'positif', 'netral', 'negatif'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setSentimentFilter(f)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        sentimentFilter === f
                          ? f === 'positif'
                            ? 'bg-emerald-600 text-white'
                            : f === 'negatif'
                            ? 'bg-rose-600 text-white'
                            : 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {f === 'all' ? 'Semua' : f === 'positif' ? 'Positif' : f === 'netral' ? 'Netral' : 'Negatif'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monitoring Output Area */}
              {hasMonitored ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white">
                      Daftar Pemberitaan Referensi ({filteredMediaArticles.length} Berita)
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">10 National Media Index</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredMediaArticles.map((art) => (
                      <div
                        key={art.id}
                        className="bg-white dark:bg-[#0B1120] rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 font-mono">
                                {art.media}
                              </span>
                              {art.sourceMode === 'live-rss' && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  LIVE RSS
                                </span>
                              )}
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                art.sentiment === 'positif'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                                  : art.sentiment === 'negatif'
                                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                                  : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                              }`}
                            >
                              {art.sentiment} ({art.score ?? 55}%)
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {art.title}
                          </h4>

                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                            {art.summary}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400 font-mono">{art.timestamp}</span>
                          <div className="flex items-center gap-3">
                            {art.url && (
                              <a
                                href={art.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Cek Media</span>
                              </a>
                            )}
                            <button
                              onClick={() => handleGoToQuickResponse(art.title)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700"
                            >
                              <Zap className="w-3 h-3" />
                              <span>Tanggapi Cepat</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-12 border border-slate-200/90 dark:border-slate-800 shadow-sm text-center space-y-2">
                  <Globe className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Siap Memantau 10 Media Nasional
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Pilih topik atau ketik kata kunci isu di atas, lalu klik <strong>&quot;Analisis 10 Media&quot;</strong> untuk menghasilkan data sentimen dari 10 media dan mengekspornya ke Word/PDF.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ANALISIS MANUAL */}
          {activeTab === 'manual' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Card: Input Teks */}
              <div className="lg:col-span-6 bg-white dark:bg-[#0B1120] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 no-print">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white">
                    Teks untuk Analisis Sentimen NLP
                  </h3>
                </div>

                <form onSubmit={handleManualAnalyze} className="space-y-4">
                  <textarea
                    rows={6}
                    required
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    placeholder="Tempel teks berita, komentar media sosial, atau opini publik di sini..."
                    className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all leading-relaxed"
                  />

                  <button
                    type="submit"
                    disabled={isAnalyzing || !manualText.trim()}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-98 transition-all disabled:opacity-50"
                  >
                    <BarChart2 className="w-4 h-4" />
                    <span>{isAnalyzing ? 'Menganalisis...' : 'Analisis Sentimen'}</span>
                  </button>
                </form>
              </div>

              {/* Right Card: Output Analisis */}
              <div className="lg:col-span-6 bg-white dark:bg-[#0B1120] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm min-h-[380px] flex flex-col justify-between">
                {manualResult ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        {manualResult.polarity === 'positif' ? (
                          <Smile className="w-5 h-5 text-emerald-500" />
                        ) : manualResult.polarity === 'negatif' ? (
                          <Frown className="w-5 h-5 text-rose-500" />
                        ) : (
                          <Meh className="w-5 h-5 text-blue-500" />
                        )}
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                            manualResult.polarity === 'positif'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                              : manualResult.polarity === 'negatif'
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                              : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                          }`}
                        >
                          Sentimen {manualResult.polarity} ({manualResult.score}%)
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 no-print">
                        <button
                          onClick={() => exportManualSentimentToDocx(manualResult)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Unduh Word (.docx)"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          <span>Word</span>
                        </button>

                        <button
                          onClick={() => exportManualSentimentToPdf(manualResult)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Unduh PDF (.pdf)"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>

                        <button
                          onClick={() => handleSaveAnalysisToKb(manualResult)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Simpan Hasil ke Knowledge Base"
                        >
                          {savedToKb ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <BookOpen className="w-3.5 h-3.5" />}
                          <span>{savedToKb ? 'Tersimpan' : 'Ke KB'}</span>
                        </button>

                        <button
                          onClick={() => copyResult(manualResult)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Tersalin' : 'Salin'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                        Spektrum Emosi Dominan:
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {manualResult.dominantEmotion}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                        Kata Kunci Terdeteksi:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {manualResult.positiveKeywords?.map((kw: string, i: number) => (
                          <span key={`p-${i}`} className="text-xs px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 font-medium">
                            +{kw}
                          </span>
                        ))}
                        {manualResult.negativeKeywords?.map((kw: string, i: number) => (
                          <span key={`n-${i}`} className="text-xs px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200/60 font-medium">
                            -{kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50/60 dark:bg-blue-950/30 p-3.5 rounded-xl border border-blue-200/60 dark:border-blue-800/40 flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-blue-900 dark:text-blue-300 block mb-0.5">
                          Rekomendasi Tindakan Humas:
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {manualResult.recommendation}
                        </p>
                      </div>
                    </div>

                    {manualResult.polarity === 'negatif' && (
                      <div className="pt-2 no-print">
                        <button
                          onClick={() => handleGoToQuickResponse(manualResult.inputText)}
                          className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 transition-all"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Buat Quick Response Mitigasi Krisis Ini ➜</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center my-auto py-16 text-center text-slate-400 dark:text-slate-500">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-3">
                      <BarChart2 className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-400 dark:text-slate-500">
                      Hasil analisis sentimen akan muncul di sini
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
