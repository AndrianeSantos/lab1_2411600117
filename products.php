<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Gamit ang __DIR__ para makuha ang absolute directory path ng api folder
$jsonFilePath = __DIR__ . "/../data/products.json";

if (!file_exists($jsonFilePath)) {
    http_response_code(404);
    echo json_encode(["error" => "Data file not found at " . $jsonFilePath]);
    exit();
}

$jsonData = file_get_contents($jsonFilePath);

if ($jsonData === false) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to read data file."]);
    exit();
}

http_response_code(200);
echo $jsonData;
?>