'use client';

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
} from 'docx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MediaArticle } from './digismartData';
import { TenMediaSummary, formatIndonesianDateTime } from './sentimentEngine';

export interface ExportableNewsPayload {
  title: string;
  content: string;
  mode: 'news' | 'press-release';
  outputType: string;
  instansi: string;
  lokasi: string;
  narasumber: string;
  timestamp?: string;
}

export interface ExportableManualSentiment {
  inputText: string;
  polarity: 'positif' | 'netral' | 'negatif';
  score: number;
  dominantEmotion: string;
  positiveKeywords: string[];
  negativeKeywords: string[];
  recommendation: string;
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'digismart-export';
}

function makeDocxTable(headers: string[], rows: string[][]): Table {
  const border = { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' };
  const cellBorders = { top: border, bottom: border, left: border, right: border };

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(
      (h) =>
        new TableCell({
          borders: cellBorders,
          shading: { fill: '1E3A8A' },
          children: [
            new Paragraph({
              children: [new TextRun({ text: h, bold: true, color: 'FFFFFF', size: 18 })],
            }),
          ],
        })
    ),
  });

  const bodyRows = rows.map(
    (cols) =>
      new TableRow({
        children: cols.map(
          (val) =>
            new TableCell({
              borders: cellBorders,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: val || '-', size: 18, color: '1E293B' })],
                }),
              ],
            })
        ),
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...bodyRows],
  });
}

// ==========================================
// 1. NEWS & PRESS RELEASE EXPORTS (DOCX/PDF)
// ==========================================

