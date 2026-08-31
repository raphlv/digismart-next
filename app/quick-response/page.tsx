'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  Zap, 
  Sparkles, 
  Copy, 
  Check, 
  ShieldAlert, 
  Clock, 
  HeartHandshake, 
  Layers,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

const CRISIS_TEMPLATES = [
  {
    type: 'Gangguan Layanan Sistem/Server',
    scenario: 'Sistem komputasi/server akademik mengalami lonjakan akses dan sempat down.',
    holdingStatement: 'PEMBERITAHUAN RESMI: Kami memohon maaf yang sebesar-besarnya atas kendala akses pada sistem layanan akademik yang terjadi saat ini. Tim teknis telah dikerahkan penuh dan saat ini sedang melakukan optimalisasi kapasitas jaringan. Kami memastikan seluruh data mahasiswa dalam kondisi aman. Batas waktu layanan akan diperpanjang 2x24 jam untuk menjamin kenyamanan seluruh sivitas. Pembaruan berkala akan disampaikan melalui kanal resmi ini.',
    formula: 'Acknowledge (Akui Kendala) + Action (Jelaskan Langkah Teknis) + Assurance (Garansi Keamanan & Kompensasi Waktu)',
  },
  {
    type: 'Klarifikasi Hoaks & Disinformasi',
    scenario: 'Beredar kabar palsu mengenai pungutan liar atau kebocoran data di media sosial.',
    holdingStatement: 'KLARIFIKASI INFORMASI: Sehubungan dengan beredarnya tangkapan layar/informasi mengenai [Nama Isu], kami menegaskan bahwa informasi tersebut adalah TIDAK BENAR (HOAKS). Seluruh prosedur operasional institusi selalu tunduk pada standar kepatuhan hukum dan transparansi. Kami mengimbau masyarakat untuk selalu memverifikasi kebenaran informasi melalui situs resmi dan tidak menyebarluaskan konten spekulatif.',
    formula: 'Fact Check (Sanggahan Tegas) + Compliance (Dasar Hukum/SOP) + Call to Action (Ajakan Verifikasi)',
  },
  {
    type: 'Pernyataan Empati Insiden Lapangan',
    scenario: 'Terjadi insiden mendadak di area fasilitas kampus atau kegiatan kemahasiswaan.',
    holdingStatement: 'PERNYATAAN RESMI: Kami menyampaikan rasa prihatin dan empati yang mendalam atas peristiwa yang terjadi pada kegiatan [Nama Acara]. Prioritas utama kami saat ini adalah penanganan dan pemulihan kondisi seluruh pihak terdampak. Tim tanggap darurat telah mendampingi di lokasi dan berkoordinasi erat dengan pihak berwenang. Kami memohon doa dan dukungan agar situasi segera pulih.',
    formula: 'Empathy First (Utamakan Korban) + Medical/Emergency Support (Tindakan Nyata) + Authority Collaboration (Koordinasi Resmi)',
  },
];

export default function QuickResponsePage() {
  const [selectedTemplate, setSelectedTemplate] = useState(CRISIS_TEMPLATES[0]);
  const [customCrisis, setCustomCrisis] = useState('Gangguan Server Pengisian KRS Semester Ganjil 2026');
  const [holdingText, setHoldingText] = useState(CRISIS_TEMPLATES[0].holdingStatement);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setHoldingText(
        `PERNYATAAN RESMI HUMAS TERKAIT: ${customCrisis.toUpperCase()}\n\nKami memahami kekhawatiran dan ketidaknyamanan yang dialami oleh seluruh pihak terkait ${customCrisis.toLowerCase()}. Saat ini tim tanggap krisis dan manajemen telah mengambil langkah investigasi cepat dan mitigasi menyeluruh.\n\nKami mengimbau publik untuk tetap tenang dan memantau kanal informasi resmi. Posko bantuan darurat telah disiagakan melalui WhatsApp Center di nomor 0812-XXXX-XXXX. Pembaruan status akan kami rilis kembali dalam waktu 60 menit ke depan.`
      );
      setIsGenerating(false);
    }, 600);
  };

  const copyText = (t: string) => {
    navigator.clipboard.writeText(t);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header 
          title="Quick Response (Crisis Communication AI)" 
          subtitle="Generator Holding Statement & Protokol Komunikasi Krisis dalam 'Golden Hour'" 
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Golden Hour Banner */}
          <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold font-mono uppercase mb-1">
                  Aturan Golden Hour (Max 60 Menit)
                </div>
                <h2 className="text-lg sm:text-xl font-display font-bold">
                  Protokol Kecepatan & Empati Respons Krisis PR
                </h2>
                <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-2xl leading-relaxed">
                  Dalam manajemen krisis reputasi, kekosongan pernyataan resmi akan segera diisi oleh spekulasi liar. Holding Statement dirancang untuk meredam kepanikan publik secara etis dan terukur.
                </p>
              </div>
            </div>
          </div>

          {/* Form & Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Custom Generator & Presets */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-display font-bold text-slate-900">
                    Generator Holding Statement AI
                  </h3>
                </div>

                <form onSubmit={handleGenerate} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Deskripsi Isu / Krisis yang Terjadi
                    </label>
                    <textarea
                      rows={3}
                      value={customCrisis}
                      onChange={(e) => setCustomCrisis(e.target.value)}
                      required
                      placeholder="Jelaskan insiden atau isu negatif yang sedang viral..."
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-600/30 active:scale-98 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isGenerating ? 'Menyusun Pernyataan...' : 'Rumuskan Holding Statement'}</span>
                  </button>
                </form>
              </div>

              {/* Template Presets */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pilih Template Skenario Standar:
                </span>
                <div className="space-y-2">
                  {CRISIS_TEMPLATES.map((tpl, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedTemplate(tpl);
                        setHoldingText(tpl.holdingStatement);
                      }}
                      className={`
                        w-full text-left p-3 rounded-xl border text-xs transition-all
                        ${
                          selectedTemplate.type === tpl.type
                            ? 'bg-rose-50/70 border-rose-300 font-semibold text-rose-900 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }
                      `}
                    >
                      <div className="font-bold text-slate-900">{tpl.type}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{tpl.scenario}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Holding Statement Preview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between min-h-[420px]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-rose-600" />
                      <h3 className="text-sm sm:text-base font-display font-bold text-slate-900">
                        Draf Pernyataan Resmi Siap Rilis
                      </h3>
                    </div>

                    <button
                      onClick={() => copyText(holdingText)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Tersalin' : 'Salin Draf'}</span>
                    </button>
                  </div>

                  {/* Formula Breakdown */}
                  <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[11px] font-bold text-amber-900">
                        Formula Komunikasi yang Diterapkan:
                      </span>
                      <p className="text-xs text-amber-800 mt-0.5">
                        {selectedTemplate.formula}
                      </p>
                    </div>
                  </div>

                  {/* Textarea holding statement editable */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Teks Pernyataan (Dapat Diedit Mahasiswa):
                    </label>
                    <textarea
                      rows={8}
                      value={holdingText}
                      onChange={(e) => setHoldingText(e.target.value)}
                      className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 leading-relaxed font-sans focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
                  <span>💡 Tip: Sebarkan serentak di Instagram Story & Utas X resmi.</span>
                  <span className="font-mono text-slate-400">Verifikasi Tim Legal & Humas</span>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
