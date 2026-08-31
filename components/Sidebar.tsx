'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  Activity,
  Radio,
  Zap,
  MessagesSquare,
  FileText,
  BookOpen,
  Cpu,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'News Generator', href: '/news-generator', icon: Newspaper, badge: 'AI' },
  { name: 'Sentiment Analysis', href: '/sentiment-analysis', icon: Activity },
  { name: 'Social Listening', href: '/social-listening', icon: Radio, badge: 'Live' },
  { name: 'Quick Response', href: '/quick-response', icon: Zap, badge: 'Crisis' },
  { name: 'Social Media', href: '/social-media', icon: MessagesSquare },
  { name: 'Press Release', href: '/press-release', icon: FileText },
  { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen, badge: 'Edukasi' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar with Hamburger */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#0B1120] text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-slate-800/80 text-slate-200 hover:bg-slate-700 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Buka Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-glow-blue">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-wide text-white">DIGISMART</span>
              <span className="block text-[10px] text-blue-400 font-medium -mt-1">AI Public Communication</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1"></span>
            Online
          </span>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Main Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B1120] border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Branding Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-glow-blue group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg tracking-wider text-white">DIGISMART</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold">v2.0</span>
              </div>
              <span className="block text-xs text-slate-400 font-medium">AI Public Communication</span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Universal Digital Communication Hub Banner */}
        <div className="px-4 pt-4 pb-2">
          <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-800/50 border border-blue-500/30 rounded-xl p-3">
            <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Pusat Komunikasi Digital</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Sistem terpadu pemantauan isu, generator warta & mitigasi krisis publik berbasis AI.
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5 no-scrollbar">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
            Menu Utama
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`
                      text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0
                      ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badge === 'AI'
                          ? 'bg-blue-500/20 text-blue-400'
                          : item.badge === 'Live'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : item.badge === 'Crisis'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }
                    `}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer (Developed by Pangeran Ryan) */}
        <div className="p-4 border-t border-slate-800 bg-[#070D18]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-xs text-slate-400 font-mono">Powered by</span>
            </div>
            <span className="text-xs font-bold text-blue-400 font-mono tracking-wide">Pangeran Ryan</span>
          </div>
        </div>
      </aside>
    </>
  );
}
