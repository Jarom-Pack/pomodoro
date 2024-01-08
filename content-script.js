/*
psuedo-code
var break or work = getmessage.breakorwork();
var blocked sites == [twitter.com, facebook.com, reddit.com]
if site == (blocked sites && break or work == work) {
    site_replace(local-file)
}
*/

const code = `
<html>
<body>
<center>
    <h1>
        Blocked this site lol <br/>
    </h1>
    <img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Simpleicons_Interface_lock-padlock-symbol-for-protect.svg" alt="image of lock">
</center>
</body>
</html>
`;

const matches = ["twitter.com", "facebook.com", "youtube.com","reddit.com"];
var currentTimer;

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message in content.js:", message);
    
    if (message !== undefined) {
        // Handle the received activeTimer data
        console.log("Active Timer in content.js: " + message);
        currentTimer = message;
    }
});



console.log("Listener is set up");

// Function to replace content if necessary
function replaceContent() {
    // Check if the current URL includes any of the strings in the matches array
    if (matches.some(match => window.location.href.includes(match)) && currentTimer == true) {
        document.documentElement.innerHTML = code;
    }
    setTimeout(replaceContent, 1000);
}

replaceContent();