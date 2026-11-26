'use client';

import { MediaArticle } from './digismartData';
import { TenMediaSummary, formatIndonesianDateTime } from './sentimentEngine';

export interface GenerateOptions {
  mode: 'news' | 'press-release';
  judul: string;
  keyword?: string;
  instansi?: string;
  lokasi?: string;
  narasumber?: string;
  jenisOutput?: string;
  agenda?: string;
  hasil?: string;
  format?: string;
  apiKey?: string;
  mediaReferences?: MediaArticle[];
  sentimentSummary?: TenMediaSummary | null;
}

export interface QuickResponseOptions {
  inputText: string;
  tone: string;
  jenisRespons: string;
  apiKey?: string;
}

export interface SocialMediaOptions {
  topik: string;
  platform: string;
  tone: string;
  apiKey?: string;
}

function sanitizeAiOutput(raw: string): string {
  return raw
    .replace(/```[\w]*\n?/g, '')
    .replace(/---+\s*Support Pollinations\.AI[\s\S]*$/i, '')
    .replace(/\*\*Sponsor\*\*[\s\S]*$/i, '')
    .trim();
}

async function requestAiCompletion(params: {
  systemPrompt: string;
  userPrompt: string;
  jsonMode?: boolean;
  temperature?: number;
  apiKey?: string;
}): Promise<{ text: string; provider: string } | null> {
  const { systemPrompt, userPrompt, jsonMode = false, temperature = 0.3, apiKey = '' } = params;

  // 1. Server API Route (/api/ai-generate/) — runs on Vercel / Node.js
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    const res = await fetch('/api/ai-generate/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        systemPrompt,
        userPrompt,
        jsonMode,
        temperature,
        clientApiKey: apiKey,
      }),
    });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (data?.text && data.text.trim().length > 20) {
        return { text: sanitizeAiOutput(data.text), provider: data.provider || 'AI Server Engine' };
      }
    }
  } catch (err) {
    console.warn('Server AI route unavailable, falling back to direct client AI:', err);
  }

  // 2. Direct client-side Gemini API (if user provided key)
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
        apiKey.trim()
      )}`;
      const res = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          generationConfig: { temperature, maxOutputTokens: 1600 },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = sanitizeAiOutput(data.candidates?.[0]?.content?.parts?.[0]?.text || '');
        if (text.length > 20) {
          return { text, provider: 'Google Gemini 1.5 Flash' };
        }
      }
    } catch (e) {
      console.warn('Direct Gemini call failed:', e);
    }
  }

  // 3. Direct client-side Public AI fallback
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        model: 'openai',
        temperature,
        ...(jsonMode ? { jsonMode: true } : {}),
      }),
    });
    clearTimeout(timer);
    if (res.ok) {
      const text = sanitizeAiOutput(await res.text());
      if (text.length > 20) {
        return { text, provider: 'AI Public Engine' };
      }
    }
  } catch (e) {
    console.warn('Direct public AI failed:', e);
  }

  return null;
}

function buildMediaReferencePromptBlock(
  mediaReferences: MediaArticle[] = [],
  sentimentSummary?: TenMediaSummary | null
): string {
  if (!mediaReferences.length) {
    return 'Belum ada data monitoring media terlampir; gunakan hanya parameter resmi dari pengguna tanpa mengarang angka statistik.';
  }

  const summaryHeader = sentimentSummary
    ? `Ringkasan Sentimen (${sentimentSummary.totalMedia} Media, ${sentimentSummary.liveCount} Live RSS): Dominan ${sentimentSummary.overallPolarity.toUpperCase()} (Skor rata-rata ${sentimentSummary.averageScore}% | Positif ${sentimentSummary.positifPct}%, Netral ${sentimentSummary.netralPct}%, Negatif ${sentimentSummary.negatifPct}%). Rekomendasi: ${sentimentSummary.strategicRecommendation}`
    : `Jumlah Referensi Media: ${mediaReferences.length} media nasional.`;

  const lines = mediaReferences.slice(0, 10).map(
    (art, i) =>
      `${i + 1}. [${art.media}] (${art.sentiment.toUpperCase()}, ${art.score ?? 55}%) — ${art.title}. Ringkasan: ${art.summary}`
  );

  return `${summaryHeader}\nDaftar Rujukan Media:\n${lines.join('\n')}`;
}

