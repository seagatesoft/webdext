var data;

function createTable(dataRecords) {
    var nOfRows = dataRecords.length;
    var fields = Object.keys(dataRecords[0]);
    var nOfColumns = fields.length;
    var table = document.createElement("table");
    table.id = "dataRecordsTable";
    table.className = "table table-striped table-bordered table-hover table-condensed";
    var thead = table.createTHead();
    var th = document.createElement("th");
    th.appendChild(document.createTextNode("Row"));
    thead.insertRow(0);
    thead.rows[0].appendChild(th);

    for (var i=1; i <= nOfColumns; i++) {
        var th = document.createElement("th");
        thead.rows[0].appendChild(document.createTextNode(fields[0]));
    }

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for (var i=0; i < nOfRows; i++) {
        tbody.insertRow(i);
        tbody.rows[i].insertCell(0);
        tbody.rows[i].cells[0].appendChild(document.createTextNode((i+1)+"."));
        tbody.rows[i].cells[0].className = "text-right";

        var columnNumber = 0;

        for (var j=0; j < nOfColumns; j++) {
            columnNumber++;
            tbody.rows[i].insertCell(columnNumber);
            var dataItem = dataRecords[i][fields[j]].content;
            console.log(dataRecords[i]);
            var dataItemNode = document.createTextNode(dataItem);
            tbody.rows[i].cells[columnNumber].appendChild(dataItemNode);
        }
    }

    return table;
}

function displayDataRecords() {
    var hyperlinkNode = document.createElement("a");
    hyperlinkNode.href = data.pageUrl;
    hyperlinkNode.appendChild(document.createTextNode(data.pageUrl));
    hyperlinkNode.className = "alert-link";
    document.getElementById("pageUrl").appendChild(hyperlinkNode);

    var extractionTime = Math.floor(data.extractionTime);
    document.getElementById("extractionTime").innerText = addThreeDigitSeparator(extractionTime);

    var memoryUsage = data.memoryUsage;
    document.getElementById("memoryUsage").innerText = addThreeDigitSeparator(memoryUsage);

    document.getElementById("rowsNumber").innerText = data.dataRecords.length;
    document.getElementById("columnsNumber").innerText = Object.keys(data.dataRecords[0]).length;
    document.getElementById("tableContainer").appendChild(createTable(data.dataRecords));
}

chrome.runtime.sendMessage({info: "wrapperExtractPageLoaded"}, function(response) {
    data = response.data;

    if (data.dataRecords.length > 0) {
        displayDataRecords();
    } else {
        var container = document.getElementById("container");
        container.parentNode.removeChild(container);
        document.body.appendChild(document.createTextNode("Can't extract any data."));
        alert("Can't extract any data.");
    }
});
