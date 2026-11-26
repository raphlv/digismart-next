<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$topic = isset($_GET['topic']) ? trim($_GET['topic']) : 'Politik & Pemerintahan';
$query = isset($_GET['query']) ? trim($_GET['query']) : $topic;
$mediaFilter = isset($_GET['media']) ? trim($_GET['media']) : 'Semua Media (Top 10)';

$mediaList = [
  ['name' => 'Kompas.com', 'domain' => 'kompas.com', 'rss' => ''],
  ['name' => 'Detik.com', 'domain' => 'detik.com', 'rss' => 'https://news.detik.com/berita/rss'],
  ['name' => 'Tribunnews.com', 'domain' => 'tribunnews.com', 'rss' => ''],
  ['name' => 'CNN Indonesia', 'domain' => 'cnnindonesia.com', 'rss' => 'https://www.cnnindonesia.com/nasional/rss'],
  ['name' => 'Liputan6.com', 'domain' => 'liputan6.com', 'rss' => 'https://feed.liputan6.com/rss/news'],
  ['name' => 'CNBC Indonesia', 'domain' => 'cnbcindonesia.com', 'rss' => 'https://www.cnbcindonesia.com/news/rss'],
  ['name' => 'Okezone.com', 'domain' => 'okezone.com', 'rss' => 'https://sindikasi.okezone.com/index.php/rss/1/RSS2.0'],
  ['name' => 'Republika.co.id', 'domain' => 'republika.co.id', 'rss' => 'https://www.republika.co.id/rss'],
  ['name' => 'Antara News', 'domain' => 'antaranews.com', 'rss' => 'https://www.antaranews.com/rss/terkini.xml'],
  ['name' => 'Tempo.co', 'domain' => 'tempo.co', 'rss' => 'https://rss.tempo.co/nasional'],
];

if ($mediaFilter !== 'Semua Media (Top 10)') {
  $mediaList = array_values(array_filter($mediaList, function ($m) use ($mediaFilter) {
    return $m['name'] === $mediaFilter;
  }));
}

function fetch_url($url) {
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_TIMEOUT => 7,
      CURLOPT_USERAGENT => 'Mozilla/5.0 (compatible; DIGISMARTBot/2.0)',
    ]);
    $out = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ($code >= 200 && $code < 300) ? $out : false;
  }
  return @file_get_contents($url);
}

$articles = [];
foreach ($mediaList as $idx => $m) {
  $gnews = 'https://news.google.com/rss/search?q=' . urlencode($query . ' site:' . $m['domain']) . '&hl=id&gl=ID&ceid=ID:id';
  $xmlStr = fetch_url($gnews);
  if (!$xmlStr && $m['rss']) {
    $xmlStr = fetch_url($m['rss']);
  }

  $picked = null;
  if ($xmlStr) {
    libxml_use_internal_errors(true);
    $xml = @simplexml_load_string($xmlStr, 'SimpleXMLElement', LIBXML_NOCDATA);
    if ($xml && isset($xml->channel->item[0])) {
      $it = $xml->channel->item[0];
      $title = trim(strip_tags((string)$it->title));
      $link = trim((string)$it->link);
      $desc = trim(preg_replace('/\s+/', ' ', strip_tags((string)$it->description)));
      $picked = [
        'id' => 'php-' . $m['domain'] . '-' . time() . '-' . $idx,
        'media' => $m['name'],
        'title' => $title,
        'topic' => $topic,
        'timestamp' => (string)$it->pubDate ?: 'Terkini',
        'sentiment' => 'netral',
        'summary' => strlen($desc) > 20 ? mb_substr($desc, 0, 240) : ('Laporan ' . $m['name'] . ': ' . $title),
        'url' => $link,
        'sourceMode' => 'live-rss',
      ];
    }
  }

  if (!$picked) {
    $picked = [
      'id' => 'php-ref-' . $m['domain'] . '-' . $idx,
      'media' => $m['name'],
      'title' => 'Liputan ' . $m['name'] . ' terkait ' . $query,
      'topic' => $topic,
      'timestamp' => 'Terkini',
      'sentiment' => 'netral',
      'summary' => 'Rujukan pemantauan pemberitaan ' . $m['name'] . ' pada topik ' . $topic . '.',
      'url' => 'https://www.google.com/search?q=' . urlencode($query . ' site:' . $m['domain']),
      'sourceMode' => 'structured-reference',
    ];
  }
  $articles[] = $picked;
}

echo json_encode([
  'topic' => $topic,
  'query' => $query,
  'totalMedia' => count($articles),
  'articles' => $articles,
], JSON_UNESCAPED_UNICODE);
