<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$jsonFile = __DIR__ . '/data.json';

if (file_exists($jsonFile)) {
    echo file_get_contents($jsonFile);
} else {
    echo json_encode(["error" => "Data file not found"]);
}
?>