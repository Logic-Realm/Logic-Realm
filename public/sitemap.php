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
} else {
    error_log('Logic Realm sitemap: unable to retrieve software slugs.');
}

$xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
$xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

foreach ($urls as $url) {
    $loc = htmlspecialchars($url['loc'], ENT_XML1 | ENT_COMPAT, 'UTF-8');
    $changefreq = htmlspecialchars($url['changefreq'], ENT_XML1 | ENT_COMPAT, 'UTF-8');
    $priority = htmlspecialchars($url['priority'], ENT_XML1 | ENT_COMPAT, 'UTF-8');

    $xml .= "  <url>\n";
    $xml .= "    <loc>{$loc}</loc>\n";
    $xml .= "    <changefreq>{$changefreq}</changefreq>\n";
    $xml .= "    <priority>{$priority}</priority>\n";
    $xml .= "  </url>\n";
}

$xml .= '</urlset>';
echo $xml;
