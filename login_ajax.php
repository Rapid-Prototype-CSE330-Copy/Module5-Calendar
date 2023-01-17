<?php
header("Content-Type: application/json");

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);
//Variables can be accessed as such:
$username = $json_obj['username'];
$password = $json_obj['password'];
//This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

//access database
require 'database.php';
$stmt = $mysqli->prepare("SELECT id, hashed_password FROM users WHERE username=?");
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($user_id, $hashedPassword);
$stmt->fetch();
$stmt->close();

//check if username exists
if($user_id == null){
	echo json_encode(array(
		"success" => false,
		"message" => "Username ".$username." does not exist.",
		"id" => 0,
		"username" => ''
	));
	exit;
}

//check if username and password are valid
if( !preg_match('/^[\w_\-]+$/', $username) || !preg_match('/^[\w_\-]+$/', $password) ){
	echo json_encode(array(
		"success" => false,
		"message" => "Invalid username or password.",
		"id" => 0,
		"username" => ''
	));
	exit;
}

//check if password is correct
$guessedPassword = $password;
if(password_verify($guessedPassword, $hashedPassword)){
	session_start();
	$_SESSION['username'] = $username;
	$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
	$token = $_SESSION['token'];  

	echo json_encode(array(
		"success" => true,
		"message" => "Welcome, ".$username.".",
		"id" => $user_id,
		"username" => $username,
		"token" => $token
	));
	exit;
}else{
	echo json_encode(array(
		"success" => false,
		"message" => "Username and Password does not match our record.",
		"id" => 0,
		"username" => ''
	));
	exit;
}

// Check to see if the username and password are valid.  (You learned how to do this in Module 3.)
// if( !preg_match('/^[\w_\-]+$/', $username) && !preg_match('/^[\w_\-]+$/', $password) ){
// 	session_start();
// 	$_SESSION['username'] = $username;
// 	$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 

// 	echo json_encode(array(
// 		"success" => true,
// 		"message" => "Valid Username and Password"
// 	));
// 	exit;
// }else{
// 	echo json_encode(array(
// 		"success" => false,
// 		"message" => "Invalid Username or Password"
// 	));
// 	exit;
// }



?>