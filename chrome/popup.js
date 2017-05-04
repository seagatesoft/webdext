document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("intelligentExtractButton").addEventListener("click", function() {
        chrome.tabs.executeScript(null, {file: "webdext.js"});
    });
});
