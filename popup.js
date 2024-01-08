// this is real 
var timerValue;
var paused = false;
// get lots of locations

var timerLocation = document.getElementById("timerLocation");
var pauseButtonLocation = document.getElementById("pauseButton");
var pauseButtonLocationForUn = document.getElementById("put_un_here");


var breakTimeChangeLocation = document.getElementById("break_time_change");
var workTimeChangeLocation = document.getElementById("work_time_change");

var getUpdateButtonLocation = document.getElementById("update_button");


chrome.runtime.onMessage.addListener((message,sender,sendResponse) => {
    if(message.timer){
        timerValue = message.timer;

        //calculate minutes and seconds
        var minutes = Math.floor(timerValue/60);
        var seconds = timerValue - minutes*60;
        //add 0 before seconds if it's less then 10
        if(seconds<10)seconds = seconds.toString().padStart(2,'0');
        //put them together
        var timerString = (minutes + ":" + seconds);

        timerLocation.textContent = timerString;


    }

    if(message.currentPausedValue){
        paused = message.currentPausedValue;
        if(paused) pauseButtonLocationForUn.textContent = "un"; else pauseButtonLocationForUn.textContent = " "; // when popup is opened, automatically change button to unpause/pause
    }

});


function sendPauseMessage() {
    paused = !paused;
    chrome.runtime.sendMessage({ sendPausedValue: paused });
    console.log("Pause Button Clicked, Sending Message. Paused: " + paused);
    if (paused) pauseButtonLocationForUn.textContent = "un";
    else pauseButtonLocationForUn.textContent = "";
}


pauseButtonLocation.addEventListener("click", sendPauseMessage);






// update button stuff

//if (getUpdateButtonLocation) {
getUpdateButtonLocation.addEventListener("click", function () {
        // send message to background about the change: the values of the break/work update locations

    chrome.runtime.sendMessage({
        updateDataBreak: breakTimeChangeLocation.value,
        updateDataWork: workTimeChangeLocation.value
    });

    console.log("Sent the junk");
});
//}
