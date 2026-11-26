'use client';

import React from 'react';
import {
  FileText,
  Radio,
  BarChart2,
  Zap,
} from 'lucide-react';
import { StatItem } from '@/lib/digismartData';

interface StatCardProps {
  item: StatItem;
}

const ICON_MAP: Record<string, React.ElementType> = {
  FileText,
  Radio,
  Activity: BarChart2,
  Zap,
};

export default function StatCard({ item }: StatCardProps) {
  const Icon = ICON_MAP[item.iconName] || FileText;

  return (
    <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Icon className="w-5 h-5" />
        </div>

        {/* Change Badge */}
        <div
          className={`
            inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold font-mono
            ${item.isPositive
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40'
            }
          `}
        >
          <span>{item.change}</span>
        </div>
      </div>

      {/* Metric Value & Label */}
      <div className="mt-4">
        <div className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
          {item.value}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
          {item.title}
        </div>
      </div>
    </div>
  );
}
