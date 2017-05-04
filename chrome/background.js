var recSetList = [];

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if (message.info === "dataExtracted") {
        recSetList = message.recSetList;
        chrome.tabs.create({url:chrome.extension.getURL("intellextract.html")});
    } else if (message.info === "resultPageLoaded") {
        sendResponse({recSetList: recSetList });
    }
});