export async function exportNewsToDocx(
  news: ExportableNewsPayload,
  mediaReferences: MediaArticle[] = [],
  sentimentSummary?: TenMediaSummary | null
): Promise<void> {
  const isPressRelease = news.mode === 'press-release';
  const dateLabel = formatIndonesianDateTime();

  const paragraphs: (Paragraph | Table)[] = [
    new Paragraph({
      alignment: isPressRelease ? AlignmentType.CENTER : AlignmentType.LEFT,
      children: [
        new TextRun({
          text: isPressRelease ? 'SIARAN PERS RESMI — DIGISMART AI' : 'NASKAH BERITA PUBLIK — DIGISMART AI',
          bold: true,
          size: 18,
          color: '2563EB',
        }),
      ],
    }),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: isPressRelease ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { before: 120, after: 160 },
      children: [new TextRun({ text: news.title, bold: true, size: 28, color: '0F172A' })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Instansi: ${news.instansi} | Lokasi: ${news.lokasi} | Narasumber: ${news.narasumber} | Format: ${news.outputType} | Tanggal: ${dateLabel}`,
          size: 18,
          italics: true,
          color: '475569',
        }),
      ],
    }),
  ];

  news.content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      paragraphs.push(new Paragraph({ text: '' }));
      return;
    }
    paragraphs.push(
      new Paragraph({
        spacing: { after: 120 },
        alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: trimmed, size: 22, color: '1E293B' })],
      })
    );
  });

  if (mediaReferences.length > 0) {
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 320, after: 120 },
        children: [
          new TextRun({
            text: `Lampiran Referensi ${mediaReferences.length} Media & Analisis Sentimen`,
            bold: true,
            size: 24,
            color: '1E3A8A',
          }),
        ],
      })
    );

    if (sentimentSummary) {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 140 },
          children: [
            new TextRun({
              text: `Topik Pantauan: ${sentimentSummary.query} | Sentimen Keseluruhan: ${sentimentSummary.overallPolarity.toUpperCase()} (Skor Rata-rata ${sentimentSummary.averageScore}%) — Positif ${sentimentSummary.positifPct}%, Netral ${sentimentSummary.netralPct}%, Negatif ${sentimentSummary.negatifPct}%.`,
              size: 20,
              color: '334155',
            }),
          ],
        })
      );
    }

    const tableRows = mediaReferences.map((art, i) => [
      String(i + 1),
      art.media,
      `${art.sentiment.toUpperCase()} (${art.score ?? 55}%)`,
      art.title,
      art.summary,
    ]);

    paragraphs.push(
      makeDocxTable(['No', 'Media', 'Sentimen', 'Judul Referensi', 'Ringkasan'], tableRows)
    );
  }

  const doc = new Document({
    sections: [{ children: paragraphs }],
  });

  const blob = await Packer.toBlob(doc);
  triggerBlobDownload(blob, `${sanitizeFilename(news.mode + '-' + news.title)}.docx`);
}

export function exportNewsToPdf(
  news: ExportableNewsPayload,
  mediaReferences: MediaArticle[] = [],
  sentimentSummary?: TenMediaSummary | null
): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 44;
  const maxWidth = pageWidth - margin * 2;
  let y = 48;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 48) {
      doc.addPage();
      y = 48;
    }
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(37, 99, 235);
  doc.text(
    news.mode === 'press-release'
      ? 'DIGISMART AI COMMAND CENTER — SIARAN PERS RESMI'
      : 'DIGISMART AI COMMAND CENTER — NASKAH BERITA PUBLIK',
    margin,
    y
  );
  y += 18;

  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(news.title, maxWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 19 + 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  const metaText = `Instansi: ${news.instansi} | Lokasi: ${news.lokasi} | Narasumber: ${news.narasumber} | Format: ${news.outputType} | ${formatIndonesianDateTime()}`;
  const metaLines = doc.splitTextToSize(metaText, maxWidth);
  doc.text(metaLines, margin, y);
  y += metaLines.length * 12 + 8;

  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);

  news.content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      y += 8;
      return;
    }
    const wrapped = doc.splitTextToSize(trimmed, maxWidth);
    ensureSpace(wrapped.length * 15 + 6);
    doc.text(wrapped, margin, y);
    y += wrapped.length * 14.5 + 5;
  });

  if (mediaReferences.length > 0) {
    ensureSpace(80);
    y += 14;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 138);
    doc.text(
      `Lampiran Referensi ${mediaReferences.length} Media & Analisis Sentimen`,
      margin,
      y
    );
    y += 14;

    if (sentimentSummary) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const sumLines = doc.splitTextToSize(
        `Topik: ${sentimentSummary.query} | Sentimen Dominan: ${sentimentSummary.overallPolarity.toUpperCase()} (${sentimentSummary.averageScore}%) — Positif ${sentimentSummary.positifPct}%, Netral ${sentimentSummary.netralPct}%, Negatif ${sentimentSummary.negatifPct}%`,
        maxWidth
      );
      doc.text(sumLines, margin, y);
      y += sumLines.length * 12 + 6;
    }

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      headStyles: { fillColor: [30, 58, 138], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 7.8, textColor: [30, 41, 59] },
      head: [['No', 'Media', 'Sentimen', 'Judul & Ringkasan']],
      body: mediaReferences.map((art, i) => [
        String(i + 1),
        art.media,
        `${art.sentiment.toUpperCase()}\n(${art.score ?? 55}%)`,
        `${art.title}\n${art.summary}`,
      ]),
    });
  }

  doc.save(`${sanitizeFilename(news.mode + '-' + news.title)}.pdf`);
}

// ==========================================
// 2. 10-MEDIA SENTIMENT ANALYSIS EXPORTS
// ==========================================

export async function exportMediaSentimentToDocx(
  articles: MediaArticle[],
  summary: TenMediaSummary
): Promise<void> {
  const children: (Paragraph | Table)[] = [
    new Paragraph({
      children: [
        new TextRun({
          text: 'LAPORAN ANALISIS SENTIMEN 10 MEDIA NASIONAL — DIGISMART AI',
          bold: true,
          size: 18,
          color: '2563EB',
        }),
      ],
    }),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 120, after: 140 },
      children: [
        new TextRun({
          text: `Monitoring & Sentimen Media: ${summary.query}`,
          bold: true,
          size: 28,
          color: '0F172A',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: `Kategori Topik: ${summary.topic} | Jumlah Media: ${summary.totalMedia} Media | Tanggal Laporan: ${summary.generatedAt}`,
          size: 18,
          italics: true,
          color: '475569',
        }),
      ],
    }),
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 140, after: 80 },
      children: [new TextRun({ text: 'Ringkasan Agregat Sentimen', bold: true, size: 22, color: '1E3A8A' })],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `Sentimen Keseluruhan: ${summary.overallPolarity.toUpperCase()} (Skor Rata-rata: ${summary.averageScore}%)`,
          bold: true,
          size: 21,
          color: '0F172A',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `Distribusi: Positif ${summary.positifCount} media (${summary.positifPct}%) | Netral ${summary.netralCount} media (${summary.netralPct}%) | Negatif ${summary.negatifCount} media (${summary.negatifPct}%)`,
          size: 20,
          color: '334155',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: `Rekomendasi Strategi Humas: ${summary.strategicRecommendation}`,
          size: 20,
          color: '1E293B',
        }),
      ],
    }),
    makeDocxTable(
      ['No', 'Media Nasional', 'Sentimen', 'Skor', 'Judul Pemberitaan', 'Ringkasan'],
      articles.map((art, i) => [
        String(i + 1),
        art.media,
        art.sentiment.toUpperCase(),
        `${art.score ?? 55}%`,
        art.title,
        art.summary,
      ])
    ),
  ];

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  triggerBlobDownload(blob, `laporan-sentimen-10-media-${sanitizeFilename(summary.query)}.docx`);
}

export function exportMediaSentimentToPdf(
  articles: MediaArticle[],
  summary: TenMediaSummary
): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const maxWidth = pageWidth - margin * 2;
  let y = 44;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(37, 99, 235);
  doc.text('DIGISMART AI — LAPORAN ANALISIS SENTIMEN 10 MEDIA NASIONAL', margin, y);
  y += 18;

  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(`Monitoring & Sentimen: ${summary.query}`, maxWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 18 + 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Topik: ${summary.topic} | Cakupan: ${summary.totalMedia} Media | Tanggal: ${summary.generatedAt}`,
    margin,
    y
  );
  y += 16;

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, maxWidth, 62, 6, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `Sentimen Dominan: ${summary.overallPolarity.toUpperCase()} (Skor Rata-rata: ${summary.averageScore}%)`,
    margin + 12,
    y + 18
  );
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(
    `Positif: ${summary.positifCount} (${summary.positifPct}%)   |   Netral: ${summary.netralCount} (${summary.netralPct}%)   |   Negatif: ${summary.negatifCount} (${summary.negatifPct}%)`,
    margin + 12,
    y + 34
  );
  const recLines = doc.splitTextToSize(`Rekomendasi: ${summary.strategicRecommendation}`, maxWidth - 24);
  doc.text(recLines[0] || '', margin + 12, y + 50);
  y += 76;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 7.8, textColor: [30, 41, 59] },
    head: [['No', 'Media', 'Sentimen', 'Judul Berita', 'Ringkasan']],
    body: articles.map((art, i) => [
      String(i + 1),
      art.media,
      `${art.sentiment.toUpperCase()}\n(${art.score ?? 55}%)`,
      art.title,
      art.summary,
    ]),
  });

  doc.save(`laporan-sentimen-10-media-${sanitizeFilename(summary.query)}.pdf`);
}

