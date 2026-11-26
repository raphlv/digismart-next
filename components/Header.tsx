'use client';

import React, { useState } from 'react';
import { useDigismart } from '@/lib/digismartContext';
import { Bell, Moon, Sun, RotateCcw, Check } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  icon?: React.ElementType;
  actionButton?: React.ReactNode;
}

export default function Header({
  title = 'Dashboard DIGISMART',
  subtitle = 'AI Command Center — Komunikasi Publik Digital',
  icon: Icon,
  actionButton,
}: HeaderProps) {
  const { darkMode, toggleDarkMode, resetAllData, issues, articles, mediaSummary } = useDigismart();
  const [resetDone, setResetDone] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications: string[] = [];
  if (mediaSummary) {
    notifications.push(
      `Monitoring ${mediaSummary.totalMedia} Media (${mediaSummary.query}): Sentimen ${mediaSummary.overallPolarity.toUpperCase()} (${mediaSummary.averageScore}%).`
    );
  }
  issues.slice(0, 2).forEach((iss) => {
    notifications.push(`[${iss.severity.toUpperCase()}] ${iss.title} (${iss.platform})`);
  });
  articles.slice(0, 2).forEach((art) => {
    notifications.push(`Naskah dibuat: ${art.title}`);
  });

  const handleReset = () => {
    if (confirm('Kosongkan semua data dan mulai testing dari 0 (fresh)?')) {
      resetAllData();
      setResetDone(true);
      setTimeout(() => setResetDone(false), 2000);
    }
  };

  return (
    <header className="bg-white dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-30 transition-colors no-print">
      <div className="flex flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        {/* Left: Page Icon + Title & Subtitle */}
        <div className="flex items-center gap-3.5 min-w-0">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-tight truncate">
              {title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: Action Button (optional) + Reset Button + Notifications & Dark Mode Toggle */}
        <div className="flex items-center gap-2 flex-shrink-0 relative">
          {actionButton}

          <button
            type="button"
            onClick={handleReset}
            className="h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1.5 transition-all text-xs font-semibold active:scale-95"
            title="Kosongkan Data (Mulai dari 0)"
          >
            {resetDone ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <RotateCcw className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{resetDone ? 'Telah Dikosongkan' : 'Reset ke 0'}</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen((prev) => !prev)}
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center transition-all active:scale-95 relative"
              aria-label="Notifikasi"
              title="Notifikasi Aktivitas"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-1.5 right-1.5" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Aktivitas Terbaru
                  </span>
                  <button
                    type="button"
                    onClick={() => setNotifOpen(false)}
                    className="text-[11px] text-slate-400 hover:text-slate-600"
                  >
                    Tutup
                  </button>
                </div>
                {notifications.length > 0 ? (
                  <ul className="space-y-1.5 max-h-56 overflow-y-auto">
                    {notifications.map((msg, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800"
                      >
                        {msg}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 py-3 text-center">
                    Belum ada aktivitas baru.
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center transition-all active:scale-95"
            aria-label="Ubah Tema"
            title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}