// 1. GENERATE NEWS & PRESS RELEASE WITH AI (GROUNDED TO 10 MEDIA SENTIMENT)
export async function generateContentWithAI(options: GenerateOptions): Promise<{
  title: string;
  content: string;
  provider: string;
}> {
  const {
    mode,
    judul,
    keyword,
    instansi = 'Instansi Pemerintah',
    lokasi = 'Jakarta',
    narasumber = 'Pimpinan Institusi',
    jenisOutput = 'Website',
    agenda = '',
    hasil = '',
    format = 'Media Online',
    apiKey,
    mediaReferences = [],
    sentimentSummary = null,
  } = options;

  const today = formatIndonesianDateTime();
  const mediaBlock = buildMediaReferencePromptBlock(mediaReferences, sentimentSummary);

  const systemPrompt =
    mode === 'news'
      ? `Anda adalah jurnalis senior dan editor Humas pemerintah Indonesia berstandar Dewan Pers (EYD/PUEBI).
ATURAN KETAT ANTI-HALUSINASI:
1. Tulis berita menggunakan kaidah piramida terbalik dan 5W+1H berdasarkan fakta input dan data referensi 10 media (analisis sentimen) yang diberikan.
2. DILARANG KERAS mengarang angka statistik fiktif, persentase capaian palsu, atau fakta di luar referensi yang diberikan.
3. Wajib merujuk pada temuan sentimen dan judul liputan dari 10 media nasional di bawah ini secara akurat dan berimbang.
4. Gunakan tanggal hari ini: ${today}.`
      : `Anda adalah Kepala Biro Humas dan Juru Bicara Resmi Institusi Pemerintah Indonesia.
ATURAN KETAT ANTI-HALUSINASI:
1. Rumuskan SIARAN PERS RESMI yang akurat, transparan, dan berwibawa sesuai tata naskah dinas kehumasan.
2. DILARANG mengarang angka statistik atau capaian yang tidak ada dalam parameter input maupun referensi media.
3. Wajib menyelaraskan isi siaran pers dengan temuan analisis sentimen 10 media nasional yang dilampirkan.
4. Gunakan tanggal hari ini: ${today}.`;

  const userPrompt =
    mode === 'news'
      ? `Tuliskan artikel berita lengkap dengan parameter berikut:
- Judul Kegiatan/Topik: "${judul}"
- Instansi Penyelenggara: "${instansi}"
- Lokasi: "${lokasi}"
- Narasumber/Pejabat: "${narasumber}"
- Kata Kunci Pendukung: "${keyword || 'layanan publik, transparansi, tata kelola'}"
- Jenis Output: "${jenisOutput}"
- Tanggal Publikasi: ${today}

DATA REFERENSI MEDIA & ANALISIS SENTIMEN:
${mediaBlock}

Format Naskah:
1. Baris pertama: JUDUL BERITA informatif dan faktual (tanpa tanda kutip atau simbol markdown).
2. Paragraf 1 (Lead/Dateline): ${lokasi.toUpperCase()}, ${today} — Memuat inti 5W+1H secara akurat.
3. Paragraf 2-3 (Body & Rujukan Media): Uraian pelaksanaan kegiatan serta sintesis pemberitaan dan sentimen dari referensi 10 media nasional di atas, disertai kutipan resmi ${narasumber}.
4. Paragraf 4 (Respons & Tindak Lanjut): Penjelasan dampak bagi masyarakat dan respons konstruktif atas sorotan media/publik.
5. Penutup: Narahubung media resmi ${instansi}.`
      : `Buatlah Naskah SIARAN PERS RESMI lengkap dengan parameter berikut:
- Nama Agenda/Peristiwa: "${judul}"
- Instansi: "${instansi}"
- Lokasi: "${lokasi}"
- Pejabat Penanggung Jawab: "${narasumber}"
- Rincian Agenda Utama: "${agenda || 'Pembahasan strategis dan koordinasi peningkatan mutu layanan publik'}"
- Hasil/Capaian Kegiatan: "${hasil || 'Penyampaian komitmen tindak lanjut dan penguatan kanal informasi resmi'}"
- Format Standar Rilis: "${format}"
- Tanggal: ${today}

DATA REFERENSI MEDIA & ANALISIS SENTIMEN:
${mediaBlock}

Format Naskah Siaran Pers:
- KOP & NOMOR SIARAN PERS (NOMOR: [Auto]/SP-HUMAS/${new Date().getFullYear()})
- STATUS: UNTUK SEGERA DISIARKAN
- JUDUL SIARAN PERS (Huruf kapital, tegas, tanpa markdown)
- DATELINE (${lokasi.toUpperCase()}, ${today})
- ALINEA PEMBUKA & KONTEKS SENTIMEN MEDIA
- KUTIPAN LANGSUNG (${narasumber})
- POIN RINCIAN AGENDA & TINDAK LANJUT
- KONTAK MEDIA & NARAHUBUNG RESMI.`;

  const aiReply = await requestAiCompletion({
    systemPrompt,
    userPrompt,
    temperature: 0.3,
    apiKey,
  });

  if (aiReply && aiReply.text.length > 120) {
    const mentionsTopic =
      aiReply.text.toLowerCase().includes(judul.toLowerCase().split(' ')[0]) ||
      aiReply.text.toLowerCase().includes(instansi.toLowerCase().split(' ')[0]);

    if (mentionsTopic) {
      const lines = aiReply.text.split('\n').filter((l) => l.trim().length > 0);
      let titleLine = lines[0].replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
      if (
        titleLine.length > 110 ||
        titleLine.startsWith('SIARAN PERS') ||
        titleLine.startsWith('NOMOR:')
      ) {
        titleLine =
          mode === 'news'
            ? `${judul}: Tindak Lanjut ${instansi} Berdasarkan Pantauan Media`
            : `${judul.toUpperCase()} — SIARAN PERS RESMI ${instansi.toUpperCase()}`;
      }
      return {
        title: titleLine || judul,
        content: aiReply.text,
        provider: `${aiReply.provider} (${mediaReferences.length} Media)`,
      };
    }
  }

  // Grounded Local Editorial Engine (Zero fabricated stats, cites actual 10-media sentiment)
  const docNumber = `0${Math.floor(Math.random() * 80) + 12}/SP-HUMAS/${new Date().getFullYear()}`;
  const slugDomain = instansi.toLowerCase().replace(/[^a-z0-9]/g, '') || 'instansi';
  const mediaNamesList =
    mediaReferences.length > 0
      ? mediaReferences.map((m) => m.media).join(', ')
      : 'Kompas.com, Detik.com, Antara News, Tempo.co';

  const sentimentOverviewLine =
    mediaReferences.length > 0 && sentimentSummary
      ? `Berdasarkan pemantauan dan analisis sentimen terhadap ${sentimentSummary.totalMedia} media nasional (${mediaNamesList}), opini pemberitaan tercatat ${sentimentSummary.positifPct}% positif, ${sentimentSummary.netralPct}% netral, dan ${sentimentSummary.negatifPct}% bernada kritis/negatif dengan skor sentimen rata-rata ${sentimentSummary.averageScore}%.`
      : `Pemberitaan terkait agenda ini disusun dengan mengacu pada standar verifikasi informasi publik dan keterbukaan data kelembagaan.`;

  const keyMediaHighlights =
    mediaReferences.length > 0
      ? `\n\nSorotan dari sejumlah media rujukan antara lain:\n${mediaReferences
          .slice(0, 5)
          .map((m) => `• ${m.media} (${m.sentiment.toUpperCase()}, ${m.score ?? 55}%): ${m.title}.`)
          .join('\n')}`
      : '';

  if (mode === 'news') {
    const title = `${judul}: ${instansi} Sampaikan Keterangan Resmi dan Tindak Lanjut di ${lokasi}`;
    const content = `${lokasi.toUpperCase()}, ${today} — ${instansi} menyampaikan perkembangan resmi terkait "${judul}" di ${lokasi}, sebagai bagian dari upaya memastikan keterbukaan informasi dan kualitas layanan kepada masyarakat.\n\n${sentimentOverviewLine}${keyMediaHighlights}\n\nMenanggapi dinamika pemberitaan dan masukan publik tersebut, ${narasumber} menegaskan komitmen institusi untuk menjaga transparansi serta menindaklanjuti setiap catatan di lapangan secara terukur.\n\n"Kami mencermati seluruh laporan media dan aspirasi masyarakat terkait ${judul}. Evaluasi dan koordinasi lintas unit terus dilakukan agar pelayanan publik berjalan akuntabel dan responsif," ujar ${narasumber}.\n\nKe depan, ${instansi} akan menyampaikan pembaruan berkala melalui kanal informasi resmi guna memastikan masyarakat memperoleh data yang akurat dan terverifikasi.\n\nKONTAK MEDIA:\nDivisi Komunikasi Publik ${instansi}\nEmail: humas@${slugDomain}.go.id`;
    return {
      title,
      content,
      provider: `DIGISMART Grounded Engine (${mediaReferences.length} Media)`,
    };
  }

  const title = `${judul.toUpperCase()}: LANGKAH RESMI ${instansi.toUpperCase()} MENJAWAB ASPIRASI PUBLIK`;
  const content = `SIARAN PERS RESMI\nNOMOR: ${docNumber}\nUNTUK SEGERA DISIARKAN\n\n${title}\n\n${lokasi.toUpperCase()}, ${today} – ${instansi} secara resmi menyampaikan keterangan pers mengenai pelaksanaan "${judul}" sebagai wujud akuntabilitas dan keterbukaan informasi publik.\n\n${sentimentOverviewLine}${keyMediaHighlights}\n\nAgenda pokok yang dibahas meliputi:\n• ${agenda || 'Koordinasi kebijakan dan evaluasi implementasi layanan publik bersama pemangku kepentingan'}\n\nDalam pernyataan resminya, ${narasumber} menyampaikan:\n"Setiap catatan dari publik dan media nasional menjadi bahan evaluasi penting bagi ${instansi}. Fokus kami adalah memastikan kepastian layanan dan penyampaian informasi yang faktual kepada masyarakat."\n\nCapaian serta komitmen tindak lanjut:\n• ${hasil || 'Penguatan koordinasi lapangan dan pembaruan informasi berkala melalui portal resmi instansi'}\n\n---\nKONTAK MEDIA & NARAHUBUNG:\nBiro Hubungan Masyarakat ${instansi}\nEmail: siaranpers@${slugDomain}.go.id\nWebsite: https://${slugDomain}.go.id`;
  return {
    title,
    content,
    provider: `DIGISMART Grounded Engine (${mediaReferences.length} Media)`,
  };
}

