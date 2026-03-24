<?php

header("Content-Type: application/json; charset=utf-8");
date_default_timezone_set("America/Sao_Paulo");

echo json_encode([
    "ok" => true,
    "mensagem" => "API funcionando",
    "data" => date("Y-m-d H:i:s")
]);