<?php
declare(strict_types=1);

$host = "mysql.jundweb.com.br";
$db   = "jundweb13";
$user = "jundweb13";
$pass = "9qQjZFA9SKc2c6o";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "erro" => "Erro na conexão com banco"
    ]);
    exit;
}