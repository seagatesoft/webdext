function showListOfExtractors() {
    chrome.storage.local.get(null, function (data) {
        if (data) {
            var table = document.getElementById("extractorsTable");

            if (table) {
                table.parentNode.removeChild(table);        
            }

            table = createTable(data);
            document.getElementById("tableArea").appendChild(table);
        } else {
            document.getElementById("tableArea").innerText("No existing extractor.");
        }
    });
}

function createTable(data) {
    var table = document.createElement("table");
    table.id = "extractorsTable";
    table.className = "table table-striped table-bordered table-hover table-condensed";
    var thead = table.createTHead();
    var headers = ["Row", "Extractor Name", ""];
    thead.insertRow(0);

    for (var i=0; i < headers.length; i++) {
        var th = document.createElement("th");
        th.appendChild(document.createTextNode(headers[i]));
        thead.rows[0].appendChild(th);
    }

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    var rowNumber = 0;

    for (var key in data) {
        tbody.insertRow(rowNumber);
        tbody.rows[rowNumber].insertCell(0);
        tbody.rows[rowNumber].id = "row_" + rowNumber;
        tbody.rows[rowNumber].cells[0].appendChild(document.createTextNode((rowNumber+1)+"."));
        tbody.rows[rowNumber].insertCell(1);
        tbody.rows[rowNumber].cells[1].appendChild(document.createTextNode(key));
        tbody.rows[rowNumber].insertCell(2);
        var deleteButton = document.createElement("button");
        deleteButton.id = "delete_" + rowNumber;
        deleteButton.className = "btn btn-danger";
        deleteButton.innerText = "Delete";
        deleteButton.value = key;
        deleteButton.addEventListener("click", deleteExtractor);
        tbody.rows[rowNumber].cells[2].appendChild(deleteButton);
        rowNumber++;
    }

    return table;
}

function deleteExtractor(event) {
    var key = event.target.value;
    chrome.storage.local.remove(key, function () {
        alert(key + " deleted.");
    });
    showListOfExtractors();
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("createExtractor").addEventListener("click", function(event) {
        var currentState = event.target.value;
        if (currentState === "hidden") {
            document.getElementById("createExtractorArea").className = "show";
            event.target.value = "show";
        } else {
            document.getElementById("createExtractorArea").className = "hidden";
            event.target.value = "hidden";
        }
    });

    document.getElementById("cancelCreateExtractor").addEventListener("click", function(event) {
        document.getElementById("createExtractorArea").className = "hidden";
        document.getElementById("createExtractor").value = "hidden";
    });

    document.getElementById("saveExtractor").addEventListener("click", function(event) {
        var newExtractor = {};
        var extractorName = document.getElementById("extractorName").value;
        var extractorText = document.getElementById("extractorTextarea").value;
        newExtractor[extractorName] = extractorText;
        chrome.storage.local.set(newExtractor, function() {
            alert("Extractor "+extractorName+" saved.");
            showListOfExtractors();
        });
    });

    showListOfExtractors();
});
