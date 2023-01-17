<?php
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$invitedUserName = "";
$eventId = 0;

$invitedUserName = $json_obj['invitedUserName'];
$eventId = $json_obj['eventId'];

// $invitedUserName = "user1";
// $eventId = 4;

//check if username is valid
if( !preg_match('/^[\w_\-]+$/', $invitedUserName) ){
	echo json_encode(array(
		"success" => false,
		"message" => "Invalid username."
	));
	exit;
}

//access database
require 'database.php';
$stmt = $mysqli->prepare("SELECT other_member_user_id_string, holder_id from events WHERE id=?");
$stmt->bind_param('s', $eventId);
$stmt->execute();
$stmt->bind_result($other_member_user_id_string, $holder_id);
$stmt->fetch();
$stmt->close();

if($holder_id == null){
    echo json_encode(array(
		"success" => false,
		"message" => "Error: Event does not exist!"
	));
	exit;
}

$stmt = $mysqli->prepare("SELECT id from users WHERE username=?");
$stmt->bind_param('s', $invitedUserName);
$stmt->execute();
$stmt->bind_result($invitedUser_id);
$stmt->fetch();
$stmt->close();

if($invitedUser_id == null){
    echo json_encode(array(
		"success" => false,
		"message" => "Username ".$invitedUserName." does not exist."
	));
	exit;
}

if($invitedUser_id == $holder_id){
    echo json_encode(array(
		"success" => false,
		"message" => "You are the event holder. Don't invite yourself!"
	));
	exit;
}

$otherMemberIDs = array_map('intval', explode(',', $other_member_user_id_string));
if(in_array($invitedUser_id, $otherMemberIDs)){
    echo json_encode(array(
		"success" => false,
		"message" => "Username ".$invitedUserName." is already invited to this event before."
	));
	exit;
}else{
    $other_member_user_id_string = $other_member_user_id_string.",".strval($invitedUser_id);

    $stmt = $mysqli->prepare("UPDATE events set other_member_user_id_string=? WHERE id=?");
    $stmt->bind_param('ss', $other_member_user_id_string, $eventId);
    $stmt->execute();
    $stmt->close();

    //double check if update is successful
    $stmt = $mysqli->prepare("SELECT other_member_user_id_string from events WHERE id=?");
    $stmt->bind_param('s', $eventId);
    $stmt->execute();
    $stmt->bind_result($idStringAfterUpdate);
    $stmt->fetch();
    $stmt->close();

    $idsAfterUpdate = array_map('intval', explode(',', $idStringAfterUpdate));
    if(in_array($invitedUser_id, $idsAfterUpdate)){
        echo json_encode(array(
            "success" => true,
            "message" => "Username ".$invitedUserName." has successfully been invited to this event."
        ));
        exit;
    }else{
        echo json_encode(array(
            "success" => false,
            "message" => "Error: Unknown update error!"
        ));
        exit;
    }

}


?>