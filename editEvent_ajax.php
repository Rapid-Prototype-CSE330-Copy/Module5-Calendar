<?php

require 'database.php';

$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);
//Variables can be accessed as such:
$eventId = $json_obj['eventId'];
$tit = $json_obj['title'];
$title = htmlentities($tit);
$isImportant = $json_obj['isImportant'];
$tag = $json_obj['tag'];
$dateAndTime = $json_obj['dateAndTime'];

$stmt = $mysqli->prepare("update events set title = ?, isImportant = ?, tag = ?, dateAndTime = ? WHERE id = ?");
$stmt->bind_param('sssss', $title, $isImportant, $tag, $dateAndTime, $eventId);
$stmt->execute();
$stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => "Event updated successfully!"
));
exit;
