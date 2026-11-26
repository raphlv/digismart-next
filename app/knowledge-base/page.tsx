'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useDigismart } from '@/lib/digismartContext';
import { exportKnowledgeDocToDocx, exportKnowledgeDocToPdf } from '@/lib/exportUtils';
import { 
  BookOpen, 
  Plus, 
  Search, 
  FileText, 
  X, 
  Calendar,
  Sparkles,
  Download,
  FileDown,
  Copy,
  Check,
  Tag,
  Filter
} from 'lucide-react';

const CATEGORIES = [
  'Semua',
  'Protokol Krisis',
  'Jurnalistik Humas',
  'Social Media & Fact-Checking',
  'Regulasi & Kebijakan',
];

export default function KnowledgeBasePage() {
  const { knowledgeDocs, addKnowledgeDoc } = useDigismart();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // New Doc Form
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Protokol Krisis');
  const [docSummary, setDocSummary] = useState('');
  const [docContent, setDocContent] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveSearch(searchQuery.trim().toLowerCase());
  };

  const filteredDocs = knowledgeDocs.filter((doc) => {
    // Filter Category
    if (selectedCategory !== 'Semua' && doc.category !== selectedCategory) {
      return false;
    }
    // Filter Search
    if (!activeSearch) return true;
    return (
      doc.title.toLowerCase().includes(activeSearch) ||
      doc.category.toLowerCase().includes(activeSearch) ||
      doc.summary.toLowerCase().includes(activeSearch) ||
      doc.content.toLowerCase().includes(activeSearch)
    );
  });

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    addKnowledgeDoc({
      title: docTitle.trim(),
      category: docCategory,
      summary: docSummary.trim() || 'Dokumen kebijakan dan SOP kehumasan institusi.',
      content: docContent.trim() || 'Panduan operasional dan regulasi pelaksanaan tata kelola komunikasi publik.',
      author: 'Humas & Tim Regulasi',
    });

    setDocTitle('');
    setDocSummary('');
    setDocContent('');
    setIsModalOpen(false);
  };

  const copyDoc = (doc: any) => {
    navigator.clipboard.writeText(`${doc.title}\n\nKategori: ${doc.category}\nTanggal: ${doc.date}\nPenulis: ${doc.author}\n\nRINGKASAN:\n${doc.summary}\n\nISI DOKUMEN:\n${doc.content}\n\n---\nDIGISMART Knowledge Repository`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadDocTxt = (doc: any) => {
    const text = `${doc.title}\n${'='.repeat(doc.title.length)}\nKategori: ${doc.category}\nTanggal: ${doc.date}\nPenulis: ${doc.author}\n\nRINGKASAN:\n${doc.summary}\n\nISI LENGKAP:\n${doc.content}\n\n---\nDIGISMART Knowledge Repository`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#060913] flex flex-col lg:flex-row transition-colors">
      <Sidebar />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header 
          title="Knowledge Base" 
          subtitle="Simpan & cari dokumen kebijakan dengan AI"
          icon={BookOpen}
          actionButton={
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Dokumen</span>
            </button>
          }
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* AI Search Bar (Exactly as in Video 7) */}
          <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari dokumen, SOP krisis, atau regulasi dengan AI..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-600/20 active:scale-95 transition-all flex-shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Search</span>
              </button>
            </form>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Kategori:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Documents Grid / Empty State */}
          {filteredDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="bg-white dark:bg-[#0B1120] rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono">
                        {doc.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {doc.date}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">
                      {doc.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold">
                    <span>Baca SOP Lengkap</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-16 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-1">
                <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Belum ada dokumen kebijakan (Fresh Start)
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm">
                Data dimulai dari 0. Klik tombol <strong>&quot;+ Tambah Dokumen&quot;</strong> di atas untuk menyimpan naskah SOP atau regulasi baru.
              </p>
            </div>
          )}

          {/* Detail Reading Modal */}
          {selectedDoc && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono">
                      {selectedDoc.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedDoc.date} • {selectedDoc.author}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-display font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedDoc.title}
                </h3>

                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 italic">
                  &ldquo;{selectedDoc.summary}&rdquo;
                </div>

                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 max-h-80 overflow-y-auto">
                  {selectedDoc.content}
                </div>

                <div className="pt-2 flex flex-wrap justify-end gap-2">
                  <button
                    onClick={() => exportKnowledgeDocToDocx(selectedDoc)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Word (.docx)</span>
                  </button>
                  <button
                    onClick={() => exportKnowledgeDocToPdf(selectedDoc)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>PDF (.pdf)</span>
                  </button>
                  <button
                    onClick={() => downloadDocTxt(selectedDoc)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {downloaded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5" />}
                    <span>{downloaded ? 'Terunduh' : 'TXT'}</span>
                  </button>
                  <button
                    onClick={() => copyDoc(selectedDoc)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin' : 'Salin Isi'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Tambah Dokumen */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
                    Tambah Dokumen Kebijakan
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveDoc} className="space-y-4">
                  {/* Judul Dokumen * */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Judul Dokumen <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      placeholder="Contoh: SOP Komunikasi Krisis 2026..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  {/* Kategori */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Kategori
                    </label>
                    <select
                      value={docCategory}
                      onChange={(e) => setDocCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                    >
                      <option value="Protokol Krisis">Protokol Krisis</option>
                      <option value="Jurnalistik Humas">Jurnalistik Humas</option>
                      <option value="Social Media & Fact-Checking">Social Media & Fact-Checking</option>
                      <option value="Regulasi & Kebijakan">Regulasi & Kebijakan</option>
                    </select>
                  </div>

                  {/* Ringkasan */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Ringkasan Singkat
                    </label>
                    <textarea
                      rows={2}
                      value={docSummary}
                      onChange={(e) => setDocSummary(e.target.value)}
                      placeholder="Ringkasan poin penting dokumen..."
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all leading-relaxed"
                    />
                  </div>

                  {/* Isi Dokumen */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Isi Dokumen / SOP
                    </label>
                    <textarea
                      rows={4}
                      value={docContent}
                      onChange={(e) => setDocContent(e.target.value)}
                      placeholder="Masukkan panduan lengkap atau naskah SOP..."
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all leading-relaxed"
                    />
                  </div>

                  {/* Simpan Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!docTitle.trim()}
                      className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 active:scale-98 transition-all disabled:opacity-50"
                    >
                      <span>Simpan ke Knowledge Base</span>
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
