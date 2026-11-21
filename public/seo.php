<?php
// Lightweight metadata response for software detail URLs.
// React still renders the page; this file only makes the initial HTML metadata crawlable.
$slug = isset($_GET['slug']) ? (string) $_GET['slug'] : '';
if (!preg_match('/^[a-zA-Z0-9-]+$/', $slug)) {
    http_response_code(400);
    exit('Invalid software slug');
}

require_once __DIR__ . '/api/_config.php';

$stmt = $conn->prepare("SELECT name, sdesc, category, platforms FROM softwares WHERE slug = ? LIMIT 1");
if (!$stmt) {
    http_response_code(500);
    exit('Unable to prepare software lookup');
}
$stmt->bind_param("s", $slug);
$stmt->execute();
$result = $stmt->get_result();
$app = $result ? $result->fetch_assoc() : null;
$stmt->close();

// Keep the normal React application shell for missing software slugs.
// React Router can then render the site's own 404 screen with its shared header/footer,
// while the HTTP response correctly tells crawlers that the requested URL is missing.
if (!is_array($app)) {
    http_response_code(404);
}

$baseUrl = 'https://logicrealm.rf.gd';
$canonical = $baseUrl . '/softwares/' . rawurlencode($slug);
$found = is_array($app);

$title = $found
    ? trim((string) $app['name']) . ' | Logic Realm'
    : 'Software Not Found | Logic Realm';
$description = $found && trim((string) $app['sdesc']) !== ''
    ? trim((string) $app['sdesc'])
    : ($found
        ? 'Explore ' . (string) $app['name'] . ', a software product from Logic Realm.'
        : 'The requested software product could not be found on Logic Realm.');

$imagePath = '/seo/' . $slug . '_page.png';
if (!is_file(__DIR__ . $imagePath)) {
    $imagePath = '/seo/softwares_page.png';
}
if (!is_file(__DIR__ . $imagePath)) {
    $imagePath = '/icon.svg';
}
$imageUrl = $baseUrl . $imagePath;

$escape = static function ($value) {
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
};

$structuredData = null;
if ($found) {
    $structuredData = [
        '@context' => 'https://schema.org',
        '@type' => 'SoftwareApplication',
        'name' => (string) $app['name'],
        'description' => (string) $description,
        'url' => $canonical,
    ];

    if (!empty($app['category'])) {
        $structuredData['applicationCategory'] = (string) $app['category'];
    }
    if (!empty($app['platforms'])) {
        $structuredData['operatingSystem'] = (string) $app['platforms'];
    }
}

$html = @file_get_contents(__DIR__ . '/index.html');
if ($html === false) {
    http_response_code(500);
    exit('Built application entry point is missing');
}

$htmlTitle = '<title>' . $escape($title) . '</title>';
$html = preg_replace_callback(
    '/<title>.*?<\/title>/is',
    static function () use ($htmlTitle) { return $htmlTitle; },
    $html,
    1
);

$descriptionTag = '<meta name="description" content="' . $escape($description) . '" data-rh="true">';
$html = preg_replace_callback(
    '/<meta\s+name=["\']description["\'][^>]*>/i',
    static function () use ($descriptionTag) { return $descriptionTag; },
    $html,
    1
);

$metadata = '
  <link rel="canonical" href="' . $escape($canonical) . '">
  <meta name="robots" content="' . ($found ? 'index,follow' : 'noindex,follow') . '">
  <meta property="og:type" content="website">
  <meta property="og:url" content="' . $escape($canonical) . '">
  <meta property="og:title" content="' . $escape($title) . '">
  <meta property="og:description" content="' . $escape($description) . '">
  <meta property="og:image" content="' . $escape($imageUrl) . '">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="' . $escape($title) . '">
  <meta name="twitter:description" content="' . $escape($description) . '">
  <meta name="twitter:image" content="' . $escape($imageUrl) . '">';
$metadata = str_replace('\\n', "\n", $metadata);

if ($structuredData !== null) {
    $json = json_encode(
        $structuredData,
        JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE |
        JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
    );
    if ($json !== false) {
        $metadata .= "\n  <script type=\"application/ld+json\">" . $json . "</script>";
    }
}

$html = preg_replace_callback(
    '/<\/head>/i',
    static function () use ($metadata) { return $metadata . "\n</head>"; },
    $html,
    1
);
header('Content-Type: text/html; charset=UTF-8');
echo $html;
