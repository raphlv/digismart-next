'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  MessagesSquare, 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  Calendar, 
  Image as ImageIcon, 
  Hash, 
  Instagram, 
  Twitter, 
  Linkedin,
  Clock
} from 'lucide-react';

export default function SocialMediaPage() {
  const [platform, setPlatform] = useState<'instagram' | 'twitter' | 'linkedin'>('instagram');
  const [caption, setCaption] = useState(
    'Transformasi digital kampus bukan sekadar teknologi, melainkan komitmen menghadirkan layanan akademik yang cepat, transparan, dan inklusif bagi seluruh mahasiswa! 🎓✨\n\nSimak info pembaruan server dan panduan KRS semester ini selengkapnya di tautan bio ya Rekan Muda!'
  );
  const [hashtags, setHashtags] = useState('#KampusDigital #InovasiPendidikan #MahasiswaUnggul #HumasDigital');
  const [scheduleTime, setScheduleTime] = useState('Hari ini, 19:00 WIB (Peak Hours)');
  const [copied, setCopied] = useState(false);

  const copyPost = () => {
    navigator.clipboard.writeText(`${caption}\n\n${hashtags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header 
          title="Social Media Planner & Previewer" 
          subtitle="Manajemen Konten Multi-Platform, Optimasi Tagar, & Pratinjau Feed Interaktif" 
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Composer */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-display font-bold text-slate-900">
                  Composer Konten Media Sosial
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {caption.length} karakter
                </span>
              </div>

              {/* Platform Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilih Kanal Publikasi:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlatform('instagram')}
                    className={`
                      py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all
                      ${platform === 'instagram' ? 'bg-pink-50 border-pink-300 text-pink-700' : 'bg-slate-50 border-slate-200 text-slate-600'}
                    `}
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlatform('twitter')}
                    className={`
                      py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all
                      ${platform === 'twitter' ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-slate-50 border-slate-200 text-slate-600'}
                    `}
                  >
                    <Twitter className="w-4 h-4" />
                    <span>X / Twitter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlatform('linkedin')}
                    className={`
                      py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all
                      ${platform === 'linkedin' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'}
                    `}
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </button>
                </div>
              </div>

              {/* Caption Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Caption / Postingan
                </label>
                <textarea
                  rows={6}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Tuliskan naskah postingan yang menarik audiens..."
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed"
                />
              </div>

              {/* Hashtag Recommendation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rekomendasi Tagar (Hashtags)
                </label>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                />
              </div>

              {/* Schedule Info */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Waktu Tayang Optimal: <strong>{scheduleTime}</strong></span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyPost}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Berhasil Disalin!' : 'Salin Siap Posting'}</span>
                </button>
              </div>
            </div>

            {/* Right: Live Interactive Mockup Preview */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col items-center">
                <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Pratinjau Tampilan ({platform.toUpperCase()})
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold font-mono">
                    Ready to Publish
                  </span>
                </div>

                {/* Smartphone / Social Mockup Card */}
                <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
                  {/* Mockup Header */}
                  <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                        H
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-900 leading-tight">
                          Humas & Komunikasi Publik
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono">
                          @humas_official • Resmi
                        </span>
                      </div>
                    </div>
                    <span className="text-slate-400 font-bold">•••</span>
                  </div>

                  {/* Mockup Image Banner */}
                  <div className="h-44 bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center p-4 text-center text-white relative">
                    <Sparkles className="w-8 h-8 text-blue-200 mb-1" />
                    <span className="font-display font-bold text-sm tracking-tight">
                      TRANSFORMASI DIGITAL KAMPUS
                    </span>
                    <span className="text-[10px] text-blue-100 mt-1 max-w-xs">
                      Pembaruan Layanan & Infrastruktur Akademik Terpadu
                    </span>
                  </div>

                  {/* Mockup Caption */}
                  <div className="p-3.5 space-y-2">
                    <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                      {caption}
                    </p>
                    <p className="text-xs text-blue-600 font-medium font-mono">
                      {hashtags}
                    </p>
                    <span className="block text-[10px] text-slate-400 font-mono pt-1">
                      Dipublikasikan pada {scheduleTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
