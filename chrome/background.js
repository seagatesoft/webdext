var data = null;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if (message.info === "dataExtracted") {
        data = message.data;
        chrome.tabs.create({url:chrome.extension.getURL("intellextract.html")});
    } else if (message.info === "resultPageLoaded") {
        sendResponse({data: data});
    }
});
