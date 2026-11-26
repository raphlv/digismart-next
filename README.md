# DIGISMART v2.0 — AI Public Communication Command Center

Platform AI Public Communication untuk pemantauan isu, analisis sentimen 10 media nasional (Live RSS + NLP Lexicon), generator berita/siaran pers berbasis referensi 10 media, respons cepat krisis, dan ekspor laporan Word (`.docx`) serta PDF (`.pdf`).

## Fitur Utama

1. **Sentiment Analysis 10 Media Nasional (`/sentiment-analysis`)**
   - Menarik feed berita nyata (Live RSS) dari 10 media nasional Indonesia: Kompas.com, Detik.com, Tribunnews.com, CNN Indonesia, Liputan6.com, CNBC Indonesia, Okezone.com, Republika.co.id, Antara News, dan Tempo.co.
   - Analisis sentimen NLP bahasa Indonesia dengan penanganan frasa negasi (*tidak, bukan, kurang, belum*).
   - Ekspor laporan lengkap ke **Word (`.docx`)** dan **PDF (`.pdf`)**.
2. **AI News & Press Release Suite (`/news-generator`)**
   - Penulisan berita 5W+1H dan Siaran Pers Resmi yang mengacu langsung pada hasil analisis sentimen 10 media nasional (anti-halusinasi).
   - Ekspor naskah beserta tabel lampiran referensi 10 media ke **Word (`.docx`)**, **PDF (`.pdf`)**, `.txt`, dan Print.
3. **AI Social Listening, Quick Response, Social Media & Knowledge Base**
   - Dukungan ekspor **Word (`.docx`)** dan **PDF (`.pdf`)** di seluruh modul dokumen/laporan.

## Menjalankan Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3006`.

## Preview Klien di Vercel (Tanpa Beli Domain & Hosting)

1. Push isi folder ini ke repository GitHub (`raphlv/digismart-next`).
2. Hubungkan repository ke **Vercel** (preset Next.js, Build Command: `npm run build`).
3. **(Opsional, disarankan)** Tambahkan Environment Variable `GEMINI_API_KEY` di Vercel Project Settings untuk kualitas AI terbaik.
4. Endpoint `/api/media-feed/` dan `/api/ai-generate/` otomatis aktif sebagai Serverless Function di Vercel untuk preview klien.

## Deployment Setelah Pembelian Domain & Hosting

- **Node.js / VPS / Vercel Custom Domain:** Jalankan `npm run build && npm run start` (port default `3006`).
- **Shared Hosting PHP (cPanel / Apache):** Tersedia endpoint pendamping `public/media-feed.php` untuk penarikan RSS 10 media di sisi PHP.
