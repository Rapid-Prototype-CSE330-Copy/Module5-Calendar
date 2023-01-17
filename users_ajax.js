// General user id, 0 as guest
let currentUserId = 0;
let currentUsername = "";

//login
function loginAjax(event) {
    const username = document.getElementById("usernameInput").value; // Get the username from the form
    const password = document.getElementById("passwordInput").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { username: username, password: password };
    let test = JSON.stringify(data);
    console.log(test);
    fetch("login_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        // .then(data => console.log(data.success ? `You've been logged in! ${data.message}` : `You were not logged in ${data.message}`))
        .then(data => { 
            alert(data.success ? `You've been logged in! ${data.message}` : `You were not logged in ${data.message}`);
            if(data.success){
                // disable login and register when id changes
                document.getElementById('loginsAndRegisters').setAttribute("hidden", "hidden");
                document.getElementById('logout_btn').style.display = "block";
                document.getElementById('eventList').innerHTML = "Click on dates to check your events!";
                document.cookie = "token=" + data.token;
                closeModal()

            }
            updateUser(parseInt(data.id), data.username);
        })
        .catch(err => console.error(err));
}

document.getElementById("login_btn").addEventListener("click", loginAjax, false);// Bind the AJAX call to button click



//register
function registerAjax(event) {
    const username = document.getElementById("registerUsernameInput").value; // Get the username from the form
    const password = document.getElementById("registerPasswordInput").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { username: username, password: password };
    var test = JSON.stringify(data);
    console.log(test);
    fetch("register_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        // .then(data => console.log(data.success ? "You've been registered!" : `You were not registered ${data.message}`))
        .then(data => {
            alert(data.success ? `You've been registered! ${data.message}` : `Failed registration: ${data.message}`)
            location.reload()
        })
        .catch(err => console.error(err));
}

document.getElementById("register_btn").addEventListener("click", registerAjax, false); // Bind the AJAX call to button click


//logout
function logout(){
    updateUser(0, '');
    updateEventId(0);
    document.getElementById('logout_btn').style.display = "none"
    document.getElementById('create_event_btn').style.display = "none"
    document.getElementById('eventList').innerHTML = "Login to check your events!";

}
document.getElementById("logout_btn").addEventListener("click", logout, false);

//enable login and register when logged out
function enableLoginAndRegister(){
    document.getElementById('loginsAndRegisters').removeAttribute("hidden");
} 
document.getElementById("logout_btn").addEventListener("click", enableLoginAndRegister, false);

function updateUser(id, usrname){
    currentUserId = id;
    currentUsername = usrname;
    if(currentUserId == 0){
        document.getElementById('welcomeText').innerHTML = "You are viewing the calendar as guest";
        document.getElementById('idText').innerHTML = id;
    }else{
        document.getElementById('welcomeText').innerHTML = "Welcome, " + usrname;
        document.getElementById('idText').innerHTML = id;
    }
    
}

