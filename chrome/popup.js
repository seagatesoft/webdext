document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("intelligentExtractButton").addEventListener("click", function(event) {
        var button = document.getElementById("intelligentExtractButton");
        button.disabled = true;
        button.innerText = "Please wait";
        chrome.tabs.executeScript(null, {file: "webdext.js"}, function () {
            var button = document.getElementById("intelligentExtractButton");
            button.disabled = false;
            button.innerText = "Intelligent Extract";
        });
    });

    document.getElementById("listOfExtractorsButton").addEventListener("click", function(event) {
        chrome.tabs.create({url:chrome.extension.getURL("extractors.html")});
    });
});
