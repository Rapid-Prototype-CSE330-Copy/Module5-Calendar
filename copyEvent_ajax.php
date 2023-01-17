<?php
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);
$eventId = $json_obj['eventId'];
$dates = $json_obj['dates'];

//access database
require 'database.php';

$stmt = $mysqli->prepare("SELECT COUNT(*), title, dateAndTime, holder_id, isImportant, other_member_user_id_string, tag 
                        FROM events WHERE id=?");
$stmt->bind_param('s', $eventId);
$stmt->execute();
$stmt->bind_result($cnt, $title, $dateAndTime, $holder_id, $isImportant, $other_member_user_id_string, $tag);
$stmt->fetch();
$stmt->close();

if($cnt != 1){
    echo json_encode(array(
		"success" => false,
		"message" => "Event not Valid!"
	));
	exit;
}

$time = explode($dateAndTime)[1];

foreach ($dates as $date){
    $newDateAndTime = $date.$time;
    $stmt = $mysqli->prepare("INSERT into events 
                            (title, dateAndTime, holder_id, isImportant, other_member_user_id_string, tag)
                            values (?,?,?,?,?,?)");
    $stmt->bind_param('ssssss', $title, $newDateAndTime, $holder_id, $isImportant, $other_member_user_id_string, $tag);
    $stmt->execute();
    $stmt->close();
}


echo json_encode(array(
    "success" => true,
    "message" => "Event successfully copied to the weeks!"
));
exit;


?>