// 2. GENERATE QUICK CRISIS RESPONSE WITH AI
export async function generateQuickResponseWithAI(options: QuickResponseOptions): Promise<{
  content: string;
  provider: string;
}> {
  const { inputText, tone, jenisRespons, apiKey } = options;

  const systemPrompt = `Anda adalah Spesialis Manajemen Krisis Komunikasi dan Juru Bicara Pemerintah Indonesia.
Tugas Anda adalah membuat draf respon tanggap cepat (${jenisRespons}) menanggapi isu publik atau komplain warga dengan tone '${tone}'.
Teks harus lugas, menenangkan publik, akuntabel, tidak defensif, dan tidak mengarang statistik palsu.`;

  const userPrompt = `Isu / Komentar Publik: "${inputText}"
Tone Suara: "${tone}"
Jenis Naskah Respons: "${jenisRespons}"

Tuliskan naskah tanggapan utuh dan siap pakai (tanpa tanda kutip pembuka atau markdown sponsor).`;

  const aiReply = await requestAiCompletion({
    systemPrompt,
    userPrompt,
    temperature: 0.35,
    apiKey,
  });

  if (aiReply && aiReply.text.length > 60) {
    return {
      content: aiReply.text,
      provider: aiReply.provider,
    };
  }

  const fallback = `${jenisRespons.toUpperCase()} — RESPON CEPAT HUMAS (Tone: ${tone})\n\nMenanggapi perhatian publik mengenai "${inputText}", kami sampaikan keterangan resmi sebagai berikut:\n\n1. Kami memahami kekhawatiran masyarakat dan menjadikan masukan ini sebagai prioritas evaluasi.\n2. Tim teknis dan unit operasional terkait tengah melakukan verifikasi fakta serta penanganan di lapangan sesuai prosedur.\n3. Kami memastikan hak dan kenyamanan layanan publik tetap terlindungi.\n4. Perkembangan penanganan akan disampaikan secara berkala melalui saluran komunikasi resmi.`;
  return {
    content: fallback,
    provider: 'DIGISMART Local Smart Engine',
  };
}

