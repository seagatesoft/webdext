var startTime = window.performance.now();
var recSetList = Webdext.extract();
var extractionTime = window.performance.now() - startTime;
chrome.runtime.sendMessage({
    info: "dataExtractedByIntell",
    data: {
        pageUrl: location.href,
        recSetList: recSetList,
        extractionTime: extractionTime,
        memoryUsage: window.performance.memory.usedJSHeapSize
    }
});
