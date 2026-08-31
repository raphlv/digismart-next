'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import IssueMonitoringChart from '@/components/IssueMonitoringChart';
import PublicSentimentChart from '@/components/PublicSentimentChart';
import TrendingKeywords from '@/components/TrendingKeywords';
import { useDigismart } from '@/lib/digismartContext';
import Link from 'next/link';
import { 
  Sparkles, 
  Newspaper, 
  Activity, 
  Zap, 
  FileText, 
  Radio, 
  ArrowRight,
  ShieldAlert,
  Bot,
  GraduationCap
} from 'lucide-react';

export default function DashboardPage() {
  const { stats, articles, socialPosts } = useDigismart();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Header */}
        <Header 
          title="Dashboard DIGISMART" 
          subtitle="AI Command Center - Komunikasi Publik Digital" 
        />

        {/* Dashboard Body */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Quick Scenario Info Banner for Students */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md mb-2.5">
                <Bot className="w-3.5 h-3.5 text-blue-200" />
                <span>AI Public Communication Hub v2.0</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold tracking-tight">
                Pusat Komando & Simulasi Kehumasan Digital
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-1.5 leading-relaxed">
                Pantau dinamika percakapan publik, buat siaran pers otomatis berbasis AI 5W+1H, analisa polaritas sentimen netizen, dan lakukan simulasi respons krisis dalam hitungan menit.
              </p>
              
              {/* Quick Actions Shortcuts */}
              <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-4 border-t border-white/15">
                <Link
                  href="/news-generator"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-blue-900 text-xs font-bold shadow hover:bg-blue-50 active:scale-95 transition-all"
                >
                  <Newspaper className="w-3.5 h-3.5 text-blue-600" />
                  <span>Generate Berita AI</span>
                </Link>
                <Link
                  href="/sentiment-analysis"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 text-white hover:bg-white/30 text-xs font-semibold backdrop-blur-md active:scale-95 transition-all"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Uji Sentimen Teks</span>
                </Link>
                <Link
                  href="/quick-response"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 text-white hover:bg-white/30 text-xs font-semibold backdrop-blur-md active:scale-95 transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Holding Statement Krisis</span>
                </Link>
                <Link
                  href="/knowledge-base"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 text-white hover:bg-white/30 text-xs font-semibold backdrop-blur-md active:scale-95 transition-all"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-sky-200" />
                  <span>Modul Belajar</span>
                </Link>
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-400/20 to-transparent pointer-events-none hidden md:block"></div>
          </div>

          {/* 4 Stat Cards (As seen in the photo) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {stats.map((stat) => (
              <StatCard key={stat.id} item={stat} />
            ))}
          </div>

          {/* Charts Row (Line Chart + Donut Chart) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left 2 Cols: Monitoring Isu dan Berita */}
            <div className="lg:col-span-2">
              <IssueMonitoringChart />
            </div>

            {/* Right 1 Col: Sentimen Publik */}
            <div className="lg:col-span-1">
              <PublicSentimentChart />
            </div>
          </div>

          {/* Trending Keywords */}
          <TrendingKeywords />

          {/* Recent Feeds & Articles Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Recent AI News Generated */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-display font-bold text-slate-900">
                      Draf Berita & Siaran Terakhir
                    </h3>
                  </div>
                  <Link
                    href="/news-generator"
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    <span>Buat Berita Baru</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {articles.length > 0 ? (
                  <div className="space-y-3">
                    {articles.slice(0, 2).map((art) => (
                      <div
                        key={art.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-200 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-mono">
                            {art.topic}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {art.timestamp}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                          {art.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {art.leadParagraph}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    Belum ada draf berita yang dibuat.
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Divalidasi dengan standar jurnalistik 5W+1H</span>
                <Link href="/news-generator" className="text-blue-600 font-semibold hover:underline">
                  Kelola Semua ({articles.length})
                </Link>
              </div>
            </div>

            {/* Social Listening Live Stream Preview */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-display font-bold text-slate-900">
                      Social Listening Feed Terbaru
                    </h3>
                  </div>
                  <Link
                    href="/social-listening"
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                  >
                    <span>Lihat Semua Feed</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {socialPosts.slice(0, 2).map((post) => (
                    <div
                      key={post.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-200 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">
                            {post.author}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {post.handle}
                          </span>
                        </div>
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
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {post.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Multi-platform: X/Twitter, Instagram, TikTok</span>
                <Link href="/social-listening" className="text-emerald-600 font-semibold hover:underline">
                  Pantau Isu ({socialPosts.length})
                </Link>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
