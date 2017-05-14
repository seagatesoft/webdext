document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("intelligentExtractButton").addEventListener("click", function() {
        var buttons = document.getElementsByClassName("menuButton");
        var numberOfButtons = buttons.length;

        for (var i=numberOfButtons; i--; ) {
            buttons[i].disabled = true;
            buttons[i].innerText = "Please wait";
        }

        chrome.tabs.executeScript(null, {file: "webdext.js"});
    });

    document.getElementById("useExistingExtractorButton").addEventListener("click", function() {
        chrome.storage.local.get(null, function (data) {
            if (data) {
                var buttonPanel = document.getElementById("buttonPanel");
                buttonPanel.parentNode.removeChild(buttonPanel);

                var extractorListElement = document.createElement("ul");

                for (var key in data) {
                    var extractorElement = document.createElement("li");
                    var labelElement = document.createElement("label");
                    labelElement.appendChild(document.createTextNode(key));
                    extractorElement.appendChild(labelElement);
                    var buttonElement = document.createElement("button");
                    buttonElement.value = key;
                    buttonElement.appendChild(document.createTextNode("Extract"));
                    extractorElement.appendChild(buttonElement);
                    extractorListElement.appendChild(extractorElement);
                }

                document.body.appendChild(extractorListElement);
            } else {
                alert("No existing extractor.");
            }
        });
    });

    document.getElementById("listOfExtractorsButton").addEventListener("click", function() {
        chrome.tabs.create({url:chrome.extension.getURL("extractors.html")});
    });
});
