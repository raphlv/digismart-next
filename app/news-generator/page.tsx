'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useDigismart } from '@/lib/digismartContext';
import { 
  Newspaper, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Send, 
  Sliders,
  Quote,
  Layers,
  BookOpen
} from 'lucide-react';

export default function NewsGeneratorPage() {
  const { articles, addArticle } = useDigismart();

  const [topic, setTopic] = useState('Peluncuran Beasiswa Prestasi Mahasiswa Berbasis Inovasi AI');
  const [tone, setTone] = useState('Formal & Edukatif');
  const [targetAudience, setTargetAudience] = useState('Mahasiswa & Publik Akademik');
  const [spokesperson, setSpokesperson] = useState('Dr. Ir. Hendra Gunawan (Wakil Rektor Bidang Akademik)');
  const [keyFact, setKeyFact] = useState('Kuota 500 mahasiswa berprestasi dengan pembebasan biaya kuliah penuh dan dana riset Rp 10 juta per tim.');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [latestDraft, setLatestDraft] = useState<any>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const generated = {
        title: `${topic}: Langkah Strategis Mencetak Talenta Unggul`,
        topic: topic,
        tone: tone,
        leadParagraph: `Dalam rangka mengakselerasi kesiapan generasi muda menyongsong era kecerdasan artifisial, program ${topic.toLowerCase()} resmi dibuka hari ini. Inisiatif ini ditujukan khusus bagi ${targetAudience.toLowerCase()} yang memiliki komitmen tinggi dalam riset dan inovasi aplikatif.`,
        quotes: `"${keyFact} Kami percaya generasi muda Indonesia memiliki potensi luar biasa untuk memimpin transformasi teknologi nasional," tegas ${spokesperson}.`,
        content: `Program ini tidak hanya memberikan dukungan finansial, tetapi juga menyertakan pendampingan intensif dari praktisi industri teknologi dan mentor akademik berpengalaman. Pendaftaran dibuka secara daring hingga akhir bulan ini melalui portal resmi kampus.`,
        keywords: [topic.split(' ')[0] || 'Inovasi', 'Pendidikan', 'Beasiswa AI', 'Transformasi Digital'],
      };

      addArticle(generated);
      setLatestDraft(generated);
      setIsGenerating(false);
    }, 800);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header 
          title="AI News Generator" 
          subtitle="Pembuat Berita & Siaran Pers Cerdas Berstandar Jurnalistik 5W+1H" 
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Info Banner for Students */}
          <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 text-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-display font-bold text-slate-900">
                  Laboratorium Jurnalistik AI Mahasiswa
                </h2>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Latihlah teknik penyusunan sudut pandang (*angle*), kutipan narasumber resmi, serta gaya bahasa (*tone of voice*) yang akurat dan kredibel.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-100/60 px-3 py-1.5 rounded-xl border border-blue-200">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Format Piramida Terbalik</span>
            </div>
          </div>

          {/* Generator Form & Output Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Form: Parameter Input */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-display font-bold text-slate-900">
                    Parameter Draf Berita
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                  AI Model v2.0
                </span>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4">
                {/* Topic */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Topik / Peristiwa Utama
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                    placeholder="Contoh: Kunjungan Delegasi Riset Internasional"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>

                {/* Tone & Target Audience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Gaya Bahasa (Tone)
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                    >
                      <option value="Formal & Edukatif">Formal & Edukatif</option>
                      <option value="Investigatif & Lugas">Investigatif & Lugas</option>
                      <option value="Klarifikasi Krisis Humas">Klarifikasi Krisis Humas</option>
                      <option value="Populer & Mahasiswa">Populer & Mahasiswa</option>
                      <option value="Inspiratif & Human Interest">Inspiratif & Human Interest</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target Audiens
                    </label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="Contoh: Mahasiswa, Dosen, Publik"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Spokesperson & Key Quote */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Narasumber Resmi & Jabatan
                  </label>
                  <input
                    type="text"
                    value={spokesperson}
                    onChange={(e) => setSpokesperson(e.target.value)}
                    placeholder="Nama dan Jabatan Narasumber"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fakta Inti & Angka Kunci
                  </label>
                  <textarea
                    rows={3}
                    value={keyFact}
                    onChange={(e) => setKeyFact(e.target.value)}
                    placeholder="Masukkan data angka, tanggal, atau poin penting..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                {/* Generate Button */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 active:scale-98 transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sedang Merumuskan Berita AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Draf Berita Sekarang</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Output: Real-time News Preview */}
            <div className="lg:col-span-7 space-y-4">
              {/* Preview Card */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between min-h-[420px]">
                {latestDraft || articles[0] ? (
                  (() => {
                    const current = latestDraft || articles[0];
                    const fullText = `${current.title}\n\n${current.leadParagraph}\n\n${current.quotes}\n\n${current.content}`;
                    return (
                      <div className="space-y-4">
                        {/* Header Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-mono">
                              {current.topic}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              {current.timestamp}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => copyToClipboard(fullText)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Article Headline */}
                        <h2 className="text-base sm:text-lg lg:text-xl font-display font-bold text-slate-900 leading-snug">
                          {current.title}
                        </h2>

                        {/* Lead Paragraph */}
                        <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-xl border-l-4 border-blue-600">
                          {current.leadParagraph}
                        </p>

                        {/* Official Quote */}
                        <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-3">
                          <Quote className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                            {current.quotes}
                          </p>
                        </div>

                        {/* Body Content */}
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {current.content}
                        </p>

                        {/* Keywords */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {current.keywords?.map((kw: string, i: number) => (
                            <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center text-slate-400">
                    <Newspaper className="w-12 h-12 text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-600">Belum ada draf yang digenerate</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                      Isi parameter di samping dan klik tombol generate untuk merumuskan berita jurnalistik cerdas.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* History of Generated Articles */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-display font-bold text-slate-900">
                  Arsip Draf Berita AI ({articles.length})
                </h3>
              </div>
              <span className="text-xs text-slate-500">Tersimpan di Sesi Latihan</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1.5">
                      <span className="font-bold text-blue-600 uppercase">{art.topic}</span>
                      <span>{art.timestamp}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                      {art.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {art.leadParagraph}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">{art.tone}</span>
                    <button
                      onClick={() => setLatestDraft(art)}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      Buka di Editor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
