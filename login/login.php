<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');
$apelido = trim($data['apelido'] ?? '');

if (!$email || !$apelido) {
  http_response_code(400);
  echo json_encode(['erro' => 'Preencha todos os campos']);
  exit;
}

// Verifica se já existe
$stmt = $conn->prepare("SELECT id, codigo_convite FROM usuarios WHERE email = ? AND apelido = ?");
$stmt->bind_param("ss", $email, $apelido);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
  // Gera um código único de convite
  $codigo_convite = uniqid('CVT-');

  $insert = $conn->prepare("INSERT INTO usuarios (email, apelido, codigo_convite) VALUES (?, ?, ?)");
  $insert->bind_param("sss", $email, $apelido, $codigo_convite);
  if ($insert->execute()) {
    echo json_encode([
      'sucesso' => true,
      'mensagem' => 'Usuário cadastrado e logado',
      'email' => $email,
      'apelido' => $apelido,
      'codigo_convite' => $codigo_convite
    ]);
  } else {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao cadastrar usuário']);
  }
} else {
  $user = $result->fetch_assoc();
  echo json_encode([
    'sucesso' => true,
    'mensagem' => 'Login realizado com sucesso',
    'email' => $email,
    'apelido' => $apelido,
    'codigo_convite' => $user['codigo_convite']
  ]);
}
