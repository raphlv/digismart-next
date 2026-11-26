'use client';

import React, { useState } from 'react';
import { useDigismart } from '@/lib/digismartContext';
import { TrendingUp } from 'lucide-react';

export default function IssueMonitoringChart() {
  const { trendData } = useDigismart();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const rawMax = Math.max(0, ...trendData.map((d) => Math.max(d.isu, d.berita)));
  const maxValue = Math.max(8, Math.ceil(rawMax / 4) * 4);
  const yTicks = [0, 1, 2, 3, 4].map((step) => Math.round((maxValue / 4) * step));
  const height = 240;
  const width = 600;
  const paddingX = 45;
  const paddingY = 30;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  const pointsIsu = trendData.map((d, i) => {
    const x = paddingX + (i / (trendData.length - 1)) * graphWidth;
    const y = height - paddingY - (d.isu / maxValue) * graphHeight;
    return { x, y, day: d.day, val: d.isu };
  });

  const pointsBerita = trendData.map((d, i) => {
    const x = paddingX + (i / (trendData.length - 1)) * graphWidth;
    const y = height - paddingY - (d.berita / maxValue) * graphHeight;
    return { x, y, day: d.day, val: d.berita };
  });

  const makeSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    return pts.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x},${pt.y}`;
      const prev = arr[i - 1];
      const cp1x = prev.x + (pt.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (pt.x - prev.x) / 2;
      const cp2y = pt.y;
      return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pt.x},${pt.y}`;
    }, '');
  };

  const pathIsu = makeSmoothPath(pointsIsu);
  const pathBerita = makeSmoothPath(pointsBerita);

  return (
    <div className="bg-white dark:bg-[#0B1120] rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm sm:text-base font-display font-bold text-slate-900 dark:text-white">
            Monitoring Isu dan Berita
          </h2>
        </div>
      </div>

      {/* SVG Line Chart */}
      <div className="relative flex-1 w-full pt-4 min-h-[220px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Dynamic Y Axis Grid Lines & Labels */}
          {yTicks.map((val) => {
            const y = height - paddingY - (val / maxValue) * graphHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 12}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 dark:fill-slate-500 font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Lines */}
          <path
            d={pathIsu}
            fill="none"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={pathBerita}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Interactive Data Points */}
          {pointsIsu.map((pt, i) => (
            <circle
              key={`isu-${i}`}
              cx={pt.x}
              cy={pt.y}
              r={hoveredIndex === i ? 5 : 3.5}
              className="fill-white dark:fill-slate-900 stroke-blue-600 stroke-2 cursor-pointer transition-all"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}

          {pointsBerita.map((pt, i) => (
            <circle
              key={`berita-${i}`}
              cx={pt.x}
              cy={pt.y}
              r={hoveredIndex === i ? 5 : 3.5}
              className="fill-white dark:fill-slate-900 stroke-cyan-500 stroke-2 cursor-pointer transition-all"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}

          {/* X Axis Labels: Sen, Sel, Rab, Kam, Jum, Sab, Min */}
          {trendData.map((d, i) => {
            const x = paddingX + (i / (trendData.length - 1)) * graphWidth;
            return (
              <text
                key={`label-${i}`}
                x={x}
                y={height - 8}
                textAnchor="middle"
                className="text-[11px] fill-slate-500 dark:fill-slate-400 font-medium"
              >
                {d.day}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute z-10 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg p-2 shadow-lg border border-slate-700 pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(pointsIsu[hoveredIndex].x / width) * 100}%`,
              top: `${(Math.min(pointsIsu[hoveredIndex].y, pointsBerita[hoveredIndex].y) / height) * 100 - 10}%`,
            }}
          >
            <div className="font-bold border-b border-slate-700 pb-1 mb-1">
              {trendData[hoveredIndex].day}
            </div>
            <div className="flex items-center justify-between gap-3 text-blue-400">
              <span>Isu:</span>
              <span className="font-bold font-mono">{trendData[hoveredIndex].isu}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-cyan-400">
              <span>Berita:</span>
              <span className="font-bold font-mono">{trendData[hoveredIndex].berita}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
