<?php
header('Content-Type: application/json');
require_once '../config/config.php';

$sql = "SELECT id, apelido, presente, codigo_convite, status FROM usuarios ORDER BY apelido ASC";
$result = $conn->query($sql);

$usuarios = [];

while ($row = $result->fetch_assoc()) {
  $usuarios[] = $row;
}

echo json_encode($usuarios);
