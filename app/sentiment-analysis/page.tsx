'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useDigismart } from '@/lib/digismartContext';
import { 
  Activity, 
  Sparkles, 
  Smile, 
  Meh, 
  Frown, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Layers,
  Search,
  ArrowRight
} from 'lucide-react';

const SAMPLE_TEXTS = [
  {
    label: 'Apresiasi Layanan KRS',
    text: 'Terima kasih banyak tim IT kampus atas update servernya! Proses pengisian KRS semester ini lancar banget dan sangat cepat dibanding tahun lalu. Mantap solutif!',
  },
  {
    label: 'Keluhan Server Error',
    text: 'Situs portal akademik masih eror dan lambat parah dari pagi. Sangat kecewa karena hari ini tenggat terakhir pembayaran tapi sistem malah down terus.',
  },
  {
    label: 'Pertanyaan Beasiswa Netral',
    text: 'Mohon info mengenai jadwal wawancara beasiswa riset angkatan 2026, apakah pengumuman kelolosan administrasi dikirimkan melalui email resmi?',
  },
  {
    label: 'Kritik Kebijakan Parkir',
    text: 'Kenaikan tarif parkir kampus dinilai kurang transparan. Banyak fasilitas penunjang di gedung barat yang rusak dan belum diperbaiki.',
  },
];

export default function SentimentAnalysisPage() {
  const { analyzeText, sentimentHistory } = useDigismart();
  const [inputText, setInputText] = useState(SAMPLE_TEXTS[0].text);
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeText(inputText);
      setCurrentResult(res);
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header 
          title="Sentiment Analysis Engine" 
          subtitle="Analisis Polaritas Opini Publik, Spektrum Emosi, & Rekomendasi Mitigasi Humas" 
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Banner */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 text-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-display font-bold text-slate-900">
                  Kalkulator Polaritas Opini Publik Berbasis NLP
                </h2>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Masukkan komentar media sosial, artikel warta, atau tanggapan publik untuk mengukur sentimen secara kuantitatif dan kualitatif.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl">
              NLP Engine Active
            </span>
          </div>

          {/* Analysis Form & Visualizer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Input Form */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-display font-bold text-slate-900">
                  Input Teks Komentar / Isu
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {inputText.length} karakter
                </span>
              </div>

              {/* Sample Presets */}
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Coba Sampel Latihan Mahasiswa:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_TEXTS.map((sample, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setInputText(sample.text)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all active:scale-95 text-left"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div>
                  <textarea
                    rows={5}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    required
                    placeholder="Ketik atau tempel teks komentar netizen di sini..."
                    className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAnalyzing || !inputText.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 active:scale-98 transition-all disabled:opacity-50"
                >
                  <Activity className="w-4 h-4" />
                  <span>{isAnalyzing ? 'Sedang Menganalisis Sentimen...' : 'Analisis Sentimen Teks'}</span>
                </button>
              </form>
            </div>

            {/* Right Output: Detailed Diagnostic */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between min-h-[380px]">
                {currentResult || sentimentHistory[0] ? (
                  (() => {
                    const res = currentResult || sentimentHistory[0];
                    const isPos = res.polarity === 'positif';
                    const isNeg = res.polarity === 'negatif';
                    return (
                      <div className="space-y-5">
                        {/* Status Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            {isPos && <Smile className="w-6 h-6 text-emerald-600" />}
                            {isNeg && <Frown className="w-6 h-6 text-rose-600" />}
                            {!isPos && !isNeg && <Meh className="w-6 h-6 text-blue-600" />}
                            <div>
                              <span className="block text-xs text-slate-400 font-mono">Hasil Klasifikasi</span>
                              <span
                                className={`
                                  text-base font-display font-bold uppercase tracking-wide
                                  ${isPos ? 'text-emerald-600' : isNeg ? 'text-rose-600' : 'text-blue-600'}
                                `}
                              >
                                Sentimen {res.polarity}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="block text-xs text-slate-400 font-mono">Skor Keyakinan</span>
                            <span className="text-xl font-display font-bold text-slate-900 font-mono">
                              {res.score}%
                            </span>
                          </div>
                        </div>

                        {/* Emotion Category */}
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Spektrum Emosi Dominan:
                          </span>
                          <p className="text-xs sm:text-sm font-semibold text-slate-800">
                            {res.dominantEmotion}
                          </p>
                        </div>

                        {/* Keyword Extraction */}
                        <div className="space-y-2">
                          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Kata Kunci Pemicu Terdeteksi:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {res.positiveKeywords?.map((kw: string, i: number) => (
                              <span key={`pos-${i}`} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                                + {kw}
                              </span>
                            ))}
                            {res.negativeKeywords?.map((kw: string, i: number) => (
                              <span key={`neg-${i}`} className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                                - {kw}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Recommendation */}
                        <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200/80 flex items-start gap-3">
                          <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="block text-xs font-bold text-blue-900 mb-0.5">
                              Rekomendasi Tindakan Humas:
                            </span>
                            <p className="text-xs text-slate-700 leading-relaxed">
                              {res.recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center text-slate-400">
                    <Activity className="w-12 h-12 text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-600">Menunggu Input Analisis</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      Pilih sampel teks atau ketik teks pada kolom sebelah kiri lalu klik tombol analisis.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* History Section */}
          {sentimentHistory.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-display font-bold text-slate-900">
                    Riwayat Analisis Sesi Ini ({sentimentHistory.length})
                  </h3>
                </div>
              </div>

              <div className="space-y-2.5">
                {sentimentHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-700 truncate font-medium">
                        "{item.inputText}"
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.dominantEmotion}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`
                          text-xs font-bold px-2.5 py-0.5 rounded-full uppercase
                          ${
                            item.polarity === 'positif'
                              ? 'bg-emerald-100 text-emerald-700'
                              : item.polarity === 'negatif'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-blue-100 text-blue-700'
                          }
                        `}
                      >
                        {item.polarity} ({item.score}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
