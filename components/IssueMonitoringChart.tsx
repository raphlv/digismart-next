'use client';

import React, { useState } from 'react';
import { useDigismart } from '@/lib/digismartContext';
import { TrendingUp, Info } from 'lucide-react';

export default function IssueMonitoringChart() {
  const { trendData } = useDigismart();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = Math.max(...trendData.map((d) => Math.max(d.isu, d.berita, 30)));
  const height = 240;
  const width = 600;
  const paddingX = 40;
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
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm sm:text-base font-display font-bold text-slate-900">
            Monitoring Isu dan Berita
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="text-slate-600 font-medium">Isu Terpantau</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span className="text-slate-600 font-medium">Berita Diterbitkan</span>
          </div>
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="relative flex-1 w-full pt-4 min-h-[220px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Y Axis Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = height - paddingY - pct * graphHeight;
            const val = Math.round(pct * maxValue);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
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
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {pointsIsu.map((pt, i) => (
            <g key={`isu-${i}`}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIndex === i ? 5 : 3.5}
                className="fill-white stroke-blue-600 stroke-2 cursor-pointer transition-all"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          ))}

          {pointsBerita.map((pt, i) => (
            <g key={`berita-${i}`}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIndex === i ? 5 : 3.5}
                className="fill-white stroke-sky-400 stroke-2 cursor-pointer transition-all"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          ))}

          {/* X Axis Labels */}
          {trendData.map((d, i) => {
            const x = paddingX + (i / (trendData.length - 1)) * graphWidth;
            return (
              <text
                key={`label-${i}`}
                x={x}
                y={height - 8}
                textAnchor="middle"
                className="text-[11px] fill-slate-600 font-medium"
              >
                {d.day}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute z-10 bg-slate-900 text-white text-xs rounded-lg p-2 shadow-lg border border-slate-700 pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(pointsIsu[hoveredIndex].x / width) * 100}%`,
              top: `${(Math.min(pointsIsu[hoveredIndex].y, pointsBerita[hoveredIndex].y) / height) * 100 - 10}%`,
            }}
          >
            <div className="font-bold border-b border-slate-700 pb-1 mb-1">
              Hari {trendData[hoveredIndex].day}
            </div>
            <div className="flex items-center justify-between gap-3 text-blue-300">
              <span>Isu:</span>
              <span className="font-bold font-mono">{trendData[hoveredIndex].isu}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sky-300">
              <span>Berita:</span>
              <span className="font-bold font-mono">{trendData[hoveredIndex].berita}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Periode pemantauan 7 hari terakhir</span>
        <span className="font-medium text-slate-600">Frekuensi: Real-Time Stream</span>
      </div>
    </div>
  );
}
