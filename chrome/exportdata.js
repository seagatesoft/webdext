chrome.runtime.sendMessage({info: "exportDataPageLoaded"}, function(response) {
    var exportedDataTextarea = document.getElementById("exportedDataTextarea");

    if (response.data.dataType === "json") {
        exportedDataTextarea.innerText = JSON.stringify(response.data.dataRecords);
    } else if (response.data.dataType === "csv") {
    }
});
