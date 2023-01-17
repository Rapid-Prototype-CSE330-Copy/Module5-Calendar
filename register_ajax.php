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
$stmt = $mysqli->prepare("SELECT COUNT(*) FROM users WHERE username=?");
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($cnt);
$stmt->fetch();
$stmt->close();

if($cnt > 0){
	echo json_encode(array(
		"success" => false,
		"message" => "Username ".$username." already exists."
	));
	exit;
}

if( !preg_match('/^[\w_\-]+$/', $username) || !preg_match('/^[\w_\-]+$/', $password) ){
	echo json_encode(array(
		"success" => false,
		"message" => "Invalid username or password."
	));
	exit;
}

$hashed_password = password_hash($password, PASSWORD_BCRYPT);

$stmt = $mysqli->prepare("insert into users (username, hashed_password) values (?, ?)");
$stmt->bind_param('ss', $username, $hashed_password);
$stmt->execute();
$stmt->close();

echo json_encode(array(
	"success" => true,
	"message" => "You may continue login as ".$username." and check your calendar."
));
exit;









// session_start();

// // This is a *good* example of how you can implement password-based user authentication in your web application.
// require 'database.php';

// // echo "====================================================";
// // userinput
// $_SESSION['registerUsername'] = $mysqli->real_escape_string($_POST['registerUsername']);
// $registerUsername = $_SESSION['registerUsername'];
// $_SESSION['registerPassword'] = $mysqli->real_escape_string($_POST['registerPassword']);
// $registerPassword = $_SESSION['registerPassword'];

// // prevent csrf
// if(!hash_equals($_SESSION['token'], $_POST['token'])){
// 	die("Request forgery detected");
// }


// // Check if username&password are valid
// if( !preg_match('/^[\w_\-]+$/', $registerUsername) ){
// 	echo "Invalid username";
// 	echo sprintf("<br><a href=\"portal.php\">Back to login/register</a>");
// 	exit;
// }
// if( !preg_match('/^[\w_\-]+$/', $registerPassword) ){
// 	echo "Invalid password";
// 	echo sprintf("<br><a href=\"portal.php\">Back to login/register</a>");
// 	exit;
// }

// // hash the password
// $hashed_password = password_hash($registerPassword, PASSWORD_BCRYPT);
// // echo sprintf("<h1>hashedpassword: %s</h1>", $hashed_password);



// // Check if username already exists
// $stmt = $mysqli->prepare("SELECT COUNT(*) FROM users WHERE username=?");
// $stmt->bind_param('s', $registerUsername);
// $stmt->execute();
// $stmt->bind_result($cnt);
// $stmt->fetch();
// if($cnt > 0){
// 	// echo sprintf("<h1>Error: Username %s already exists!</h1>", $registerUsername);
// 	// echo sprintf("<a href=\"portal.php\">Back to login/register page</a>");
// 	header("Location: register_fail.php");
//         exit;
// }
// $stmt->close();

// // Use a prepared statement
// // $stmt = $mysqli->prepare("SELECT COUNT(*), id, hashed_password FROM users WHERE username=?");
// $stmt = $mysqli->prepare("insert into users (username, hashed_password) values (?, ?)");
// // echo sprintf("<h1>stmt: %s</h1>", $stmt);

// // Bind the parameter
// $stmt->bind_param('ss', $registerUsername, $hashed_password);
// $stmt->execute();
// $stmt->close();
// echo sprintf("<h1>You have successfully registered as: %s</h1>", $registerUsername);
// session_destroy();
// echo sprintf("<br><a href=\"portal.php\">Back to login/register</a>");





?>