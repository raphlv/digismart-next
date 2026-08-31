'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Printer, 
  Building2, 
  User, 
  Phone, 
  Mail,
  Download
} from 'lucide-react';

export default function PressReleasePage() {
  const [instansi, setInstansi] = useState('LEMBAGA PENDIDIKAN & RISET DIGITAL INDONESIA');
  const [noSurat, setNoSurat] = useState('042/PR-HUMAS/VIII/2026');
  const [cityDate, setCityDate] = useState('JAKARTA, 31 AGUSTUS 2026');
  const [title, setTitle] = useState('Akselerasi Penguatan Ekosistem Kecerdasan Buatan Nasional Melalui Pembukaan Program Talenta Digital 2026');
  const [lead, setLead] = useState('Dalam upaya mencetak 10.000 talenta kecerdasan buatan terapan di Indonesia, konsorsium riset dan pendidikan nasional hari ini resmi meluncurkan inisiatif pelatihan komprehensif bagi generasi muda di seluruh perguruan tinggi.');
  const [body, setBody] = useState('Program ini memadukan kurikulum standar industri internasional dengan studi kasus riil pemanfaatan AI dalam sektor publik, layanan kesehatan, dan mitigasi bencana. Peserta yang lolos seleksi akan mendapatkan beasiswa penuh serta kesempatan magang di pusat riset teknologi terkemuka.');
  const [quote, setQuote] = useState('"Investasi terbesar suatu bangsa adalah pada kesiapan sumber daya manusianya. Melalui ekosistem ini, kami memastikan generasi muda bukan hanya konsumen teknologi, melainkan inovator utama," ujar Ketua Dewan Pembina.');
  const [contactName, setContactName] = useState('Sarah Danuarta (Kepala Hubungan Media)');
  const [contactPhone, setContactPhone] = useState('+62 811-9876-5432');
  const [contactEmail, setContactEmail] = useState('media@humasdigital.ac.id');
  const [copied, setCopied] = useState(false);

  const getFullText = () => {
    return `SIARAN PERS
${instansi}
Nomor: ${noSurat}
UNTUK SEGERA DISIARKAN

${title.toUpperCase()}

${cityDate} – ${lead}

${body}

${quote}

---
TENTANG INSTITUSI:
${instansi} adalah lembaga nirlaba yang berfokus pada pengembangan riset teknologi terapan dan peningkatan literasi komunikasi publik berbasis data di Indonesia.

KONTAK MEDIA:
${contactName}
Telepon: ${contactPhone}
Email: ${contactEmail}
Website: https://humasdigital.ac.id`;
  };

  const copyRelease = () => {
    navigator.clipboard.writeText(getFullText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header 
          title="Official Press Release Builder" 
          subtitle="Penyusun Siaran Pers Standar Lembaga Pemerintahan & Korporat" 
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Input Form */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-display font-bold text-slate-900">
                  Formulir Naskah Siaran Pers
                </h3>
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  Format Baku PR
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Instansi / Perusahaan</label>
                  <input
                    type="text"
                    value={instansi}
                    onChange={(e) => setInstansi(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">No. Siaran Pers</label>
                    <input
                      type="text"
                      value={noSurat}
                      onChange={(e) => setNoSurat(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Tempat & Tanggal</label>
                    <input
                      type="text"
                      value={cityDate}
                      onChange={(e) => setCityDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Judul Siaran Pers</label>
                  <textarea
                    rows={2}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Lead Paragraf (5W1H)</label>
                  <textarea
                    rows={3}
                    value={lead}
                    onChange={(e) => setLead(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Kutipan Resmi Pimpinan</label>
                  <textarea
                    rows={3}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Narahubung Media</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Nomor Telepon</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Formal Letter Paper Preview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md font-serif text-slate-900 space-y-6">
                
                {/* Paper Header */}
                <div className="border-b-2 border-slate-900 pb-4 text-center">
                  <span className="block text-xs font-sans font-bold tracking-widest text-slate-500 uppercase">
                    SIARAN PERS RESMI
                  </span>
                  <h2 className="text-sm sm:text-base font-sans font-bold text-slate-900 tracking-wide mt-1">
                    {instansi}
                  </h2>
                  <div className="flex items-center justify-between text-[11px] font-sans text-slate-500 mt-2 font-mono">
                    <span>No: {noSurat}</span>
                    <span className="font-bold text-rose-600 uppercase">UNTUK SEGERA DISIARKAN</span>
                  </div>
                </div>

                {/* Headline */}
                <h1 className="text-base sm:text-lg font-sans font-bold text-slate-900 leading-snug text-center">
                  {title}
                </h1>

                {/* Body Content */}
                <div className="font-sans text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed">
                  <p>
                    <strong>{cityDate}</strong> – {lead}
                  </p>
                  <p>
                    {body}
                  </p>
                  <blockquote className="p-3 bg-slate-50 border-l-4 border-slate-700 italic text-slate-800">
                    {quote}
                  </blockquote>
                </div>

                {/* Media Contact Footer */}
                <div className="border-t border-slate-200 pt-4 font-sans text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-slate-800 block mb-1">Narahubung Media (Media Relations):</span>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{contactName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{contactEmail}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    onClick={copyRelease}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-sans font-bold text-xs flex items-center justify-center gap-2 shadow"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Naskah Siaran Pers Berhasil Disalin' : 'Salin Format Siaran Pers'}</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
