'use client';

import React from 'react';
import { 
  FileText, 
  Radio, 
  Activity, 
  Zap, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';
import { StatItem } from '@/lib/digismartData';

interface StatCardProps {
  item: StatItem;
}

const ICON_MAP: Record<string, React.ElementType> = {
  FileText,
  Radio,
  Activity,
  Zap,
};

export default function StatCard({ item }: StatCardProps) {
  const Icon = ICON_MAP[item.iconName] || Activity;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-blue-50/80 border border-blue-100/80 flex items-center justify-center text-blue-600">
          <Icon className="w-5 h-5" />
        </div>

        {/* Change Badge */}
        <div
          className={`
            inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold font-mono
            ${
              item.isPositive
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                : 'bg-rose-50 text-rose-600 border border-rose-200/60'
            }
          `}
        >
          {item.isPositive ? (
            <TrendingUp className="w-3 h-3 text-emerald-600" />
          ) : (
            <TrendingDown className="w-3 h-3 text-rose-600" />
          )}
          <span>{item.change}</span>
        </div>
      </div>

      {/* Metric Value & Label */}
      <div className="mt-4">
        <div className="text-3xl font-display font-bold text-slate-900 tracking-tight">
          {item.value}
        </div>
        <div className="text-xs text-slate-500 font-medium mt-1">
          {item.title}
        </div>
      </div>
    </div>
  );
}
