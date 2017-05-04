var recSetList = [];

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
            tbody.rows[i].cells[j+1].appendChild(
                document.createTextNode(recSet[i].dataItems[j].value)
            );
        }
    }

    document.getElementById("tableContainer").appendChild(table);
}

function updateRecSetNumber(number) {
    document.getElementById("recSetNumber").innerText = number;
}

function displayRecSet() {
    var recSetListLength = recSetList.length;
    document.getElementById("totalRecSet").innerText = recSetListLength;
    updateRecSetNumber(1);
    createTable(recSetList[0]);
}

function showNoDataExtractedMessage() {
    alert("Can't extract any data.");
}

chrome.runtime.sendMessage({info: "resultPageLoaded"}, function(response) {
    recSetList = response.recSetList;

    if (recSetList.length > 0) {
        displayRecSet();
    } else {
        showNoDataExtractedMessage();
    }
});
