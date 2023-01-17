<?php
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);
$userId = $json_obj['userId'];
$year = $json_obj['year'];
$month = $json_obj['month'];
$date = $json_obj['date'];

// echo $json_obj['userId']. "\n";
// echo $json_obj['year']. "\n";
// echo $json_obj['month']. "\n";
// echo $json_obj['date']. "\n";

// $userId = 3;
// $year = 2022;
// $month = 10;
// $date = 23;

if(((int) $month) < 10){
    $standardMonthString = "0".strval($month);
}else{
    $standardMonthString = strval($month);
}

if(((int) $date) < 10){
    $standardDateString = "0".strval($date);
}else{
    $standardDateString = strval($date);
}

$YMD = strval($year)."-".$standardMonthString."-".$standardDateString;



//access database
require 'database.php';

$stmt = $mysqli->prepare("SELECT COUNT(*) FROM events WHERE holder_id=? AND LOCATE(?, dateAndTime)>0");
$stmt->bind_param('ss', $userId, $YMD);
$stmt->execute();
$stmt->bind_result($cnt);
$stmt->fetch();
$stmt->close();

$stmt = $mysqli->prepare("SELECT id, title, dateAndTime, isImportant, other_member_user_id_string, tag
                        FROM events 
                        WHERE holder_id=? AND LOCATE(?, dateAndTime)>0");
$stmt->bind_param('ss', $userId, $YMD);
$stmt->execute();
$stmt->bind_result($id, $title, $dateAndTime, $isImportant, $other_member_user_id_string, $tag);

$dataString = '';
$i = 1;

if($cnt>0){
    echo "{";
    echo '"hasEvents":true,';
    while($stmt->fetch()){
        $dataString = $dataString.sprintf('"event%s":{"eventId":"%s","title":"%s","dateAndTime":"%s","isImportant":"%s","other_member_user_id_string":"%s", "tag":"%s"},',
                        htmlspecialchars($i),
                        htmlspecialchars($id),
                        htmlspecialchars($title), 
                        htmlspecialchars($dateAndTime), 
                        htmlspecialchars($isImportant), 
                        htmlspecialchars($other_member_user_id_string),
                        htmlspecialchars($tag));
        $i += 1;
    }
    $dataString = rtrim($dataString, ",");
    echo $dataString;
    echo "}";
}else{
    echo json_encode(array(
		"hasEvents" => false,
	));
	exit;
}


$stmt->close();



?>