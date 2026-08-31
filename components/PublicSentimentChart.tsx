'use client';

import React from 'react';
import { useDigismart } from '@/lib/digismartContext';
import { PieChart, Smile, Meh, Frown } from 'lucide-react';

export default function PublicSentimentChart() {
  const { sentiment } = useDigismart();

  const total = sentiment.positif + sentiment.netral + sentiment.negatif;
  const posPct = total > 0 ? (sentiment.positif / total) * 100 : 0;
  const netPct = total > 0 ? (sentiment.netral / total) * 100 : 0;
  const negPct = total > 0 ? (sentiment.negatif / total) * 100 : 0;

  // SVG Donut calculation
  const radius = 64;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  const posStroke = (posPct / 100) * circumference;
  const netStroke = (netPct / 100) * circumference;
  const negStroke = (negPct / 100) * circumference;

  const posOffset = 0;
  const netOffset = -posStroke;
  const negOffset = -(posStroke + netStroke);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col h-full justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm sm:text-base font-display font-bold text-slate-900">
            Sentimen Publik
          </h2>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
          Total 100%
        </span>
      </div>

      {/* Donut Chart Visual */}
      <div className="flex items-center justify-center my-4 relative">
        <svg width="180" height="180" className="transform -rotate-90">
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
          {/* Negatif (Rose) */}
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
        </svg>

        {/* Center Summary */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-2xl font-display font-bold text-slate-900">
            {sentiment.positif}%
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">
            Dominan Positif
          </span>
        </div>
      </div>

      {/* Legend & Breakdown (Exact as in photo) */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="grid grid-cols-3 gap-2">
          {/* Positif */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Positif</span>
            </div>
            <div className="text-sm font-bold text-emerald-800 font-mono mt-0.5">
              {sentiment.positif}%
            </div>
          </div>

          {/* Netral */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-700">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Netral</span>
            </div>
            <div className="text-sm font-bold text-blue-800 font-mono mt-0.5">
              {sentiment.netral}%
            </div>
          </div>

          {/* Negatif */}
          <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-rose-700">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Negatif</span>
            </div>
            <div className="text-sm font-bold text-rose-800 font-mono mt-0.5">
              {sentiment.negatif}%
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 text-center leading-relaxed mt-1">
          {sentiment.negatif > 40
            ? '⚠️ Peringatan: Sentimen negatif tinggi. Direkomendasikan segera menyusun pernyataan klarifikasi humas.'
            : '✅ Indeks penerimaan publik berada dalam kondisi stabil dan kondusif.'}
        </p>
      </div>
    </div>
  );
}