// 3. GENERATE SOCIAL MEDIA POSTS WITH AI
export async function generateSocialMediaWithAI(options: SocialMediaOptions): Promise<{
  caption: string;
  hashtags: string;
  visualIdea: string;
  bestTime: string;
  provider: string;
}> {
  const { topik, platform, tone, apiKey } = options;

  const systemPrompt = `Anda adalah Social Media Strategist profesional untuk institusi publik di Indonesia.
Tugas Anda membuat konten media sosial untuk platform ${platform} dengan gaya bahasa '${tone}'.
Berikan caption yang faktual, humanis, ajakan interaksi (CTA), rekomendasi visual, dan hashtags relevan tanpa mengarang statistik.`;

  const userPrompt = `Topik: "${topik}"
Platform: "${platform}"
Tone: "${tone}"

Berikan respon JSON valid tanpa markdown fence:
{
  "caption": "Teks naskah caption lengkap beserta emoji yang pas",
  "hashtags": "#Tag1 #Tag2 #Tag3 #Tag4",
  "visualIdea": "Rekomendasi visual atau format gambar/video (1-2 kalimat)",
  "bestTime": "Waktu posting terbaik (contoh: 12.00 - 13.30 & 19.00 - 21.00 WIB)"
}`;

  const aiReply = await requestAiCompletion({
    systemPrompt,
    userPrompt,
    jsonMode: true,
    temperature: 0.4,
    apiKey,
  });

  if (aiReply) {
    try {
      const parsed = JSON.parse(aiReply.text);
      if (parsed.caption) {
        return {
          caption: parsed.caption,
          hashtags: parsed.hashtags || `#${topik.replace(/\s+/g, '')} #InfoPublik`,
          visualIdea: parsed.visualIdea || 'Infografis modern dengan headline tegas dan poin informasi resmi.',
          bestTime: parsed.bestTime || '11.30 - 13.00 & 19.00 - 21.00 WIB',
          provider: aiReply.provider,
        };
      }
    } catch {
      // Fall through to structured local engine
    }
  }

  return {
    caption: `Informasi Publik Terkini 👋\n\n${topik} hadir untuk memperkuat keterbukaan informasi dan mutu pelayanan bagi masyarakat. Simak rincian lengkapnya melalui kanal resmi kami.\n\nPunya pertanyaan atau masukan? Sampaikan di kolom komentar ya! 👇`,
    hashtags: `#${topik.replace(/[^a-zA-Z0-9]/g, '') || 'InfoPublik'} #InfoPublik #HumasDigital #LayananPublik`,
    visualIdea: 'Desain Carousel 3 slide: Slide 1 Headline utama; Slide 2 Poin informasi; Slide 3 Kanal pengaduan resmi.',
    bestTime: '12.00 - 13.30 WIB & 19.00 - 21.00 WIB',
    provider: 'DIGISMART Local Smart Engine',
  };
}
