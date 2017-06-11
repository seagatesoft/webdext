var intellExtractData, wrapperExtractData, originalTab;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if (message.info === "dataExtractedByIntell") {
        originalTab = sender.tab;
        intellExtractData = message.data;
        chrome.tabs.create({url: chrome.extension.getURL("intellextract.html")});
    } else if (message.info === "dataExtractedByWrapper") {
        wrapperExtractData = message.data;
        chrome.tabs.create({url: chrome.extension.getURL("wrapperextract.html")});
    } else if (message.info === "intellExtractPageLoaded") {
        sendResponse({data: intellExtractData, originalTab: originalTab});
    } else if (message.info === "wrapperExtractPageLoaded") {
        sendResponse({data: wrapperExtractData});
    }
});
