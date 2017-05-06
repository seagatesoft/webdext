var initialMemory = window.performance.memory.usedJSHeapSize;
var startTime = Date.now();
var recSetList = Webdext.extract();
var stopTime = Date.now();
var currentMemory = window.performance.memory.usedJSHeapSize;
var extractionTime = stopTime - startTime;
var memoryUsage = currentMemory - initialMemory;
chrome.runtime.sendMessage({
    info: "dataExtracted",
    data: {
        pageUrl: location.href,
        recSetList: recSetList,
        extractionTime: extractionTime,
        memoryUsage: memoryUsage
    }
});
