let currentEventId = 0;
const selectedEventRowColor = "background-color:#f0e68c";

function getEventsAjax() {
    // Make a URL-encoded string for passing POST data:
    let dataYear = currentDate.getFullYear();
    let dataMonth = parseInt(currentDate.getMonth()) + 1;
    let dataDate = currentDate.getDate();
    const data = {userId: currentUserId, year: dataYear, month: dataMonth, date: dataDate};
    let test = JSON.stringify(data);
    console.log(test);
    fetch("returnEvents_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'content-type': 'application/json'}
    })
        .then(response => response.json())
        .then(data => {
            // alert(data);
            console.log(data);
            updateEventId(0);
            const wrapper = document.getElementById('createEventWrapper')
            wrapper.innerHTML = ""
            wrapper.insertAdjacentHTML("beforeend", "<button class='btn btn-sm' id='create_event_btn'>Create Event</button>")
            // Create Event
            document.getElementById('create_event_btn').addEventListener('click', function () {
                showModal('create-event-modal')
            })


            if (parseInt(currentUserId) != 0) {
                if (data.hasEvents) {
                    //clear out the eventList
                    document.getElementById('eventList').innerHTML = "";
                    Object.entries(data).forEach(([key, value]) => {
                        // don't print hasEvents
                        if (key != "hasEvents") {
                            // currentEventId = value["eventId"]

                            //create a child node newLi
                            let newLi = document.createElement("li");

                            // newLi's id will be the event's id in the database, class will be eventRow!
                            let newLiId = "eventId_" + value["eventId"];
                            newLi.setAttribute("id", newLiId);
                            newLi.setAttribute("class", "eventRow");
                            let valueTime = value["dateAndTime"].split(" ")[1];
                            // print title and time (not dateTime)
                            newLi.innerHTML = "<b>" + value["title"] + "</b>" + " at " + "<i>" + valueTime + "</i> ";

                            // print if it is important
                            if (value["isImportant"] == "yes") {
                                newLi.innerHTML += '<b>Important</b> ';
                            }

                            // print if it is group event
                            if (value["other_member_user_id_string"] != "") {
                                newLi.innerHTML += '<b>(Group event held by you)</b>';
                            }

                            // print if it is tag
                            if (value["tag"] != "") {
                                newLi.innerHTML += `<b style="color: red">${value['tag']}</b>`;
                            }

                            let objJson = encodeURI(JSON.stringify(value))
                            newLi.innerHTML += `<button class="btn btn-sm" style="margin-right: 8px" onclick="editEvent('${objJson}')">Edit</button><button class="btn btn-sm" onclick="deleteEvent(${value['eventId']})">Delete</button>`


                            // click on newLi will change the value of currentEventId
                            newLi.addEventListener("click", function () {
                                currentEventId = value["eventId"];
                                // remove all the li's style
                                let allEventRows = document.getElementsByClassName('eventRow');
                                for (let m = 0; m < allEventRows.length; m++) {
                                    allEventRows[m].removeAttribute("style");
                                }
                                //and set the current eventRow's style
                                document.getElementById('eventId_' + currentEventId.toString()).setAttribute("style", selectedEventRowColor);
                                // and display group members
                                printGroupMembers();
                            
                            }, false);

                            document.getElementById('eventList').appendChild(newLi);
                            console.log(key, value["dateAndTime"]);
                        }
                    });
                } else {
                    currentEventId = 0
                    document.getElementById('eventList').innerHTML = "You don't have any events on this date.";
                }
            } else {
                document.getElementById('create_event_btn').style.display = "none"
                document.getElementById('eventList').innerHTML = "Login to check your events!";
            }
            // Object.entries(data).forEach(([key, value]) => {
            //     console.log(key, value["dateAndTime"]);
            // });

            // .forEach(([key, value]) => {
            //     console.log(`${key} ${value}`);
            // });
        })
        .catch(err => console.error(err));
}

document.getElementById('alertEvents_btn').addEventListener("click", getEventsAjax, false);


function changeEventImportance() {
    const data = {eventId: currentEventId};
    let test = JSON.stringify(data);
    console.log(test);
    fetch("changeEventImportance_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'content-type': 'application/json'}
    })
        .then(response => response.json())
        .then(data => {
            alert(data.success ? `${data.message}` : `${data.message}`);
            getEventsAjax();
            updateEventId(0);
        })
        .catch(err => console.error(err));
}

document.getElementById('changeImportance_btn').addEventListener("click", changeEventImportance, false);


function updateEventId(eventIdString) {
    currentEventId = parseInt(eventIdString);
    document.getElementById('currentEventIdText').innerHTML = currentEventId;
}

document.getElementById('printCurrentEventId_btn').addEventListener("click", function () {
    document.getElementById('currentEventIdText').innerHTML = currentEventId;
}, false);


