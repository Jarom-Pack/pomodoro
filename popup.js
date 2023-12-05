// this is real 
var timerValue;
var paused = false;

var timerLocation = document.getElementById("timerLocation");
var pauseButtonLocation = document.getElementById("pauseButton");
var pauseButtonLocationForUn = document.getElementById("put_un_here");



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