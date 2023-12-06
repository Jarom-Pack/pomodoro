/*
psuedo-code
var break or work = getmessage.breakorwork();
var blocked sites == [twitter.com, facebook.com, reddit.com]
if site == (blocked sites && break or work == work) {
    site_replace(local-file)
}
*/

/*
test code one
var pausedValue = work;
var blocked = ["https://twitter.com/", "facebook.com", "reddit.com"]; 

 if(window.location.pathname == blocked[0]) {
        location.replace('http://example.com')
 }
*/
const code = `
<html>
<body>
  Blocked this site lol
</body>
</html>
`;

const matches = ["twitter.com", "facebook.com", "youtube.com","google.com","reddit.com"];


function replaceContent() {

  // Check if the current URL includes any of the strings in the matches array
  if (matches.some(match => window.location.href.includes(match))) {
    document.documentElement.innerHTML = code;
  }
  setTimeout(replaceContent, 1000);
}

replaceContent();
 