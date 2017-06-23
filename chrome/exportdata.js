function convertToCSV(dataRecords) {
    var keys = Object.keys(dataRecords[0]),
        keysLength = keys.length,
        dataRecordsLength = dataRecords.length,
        csvArray = [];

    var labels = keys.map(function(k) {
        return '"' + k.trim() + '"';
    });
    csvArray.push(labels.join(","));

    for (var i=0; i < dataRecordsLength; i++) {
        var values = [];

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