// ==========================================
// 3. MANUAL NLP SENTIMENT EXPORTS (DOCX/PDF)
// ==========================================

export async function exportManualSentimentToDocx(res: ExportableManualSentiment): Promise<void> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: 'HASIL ANALISIS SENTIMEN NLP — DIGISMART AI',
                bold: true,
                size: 18,
                color: '2563EB',
              }),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 120, after: 140 },
            children: [
              new TextRun({
                text: `Sentimen ${res.polarity.toUpperCase()} (${res.score}%)`,
                bold: true,
                size: 28,
                color: '0F172A',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 140 },
            children: [
              new TextRun({
                text: `Tanggal: ${formatIndonesianDateTime()} | Spektrum Emosi Dominan: ${res.dominantEmotion}`,
                size: 18,
                italics: true,
                color: '475569',
              }),
            ],
          }),
          makeDocxTable(
            ['Komponen Analisis', 'Detail Hasil'],
            [
              ['Teks yang Dianalisis', res.inputText],
              ['Polaritas & Skor', `${res.polarity.toUpperCase()} (${res.score}%)`],
              ['Emosi Dominan', res.dominantEmotion],
              ['Kata Kunci Positif', res.positiveKeywords.join(', ') || '-'],
              ['Kata Kunci Negatif', res.negativeKeywords.join(', ') || '-'],
              ['Rekomendasi Tindakan Humas', res.recommendation],
            ]
          ),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  triggerBlobDownload(blob, `analisis-sentimen-${res.polarity}.docx`);
}

