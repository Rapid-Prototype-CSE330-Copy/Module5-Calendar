// currentDate is the key global variable representing the user-selected date, initialized as the current date
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = new Month(currentDate.getFullYear(), currentDate.getMonth());
let currentDay = currentDate.getDate();
let currentWeek = new Week(currentDate);
const today = new Date();
updateAll();

// colors for calendar cells
const todayTdColor = "background-color:#D6EEEE";
const selectedTdColor = "background-color:#f0e68c";
drawCalendarTable(); //defined below


// update into currentDate's year, month, day
function updateAll(){
    currentYear = currentDate.getFullYear();
    currentMonth = new Month(currentDate.getFullYear(), currentDate.getMonth());
    currentDay = currentDate.getDate();
    document.getElementById('yearText').innerHTML = currentYear;
    document.getElementById('monthText').innerHTML = getMonthToText(currentMonth.month);
    // document.getElementById('dayText').innerHTML = currentDay;
}


// Current date button
document.getElementById('switchToCurrentDate_btn').addEventListener("click", switchToToday, false);

function switchToToday(){
    currentDate = new Date();
    // document.getElementById('dateText').innerHTML = currentDate;
    updateAll();
}

document.getElementById('printCurrentDate_btn').addEventListener("click", function(){
    document.getElementById('currentDateText').innerHTML = currentDate;
}, false);

function getMonthToText(monthNum){
    let month = "";
    switch(monthNum){
        case 0:
            month = "Jan";
            break;
        case 1:
            month = "Feb";
            break;
        case 2:
            month = "Mar";
            break;
        case 3:
            month = "Apr";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "Jun";
            break;
        case 6:
            month = "Jul";
            break;
        case 7:
            month = "Aug";
            break;
        case 8:
            month = "Sep";
            break;
        case 9:
            month = "Oct";
            break;
        case 10:
            month = "Nov";
            break;
        case 11:
            month = "Dec";
            break;
    }
    return month
}


// calendar buttons
function switchToPreviousMonth(){
    currentMonth = currentMonth.prevMonth();
    document.getElementById('yearText').innerHTML = currentMonth.year;
    document.getElementById('monthText').innerHTML = getMonthToText(currentMonth.month);
    drawCalendarTable();
}

document.getElementById('getPreviousMonth_btn').addEventListener("click", switchToPreviousMonth, false);


function switchToNextMonth(){
    currentMonth = currentMonth.nextMonth();
    document.getElementById('yearText').innerHTML = currentMonth.year;
    document.getElementById('monthText').innerHTML = getMonthToText(currentMonth.month);
    drawCalendarTable();
}

document.getElementById('getNextMonth_btn').addEventListener("click", switchToNextMonth, false);

function switchToPreviousYear(){
    currentMonth = currentMonth.prevMonth();
    currentMonth = currentMonth.prevMonth();
    currentMonth = currentMonth.prevMonth();
    currentMonth = currentMonth.prevMonth();
    currentMonth = currentMonth.prevMonth();
    currentMonth = currentMonth.prevMonth();
    currentMonth = currentMonth.prevMonth();
    currentMonth = currentMonth.prevMonth();
    currentMonth = currentMonth.prevMonth();
    currentMonth = currentMonth.prevMonth();
    currentMonth = currentMonth.prevMonth();
    currentMonth = currentMonth.prevMonth();
    document.getElementById('yearText').innerHTML = currentMonth.year;
    document.getElementById('monthText').innerHTML = getMonthToText(currentMonth.month);
    drawCalendarTable();
}

document.getElementById('getPreviousYear_btn').addEventListener("click", switchToPreviousYear, false);

function switchToNextYear(){
    currentMonth = currentMonth.nextMonth();
    currentMonth = currentMonth.nextMonth();
    currentMonth = currentMonth.nextMonth();
    currentMonth = currentMonth.nextMonth();
    currentMonth = currentMonth.nextMonth();
    currentMonth = currentMonth.nextMonth();
    currentMonth = currentMonth.nextMonth();
    currentMonth = currentMonth.nextMonth();
    currentMonth = currentMonth.nextMonth();
    currentMonth = currentMonth.nextMonth();
    currentMonth = currentMonth.nextMonth();
    currentMonth = currentMonth.nextMonth();
    document.getElementById('yearText').innerHTML = currentMonth.year;
    document.getElementById('monthText').innerHTML = getMonthToText(currentMonth.month);
    drawCalendarTable();
}

document.getElementById('getNextYear_btn').addEventListener("click", switchToNextYear, false);

// for (let i=0; i<weeks[0].getDates().length; i++){
//     console.log(weeks[0].getDates()[i].getDate());
// }


