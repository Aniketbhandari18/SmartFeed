<?php
require "db.php";
require "generateCuid.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  echo json_encode(["success" => false, "message" => "Invalid JSON"]);
  exit;
}

$name = $data["name"];
$slug = $data["slug"];
$title = $data["title"];
$description = $data["description"];
$externalLink = $data["externalLink"] ?? null;
$createdById = $data["createdById"];

$id = generateCuid();
$now = date('Y-m-d H:i:s');

try {
  $stmt = $pdo->prepare('INSERT INTO "Space" 
    ("id", "createdById", "name", "slug", title, "description", "externalLink", "createdAt", "updatedAt")
    VALUES (:id, :createdById, :name, :slug, :title, :description, :externalLink, :createdAt, :updatedAt)
  ');

  $stmt->execute([
    ":id" => $id,
    ":createdById" => $createdById,
    ":name" => $name,
    ":slug" => $slug,
    ":title" => $title,
    ":description" => $description,
    ":externalLink" => $externalLink,
    ":createdAt" => $now,
    ":updatedAt" => $now,
  ]);

  echo json_encode(["success" => true, "message" => "Space created"]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => $e->getMessage()
  ]);
  exit;
}
