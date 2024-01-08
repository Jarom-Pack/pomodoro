var pausedValue = false; // false: unpaused, true: paused
var breaks = false; // false: work, true: break. Previously breakOrWork

//changed these 'const's to 'let's because we need to update them.
let workData = {time: 5*60, note: "workUpNote", type: "Work"}; //5*60 is the seconds to 5 minutes
let breakData = {time: 15*60, note: "breakUpdate", type: "Break"}; 

var timer = breakData.time; // breakData holds workData's timer because when you're on breakData it's counting down for workData.

var toSubtract = 0; // toAdd holds the amount of seconds to remove when handling updation

//listen for message
// In background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.sendPausedValue !== undefined) { // Check for undefined
        pausedValue = message.sendPausedValue;
        console.log("Message received in background.js: Paused Value = " + pausedValue);
    }

    // get update data, change workData and breakData accordingly. Change timer accordingly.

    if (message.updateDataBreak != undefined) { //check for break time's change


        if (breaks == true && workData.time != message.updateDataBreak){ // if the current timer is the one we want and the one we want to change is the same :
            toSubtract = (workData.time-timer) //get difference in timer,
            
            workData.time = message.updateDataBreak*60; //update max timer,
            
            if ((timer - toSubtract) > 0) { //check if we can subtract from the timer, and if so
                timer = workData.time - toSubtract; //set timer and subtract from the timer
            }else{
                time = workData.time; //otherwise, just set the timer
            }
        }else{
            workData.time = message.updateDataBreak*60;
        }
    }

    //same as the one above, but for the work data
    if (message.updateDataWork != undefined){
        

        if(breaks == false && breakData.time != message.updateDataWork*60){
            toSubtract = (breakData.time-timer)

            breakData.time = message.updateDataWork*60; 


            if ((timer - toSubtract) > 0) {
                timer = breakData.time - toSubtract;
            }else{
                timer = breakData.time;
            }
        }else{
            breakData.time = message.updateDataWork*60;
        }
    }
    
});



function timer_function() {
    if (!pausedValue) {
        if (timer > 0) {
            timer--;
        } else {
            breaks = !breaks;
            let data_take = breaks ? breakData : workData;/*   ^ Ternary expression. Before the question mark is like an "if" statement condition
           If it's true, do what's before the colon. Otherwise, what's after I think        */
            timer = data_take.time;

            chrome.notifications.create(
                data_take.note, // this is a comment
                {
                    type: "basic",
                    iconUrl: "32.png",
                    title: data_take.type + ' Time Up',
                    message: data_take.type + ' time is up!'
                }
            );
            chrome.notifications.clear(data_take.note);
            chrome.runtime.sendMessage({onBreak: breaks})
        }
    }

}

//send timer to the popup.js
// Modify the sendMessages function in background.js  
function sendMessages() {
    // const activeTimerData = { a
    //     activeTimer: breaks ? "Break" : "Work",
    //     timer: timer 
    // }; 

    // send current list of tabs to the sendInfoToTabs function "sometime soon"
    chrome.tabs.query({}, sendInfoToTabs);    

    chrome.runtime.sendMessage({ 
        timer: timer, 
        currentPausedValue: pausedValue,
        onBreak: breaks
    }); 

    //console.log("SENT MESSAGES I THINK")
}

function sendInfoToTabs(tabs) {
        var messageToSendToTab = breaks; // or a struct like {foo: bar}; or something like activeTimerData!
        for (var i=0; i<tabs.length; i++) {
           chrome.tabs.sendMessage(tabs[i].id, messageToSendToTab);
           //console.log("Sent " + messageToSendToTab + " to a tab!");
        }
}


//updating everything
function update(){
	timer_function();
	sendMessages();
    //console.log("sent the thing");
}

setInterval(update, 1000);