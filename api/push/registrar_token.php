<?php
declare(strict_types=1);

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/bd.php';

// pegar dados
$input = json_decode(file_get_contents("php://input"), true);

$fcm_token = $input['token'] ?? null;
$usuario_id = $input['usuario_id'] ?? null;
$plataforma = $input['plataforma'] ?? 'web';

if (!$fcm_token) {
    http_response_code(400);
    echo json_encode(["erro" => "Token não informado"]);
    exit;
}

try {
    // verifica se já existe
    $sql = "SELECT id FROM push_tokens WHERE fcm_token = :token LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['token' => $fcm_token]);
    $existe = $stmt->fetch();

    if ($existe) {
        // update
        $sql = "UPDATE push_tokens 
                SET usuario_id = :usuario_id,
                    ativo = 1,
                    ultimo_uso_em = NOW()
                WHERE fcm_token = :token";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'usuario_id' => $usuario_id,
            'token' => $fcm_token
        ]);

        echo json_encode(["status" => "atualizado"]);
    } else {
        // insert
        $sql = "INSERT INTO push_tokens 
                (usuario_id, fcm_token, plataforma, ativo, ultimo_uso_em)
                VALUES (:usuario_id, :token, :plataforma, 1, NOW())";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'usuario_id' => $usuario_id,
            'token' => $fcm_token,
            'plataforma' => $plataforma
        ]);

        echo json_encode(["status" => "criado"]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "erro" => "Erro ao salvar token"
    ]);
}