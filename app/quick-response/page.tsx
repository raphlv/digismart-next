'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useDigismart } from '@/lib/digismartContext';
import { generateQuickResponseWithAI } from '@/lib/aiService';
import { exportNewsToDocx, exportNewsToPdf } from '@/lib/exportUtils';
import { 
  Zap, 
  Copy, 
  Check, 
  Download, 
  RotateCcw,
  BookOpen,
  ArrowRight,
  Sparkles,
  Share2,
  FileDown,
  FileText
} from 'lucide-react';

function QuickResponseContent() {
  const { issues, addKnowledgeDoc } = useDigismart();

  const [inputText, setInputText] = useState('');
  const [tone, setTone] = useState('Formal Pemerintah');
  const [jenisRespons, setJenisRespons] = useState('Draft Klarifikasi');

  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [savedToKb, setSavedToKb] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Check URL query parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const issueQuery = params.get('issue');
      if (issueQuery) {
        setInputText(issueQuery);
      }
    }
  }, []);

  const handleSelectPredefinedIssue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      setInputText(val);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsGenerating(true);

    try {
      const issueSnippet = inputText.trim();
      const aiRes = await generateQuickResponseWithAI({
        inputText: issueSnippet,
        tone,
        jenisRespons,
      });

      setResult({
        tone,
        jenisRespons,
        issue: issueSnippet,
        content: aiRes.content,
        provider: aiRes.provider,
      });
      setSavedToKb(false);
    } catch (err) {
      console.error('Quick response error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    if (!result) return;
    const blob = new Blob([result.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quick-response-${result.jenisRespons.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleSaveToKb = () => {
    if (!result) return;
    addKnowledgeDoc({
      title: `Respons Humas: ${result.jenisRespons} - ${result.issue.substring(0, 40)}...`,
      category: 'Protokol Krisis',
      summary: `Naskah komunikasi cepat hasil generate AI dengan tone ${result.tone} menanggapi isu publik: "${result.issue}".`,
      content: result.content,
      author: 'AI Quick Response Engine',
    });
    setSavedToKb(true);
    setTimeout(() => setSavedToKb(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#060913] flex flex-col lg:flex-row transition-colors">
      <Sidebar />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header 
          title="AI Quick Response" 
          subtitle="Respons cepat komunikasi publik"
          icon={Zap}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Card: Input */}
            <div className="lg:col-span-6 bg-white dark:bg-[#0B1120] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              {/* Optional Quick Selector */}
              {issues.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Atau Pilih dari Isu yang Sedang Dipantau:
                  </label>
                  <select
                    onChange={handleSelectPredefinedIssue}
                    defaultValue=""
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option value="" disabled>-- Pilih Isu Pantauan untuk Ditanggapi --</option>
                    {issues.map((iss) => (
                      <option key={iss.id} value={iss.title}>
                        [{iss.severity.toUpperCase()}] {iss.title} ({iss.platform})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <form onSubmit={handleGenerate} className="space-y-4">
                {/* Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Isu / Komentar / Berita Viral <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Tempel isu publik atau komentar negatif di sini..."
                    className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all leading-relaxed"
                  />
                </div>

                {/* Tone & Jenis Respons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Tone
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                    >
                      <option value="Formal Pemerintah">Formal Pemerintah</option>
                      <option value="Humanis">Humanis</option>
                      <option value="Persuasif">Persuasif</option>
                      <option value="Krisis Komunikasi">Krisis Komunikasi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Jenis Respons
                    </label>
                    <select
                      value={jenisRespons}
                      onChange={(e) => setJenisRespons(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                    >
                      <option value="Draft Klarifikasi">Draft Klarifikasi</option>
                      <option value="FAQ Publik">FAQ Publik</option>
                      <option value="Statement Resmi">Statement Resmi</option>
                      <option value="Narasi Komunikasi">Narasi Komunikasi</option>
                      <option value="Konferensi Pers Draft">Konferensi Pers Draft</option>
                    </select>
                  </div>
                </div>

                {/* Button: Generate Quick Response */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isGenerating || !inputText.trim()}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-98 transition-all disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>{isGenerating ? 'Menyusun Respons...' : 'Generate Quick Response'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Card: Output */}
            <div className="lg:col-span-6 bg-white dark:bg-[#0B1120] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm min-h-[380px] flex flex-col justify-between">
              {result ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono">
                        {result.jenisRespons}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {result.tone}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() =>
                          exportNewsToDocx({
                            title: `${result.jenisRespons}: ${result.issue.substring(0, 70)}`,
                            content: result.content,
                            mode: 'press-release',
                            outputType: result.tone,
                            instansi: 'Tim Humas & Mitigasi Krisis',
                            lokasi: 'Jakarta',
                            narasumber: 'Juru Bicara Resmi',
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Unduh Word (.docx)"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Word</span>
                      </button>

                      <button
                        onClick={() =>
                          exportNewsToPdf({
                            title: `${result.jenisRespons}: ${result.issue.substring(0, 70)}`,
                            content: result.content,
                            mode: 'press-release',
                            outputType: result.tone,
                            instansi: 'Tim Humas & Mitigasi Krisis',
                            lokasi: 'Jakarta',
                            narasumber: 'Juru Bicara Resmi',
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Unduh PDF (.pdf)"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>

                      <button
                        onClick={handleSaveToKb}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Simpan ke Knowledge Base"
                      >
                        {savedToKb ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <BookOpen className="w-3.5 h-3.5" />}
                        <span>{savedToKb ? 'Tersimpan ke KB' : 'Simpan ke KB'}</span>
                      </button>

                      <button
                        onClick={downloadTxt}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Unduh (.txt)"
                      >
                        {downloaded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5" />}
                        <span>{downloaded ? 'Terunduh' : 'TXT'}</span>
                      </button>

                      <button
                        onClick={() => copyToClipboard(result.content)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Salin Naskah"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 font-sans max-h-[460px] overflow-y-auto">
                    {result.content}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center my-auto py-16 text-center text-slate-400 dark:text-slate-500">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-3">
                    <Zap className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-400 dark:text-slate-500">
                    Hasil respons akan muncul di sini
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

export default function QuickResponsePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] dark:bg-[#060913] p-8 text-slate-500">Memuat modul respons...</div>}>
      <QuickResponseContent />
    </Suspense>
  );
}
