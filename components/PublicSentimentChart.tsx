'use client';

import React from 'react';
import { useDigismart } from '@/lib/digismartContext';
import { BarChart2 } from 'lucide-react';

export default function PublicSentimentChart() {
  const { sentiment } = useDigismart();

  const total = sentiment.positif + sentiment.netral + sentiment.negatif;
  const posPct = total > 0 ? (sentiment.positif / total) * 100 : 0;
  const netPct = total > 0 ? (sentiment.netral / total) * 100 : 0;
  const negPct = total > 0 ? (sentiment.negatif / total) * 100 : 0;

  // Donut geometry
  const radius = 62;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  const posStroke = (posPct / 100) * circumference;
  const netStroke = (netPct / 100) * circumference;
  const negStroke = (negPct / 100) * circumference;

  const posOffset = 0;
  const netOffset = -posStroke;
  const negOffset = -(posStroke + netStroke);

  return (
    <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col h-full justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm sm:text-base font-display font-bold text-slate-900 dark:text-white">
            Sentimen Publik
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {total > 0 ? `${total} Data` : 'Mulai dari 0'}
        </span>
      </div>

      {/* Donut Chart Visual */}
      <div className="flex items-center justify-center my-6 relative">
        <svg width="180" height="180" className="transform -rotate-90">
          {/* Base Track */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            className="text-slate-100 dark:text-slate-800"
            strokeWidth={strokeWidth}
          />
          {total > 0 && (
            <>
              {/* Positif (Green) */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="transparent"
                stroke="#10B981"
                strokeWidth={strokeWidth}
                strokeDasharray={`${posStroke} ${circumference}`}
                strokeDashoffset={posOffset}
                strokeLinecap="butt"
              />
              {/* Netral (Blue) */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="transparent"
                stroke="#3B82F6"
                strokeWidth={strokeWidth}
                strokeDasharray={`${netStroke} ${circumference}`}
                strokeDashoffset={netOffset}
                strokeLinecap="butt"
              />
              {/* Negatif (Red) */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="transparent"
                stroke="#EF4444"
                strokeWidth={strokeWidth}
                strokeDasharray={`${negStroke} ${circumference}`}
                strokeDashoffset={negOffset}
                strokeLinecap="butt"
              />
            </>
          )}
        </svg>

        {total === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">0%</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">Belum Ada Data</span>
          </div>
        )}
      </div>

      {/* Inline Legend */}
      <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Positif {Math.round(posPct)}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>Netral {Math.round(netPct)}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span>Negatif {Math.round(negPct)}%</span>
        </div>
      </div>
    </div>
  );
}
