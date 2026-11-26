'use client';

import React from 'react';
import { useDigismart } from '@/lib/digismartContext';
import { Flame, Hash, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function TrendingKeywords() {
  const { trendingKeywords } = useDigismart();

  return (
    <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <h2 className="text-sm sm:text-base font-display font-bold text-slate-900 dark:text-white">
            Trending Keywords & Isu Publik Terkini
          </h2>
        </div>
        <Link
          href="/social-listening"
          className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 flex items-center gap-1 group"
        >
          <span>Buka Social Listening</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {trendingKeywords.length > 0 ? (
        <div className="flex flex-wrap gap-2.5">
          {trendingKeywords.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer group"
            >
              <Hash className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {item.keyword}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {item.count}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  item.sentiment === 'positif'
                    ? 'bg-emerald-500'
                    : item.sentiment === 'negatif'
                    ? 'bg-rose-500'
                    : 'bg-blue-400'
                }`}
                title={`Sentimen: ${item.sentiment}`}
              ></span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Jalankan analisis 10 media pada menu Sentiment Analysis untuk memetakan kata kunci dominan secara real-time.
        </p>
      )}
    </div>
  );
}
