const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  ShadingType
} = require('docx');

async function generateInvoice() {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1200,
              right: 1200,
            },
          },
        },
        children: [
          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'INVOICE PENGEMBANGAN PERANGKAT LUNAK AKADEMIK',
                bold: true,
                size: 28,
                font: 'Calibri',
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: 'Media Pembelajaran & Simulasi Komunikasi Publik Digital (DIGISMART Multi-Platform)',
                italics: true,
                size: 20,
                font: 'Calibri',
                color: '475569',
              }),
            ],
          }),

          // Divider Line
          new Paragraph({
            spacing: { after: 200 },
            border: {
              bottom: { color: '2563EB', space: 1, style: BorderStyle.SINGLE, size: 12 },
            },
          }),

          // Meta Information (Invoice No, Date, Perihal)
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'PENGEMBANG (DEVELOPER):', bold: true, size: 20, color: '1E293B' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Nama: ', bold: true, size: 19 }),
                          new TextRun({ text: 'Pangeran Ryan Pahlevi', size: 19 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Program Studi: ', bold: true, size: 19 }),
                          new TextRun({ text: 'S1 Teknik Informatika — Universitas Budi Luhur', size: 19 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'WhatsApp: ', bold: true, size: 19 }),
                          new TextRun({ text: '0882-2460-2608', size: 19 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Email: ', bold: true, size: 19 }),
                          new TextRun({ text: 'pangeranryan080504@gmail.com', size: 19 }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'DITUJUKAN KEPADA (KLIEN / DOSEN):', bold: true, size: 20, color: '1E293B' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'No. Invoice: ', bold: true, size: 19 }),
                          new TextRun({ text: 'INV/2026/ACAD-DEV/08-001', size: 19, font: 'Consolas' }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Tanggal: ', bold: true, size: 19 }),
                          new TextRun({ text: '31 Agustus 2026', size: 19 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Nama Dosen: ', bold: true, size: 19 }),
                          new TextRun({ text: '[Nama Dosen Beserta Gelar]', size: 19 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Institusi / Kampus: ', bold: true, size: 19 }),
                          new TextRun({ text: 'Universitas Budi Luhur', size: 19 }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 240, after: 120 } }),

          // Pricing Table Header
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'RINCIAN PEKERJAAN & ANGGARAN BIAYA PENGEMBANGAN:',
                bold: true,
                size: 21,
                color: '1E3A8A',
              }),
            ],
          }),

          // Items Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header Row
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 8, type: WidthType.PERCENTAGE },
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: 'No', bold: true, color: 'FFFFFF', size: 19 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 42, type: WidthType.PERCENTAGE },
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Komponen & Modul Sistem', bold: true, color: 'FFFFFF', size: 19 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Keterangan Deliverable', bold: true, color: 'FFFFFF', size: 19 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: 'Biaya (IDR)', bold: true, color: 'FFFFFF', size: 19 })],
                      }),
                    ],
                  }),
                ],
              }),

              // Row 1
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '1', size: 18 })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Perancangan UI/UX & Arsitektur Multi-Device', bold: true, size: 18 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Desain responsif untuk Desktop, iPad/Tablet, & Mobile.', size: 16, color: '64748B' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Layout responsif 3 perangkat', size: 18 })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Rp 1.000.000', size: 18, font: 'Consolas' })] })],
                  }),
                ],
              }),

              // Row 2
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '2', size: 18 })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Core Engine & Dashboard Visualisasi Real-Time', bold: true, size: 18 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: '4 Kartu metrik, Multi-line SVG chart, Donut sentimen.', size: 16, color: '64748B' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Dashboard Command Center', size: 18 })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Rp 1.500.000', size: 18, font: 'Consolas' })] })],
                  }),
                ],
              }),

              // Row 3
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '3', size: 18 })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Pengembangan 5 Modul Praktik AI Kehumasan', bold: true, size: 18 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: '• AI News Generator (5W1H)\n• Sentiment Analysis Engine (NLP)\n• Social Listening & Issue Tracker\n• Quick Response Crisis (Holding Statement)\n• Press Release & Social Media Planner', size: 16, color: '64748B' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: '5 Modul Interaktif Praktikum', size: 18 })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Rp 2.000.000', size: 18, font: 'Consolas' })] })],
                  }),
                ],
              }),

              // Row 4
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '4', size: 18 })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Pusat Edukasi, Studi Kasus PR & Kuis Penilaian', bold: true, size: 18 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Modul teori, analisis krisis PR Indonesia, prompt library, kuis skor otomatis.', size: 16, color: '64748B' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Learning Hub & Kuis Mahasiswa', size: 18 })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Rp 800.000', size: 18, font: 'Consolas' })] })],
                  }),
                ],
              }),

              // Row 5
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '5', size: 18 })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Kompilasi Multi-Platform (Desktop .EXE & Mobile .APK)', bold: true, size: 18 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Aplikasi Windows mandiri (DIGISMART.exe), build Android APK / PWA.', size: 16, color: '64748B' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Installer .EXE & APK Mobile', size: 18 })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Rp 1.200.000', size: 18, font: 'Consolas' })] })],
                  }),
                ],
              }),

              // Total Row
              new TableRow({
                children: [
                  new TableCell({
                    columnSpan: 3,
                    shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: 'TOTAL BIAYA PENGEMBANGAN:', bold: true, size: 20, color: '1E3A8A' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { fill: 'DBEAFE', type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: 'Rp 6.500.000', bold: true, size: 21, color: '1E3A8A', font: 'Consolas' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Terbilang
          new Paragraph({
            spacing: { before: 120, after: 200 },
            children: [
              new TextRun({ text: 'Terbilang: ', bold: true, size: 19 }),
              new TextRun({ text: 'Enam Juta Lima Ratus Ribu Rupiah', italics: true, bold: true, size: 19, color: '1E3A8A' }),
            ],
          }),

          // Payment Schedule & Bank Info
          new Paragraph({
            spacing: { before: 120, after: 60 },
            children: [
              new TextRun({ text: 'SKEMA & INFORMASI PEMBAYARAN:', bold: true, size: 20, color: '1E3A8A' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Termin 1 (Uang Muka / DP 50%): ', bold: true, size: 18 }),
              new TextRun({ text: 'Rp 3.250.000 (Saat pengerjaan dimulai / persetujuan invoice)', size: 18 }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Termin 2 (Pelunasan 50%): ', bold: true, size: 18 }),
              new TextRun({ text: 'Rp 3.250.000 (Setelah serah terima berkas .EXE, .APK, dan demo)', size: 18 }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Rekening Pembayaran: ', bold: true, size: 18 }),
              new TextRun({ text: '[Nama Bank Anda: BCA / Mandiri / BNI / BRI] — No. Rek: [Nomor Rekening Anda] a.n. Pangeran Ryan Pahlevi', size: 18 }),
            ],
          }),

          // Catatan & Garansi
          new Paragraph({
            spacing: { before: 180, after: 60 },
            children: [
              new TextRun({ text: 'CATATAN & LAYANAN TAMBAHAN:', bold: true, size: 20, color: '1E3A8A' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Hak Cipta & Deliverable: ', bold: true, size: 18 }),
              new TextRun({ text: 'Mencakup file aplikasi desktop (.exe), paket instalasi Android (.apk), serta full source code proyek.', size: 18 }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Garansi Pemeliharaan: ', bold: true, size: 18 }),
              new TextRun({ text: 'Gratis perbaikan kendala teknis (bug-fixing) dan pendampingan penggunaan selama 30 hari.', size: 18 }),
            ],
          }),

          new Paragraph({ spacing: { before: 300, after: 200 } }),

          // Signature Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'Mengetahui / Menyetujui,', size: 18 })] }),
                      new Paragraph({ children: [new TextRun({ text: 'Dosen Pembimbing / Klien', size: 18 })] }),
                      new Paragraph({ spacing: { before: 800 } }),
                      new Paragraph({ children: [new TextRun({ text: '( ...................................................... )', bold: true, size: 18 })] }),
                      new Paragraph({ children: [new TextRun({ text: 'NIP / NIDN: .......................................', size: 16, color: '64748B' })] }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'Jakarta, 31 Agustus 2026', size: 18 })] }),
                      new Paragraph({ children: [new TextRun({ text: 'Pengembang Sistem (Developer)', size: 18 })] }),
                      new Paragraph({ spacing: { before: 800 } }),
                      new Paragraph({ children: [new TextRun({ text: 'Pangeran Ryan Pahlevi', bold: true, size: 18, underline: {} })] }),
                      new Paragraph({ children: [new TextRun({ text: 'NIM: S1 Teknik Informatika', size: 16, color: '64748B' })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, 'INVOICE_PENGEMBANGAN_DIGISMART_6.5JT.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log('Invoice DOCX successfully created at:', outputPath);
}

generateInvoice();
