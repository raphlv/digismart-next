'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useDigismart } from '@/lib/digismartContext';
import { generateContentWithAI } from '@/lib/aiService';
import { TOPIC_LIST, MediaArticle } from '@/lib/digismartData';
import {
  generateTenMediaSentimentReferences,
  TenMediaSummary,
} from '@/lib/sentimentEngine';
import { exportNewsToDocx, exportNewsToPdf } from '@/lib/exportUtils';
import {
  Newspaper,
  FileText,
  Bot,
  Copy,
  Check,
  Download,
  Printer,
  FileDown,
  RefreshCw,
  Globe,
} from 'lucide-react';

function NewsAndPressReleaseContent() {
  const {
    addArticle,
    mediaArticles,
    mediaSummary,
    recordTenMediaMonitoring,
  } = useDigismart();

  const [activeMode, setActiveMode] = useState<'news' | 'press-release'>('news');

  // News Generator Form State
  const [judulKegiatan, setJudulKegiatan] = useState('');
  const [keyword, setKeyword] = useState('');
  const [instansi, setInstansi] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [narasumber, setNarasumber] = useState('');
  const [jenisOutput, setJenisOutput] = useState('Website');

  // Press Release Form State
  const [agenda, setAgenda] = useState('');
  const [hasilKegiatan, setHasilKegiatan] = useState('');
  const [formatRilis, setFormatRilis] = useState('Media Online');

  // 10-Media Reference State
  const [selectedRefTopic, setSelectedRefTopic] = useState(TOPIC_LIST[0]);
  const [activeRefs, setActiveRefs] = useState<MediaArticle[]>([]);
  const [activeRefSummary, setActiveRefSummary] = useState<TenMediaSummary | null>(null);
  const [isPullingRefs, setIsPullingRefs] = useState(false);

  // Generation & Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Load URL query params & existing 10-media references from context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode') || params.get('tab');
      if (modeParam === 'press-release') {
        setActiveMode('press-release');
      }

      const topicParam = params.get('topic');
      if (topicParam && !judulKegiatan) {
        setJudulKegiatan(topicParam);
      }

      const issueParam = params.get('issue');
      if (issueParam) {
        setJudulKegiatan(issueParam);
        setInstansi('Kementerian Komunikasi dan Digital');
        setLokasi('Jakarta');
        setNarasumber('Juru Bicara Komunikasi Publik');
        setAgenda(
          `Penjelasan terbuka dan mitigasi strategis menanggapi atensi publik terkait ${issueParam}.`
        );
      }
    }
  }, []);

  useEffect(() => {
    if (mediaArticles.length > 0 && activeRefs.length === 0) {
      setActiveRefs(mediaArticles);
      setActiveRefSummary(mediaSummary);
    }
  }, [mediaArticles, mediaSummary, activeRefs.length]);

  const handlePullTenMediaRefs = async () => {
    setIsPullingRefs(true);
    try {
      const { articles, summary } = await generateTenMediaSentimentReferences({
        topic: selectedRefTopic,
        customQuery: judulKegiatan.trim() || keyword.trim() || selectedRefTopic,
        selectedMedia: 'Semua Media (Top 10)',
      });
      setActiveRefs(articles);
      setActiveRefSummary(summary);
      recordTenMediaMonitoring(articles, summary);
      return { articles, summary };
    } finally {
      setIsPullingRefs(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulKegiatan.trim()) return;

    setIsGenerating(true);

    try {
      // Ensure generation is ALWAYS grounded on 10-media sentiment references
      let refsToUse = activeRefs;
      let summaryToUse = activeRefSummary;
      if (refsToUse.length < 10) {
        const pulled = await handlePullTenMediaRefs();
        refsToUse = pulled.articles;
        summaryToUse = pulled.summary;
      }

      const aiResponse = await generateContentWithAI({
        mode: activeMode,
        judul: judulKegiatan.trim(),
        keyword: keyword.trim(),
        instansi: instansi.trim() || 'Pemerintah Republik Indonesia',
        lokasi: lokasi.trim() || 'Jakarta',
        narasumber: narasumber.trim() || 'Pimpinan Tinggi Institusi',
        jenisOutput,
        agenda: agenda.trim(),
        hasil: hasilKegiatan.trim(),
        format: formatRilis,
        mediaReferences: refsToUse,
        sentimentSummary: summaryToUse,
      });

      const fullResult = {
        title: aiResponse.title,
        content: aiResponse.content,
        provider: aiResponse.provider,
        mode: activeMode,
        outputType: activeMode === 'news' ? jenisOutput : formatRilis,
        instansi: instansi.trim() || 'Pemerintah RI',
        lokasi: lokasi.trim() || 'Jakarta',
        narasumber: narasumber.trim() || 'Pimpinan Institusi',
        references: refsToUse,
        sentimentSummary: summaryToUse,
        timestamp: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setResult(fullResult);

      addArticle({
        title: fullResult.title,
        topic: judulKegiatan.trim(),
        outputType: fullResult.outputType,
        content: fullResult.content,
        instansi: fullResult.instansi,
        lokasi: fullResult.lokasi,
        narasumber: fullResult.narasumber,
        keywords: keyword.trim()
          ? keyword.split(',').map((k) => k.trim())
          : ['Publikasi Resmi', '10 Media'],
      });
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(`${result.title}\n\n${result.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsTxt = () => {
    if (!result) return;
    const refsText = (result.references || [])
      .map(
        (m: MediaArticle, idx: number) =>
          `${idx + 1}. ${m.media} [${m.sentiment.toUpperCase()} ${m.score ?? 55}%] - ${m.title}`
      )
      .join('\n');
    const fullText = `${result.title}\n${'='.repeat(result.title.length)}\nKategori: ${
      result.mode === 'news' ? 'Berita Publik' : 'Siaran Pers Resmi'
    }\nFormat: ${result.outputType}\nInstansi: ${result.instansi}\nLokasi: ${result.lokasi}\n\n${
      result.content
    }\n\nREFERENSI 10 MEDIA:\n${refsText}\n\n---\nDigenerate via DIGISMART AI Command Center`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.mode}-${result.outputType.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const downloadAsWord = async () => {
    if (!result) return;
    await exportNewsToDocx(result, result.references || [], result.sentimentSummary);
  };

  const downloadAsPdf = () => {
    if (!result) return;
    exportNewsToPdf(result, result.references || [], result.sentimentSummary);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#060913] flex flex-col lg:flex-row transition-colors">
      <Sidebar />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header
          title="AI News & Press Release Suite"
          subtitle="Penulisan berita & siaran pers AI berbasis referensi 10 media (analisis sentimen)"
          icon={Newspaper}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Segmented Mode Switcher */}
          <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-2 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-start no-print">
            <div className="grid grid-cols-2 gap-1.5 w-full sm:w-auto p-1 bg-slate-100 dark:bg-slate-900/80 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveMode('news')}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  activeMode === 'news'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Newspaper className="w-4 h-4" />
                <span>AI News Generator</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('press-release')}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  activeMode === 'press-release'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>AI Press Release Builder</span>
              </button>
            </div>
          </div>

          {/* Form & Output Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Card: Input Form */}
            <div className="lg:col-span-6 bg-white dark:bg-[#0B1120] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 no-print">
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-sm sm:text-base font-display font-bold text-slate-900 dark:text-white">
                    {activeMode === 'news'
                      ? 'Parameter Berita Publik'
                      : 'Parameter Siaran Pers Resmi'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeMode === 'news'
                      ? 'Format 5W+1H berbasis referensi 10 media nasional.'
                      : 'Format siaran pers baku instansi berbasis analisis sentimen.'}
                  </p>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase">
                  {activeMode === 'news' ? 'Mode Berita' : 'Mode Rilis'}
                </span>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {activeMode === 'news'
                      ? 'Judul Kegiatan / Topik'
                      : 'Nama Agenda / Peristiwa'}{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={judulKegiatan}
                    onChange={(e) => setJudulKegiatan(e.target.value)}
                    placeholder={
                      activeMode === 'news'
                        ? 'Contoh: Peresmian Pusat Layanan Digital...'
                        : 'Contoh: Penandatanganan MoU Tata Kelola Data Nasional...'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>

                {activeMode === 'news' ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Kata Kunci (Keywords)
                        </label>
                        <input
                          type="text"
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                          placeholder="inovasi, smart city, efisiensi"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Jenis Output
                        </label>
                        <select
                          value={jenisOutput}
                          onChange={(e) => setJenisOutput(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                        >
                          <option value="Website">Website Portal Resmi</option>
                          <option value="Instagram">Media Sosial (Instagram/FB)</option>
                          <option value="Artikel SEO">Artikel Edukasi SEO</option>
                          <option value="Breaking News">Breaking News / Kilas Cepat</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Instansi
                        </label>
                        <input
                          type="text"
                          value={instansi}
                          onChange={(e) => setInstansi(e.target.value)}
                          placeholder="Diskominfo / Instansi..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Lokasi
                        </label>
                        <input
                          type="text"
                          value={lokasi}
                          onChange={(e) => setLokasi(e.target.value)}
                          placeholder="Jakarta"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Narasumber
                        </label>
                        <input
                          type="text"
                          value={narasumber}
                          onChange={(e) => setNarasumber(e.target.value)}
                          placeholder="Nama & Jabatan..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Pejabat / Narasumber
                        </label>
                        <input
                          type="text"
                          value={narasumber}
                          onChange={(e) => setNarasumber(e.target.value)}
                          placeholder="Nama dan Jabatan Pimpinan..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Format Standar Rilis
                        </label>
                        <select
                          value={formatRilis}
                          onChange={(e) => setFormatRilis(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                        >
                          <option value="Media Online">Media Online Nasional</option>
                          <option value="Media Cetak">Media Cetak & Harian</option>
                          <option value="Broadsheet / Koran">Broadsheet / Koran Utama</option>
                          <option value="Portal Resmi">Portal Resmi Pemerintah</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Rincian Agenda Kegiatan
                      </label>
                      <textarea
                        rows={2}
                        value={agenda}
                        onChange={(e) => setAgenda(e.target.value)}
                        placeholder="Rincian pokok pembahasan, audiensi, atau tujuan acara..."
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Hasil & Dampak Bagi Publik
                      </label>
                      <textarea
                        rows={2}
                        value={hasilKegiatan}
                        onChange={(e) => setHasilKegiatan(e.target.value)}
                        placeholder="Capaian konkret, kesepakatan tindak lanjut, komitmen pelayanan..."
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed"
                      />
                    </div>
                  </>
                )}

                {/* 10-Media Sentiment Reference Selector */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      <span>Referensi 10 Media (Analisis Sentimen)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handlePullTenMediaRefs}
                      disabled={isPullingRefs}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isPullingRefs ? 'animate-spin' : ''}`} />
                      <span>
                        {isPullingRefs
                          ? 'Menarik 10 Media...'
                          : activeRefs.length >= 10
                          ? 'Perbarui 10 Media'
                          : 'Tarik Referensi 10 Media'}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedRefTopic}
                      onChange={(e) => setSelectedRefTopic(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
                    >
                      {TOPIC_LIST.map((t) => (
                        <option key={t} value={t}>
                          Topik Referensi: {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {activeRefs.length > 0 && activeRefSummary ? (
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">
                        Aktif: {activeRefs.length} Media — Sentimen{' '}
                        <span className="text-blue-600 uppercase">
                          {activeRefSummary.overallPolarity}
                        </span>{' '}
                        ({activeRefSummary.averageScore}% | +{activeRefSummary.positifPct}% / ~
                        {activeRefSummary.netralPct}% / -{activeRefSummary.negatifPct}%)
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {activeRefs.map((m) => (
                          <span
                            key={m.id}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                              m.sentiment === 'positif'
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/70'
                                : m.sentiment === 'negatif'
                                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200/70'
                                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200/70'
                            }`}
                          >
                            {m.media}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400">
                      Otomatis menarik analisis sentimen dari 10 media nasional saat generate berita.
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isGenerating || !judulKegiatan.trim()}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-98 transition-all disabled:opacity-50"
                  >
                    <Bot className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>
                      {isGenerating
                        ? 'Menyusun Naskah Berbasis 10 Media...'
                        : activeMode === 'news'
                        ? 'Generate Berita Berbasis 10 Media'
                        : 'Generate Siaran Pers Berbasis 10 Media'}
                    </span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Card: Output Preview */}
            <div className="lg:col-span-6 bg-white dark:bg-[#0B1120] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm min-h-[460px] flex flex-col justify-between">
              {result ? (
                <div className="space-y-4">
                  {/* Top Bar Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono">
                        {result.outputType}
                      </span>
                      {result.provider && (
                        <span className="text-[10px] font-mono text-slate-400">
                          {result.provider}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 no-print">
                      <button
                        onClick={downloadAsWord}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-1 transition-colors border border-blue-200/60"
                        title="Unduh File Word (.docx)"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Word (.docx)</span>
                      </button>

                      <button
                        onClick={downloadAsPdf}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors border border-rose-200/60"
                        title="Unduh File PDF (.pdf)"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>PDF (.pdf)</span>
                      </button>

                      <button
                        onClick={handlePrint}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Cetak"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak</span>
                      </button>

                      <button
                        onClick={downloadAsTxt}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Unduh (.txt)"
                      >
                        {downloaded ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        <span>{downloaded ? 'Terunduh' : 'TXT'}</span>
                      </button>

                      <button
                        onClick={copyToClipboard}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Salin Naskah"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copied ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Headline Title */}
                  <h2 className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white leading-snug">
                    {result.title}
                  </h2>

                  {/* Body Content */}
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 max-h-[340px] overflow-y-auto font-sans">
                    {result.content}
                  </div>

                  {/* 10 Media Reference Summary */}
                  {result.references && result.references.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                      <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                        Rujukan {result.references.length} Media & Sentimen Terlampir:
                      </div>
                      <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                        {result.references.map((m: MediaArticle, idx: number) => (
                          <div
                            key={m.id}
                            className="text-[11px] flex items-start justify-between gap-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800"
                          >
                            <div className="min-w-0">
                              <span className="font-bold text-blue-600 dark:text-blue-400">
                                {idx + 1}. {m.media}
                              </span>{' '}
                              <span className="text-slate-600 dark:text-slate-300">
                                — {m.title}
                              </span>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase flex-shrink-0 ${
                                m.sentiment === 'positif'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : m.sentiment === 'negatif'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {m.sentiment} ({m.score ?? 55}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center my-auto py-16 text-center text-slate-400 dark:text-slate-500">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-3">
                    {activeMode === 'news' ? (
                      <Newspaper className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    ) : (
                      <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-400 dark:text-slate-500">
                    Hasil {activeMode === 'news' ? 'artikel berita' : 'siaran pers resmi'} AI berbasis 10 media akan muncul di sini
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function NewsGeneratorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#060913] p-8 text-slate-500">
          Memuat AI News & Press Release Suite...
        </div>
      }
    >
      <NewsAndPressReleaseContent />
    </Suspense>
  );
}
