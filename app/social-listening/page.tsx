'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useDigismart } from '@/lib/digismartContext';
import { 
  Radio, 
  Filter, 
  MessageSquare, 
  Heart, 
  Share2, 
  AlertOctagon, 
  ShieldAlert, 
  PlusCircle, 
  Send,
  Zap,
  Globe,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function SocialListeningPage() {
  const { socialPosts, addSocialPost } = useDigismart();
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Post Form
  const [author, setAuthor] = useState('');
  const [handle, setHandle] = useState('');
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState<'twitter' | 'instagram' | 'tiktok' | 'news'>('twitter');
  const [sentiment, setSentiment] = useState<'positif' | 'netral' | 'negatif'>('negatif');
  const [crisisLevel, setCrisisLevel] = useState<'low' | 'medium' | 'high'>('medium');

  const filteredPosts = socialPosts.filter((post) => {
    if (platformFilter !== 'all' && post.platform !== platformFilter) return false;
    if (sentimentFilter !== 'all' && post.sentiment !== sentimentFilter) return false;
    return true;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !content) return;

    addSocialPost({
      platform,
      author,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      content,
      sentiment,
      engagement: { likes: Math.floor(Math.random() * 200) + 20, shares: Math.floor(Math.random() * 50), comments: Math.floor(Math.random() * 30) },
      crisisLevel,
      topic: 'Isu Terbuka Simulasi',
    });

    setAuthor('');
    setHandle('');
    setContent('');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header 
          title="Social Listening & Issue Tracker" 
          subtitle="Pemantauan Percakapan Netizen Multi-Platform & Deteksi Dini Anomali Isu Publik" 
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Action Toolbar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter Platform:</span>
              </div>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 cursor-pointer"
              >
                <option value="all">Semua Platform</option>
                <option value="twitter">X / Twitter</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="news">Portal Berita</option>
              </select>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium ml-2">
                <span>Sentimen:</span>
              </div>
              <select
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value)}
                className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 cursor-pointer"
              >
                <option value="all">Semua Sentimen</option>
                <option value="positif">Positif</option>
                <option value="netral">Netral</option>
                <option value="negatif">Negatif</option>
              </select>
            </div>

            {/* Injeksi Isu Simulasi Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simulasikan Postingan Netizen</span>
            </button>
          </div>

          {/* Social Feed List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPosts.map((post) => {
              const isCrisis = post.crisisLevel === 'high' || post.sentiment === 'negatif';
              return (
                <div
                  key={post.id}
                  className={`
                    bg-white rounded-2xl p-5 border shadow-sm transition-all flex flex-col justify-between
                    ${isCrisis ? 'border-rose-200/90 ring-1 ring-rose-200' : 'border-slate-200/90'}
                  `}
                >
                  <div>
                    {/* Author Bar */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.avatar}
                          alt={post.author}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-bold text-slate-900">
                              {post.author}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {post.handle}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                            <span className="uppercase font-bold text-blue-600">{post.platform}</span>
                            <span>•</span>
                            <span>{post.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`
                            text-[10px] font-bold px-2 py-0.5 rounded-full uppercase
                            ${
                              post.sentiment === 'positif'
                                ? 'bg-emerald-100 text-emerald-700'
                                : post.sentiment === 'negatif'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-blue-100 text-blue-700'
                            }
                          `}
                        >
                          {post.sentiment}
                        </span>
                        {post.crisisLevel === 'high' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-600 text-white uppercase animate-pulse">
                            High Risk
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {post.content}
                    </p>

                    {/* Topic Badge */}
                    <div className="mt-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                        Topik: {post.topic}
                      </span>
                    </div>
                  </div>

                  {/* Footer Engagement & Action */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        {post.engagement.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-3.5 h-3.5 text-blue-500" />
                        {post.engagement.shares}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                        {post.engagement.comments}
                      </span>
                    </div>

                    {post.sentiment === 'negatif' ? (
                      <Link
                        href="/quick-response"
                        className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Respon Cepat</span>
                      </Link>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-semibold">Terkendali</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Injeksi Postingan Simulasi */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-display font-bold text-slate-900">
                    Simulasikan Percakapan Publik Baru
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-slate-400 hover:text-slate-700 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreatePost} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nama Netizen</label>
                      <input
                        type="text"
                        required
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Username / Handle</label>
                      <input
                        type="text"
                        required
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="@budisantoso"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Platform</label>
                      <select
                        value={platform}
                        onChange={(e: any) => setPlatform(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                      >
                        <option value="twitter">X / Twitter</option>
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="news">Portal Berita</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sentimen</label>
                      <select
                        value={sentiment}
                        onChange={(e: any) => setSentiment(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                      >
                        <option value="negatif">Negatif (Krisis)</option>
                        <option value="netral">Netral</option>
                        <option value="positif">Positif</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Risiko</label>
                      <select
                        value={crisisLevel}
                        onChange={(e: any) => setCrisisLevel(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                      >
                        <option value="low">Rendah (Low)</option>
                        <option value="medium">Sedang (Med)</option>
                        <option value="high">Krisis (High)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Isi Percakapan / Opini</label>
                    <textarea
                      rows={3}
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Ketik isi postingan atau keluhan netizen..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow"
                    >
                      Simpan ke Feed
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
