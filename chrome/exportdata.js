function convertToCSV(dataRecords) {
    var dataRecordsLength = dataRecords.length,
        csvArray = [];

    for (var i=0; i < dataRecordsLength; i++) {
        var keys = Object.keys(dataRecords[i]),
            keysLength = keys.length,
            values = [];

        for (var j=0; j < keysLength; j++)  {
            var value = '"' + dataRecords[i][keys[j]].value + '"';
            values.push(value);
        }

        csvArray.push(values.join(","));
    }

    return csvArray.join("\n");
}

chrome.runtime.sendMessage({info: "exportDataPageLoaded"}, function(response) {
    var exportedDataTextarea = document.getElementById("exportedDataTextarea");

    if (response.data.dataType === "json") {
        exportedDataTextarea.innerText = JSON.stringify(response.data.dataRecords);
    } else if (response.data.dataType === "csv") {
        exportedDataTextarea.innerText = convertToCSV(response.data.dataRecords);
    }
});
