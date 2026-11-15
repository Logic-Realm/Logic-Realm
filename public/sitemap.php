<?php
header('Content-Type: application/xml; charset=UTF-8');
header('Cache-Control: public, max-age=300');

$baseUrl = 'https://logicrealm.rf.gd';
$staticPaths = [
    '/' => '1.0',
    '/softwares' => '0.9',
    '/about' => '0.7',
    '/contact' => '0.7',
];

$urls = [];
foreach ($staticPaths as $path => $priority) {
    $urls[] = [
        'loc' => $baseUrl . $path,
        'changefreq' => ($path === '/softwares') ? 'weekly' : 'monthly',
        'priority' => $priority,
    ];
}

require_once __DIR__ . '/api/_config.php';
$result = $conn->query("SELECT slug FROM softwares WHERE slug IS NOT NULL AND slug <> ''");

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $slug = trim((string) $row['slug']);
        if ($slug === '' || !preg_match('/^[a-zA-Z0-9-]+$/', $slug)) {
            continue;
        }
        $urls[] = [
            'loc' => $baseUrl . '/softwares/' . rawurlencode($slug),
            'changefreq' => 'weekly',
            'priority' => '0.8',
        ];
    }
}

$xml = new XMLWriter();
$xml->openMemory();
$xml->startDocument('1.0', 'UTF-8');
$xml->startElement('urlset');
$xml->writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

foreach ($urls as $url) {
    $xml->startElement('url');
    $xml->writeElement('loc', $url['loc']);
    $xml->writeElement('changefreq', $url['changefreq']);
    $xml->writeElement('priority', $url['priority']);
    $xml->endElement();
}

$xml->endElement();
$xml->endDocument();
echo $xml->outputMemory();
