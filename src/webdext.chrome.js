var recSetList = Webdext.extract();
chrome.runtime.sendMessage({
    info: "dataExtracted",
    recSetList: recSetList
});
