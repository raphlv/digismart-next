'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  BarChart2,
  Radio,
  Zap,
  MessageSquare,
  FileText,
  BookOpen,
  Cpu,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'News & Press Release', href: '/news-generator', icon: Newspaper },
  { name: 'Sentiment Analysis', href: '/sentiment-analysis', icon: BarChart2 },
  { name: 'Social Listening', href: '/social-listening', icon: Radio },
  { name: 'Quick Response', href: '/quick-response', icon: Zap },
  { name: 'Social Media', href: '/social-media', icon: MessageSquare },
  { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#0F172A] dark:bg-[#070D18] text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 active:scale-95 transition-all"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-wide text-white">DIGISMART</span>
              <span className="block text-[10px] text-blue-400 font-medium -mt-1">AI Public Communication</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B1120] dark:bg-[#060913] border-r border-slate-800/80 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Branding */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-wider text-white block">DIGISMART</span>
              <span className="text-xs text-slate-400 font-medium block">AI Public Communication</span>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const normalizedPath = pathname?.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
            const normalizedHref = item.href.endsWith('/') && item.href.length > 1 ? item.href.slice(0, -1) : item.href;
            const isActive = normalizedPath === normalizedHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }
                `}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer: Powered by AI Engine v2.0 */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="bg-[#111827] rounded-xl p-3.5 border border-slate-800 flex flex-col justify-center">
            <span className="text-[11px] text-slate-400">Powered by</span>
            <span className="text-xs font-bold text-blue-400 font-mono mt-0.5 tracking-wide">
              AI Engine v2.0
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
