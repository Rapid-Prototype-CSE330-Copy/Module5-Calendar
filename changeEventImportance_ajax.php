<?php
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);
$eventId = $json_obj['eventId'];

//access database
require 'database.php';

// get the value of isImportant before changing it
$stmt = $mysqli->prepare("SELECT isImportant FROM events WHERE id=?");
$stmt->bind_param('s', $eventId);
$stmt->execute();
$stmt->bind_result($isImportantBefore);
$stmt->fetch();
$stmt->close();


//change isImportant
if($isImportantBefore == "yes"){
    $stmt = $mysqli->prepare("UPDATE events set isImportant='no' WHERE id=?");
}else if($isImportantBefore == "no"){
    $stmt = $mysqli->prepare("UPDATE events set isImportant='yes' WHERE id=?");
}else{
    echo json_encode(array(
		"success" => false,
		"message" => "Event dose not exist!"
	));
	exit;
}

$stmt->bind_param('s', $eventId);
$stmt->execute();
$stmt->close();


//double check if update is successful
$stmt = $mysqli->prepare("SELECT isImportant FROM events WHERE id=?");
$stmt->bind_param('s', $eventId);
$stmt->execute();
$stmt->bind_result($isImportantAfter);
$stmt->fetch();
$stmt->close();

if($isImportantAfter != $isImportantBefore){
    echo json_encode(array(
        "success" => true,
        "message" => "Importance successfully changed from ".$isImportantBefore." to ".$isImportantAfter
    ));
    exit;
}else{
    echo json_encode(array(
		"success" => false,
		"message" => "Failed Update!"
	));
	exit;
}


?>