import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface MediaFeedConfig {
  name: string;
  domain: string;
  directRss?: string;
  searchUrl: (q: string) => string;
}

const TEN_MEDIA_FEEDS: MediaFeedConfig[] = [
  {
    name: 'Kompas.com',
    domain: 'kompas.com',
    searchUrl: (q) => `https://search.kompas.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    name: 'Detik.com',
    domain: 'detik.com',
    directRss: 'https://news.detik.com/berita/rss',
    searchUrl: (q) => `https://www.detik.com/search/searchall?query=${encodeURIComponent(q)}`,
  },
  {
    name: 'Tribunnews.com',
    domain: 'tribunnews.com',
    searchUrl: (q) => `https://www.tribunnews.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    name: 'CNN Indonesia',
    domain: 'cnnindonesia.com',
    directRss: 'https://www.cnnindonesia.com/nasional/rss',
    searchUrl: (q) => `https://www.cnnindonesia.com/search/?query=${encodeURIComponent(q)}`,
  },
  {
    name: 'Liputan6.com',
    domain: 'liputan6.com',
    directRss: 'https://feed.liputan6.com/rss/news',
    searchUrl: (q) => `https://www.liputan6.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    name: 'CNBC Indonesia',
    domain: 'cnbcindonesia.com',
    directRss: 'https://www.cnbcindonesia.com/news/rss',
    searchUrl: (q) => `https://www.cnbcindonesia.com/search?query=${encodeURIComponent(q)}`,
  },
  {
    name: 'Okezone.com',
    domain: 'okezone.com',
    directRss: 'https://sindikasi.okezone.com/index.php/rss/1/RSS2.0',
    searchUrl: (q) => `https://search.okezone.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    name: 'Republika.co.id',
    domain: 'republika.co.id',
    directRss: 'https://www.republika.co.id/rss',
    searchUrl: (q) => `https://republika.co.id/search/${encodeURIComponent(q)}`,
  },
  {
    name: 'Antara News',
    domain: 'antaranews.com',
    directRss: 'https://www.antaranews.com/rss/terkini.xml',
    searchUrl: (q) => `https://www.antaranews.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    name: 'Tempo.co',
    domain: 'tempo.co',
    directRss: 'https://rss.tempo.co/nasional',
    searchUrl: (q) => `https://www.tempo.co/search?q=${encodeURIComponent(q)}`,
  },
];

function decodeEntities(str: string): string {
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTag(block: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = block.match(re);
  return m ? decodeEntities(m[1]) : '';
}

function formatPubDate(pubDateStr: string): string {
  if (!pubDateStr) return 'Terkini';
  const parsed = new Date(pubDateStr);
  if (Number.isNaN(parsed.getTime())) return pubDateStr;
  const diffMin = Math.max(1, Math.round((Date.now() - parsed.getTime()) / 60000));
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  return parsed.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface ParsedItem {
  title: string;
  link: string;
  summary: string;
  timestamp: string;
}

function parseRssItems(xml: string, mediaName: string): ParsedItem[] {
  const items: ParsedItem[] = [];
  const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  const brandShort = mediaName.split('.')[0].toLowerCase();

  for (const block of itemMatches.slice(0, 12)) {
    let title = extractTag(block, 'title');
    // Remove trailing " - MediaName" appended by Google News RSS
    title = title.replace(/\s+-\s+[^-]+$/, (suffix) =>
      suffix.toLowerCase().includes(brandShort) ? '' : suffix
    ).trim();

    const link = extractTag(block, 'link');
    const rawDesc = extractTag(block, 'description');
    const pubDate = extractTag(block, 'pubDate');

    const isValidHeadline =
      title.length >= 16 &&
      title.toLowerCase() !== brandShort &&
      title.toLowerCase() !== mediaName.toLowerCase();

    if (isValidHeadline && link) {
      const summary =
        rawDesc && rawDesc.length > 20 && rawDesc.toLowerCase() !== title.toLowerCase()
          ? rawDesc.slice(0, 240)
          : `Laporan dari ${mediaName}: ${title}.`;
      items.push({
        title,
        link,
        summary,
        timestamp: formatPubDate(pubDate),
      });
    }
  }
  return items;
}

async function fetchRssWithTimeout(url: string, timeoutMs = 6500): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DIGISMARTBot/2.0)',
        Accept: 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
      },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchMediaArticle(
  media: MediaFeedConfig,
  topic: string,
  searchQuery: string
) {
  // 1. Topic-focused Google News RSS for this exact media domain
  const gnewsTopicUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
    `${searchQuery} site:${media.domain}`
  )}&hl=id&gl=ID&ceid=ID:id`;

  const topicXml = await fetchRssWithTimeout(gnewsTopicUrl);
  if (topicXml) {
    const items = parseRssItems(topicXml, media.name);
    if (items.length > 0) {
      const top = items[0];
      return {
        id: `live-${media.domain}-${Date.now()}`,
        media: media.name,
        title: top.title,
        topic,
        timestamp: top.timestamp,
        sentiment: 'netral' as const,
        summary: top.summary,
        url: top.link,
        sourceMode: 'live-rss' as const,
      };
    }
  }

  // 2. Fallback to media's direct official RSS or broad site:domain RSS
  const fallbackUrl =
    media.directRss ||
    `https://news.google.com/rss/search?q=${encodeURIComponent(`site:${media.domain}`)}&hl=id&gl=ID&ceid=ID:id`;
  const directXml = await fetchRssWithTimeout(fallbackUrl);
  if (directXml) {
    const items = parseRssItems(directXml, media.name);
    if (items.length > 0) {
      const kw = searchQuery.toLowerCase().split(/\s+/).find((w) => w.length > 3);
      const matched =
        (kw && items.find((i) => `${i.title} ${i.summary}`.toLowerCase().includes(kw))) ||
        items[0];
      return {
        id: `live-${media.domain}-${Date.now()}`,
        media: media.name,
        title: matched.title,
        topic,
        timestamp: matched.timestamp,
        sentiment: 'netral' as const,
        summary: matched.summary,
        url: matched.link,
        sourceMode: 'live-rss' as const,
      };
    }
  }

  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get('topic') || 'Politik & Pemerintahan';
  const query = searchParams.get('query') || topic;
  const mediaParam = searchParams.get('media') || 'Semua Media (Top 10)';

  const targets =
    mediaParam === 'Semua Media (Top 10)'
      ? TEN_MEDIA_FEEDS
      : TEN_MEDIA_FEEDS.filter((m) => m.name === mediaParam);

  const settled = await Promise.allSettled(
    targets.map((m) => fetchMediaArticle(m, topic, query))
  );

  const articles = settled
    .map((res, idx) => {
      if (res.status === 'fulfilled' && res.value) return res.value;
      const cfg = targets[idx];
      return {
        id: `ref-${cfg.domain}-${Date.now()}-${idx}`,
        media: cfg.name,
        title: `Liputan ${cfg.name} terkait ${query} (${topic})`,
        topic,
        timestamp: 'Terkini',
        sentiment: 'netral' as const,
        summary: `Rujukan pemantauan pemberitaan ${cfg.name} pada kanal ${topic.toLowerCase()} terkait topik ${query}.`,
        url: cfg.searchUrl(query),
        sourceMode: 'structured-reference' as const,
      };
    });

  return NextResponse.json({
    topic,
    query,
    totalMedia: articles.length,
    liveCount: articles.filter((a) => a.sourceMode === 'live-rss').length,
    articles,
  });
}