function inviteToGroupEvent(userIdString) {
    const invitedUserName = document.getElementById('invitedUsernameInput').value;
    const data = {eventId: currentEventId, invitedUserName: invitedUserName};
    let test = JSON.stringify(data);
    console.log(test);
    fetch("inviteUserToEvent_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'content-type': 'application/json'}
    })
        .then(response => response.json())
        .then(data => {
            alert(data.success ? `Success! ${data.message}` : `Fail! ${data.message}`);
            getEventsAjax();
            printGroupMembers();
        })
        .catch(err => console.error(err));
}

document.getElementById('invite_btn').addEventListener("click", inviteToGroupEvent, false)


function printGroupMembers() {
    const data = {eventId: currentEventId};
    fetch("returnMemberUsername_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'content-type': 'application/json'}
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.usernames);
            document.getElementById('groupMemberUsernameText').innerHTML = data.usernames;

        })
        .catch(err => console.error(err));
}

document.getElementById('displayMembers_btn').addEventListener("click", printGroupMembers, false);


// Save Event
document.getElementById('save_event_btn').addEventListener('click', function () {
    const title = document.querySelector('#eventTitleInput').value
    const isImportant = document.querySelector('#importantCheckbox').checked

    let dataYear = currentDate.getFullYear();
    let dataMonth = parseInt(currentDate.getMonth()) + 1;
    let dataDate = currentDate.getDate();

    const e = document.getElementById("eventTag");
    const value = e.value;

    const time = document.getElementById('eventTimePicker').value

    const data = {
        holder_id: currentUserId,
        title: title,
        dateAndTime: `${dataYear}-${dataMonth}-${dataDate} ${time}:00`,
        isImportant: isImportant === true ? 'yes' : 'no',
        tag: value
    };

    fetch("createEvent_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'content-type': 'application/json'}
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message)
            closeModal()
            getEventsAjax();
        })
        .catch(err => console.error(err));
})

function deleteEvent(id) {
    let data = {
        eventId: id
    }
    fetch("deleteEvent_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'content-type': 'application/json'}
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message)
            getEventsAjax();
        })
        .catch(err => console.error(err));
}

function editEvent(obj) {
    let data = JSON.parse(decodeURI(obj))
    console.log(data)
    document.getElementById('editEventTitleInput').value = data.title
    document.getElementById('editImportantCheckbox').checked = data.isImportant === 'yes'
    document.getElementById('editEventId').value = data.eventId
    document.getElementById('editEventTag').value = data.tag

    // get hour and minute
    let time = data.dateAndTime.split(" ")[1]
    let hour = time.split(":")[0]
    let minute = time.split(":")[1]
    document.getElementById('editEventTimePicker').value = `${hour}:${minute}`
    showModal('edit-event-modal')
}

// Edit Event Save
document.getElementById('edit_event_btn').addEventListener('click', function () {
    let dataYear = currentDate.getFullYear();
    let dataMonth = parseInt(currentDate.getMonth()) + 1;
    let dataDate = currentDate.getDate();

    const time = document.getElementById('editEventTimePicker').value

    const data = {
        eventId: document.getElementById('editEventId').value,
        title: document.getElementById('editEventTitleInput').value,
        isImportant: document.getElementById('editImportantCheckbox').checked === true ? 'yes' : 'no',
        tag: document.getElementById('editEventTag').value,
        dateAndTime: `${dataYear}-${dataMonth}-${dataDate} ${time}:00`,
    };

    fetch("editEvent_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'content-type': 'application/json'}
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message)
            closeModal()
            getEventsAjax();
        })
        .catch(err => console.error(err));
})


// copy events to the same day and time for the next few weeks
function copyEvent(){
    let weekNum = parseInt(document.getElementById('weekNum').value);
    let newDate = currentDate;
    let x=1;
    let dataDates = [];
    while(x<=weekNum){
        //console.log(x);
        newDate.setDate(newDate.getDate() + 7);
        // console.log(newDate);
        let newYear = newDate.getFullYear();
        newYear = newYear.toString();
        let newMonth = newDate.getMonth() + 1;
        if (newMonth < 10){
            newMonth = '0' + newMonth.toString()
        }
        let newDateDate = newDate.getDate();
        if (newDateDate < 10){
            newDateDate = '0' + newDateDate.toString()
        }
        let newDateString = newYear + '-' + newMonth + '-' + newDateDate + ' ';
        
        dataDates.push(newDateString);
        x++
    }

    const data = {eventId: currentEventId, dates: dataDates};
    let test = JSON.stringify(data);
    console.log(test);

    fetch("copyEvent_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'content-type': 'application/json'}
    })
        .then(response => response.json())
        .then(data => {
            alert(data.success ? `Success! ${data.message}` : `Fail! ${data.message}`);
            console.log(data);
        })
        .catch(err => console.error(err));

}

document.getElementById('copyEvent_btn').addEventListener("click", copyEvent, false);


// function hideEventButtons(){
//     let children = document.getElementById('eventButtons').childNodes;
//     for (let y=0; y<children.length; y++){
//         children[y].setAttribute("hidden", "hidden");
//     }
    
// }

// function displayEventButtons(){
//     let children = document.getElementById('eventButtons').childNodes;
//     for (let y=0; y<children.length; y++){
//         children[y].removeAttribute("hidden");
//     }
    
// }