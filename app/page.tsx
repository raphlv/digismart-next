'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import IssueMonitoringChart from '@/components/IssueMonitoringChart';
import PublicSentimentChart from '@/components/PublicSentimentChart';
import TrendingKeywords from '@/components/TrendingKeywords';
import { useDigismart } from '@/lib/digismartContext';
import { Globe } from 'lucide-react';

export default function DashboardPage() {
  const { stats } = useDigismart();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#060913] flex flex-col lg:flex-row transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Header */}
        <Header 
          title="Dashboard DIGISMART" 
          subtitle="AI Command Center — Komunikasi Publik Digital"
          icon={Globe}
        />

        {/* Dashboard Body */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* 4 Stat Cards */}
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

          {/* Trending Keywords from 10-Media Monitoring */}
          <TrendingKeywords />
        </main>
      </div>
    </div>
  );
}
