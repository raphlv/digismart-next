'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useDigismart } from '@/lib/digismartContext';
import { MonitoredIssue } from '@/lib/digismartData';
import {
  Radio,
  Plus,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  X,
  Trash2,
  Search,
  Zap,
  FileText,
  ExternalLink,
  MessageSquare,
  TrendingUp,
  BarChart2
} from 'lucide-react';

export default function SocialListeningPage() {
  const { issues, addIssue, deleteIssue } = useDigismart();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<MonitoredIssue | null>(null);
  const [judulIsu, setJudulIsu] = useState('');
  const [platform, setPlatform] = useState<'Twitter/X' | 'Instagram' | 'TikTok' | 'Youtube' | 'Portal Berita'>('Twitter/X');
  const [hashtag, setHashtag] = useState('');

  // Filters
  const [severityFilter, setSeverityFilter] = useState<'all' | 'aman' | 'waspada' | 'krisis'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts
  const amanCount = issues.filter((i) => i.severity === 'aman').length;
  const waspadaCount = issues.filter((i) => i.severity === 'waspada').length;
  const krisisCount = issues.filter((i) => i.severity === 'krisis').length;

  const filteredIssues = issues.filter((issue) => {
    if (severityFilter !== 'all' && issue.severity !== severityFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = issue.title.toLowerCase().includes(q);
      const matchDesc = issue.description.toLowerCase().includes(q);
      const matchHash = issue.hashtag?.toLowerCase().includes(q);
      const matchPlat = issue.platform.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchHash || matchPlat;
    }
    return true;
  });

  const handleSaveIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulIsu.trim()) return;

    // Determine severity automatically based on keywords
    const lower = judulIsu.toLowerCase();
    let severity: 'aman' | 'waspada' | 'krisis' = 'waspada';
    if (lower.includes('bocor') || lower.includes('korupsi') || lower.includes('krisis') || lower.includes('gelap') || lower.includes('judol') || lower.includes('rusak')) {
      severity = 'krisis';
    } else if (lower.includes('sukses') || lower.includes('apresiasi') || lower.includes('prestasi') || lower.includes('lancar') || lower.includes('penghargaan')) {
      severity = 'aman';
    }

    const mentions = Math.floor(Math.random() * 2500) + 150;

    addIssue({
      title: judulIsu.trim(),
      description: `Pemantauan otomatis terhadap isu publik '${judulIsu.trim()}' di platform ${platform} menunjukkan perhatian publik yang terus meningkat dengan keterlibatan netizen aktif.`,
      platform,
      mentions,
      severity,
      hashtag: hashtag.trim() ? (hashtag.startsWith('#') ? hashtag : `#${hashtag}`) : undefined,
    });

    setJudulIsu('');
    setHashtag('');
    setPlatform('Twitter/X');
    setIsModalOpen(false);
  };

  const handleGoToQuickResponse = (issueTitle: string) => {
    window.location.href = `/quick-response/?issue=${encodeURIComponent(issueTitle)}`;
  };

  const handleGoToPressRelease = (issueTitle: string) => {
    window.location.href = `/news-generator/?mode=press-release&issue=${encodeURIComponent(issueTitle)}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#060913] flex flex-col lg:flex-row transition-colors">
      <Sidebar />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header
          title="AI Social Listening"
          subtitle="Monitoring isu publik realtime"
          icon={Radio}
          actionButton={
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Isu</span>
            </button>
          }
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* 3 Status Cards (Aman, Waspada, Krisis) with interactive filter click */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {/* Card 1: Aman */}
            <div
              onClick={() => setSeverityFilter(severityFilter === 'aman' ? 'all' : 'aman')}
              className={`rounded-2xl p-4 sm:p-5 flex items-center justify-between cursor-pointer transition-all border ${
                severityFilter === 'aman'
                  ? 'bg-emerald-500/20 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-[#EBFBF0] dark:bg-[#0D2417] border-[#BFF1CD] dark:border-[#1E4A2F] hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    {amanCount}
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Aman
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {severityFilter === 'aman' ? 'Aktif' : 'Filter'}
              </span>
            </div>

            {/* Card 2: Waspada */}
            <div
              onClick={() => setSeverityFilter(severityFilter === 'waspada' ? 'all' : 'waspada')}
              className={`rounded-2xl p-4 sm:p-5 flex items-center justify-between cursor-pointer transition-all border ${
                severityFilter === 'waspada'
                  ? 'bg-amber-500/20 border-amber-500 shadow-md ring-2 ring-amber-500/30'
                  : 'bg-[#FEF9E7] dark:bg-[#2A2308] border-[#FDE68A] dark:border-[#4B3B0A] hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    {waspadaCount}
                  </div>
                  <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    Waspada
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {severityFilter === 'waspada' ? 'Aktif' : 'Filter'}
              </span>
            </div>

            {/* Card 3: Krisis */}
            <div
              onClick={() => setSeverityFilter(severityFilter === 'krisis' ? 'all' : 'krisis')}
              className={`rounded-2xl p-4 sm:p-5 flex items-center justify-between cursor-pointer transition-all border ${
                severityFilter === 'krisis'
                  ? 'bg-rose-500/20 border-rose-500 shadow-md ring-2 ring-rose-500/30'
                  : 'bg-[#FEECEC] dark:bg-[#280E10] border-[#FECACA] dark:border-[#521C22] hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    {krisisCount}
                  </div>
                  <div className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                    Krisis
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                {severityFilter === 'krisis' ? 'Aktif' : 'Filter'}
              </span>
            </div>
          </div>

          {/* Search & Quick Filter Bar */}
          <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari isu, hashtag, platform..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Status:</span>
              <button
                onClick={() => setSeverityFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  severityFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Semua ({issues.length})
              </button>
              <button
                onClick={() => setSeverityFilter('aman')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  severityFilter === 'aman'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Aman ({amanCount})
              </button>
              <button
                onClick={() => setSeverityFilter('waspada')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  severityFilter === 'waspada'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Waspada ({waspadaCount})
              </button>
              <button
                onClick={() => setSeverityFilter('krisis')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  severityFilter === 'krisis'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Krisis ({krisisCount})
              </button>
            </div>
          </div>

          {/* Monitored Issues List */}
          <div className="space-y-3">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => {
                const isKrisis = issue.severity === 'krisis';
                const isWaspada = issue.severity === 'waspada';

                return (
                  <div
                    key={issue.id}
                    className="bg-white dark:bg-[#0B1120] rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                    onClick={() => setSelectedIssue(issue)}
                  >
                    {/* Left: Severity Icon & Content */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="mt-0.5 flex-shrink-0">
                        {isKrisis ? (
                          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                            <ShieldAlert className="w-5 h-5" />
                          </div>
                        ) : isWaspada ? (
                          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {issue.title}
                          </h3>
                          {issue.hashtag && (
                            <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-medium">
                              {issue.hashtag}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                          {issue.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Platform Badge + Mentions + Quick Action */}
                    <div className="flex items-center gap-2.5 flex-shrink-0 self-end md:self-center" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                        {issue.platform}
                      </span>
                      <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                        {issue.mentions.toLocaleString()} mentions
                      </span>

                      <button
                        onClick={() => handleGoToQuickResponse(issue.title)}
                        className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 text-blue-600 dark:text-blue-400 transition-colors"
                        title="Buat Quick Response"
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteIssue(issue.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-300 hover:text-rose-500 transition-colors"
                        title="Hapus Isu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-12 text-center text-slate-400 border border-slate-200 dark:border-slate-800 space-y-2">
                <Radio className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-1" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada isu yang dipantau (Fresh Start)</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Data dimulai dari 0. Klik tombol <strong>&quot;+ Tambah Isu&quot;</strong> di pojok kanan atas untuk menambahkan isu pantauan baru secara real-time.
                </p>
              </div>
            )}
          </div>

          {/* Issue Detail Deep-Dive Modal */}
          {selectedIssue && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        selectedIssue.severity === 'krisis'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                          : selectedIssue.severity === 'waspada'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      Status: {selectedIssue.severity}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedIssue.platform}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedIssue(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-display font-bold text-slate-900 dark:text-white leading-snug">
                    {selectedIssue.title}
                  </h3>
                  {selectedIssue.hashtag && (
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400 mt-1 block">
                      Hashtag Terkait: {selectedIssue.hashtag}
                    </span>
                  )}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    {selectedIssue.description}
                  </p>
                </div>

                {/* Sentiment & Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <div className="text-[11px] text-slate-400 font-medium">Volume Percakapan</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                      {selectedIssue.mentions.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <div className="text-[11px] text-slate-400 font-medium">Tingkat Risiko</div>
                    <div className={`text-lg font-bold capitalize mt-0.5 ${
                      selectedIssue.severity === 'krisis' ? 'text-rose-600' : selectedIssue.severity === 'waspada' ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {selectedIssue.severity}
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleGoToQuickResponse(selectedIssue.title)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Buat Quick Response</span>
                  </button>
                  <button
                    onClick={() => handleGoToPressRelease(selectedIssue.title)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Buat Siaran Pers</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Tambah Isu Monitoring (Exactly as in Video 2) */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
                    Tambah Isu Monitoring
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveIssue} className="space-y-4">
                  {/* Judul Isu * */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Judul Isu <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={judulIsu}
                      onChange={(e) => setJudulIsu(e.target.value)}
                      placeholder="Masukkan nama isu atau topik percakapan..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  {/* Platform */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Platform
                    </label>
                    <select
                      value={platform}
                      onChange={(e: any) => setPlatform(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                    >
                      <option value="Twitter/X">Twitter/X</option>
                      <option value="Instagram">Instagram</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Youtube">Youtube</option>
                      <option value="Portal Berita">Portal Berita</option>
                    </select>
                  </div>

                  {/* Hashtag */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Hashtag
                    </label>
                    <input
                      type="text"
                      value={hashtag}
                      onChange={(e) => setHashtag(e.target.value)}
                      placeholder="#keyword"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  {/* Button Analisis & Simpan */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!judulIsu.trim()}
                      className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 active:scale-98 transition-all disabled:opacity-50"
                    >
                      <span>Analisis & Simpan</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
