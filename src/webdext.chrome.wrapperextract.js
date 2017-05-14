chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var startTime = window.performance.now();
    var wrapperData = message.wrapperData;
    var wrapper = new Webdext.Wrapper(wrapperData.dataRecordXPath, wrapperData.dataItemXPaths);
    var dataRecords = wrapper.extract();
    var extractionTime = window.performance.now() - startTime;
    chrome.runtime.sendMessage({
        info: "dataExtractedByWrapper",
        data: {
            pageUrl: location.href,
            dataRecords: dataRecords,
            extractionTime: extractionTime,
            memoryUsage: window.performance.memory.usedJSHeapSize
        }
    });
});
