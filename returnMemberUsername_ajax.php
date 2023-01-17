<?php
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$eventId = 0;
$eventId = $json_obj['eventId'];

// $eventId = 5;

//access database
require 'database.php';
$stmt = $mysqli->prepare("SELECT other_member_user_id_string from events WHERE id=?");
$stmt->bind_param('s', $eventId);
$stmt->execute();
$stmt->bind_result($other_member_user_id_string);
$stmt->fetch();
$stmt->close();

$otherMemberIDs = array_unique(array_map('intval', explode(',', $other_member_user_id_string)));

echo '{"usernames": [';
$dataString = '';
foreach ($otherMemberIDs as $userId){
    $stmt = $mysqli->prepare("SELECT username from users WHERE id=?");
    $stmt->bind_param('s', $userId);
    $stmt->execute();
    $stmt->bind_result($username);
    while($stmt->fetch()){
        $dataString = $dataString.'"'.$username.'",';
    }
}
$dataString = rtrim($dataString, ",");
echo $dataString;
echo ']}';
?>