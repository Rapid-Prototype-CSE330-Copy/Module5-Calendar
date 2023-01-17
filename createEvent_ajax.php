<?php

require 'database.php';

$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);
//Variables can be accessed as such:
$tit = $json_obj['title'];
$title = htmlentities($tit);
$dateAndTime = $json_obj['dateAndTime'];
$isImportant = $json_obj['isImportant'];
$holderId = $json_obj['holder_id'];
$tag = $json_obj['tag'];

$stmt = $mysqli->prepare("insert into events (title, dateAndTime, holder_id, isImportant, tag) values (?, ?, ?, ?, ?)");
$stmt->bind_param('sssss', $title, $dateAndTime, $holderId, $isImportant, $tag);
$stmt->execute();
$stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => "Event created successfully!"
));
exit;
