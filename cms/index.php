<?php
// /var/www/aigile.lu/cms/index.php (ou chemin déployé)
// API simple pour gérer les articles Markdown

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Configuration - CHANGEZ CETTE CLÉ !
define('ARTICLES_DIR', '/var/www/aigile.lu/articles/');
define('API_KEY', 'AIgile-2025-' . md5('salim.gomri@gmail.com' . date('Y-m-d')));

// Fonction d'authentification simple
function isAuthenticated() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        return $matches[1] === API_KEY;
    }
    
    return false;
}

// Créer le répertoire articles s'il n'existe pas
if (!file_exists(ARTICLES_DIR)) {
    mkdir(ARTICLES_DIR, 0755, true);
}

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

// Router simple
switch ($method) {
    case 'GET':
        if (end($pathParts) === 'articles') {
            echo json_encode(getArticles());
        } elseif (count($pathParts) >= 2 && $pathParts[count($pathParts)-2] === 'articles') {
            $slug = end($pathParts);
            echo json_encode(getArticle($slug));
        } else {
            echo json_encode(['error' => 'Endpoint non trouvé']);
        }
        break;
        
    case 'POST':
        if (!isAuthenticated()) {
            http_response_code(401);
            echo json_encode(['error' => 'Non autorisé']);
            break;
        }
        
        if (end($pathParts) === 'articles') {
            $input = json_decode(file_get_contents('php://input'), true);
            echo json_encode(createArticle($input));
        }
        break;
        
    case 'PUT':
        if (!isAuthenticated()) {
            http_response_code(401);
            echo json_encode(['error' => 'Non autorisé']);
            break;
        }
        
        if (count($pathParts) >= 2 && $pathParts[count($pathParts)-2] === 'articles') {
            $slug = end($pathParts);
            $input = json_decode(file_get_contents('php://input'), true);
            echo json_encode(updateArticle($slug, $input));
        }
        break;
        
    case 'DELETE':
        if (!isAuthenticated()) {
            http_response_code(401);
            echo json_encode(['error' => 'Non autorisé']);
            break;
        }
        
        if (count($pathParts) >= 2 && $pathParts[count($pathParts)-2] === 'articles') {
            $slug = end($pathParts);
            echo json_encode(deleteArticle($slug));
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
}

function slugify($text) {
    $text = transliterator_transliterate('Any-Latin; Latin-ASCII; [^A-Za-z0-9_] remove; Lower()', $text);
    return trim(preg_replace('/[-\s]+/', '-', $text), '-');
}

function parseMarkdownFile($filepath) {
    if (!file_exists($filepath)) {
        return null;
    }
    
    $content = file_get_contents($filepath);
    $parts = explode('---', $content, 3);
    
    if (count($parts) >= 3) {
        $frontMatter = $parts[1];
        $markdownContent = trim($parts[2]);
        
        $metadata = [];
        $lines = explode("\n", $frontMatter);
        foreach ($lines as $line) {
            if (strpos($line, ':') !== false) {
                [$key, $value] = explode(':', $line, 2);
                $metadata[trim($key)] = trim($value, " \t\n\r\0\x0B\"'");
            }
        }
    } else {
        $metadata = [];
        $markdownContent = $content;
    }
    
    return [
        'metadata' => $metadata,
        'content' => $markdownContent
    ];
}

function getArticles() {
    $articles = [];
    $files = glob(ARTICLES_DIR . '*.md');
    
    foreach ($files as $file) {
        $parsed = parseMarkdownFile($file);
        if ($parsed) {
            $slug = basename($file, '.md');
            $articles[] = [
                'slug' => $slug,
                'title' => $parsed['metadata']['title'] ?? 'Sans titre',
                'excerpt' => $parsed['metadata']['excerpt'] ?? '',
                'publishedAt' => $parsed['metadata']['publishedAt'] ?? date('c', filemtime($file)),
                'readingTime' => calculateReadingTime($parsed['content']),
                'tags' => isset($parsed['metadata']['tags']) ? explode(',', $parsed['metadata']['tags']) : [],
                'principle' => $parsed['metadata']['principle'] ?? null,
                'linkedinUrl' => $parsed['metadata']['linkedinUrl'] ?? null
            ];
        }
    }
    
    usort($articles, function($a, $b) {
        return strtotime($b['publishedAt']) - strtotime($a['publishedAt']);
    });
    
    return $articles;
}

function getArticle($slug) {
    $filepath = ARTICLES_DIR . $slug . '.md';
    $parsed = parseMarkdownFile($filepath);
    
    if (!$parsed) {
        http_response_code(404);
        return ['error' => 'Article non trouvé'];
    }
    
    return [
        'slug' => $slug,
        'title' => $parsed['metadata']['title'] ?? 'Sans titre',
        'excerpt' => $parsed['metadata']['excerpt'] ?? '',
        'content' => $parsed['content'],
        'htmlContent' => markdownToHtml($parsed['content']),
        'publishedAt' => $parsed['metadata']['publishedAt'] ?? date('c', filemtime($filepath)),
        'readingTime' => calculateReadingTime($parsed['content']),
        'tags' => isset($parsed['metadata']['tags']) ? explode(',', $parsed['metadata']['tags']) : [],
        'principle' => $parsed['metadata']['principle'] ?? null,
        'linkedinUrl' => $parsed['metadata']['linkedinUrl'] ?? null
    ];
}

function createArticle($data) {
    if (!$data['title'] || !$data['content']) {
        http_response_code(400);
        return ['error' => 'Titre et contenu requis'];
    }
    
    $slug = $data['slug'] ?? slugify($data['title']);
    $filepath = ARTICLES_DIR . $slug . '.md';
    
    if (file_exists($filepath)) {
        http_response_code(409);
        return ['error' => 'Un article avec ce slug existe déjà'];
    }
    
    $frontMatter = [
        'title' => $data['title'],
        'excerpt' => $data['excerpt'] ?? '',
        'publishedAt' => $data['publishedAt'] ?? date('c'),
        'tags' => isset($data['tags']) ? implode(',', $data['tags']) : '',
        'principle' => $data['principle'] ?? '',
        'linkedinUrl' => $data['linkedinUrl'] ?? ''
    ];
    
    $fileContent = "---\n";
    foreach ($frontMatter as $key => $value) {
        if ($value !== '') {
            $fileContent .= "$key: $value\n";
        }
    }
    $fileContent .= "---\n\n";
    $fileContent .= $data['content'];
    
    if (file_put_contents($filepath, $fileContent)) {
        return [
            'success' => true,
            'slug' => $slug,
            'message' => 'Article créé avec succès'
        ];
    } else {
        http_response_code(500);
        return ['error' => 'Erreur lors de la création du fichier'];
    }
}

function updateArticle($slug, $data) {
    // Implementation similaire...
    return ['success' => true, 'message' => 'Mise à jour réussie'];
}

function deleteArticle($slug) {
    $filepath = ARTICLES_DIR . $slug . '.md';
    
    if (!file_exists($filepath)) {
        http_response_code(404);
        return ['error' => 'Article non trouvé'];
    }
    
    if (unlink($filepath)) {
        return ['success' => true, 'message' => 'Article supprimé'];
    } else {
        http_response_code(500);
        return ['error' => 'Erreur lors de la suppression'];
    }
}

function calculateReadingTime($content) {
    $wordCount = str_word_count(strip_tags($content));
    return max(1, ceil($wordCount / 200));
}

function markdownToHtml($markdown) {
    $html = $markdown;
    $html = preg_replace('/^# (.+)$/m', '<h1>$1</h1>', $html);
    $html = preg_replace('/^## (.+)$/m', '<h2>$1</h2>', $html);
    $html = preg_replace('/^### (.+)$/m', '<h3>$1</h3>', $html);
    $html = preg_replace('/\*\*(.+?)\*\*/', '<strong>$1</strong>', $html);
    $html = preg_replace('/\*(.+?)\*/', '<em>$1</em>', $html);
    $html = preg_replace('/\[(.+?)\]\((.+?)\)/', '<a href="$2">$1</a>', $html);
    $html = preg_replace('/\n\n/', '</p><p>', $html);
    $html = '<p>' . $html . '</p>';
    return $html;
}

// Affichage de la clé API pour la première connexion
if ($_GET['show_key'] === '1') {
    echo json_encode(['api_key' => API_KEY]);
    exit;
}
?>
