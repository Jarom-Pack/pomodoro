// IMPORTANT WARNING: I HAVE NOT TESTED THIS. MAY NOT WORK PROPERLY LOL (it works fine except our errors as we add on to it)
var pausedValue = false; // false: unpaused, true: paused
var breaks = false; // false: work, true: break. Previously breakOrWork
const workData = {time: 15, note: "workUpNote", type: "Work"};
const breakData = {time: 5, note: "breakUpdate", type: "Break"};
var timer = workData.time; // breakData holds workData's timer because when you're on breakData it's counting down for workData.

//listen for message
// In background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.sendPausedValue !== undefined) { // Check for undefined
        pausedValue = message.sendPausedValue;
        console.log("Message received in background.js: Paused Value = " + pausedValue);
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
                data_take.note,
                {
                    type: "basic",
                    iconUrl: "32.png",
                    title: data_take.type + ' Time Up',
                    message: data_take.type + ' time is up!'
                }
            );
            chrome.notifications.clear(data_take.note);
        }
    }

}

//send timer to the popup.js
function sendMessages (){
	chrome.runtime.sendMessage({ timer: timer });
	chrome.runtime.sendMessage({ currentPausedValue : pausedValue})
}

//updating everything
function update(){
	timer_function();
	sendMessages();
}

setInterval(update, 1000);