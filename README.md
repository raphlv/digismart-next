<div align="center">

# 🚀 DIGISMART v2.0
### **AI Public Communication Command Center & Interactive PR Simulator**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Electron](https://img.shields.io/badge/Electron-31.0-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Capacitor](https://img.shields.io/badge/Capacitor-6.1-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Windows%20.EXE%20%7C%20Android%20.APK-success?style=for-the-badge)]()

<p align="center">
  <b>Platform terpadu pemantauan isu publik, generator berita berbasis AI 5W+1H, analisis sentimen netizen NLP, perumusan holding statement respons krisis, dan media simulasi kehumasan digital multi-platform.</b>
</p>

[Fitur Utama](#-fitur-utama) • [Multi-Platform](#-dukungan-multi-platform) • [Teknologi](#-arsitektur--teknologi) • [Instalasi](#-panduan-instalasi--menjalankan) • [Pengembang](#-pengembang-developer)

---

</div>

## 📖 Tentang Proyek

**DIGISMART v2.0** (*Digital Smart Communication & AI Command Center*) adalah sistem instrumen kehumasan (*Public Relations*) modern yang dirancang untuk membantu praktisi komunikasi, humas instansi/kementerian, maupun mahasiswa dalam memantau sentimen publik secara *real-time*, memproduksi warta resmi dengan kecerdasan buatan, serta merumuskan strategi mitigasi krisis reputasi dalam kurun waktu *Golden Hour* (< 60 menit).

Aplikasi ini dikembangkan dengan arsitektur **Multi-Platform** yang dapat diakses melalui antarmuka **Web Responsif**, aplikasi mandiri **Desktop Windows (`.EXE`)**, dan aplikasi mobile smartphone **Android (`.APK` / PWA)**.

---

## ✨ Fitur Utama

### 1. 📊 Dashboard Command Center
* **4 Kartu Metrik Utama**: *Total Berita Dibuat*, *Isu Dipantau*, *Analisis Sentimen*, dan *Aktivitas AI* dengan indikator fluktuasi harian.
* **Multi-Line SVG Trend Chart**: Pemantauan grafik tren isu & warta harian (Senin - Minggu) dengan *interactive hover tooltip*.
* **Donut Chart Sentimen Publik**: Pemetaan proporsi opini publik (*Positif 45%, Netral 35%, Negatif 20%*).
* **Live Skenario Switcher**: Fitur simulasi pengganti kondisi isu (*Umum, Krisis Server KRS, Peluncuran Beasiswa*) secara instan.

### 2. 📰 AI News Generator (`/news-generator`)
* Pembuat draf berita otomatis berstandar jurnalistik **5W+1H**.
* Pemilihan gaya bahasa (*Formal/Pemerintah, Investigatif, Klarifikasi Krisis, Populer*), draf kutipan pimpinan resmi, dan fitur salin teks instan.

### 3. 🧠 Sentiment Analysis NLP Engine (`/sentiment-analysis`)
* Kalkulator analisis sentimen teks/opini netizen berbasis pemrosesan bahasa alami (*NLP*).
* Deteksi spektrum emosi (*Apresiasi, Kekhawatiran, Netral*), ekstraksi kata kunci pemicu polaritas (+/-), dan rekomendasi tindakan humas.

### 4. 📡 Social Listening & Issue Tracker (`/social-listening`)
* Pemantauan percakapan publik dari berbagai saluran media (*X/Twitter, Instagram, TikTok, Berita Online*).
* Filter sentimen, penanda tingkat risiko krisis (*Low, Medium, High Risk*), dan tombol simulasi injeksi postingan.

### 5. ⚡ Quick Response Crisis AI (`/quick-response`)
* Generator *Holding Statement* darurat dalam kurun waktu *Golden Hour* menerapkan formula komunikasi:
  $$\text{Holding Statement} = \text{Acknowledge (Akui)} + \text{Action (Tindakan)} + \text{Assurance (Kepastian)}$$

### 6. 📱 Social Media Planner & Mockup (`/social-media`)
* Composer konten media sosial dilengkapi pratinjau kartu mockup smartphone (*Instagram Feed/Story, X/Twitter, LinkedIn*).
* Rekomendasi tagar (*hashtags*) otomatis dan waktu tayang optimal.

### 7. 📄 Official Press Release Builder (`/press-release`)
* Penyusun naskah siaran pers baku instansi dengan kop surat resmi, penomoran rilis, tanggal embargo, dan kontak *media relations*.

### 8. 📚 Knowledge Base & Learning Hub (`/knowledge-base`)
* Modul materi teori komunikasi publik, studi kasus krisis reputasi nyata di Indonesia, prompt library, serta kuis simulasi interaktif dengan penilaian otomatis (0-100).

---

## 📱 Dukungan Multi-Platform

| Platform | Format Berkas | Teknologi | Status |
|---|---|---|---|
| **Web Application** | Web Browser (Chrome/Edge/Safari) | Next.js 14 App Router | ✅ Siap Pakai |
| **Desktop PC / Laptop** | Standalone Executable (`.EXE`) | Electron Framework | ✅ Siap Pakai |
| **Android Smartphone** | Android Package (`.APK`) | Capacitor + Gradle | ✅ Siap Pakai |
| **Mobile & Tablet** | Progressive Web App (PWA) | Google Web App Manifest | ✅ Siap Pakai |

---

## 💻 Arsitektur & Teknologi

* **Framework Inti:** [Next.js 14](https://nextjs.org/) (App Router, Static HTML Export)
* **Bahasa Pemrograman:** [TypeScript](https://www.typescriptlang.org/) & [JavaScript (ES6+)](https://developer.mozilla.org/)
* **Desain & Styling:** [Tailwind CSS 3.4](https://tailwindcss.com/) dengan palet Command Center Slate-Dark (`#0B1120`)
* **Ikonografi:** [Lucide React](https://lucide.dev/)
* **Desktop Wrapper:** [Electron 31](https://www.electronjs.org/) dengan *built-in local loopback server*
* **Mobile Wrapper:** [@capacitor/core & @capacitor/android](https://capacitorjs.com/)

---

## 🚀 Panduan Instalasi & Menjalankan

### Prasyarat:
* Node.js versi 18.x atau 20.x+
* Git

### 1. Clone Repositori
```bash
git clone https://github.com/raphlv/digismart-next.git
cd digismart-next
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Menjalankan di Web Browser (Mode Dev)
```bash
npm run dev
```
Buka browser di alamat: **`http://localhost:3006`**

### 4. Menjalankan Aplikasi Desktop (Electron)
```bash
npm run electron:dev
```

### 5. Melakukan Build Aplikasi Mandiri Windows (.EXE)
```bash
npm run build
npm run dist:win
```
File `.exe` akan dihasilkan di folder `dist/win-unpacked/DIGISMART.exe`.

---

## 📂 Struktur Direktori

```
digismart-next/
├── app/                      # Next.js App Router (8 Modul Rute)
│   ├── layout.tsx            # Root Layout & SEO Metadata
│   ├── page.tsx              # Dashboard Utama Command Center
│   ├── news-generator/       # Generator Berita AI 5W+1H
│   ├── sentiment-analysis/   # Engine Analisis Sentimen NLP
│   ├── social-listening/     # Pemantauan Percakapan Netizen
│   ├── quick-response/       # Respon Krisis & Holding Statement
│   ├── social-media/         # Planner & Mockup Media Sosial
│   ├── press-release/        # Pembuat Siaran Pers Resmi
│   └── knowledge-base/       # Pusat Edukasi, Studi Kasus & Kuis
├── components/               # Komponen Antarmuka Reusable
│   ├── Header.tsx            # Top Bar & Scenario Switcher
│   ├── Sidebar.tsx           # Navigasi Multi-Device
│   ├── StatCard.tsx          # Kartu Metrik Interaktif
│   ├── IssueMonitoringChart  # Grafik Multi-Line SVG
│   ├── PublicSentimentChart  # Donut Chart Sentimen
│   └── TrendingKeywords.tsx  # Ticker Topik Populer
├── electron/                 # Konfigurasi Aplikasi Desktop Windows (.EXE)
│   ├── main.js               # Electron Main Process & Loopback Server
│   └── preload.js            # Preload Script
├── lib/                      # State & Data Simulasi
│   ├── digismartContext.tsx  # React Context State Management
│   └── digismartData.ts      # Dataset & Bank Soal Kuis
├── public/                   # Asset Statis, Ikon & manifest.json PWA
├── scripts/                  # Workflow & Tooling Build APK
└── capacitor.config.json     # Konfigurasi Mobile Android Capacitor
```

---

## 👨‍💻 Pengembang (Developer)

<table align="center">
  <tr>
    <td align="center">
      <b>Pangeran Ryan Pahlevi</b><br/>
      <i>Software Engineer & Full-Stack Web Developer</i><br/>
      🎓 S1 Teknik Informatika — Universitas Budi Luhur<br/><br/>
      <a href="https://github.com/raphlv">
        <img src="https://img.shields.io/badge/GitHub-raphlv-181717?style=flat&logo=github" alt="GitHub" />
      </a>
      <a href="mailto:pangeranryan080504@gmail.com">
        <img src="https://img.shields.io/badge/Email-pangeranryan080504@gmail.com-D14836?style=flat&logo=gmail&logoColor=white" alt="Email" />
      </a>
      <a href="https://instagram.com/raphlv">
        <img src="https://img.shields.io/badge/Instagram-@raphlv-E4405F?style=flat&logo=instagram&logoColor=white" alt="Instagram" />
      </a>
    </td>
  </tr>
</table>

---

<div align="center">
  <sub>Hak Cipta © 2026 DIGISMART — Dikembangkan oleh <a href="https://github.com/raphlv">Pangeran Ryan Pahlevi</a></sub>
</div>
