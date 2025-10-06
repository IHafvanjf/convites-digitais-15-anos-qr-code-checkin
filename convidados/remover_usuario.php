<?php
header('Content-Type: application/json');
require_once '../config/config.php';

// Verifica se recebeu o ID
$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? 0;

if (!$id || !is_numeric($id)) {
  http_response_code(400);
  echo json_encode(['erro' => 'ID inválido']);
  exit;
}

// Executa a exclusão
$stmt = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
  echo json_encode(['sucesso' => true]);
} else {
  http_response_code(500);
  echo json_encode(['erro' => 'Erro ao remover']);
}
