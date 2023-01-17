<?php

require 'database.php';

$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);
//Variables can be accessed as such:
$eventId = $json_obj['eventId'];

$stmt = $mysqli->prepare("delete from events where id = ?");
$stmt->bind_param('s', $eventId);
$stmt->execute();
$stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => "Event deleted successfully!"
));
exit;
