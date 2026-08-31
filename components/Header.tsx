'use client';

import React from 'react';
import { useDigismart } from '@/lib/digismartContext';
import { 
  Sparkles, 
  RotateCcw, 
  Layers, 
  Bell, 
  Search,
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({ 
  title = 'Dashboard DIGISMART', 
  subtitle = 'AI Command Center - Komunikasi Publik Digital' 
}: HeaderProps) {
  const { activeScenario, setActiveScenario, resetSimulation } = useDigismart();

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-30 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Title and Subtitle */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-display font-bold text-slate-900 tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-xs text-slate-500 font-medium truncate">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Action Controls & Simulation Scenario Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Scenario Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <Layers className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span className="text-slate-500 font-medium hidden sm:inline">Skenario Latihan:</span>
            <select
              value={activeScenario}
              onChange={(e) => setActiveScenario(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 text-xs focus:outline-none cursor-pointer"
            >
              <option value="Umum (Default)">Umum (Default)</option>
              <option value="Krisis Server KRS">Krisis Server KRS (Negatif)</option>
              <option value="Peluncuran Beasiswa Prestasi">Peluncuran Beasiswa (Positif)</option>
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetSimulation}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
            title="Reset Simulasi ke Awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