// draw calendar table
function drawCalendarTable(){
    let weeks = currentMonth.getWeeks();
    let l = weeks.length;
    let dateRows = document.getElementsByClassName('dateRow');
    let tdId = 1;

    //clear up dateRows
    for (let i=0; i<dateRows.length; i++){
        while(dateRows[i].firstChild){
            dateRows[i].removeChild(dateRows[i].firstChild);
        }
    }
    
    for (let i=0; i<weeks[0].getDates().length; i++){
        //first row
        date = weeks[0].getDates()[i];
        if(date.getDate() <= 7){
            let newTd = document.createElement("td");
            newTd.setAttribute("id", tdId.toString());
            newTd.setAttribute("class", "dateCell");
            newTd.appendChild(document.createTextNode(date.getDate()));
            if( (today.getFullYear() == currentMonth.year) && (today.getMonth() == currentMonth.month) && (today.getDate() == newTd.innerHTML) ){
                newTd.setAttribute("style", todayTdColor);
            }

            // TODO date click event
            newTd.addEventListener("click", function(){
            // enable user to select a date from calendar table
                //change value of currentDate
                let thisDate = document.getElementById(newTd.id).innerHTML;
                currentDate = new Date(currentMonth.year, currentMonth.month, thisDate);

                //make the color of the entire table white
                let allTds = document.getElementsByClassName('dateCell');
                for (let k=0; k<allTds.length; k++){
                    allTds[k].removeAttribute("style");
                    //, and remain the color of the cell representing today
                    if( (today.getFullYear() == currentMonth.year) && (today.getMonth() == currentMonth.month) && (today.getDate() == allTds[k].innerHTML) ){
                            allTds[k].setAttribute("style", todayTdColor);
                    }

                }

                //and change the color of selected cell
                document.getElementById(newTd.id).setAttribute("style", selectedTdColor);

                //List events below
                changeEventHeaderText();
                getEventsAjax();

            }, false);
            dateRows[0].appendChild(newTd);
        }else{
            let newTd = document.createElement("td");
            newTd.setAttribute("id", tdId.toString());
            newTd.appendChild(document.createTextNode(" "));
            dateRows[0].appendChild(newTd);    
        }
        
        tdId += 1;
    }

    for (let i=1; i<(l-1); i++){
        for (let j=0; j<weeks[i].getDates().length; j++){
            //middle rows
            date = weeks[i].getDates()[j];
            let newTd = document.createElement("td");
            newTd.setAttribute("id", tdId.toString());
            newTd.setAttribute("class", "dateCell");
            newTd.appendChild(document.createTextNode(date.getDate()));
            if( (today.getFullYear() == currentMonth.year) && (today.getMonth() == currentMonth.month) && (today.getDate() == newTd.innerHTML) ){
                newTd.setAttribute("style", todayTdColor);
            }
            newTd.addEventListener("click", function(){
            // enable user to select a date from calendar table
                //change value of currentDate
                let thisDate = document.getElementById(newTd.id).innerHTML;
                currentDate = new Date(currentMonth.year, currentMonth.month, thisDate);

                //make the color of the entire table white
                let allTds = document.getElementsByClassName('dateCell');
                for (let k=0; k<allTds.length; k++){
                    allTds[k].removeAttribute("style");
                    //, and remain the color of the cell representing today
                    if( (today.getFullYear() == currentMonth.year) && (today.getMonth() == currentMonth.month) && (today.getDate() == allTds[k].innerHTML) ){
                        allTds[k].setAttribute("style", todayTdColor);
                    }
                }

                //and change the color of selected cell
                document.getElementById(newTd.id).setAttribute("style", selectedTdColor);

                //List events below
                changeEventHeaderText();
                getEventsAjax();
            }, false);
            dateRows[i].appendChild(newTd);
            tdId += 1;
        }
        
    }

    for (let i=0; i<weeks[0].getDates().length; i++){
        //last row
        date = weeks[l-1].getDates()[i];
        if(date.getDate() > 7){
            let newTd = document.createElement("td");
            newTd.setAttribute("id", tdId.toString());
            newTd.setAttribute("class", "dateCell");
            newTd.appendChild(document.createTextNode(date.getDate()));
            if( (today.getFullYear() == currentMonth.year) && (today.getMonth() == currentMonth.month) && (today.getDate() == newTd.innerHTML) ){
                newTd.setAttribute("style", todayTdColor);
            }
            newTd.addEventListener("click", function(){
            // enable user to select a date from calendar table
                //change value of currentDate
                let thisDate = document.getElementById(newTd.id).innerHTML;
                currentDate = new Date(currentMonth.year, currentMonth.month, thisDate);

                //make the color of the entire table white
                let allTds = document.getElementsByClassName('dateCell');
                for (let k=0; k<allTds.length; k++){
                    allTds[k].removeAttribute("style");
                    //, and remain the color of the cell representing today
                    if( (today.getFullYear() == currentMonth.year) && (today.getMonth() == currentMonth.month) && (today.getDate() == allTds[k].innerHTML) ){
                        allTds[k].setAttribute("style", todayTdColor);
                    }
                }

                //and change the color of selected cell
                document.getElementById(newTd.id).setAttribute("style", selectedTdColor);

                //List events below
                changeEventHeaderText();
                getEventsAjax();
            }, false);
            dateRows[l-1].appendChild(newTd);
        }else{
            let newTd = document.createElement("td");
            newTd.setAttribute("id", tdId.toString());
            newTd.appendChild(document.createTextNode(" "));
            dateRows[l-1].appendChild(newTd);
        }
        tdId += 1;
    }
}


function changeEventHeaderText(){
    document.getElementById('eventHeaderText').innerHTML = "Events on " + currentMonth.year.toString()
            + "-" + (currentMonth.month+1).toString() + "-" + currentDate.getDate();
}