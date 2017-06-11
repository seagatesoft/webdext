if (typeof window.inductWrapperLoaded === "undefined") {
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.info === "inductWrapper") {
            console.log(message.data);
            var startTime = window.performance.now();
            try {
                var wrapper = Webdext.Induction.inductWrapper(
                    message.data.recSet,
                    message.data.columnNames
                );
            } catch(error) {
                console.log(error);
            }
            var inductionTime = window.performance.now() - startTime;
            chrome.runtime.sendMessage({
                info: "wrapperInducted",
                data: {
                    wrapper: wrapper,
                    wrapperName: message.data.wrapperName,
                    inductionTime: inductionTime,
                    memoryUsage: window.performance.memory.usedJSHeapSize
                }
            });
        }
    });

    window.inductWrapperLoaded = true;
}
