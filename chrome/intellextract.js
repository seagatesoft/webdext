var data = null;

function createTable(recSet) {
    var nOfRows = recSet.length;
    var nOfColumns = recSet[0].dataItems.length;
    var table = document.createElement("table");
    var thead = table.createTHead();
    var th = document.createElement("th");
    th.appendChild(document.createTextNode("Row"));
    thead.insertRow(0);
    thead.rows[0].appendChild(th);

    for (var i=1; i <= nOfColumns; i++) {
        var input = document.createElement("input");
        input.type = "text";
        input.value = "Column " + i;
        var th = document.createElement("th");
        th.appendChild(input);
        thead.rows[0].appendChild(th);
    }

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for (var i=0; i < nOfRows; i++) {
        tbody.insertRow(i);
        tbody.rows[i].insertCell(0);
        tbody.rows[i].cells[0].appendChild(document.createTextNode((i+1)+"."));

        for (var j=0; j < nOfColumns; j++) {
            tbody.rows[i].insertCell(j+1);
            var dataItem = recSet[i].dataItems[j];
            var dataItemNode;

            if (dataItem.type === "hyperlink") {
                dataItemNode = document.createElement("a");
                dataItemNode.href = dataItem.value;
                dataItemNode.appendChild(document.createTextNode(dataItem.value));
            } else if (dataItem.type === "image") {
                dataItemNode = document.createElement("img");
                dataItemNode.src = dataItem.value;
            } else {
                dataItemNode = document.createTextNode(dataItem.value);
            }

            tbody.rows[i].cells[j+1].appendChild(dataItemNode);
        }
    }

    document.getElementById("tableContainer").appendChild(table);
}

function updateRecSetNumber(number) {
    document.getElementById("recSetNumber").innerText = number;
}

function displayRecSet() {
    var recSetListLength = data.recSetList.length;

    var textNode = document.createTextNode(`Found ${recSetListLength} data region(s) on `);
    var hyperlinkNode = document.createElement("a");
    hyperlinkNode.href = data.pageUrl;
    hyperlinkNode.appendChild(document.createTextNode(data.pageUrl));
    var recSetListInfoElement = document.getElementById("recSetListInfo");
    recSetListInfoElement.appendChild(textNode);
    recSetListInfoElement.appendChild(hyperlinkNode);

    var extractionTime = data.extractionTime;
    document.getElementById("extractionTimeInfo").innerText = `Extraction time: ${extractionTime} milliseconds`;

    document.getElementById("totalRecSet").innerText = recSetListLength;
    updateRecSetNumber(1);
    createTable(data.recSetList[0]);
}

chrome.runtime.sendMessage({info: "resultPageLoaded"}, function(response) {
    data = response.data;

    if (data.recSetList.length > 0) {
        displayRecSet();
    } else {
        alert("Can't extract any data.");
    }
});
