var startTime = Date.now();
var recSetList = Webdext.extract();
var stopTime = Date.now();
var extractionTime = stopTime - startTime;
chrome.runtime.sendMessage({
    info: "dataExtracted",
    data: {
        pageUrl: location.href,
        recSetList: recSetList,
        extractionTime: extractionTime
    }
});
