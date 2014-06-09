// http://code.google.com/chrome/extensions/content_scripts.html#host-page-communication
// http://code.google.com/chrome/extensions/messaging.html#connect
var port = chrome.extension.connect({name: "grove-notification"});

document.getElementById('groveNotificationEventDiv').addEventListener('groveNotificationEvent', function() {
    var eventData = document.getElementById('groveNotificationEventDiv').innerText;
    port.postMessage(JSON.parse(eventData));
});

/* Drag and drop */
window.ondragover = function(e) {
    e.preventDefault();
};

window.ondrop = function(e) {
    e.preventDefault();
    upload(e.dataTransfer.files[0]);
};

function upload(file) {
    var imageLink ="";
    if (!file || !file.type.match(/image.*/)) return;
    document.body.className = "uploading";
    var fd = new FormData();
    fd.append("image", file);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.imgur.com/3/upload.json");
    xhr.setRequestHeader("Authorization","Client-ID 52437b3a8db42b4");
    xhr.onload = function() {
        var link = JSON.parse(xhr.responseText).data.link;
        var imageLink = ""+link.replace("http://imgur.com/", "https://i.imgur.com/");

        var messageField;
        // channel
        if (document.getElementById("channel-view").style.display == "block") {
            messageField = document.getElementsByClassName('message-field')[0];
            messageField.value = messageField.value + ' ' + imageLink;
        }

        // private channel
        else {
            messageField = document.getElementsByClassName('message-field')[1];
            messageField.value = messageField.value + ' ' + imageLink;
        }

         /* Image Preview */
        //document.getElementById("result").style.display = "inline";
        //document.getElementById("link-to-image").style.background = "url(" + imageLink + ") center center no-repeat";

        document.body.className = "uploaded";
    };

    /* Send the formdata */
    xhr.send(fd);
};