export function exportManualSentimentToPdf(res: ExportableManualSentiment): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 44;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(37, 99, 235);
  doc.text('DIGISMART AI — HASIL ANALISIS SENTIMEN NLP', margin, 44);

  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text(`Sentimen ${res.polarity.toUpperCase()} (${res.score}%)`, margin, 66);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Tanggal: ${formatIndonesianDateTime()} | Emosi: ${res.dominantEmotion}`, margin, 82);

  autoTable(doc, {
    startY: 98,
    margin: { left: margin, right: margin },
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontSize: 8.5 },
    bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
    columnStyles: { 0: { cellWidth: 140, fontStyle: 'bold' } },
    head: [['Komponen Analisis', 'Detail Hasil']],
    body: [
      ['Teks Dianalisis', res.inputText],
      ['Polaritas & Skor', `${res.polarity.toUpperCase()} (${res.score}%)`],
      ['Emosi Dominan', res.dominantEmotion],
      ['Kata Kunci Positif', res.positiveKeywords.join(', ') || '-'],
      ['Kata Kunci Negatif', res.negativeKeywords.join(', ') || '-'],
      ['Rekomendasi Humas', res.recommendation],
    ],
  });

  doc.save(`analisis-sentimen-${res.polarity}.pdf`);
}

// ==========================================
// 4. KNOWLEDGE BASE & SOCIAL MEDIA EXPORTS
// ==========================================

export async function exportKnowledgeDocToDocx(docItem: {
  title: string;
  category: string;
  date: string;
  author: string;
  summary: string;
  content: string;
}): Promise<void> {
  await exportNewsToDocx({
    title: docItem.title,
    content: `RINGKASAN:\n${docItem.summary}\n\nISI DOKUMEN:\n${docItem.content}`,
    mode: 'press-release',
    outputType: docItem.category,
    instansi: docItem.author || 'Knowledge Repository',
    lokasi: 'Indonesia',
    narasumber: docItem.author || 'Humas & Regulasi',
  });
}

export function exportKnowledgeDocToPdf(docItem: {
  title: string;
  category: string;
  date: string;
  author: string;
  summary: string;
  content: string;
}): void {
  exportNewsToPdf({
    title: docItem.title,
    content: `RINGKASAN:\n${docItem.summary}\n\nISI DOKUMEN:\n${docItem.content}`,
    mode: 'press-release',
    outputType: docItem.category,
    instansi: docItem.author || 'Knowledge Repository',
    lokasi: 'Indonesia',
    narasumber: docItem.author || 'Humas & Regulasi',
  });
}

export async function exportSocialMediaToDocx(post: {
  topic: string;
  platform: string;
  tone: string;
  caption: string;
  hashtags: string;
  visualIdea: string;
  bestTime: string;
}): Promise<void> {
  await exportNewsToDocx({
    title: `Konten Media Sosial (${post.platform}): ${post.topic}`,
    content: `CAPTION:\n${post.caption}\n\nHASHTAGS:\n${post.hashtags}\n\nREKOMENDASI VISUAL:\n${post.visualIdea}\n\nWAKTU POSTING OPTIMAL:\n${post.bestTime}`,
    mode: 'news',
    outputType: `${post.platform} (${post.tone})`,
    instansi: 'Tim Media Sosial Humas',
    lokasi: 'Indonesia',
    narasumber: 'Social Media Strategist',
  });
}

export function exportSocialMediaToPdf(post: {
  topic: string;
  platform: string;
  tone: string;
  caption: string;
  hashtags: string;
  visualIdea: string;
  bestTime: string;
}): void {
  exportNewsToPdf({
    title: `Konten Media Sosial (${post.platform}): ${post.topic}`,
    content: `CAPTION:\n${post.caption}\n\nHASHTAGS:\n${post.hashtags}\n\nREKOMENDASI VISUAL:\n${post.visualIdea}\n\nWAKTU POSTING OPTIMAL:\n${post.bestTime}`,
    mode: 'news',
    outputType: `${post.platform} (${post.tone})`,
    instansi: 'Tim Media Sosial Humas',
    lokasi: 'Indonesia',
    narasumber: 'Social Media Strategist',
  });
}
