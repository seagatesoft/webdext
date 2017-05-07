var data, currentPage;

function createPageNumberList(numberOfPages, selectedPageNumber) {
    var select = document.createElement("select");
    select.id = "pageNumberList";
    select.className = "form-control";

    for (var i=1; i <= numberOfPages; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.appendChild(document.createTextNode(i));

        if (i === selectedPageNumber) {
            option.selected = true;
        }

        select.appendChild(option);
    }

    select.addEventListener("change", pageNumberChangedCallback);

    return select;
}

function updateSelectedPageNumber(selectedPageNumber) {
    var pageNumberListEl = document.getElementById("pageNumberList");
    var options = pageNumberListEl.getElementsByTagName("option"),
        numberOfOptions = options.length;

    for (var i=0; i < numberOfOptions; i++) {
        if (options[i].selected) {
            options[i].selected = false;
        }
    }

    options[selectedPageNumber-1].selected = true;
}

function createTable(recSet) {
    var nOfRows = recSet.length;
    var nOfColumns = recSet[0].dataItems.length;
    var table = document.createElement("table");
    table.id = "recSetTable";
    table.className = "table table-striped table-bordered table-hover table-condensed";
    var thead = table.createTHead();
    var th = document.createElement("th");
    th.appendChild(document.createTextNode("Row"));
    thead.insertRow(0);
    thead.rows[0].appendChild(th);

    for (var i=1; i <= nOfColumns; i++) {
        var input = document.createElement("input");
        input.type = "text";
        input.value = "Column " + i;

        var removeButton = document.createElement("button");
        removeButton.id = "removeButton_" + i;
        removeButton.value = i;
        removeButton.className = "btn btn-warning";
        removeButton.appendChild(document.createTextNode("Remove"));

        var th = document.createElement("th");
        th.appendChild(input);
        th.appendChild(document.createElement("p"));
        th.appendChild(removeButton);
        thead.rows[0].appendChild(th);
    }

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for (var i=0; i < nOfRows; i++) {
        tbody.insertRow(i);
        tbody.rows[i].insertCell(0);
        tbody.rows[i].cells[0].appendChild(document.createTextNode((i+1)+"."));
        tbody.rows[i].cells[0].className = "text-right";

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

    return table;;
}

function displayRecSet(recSet) {
    document.getElementById("rowsNumber").innerText = recSet.length;
    document.getElementById("columnsNumber").innerText = recSet[0].dataItems.length;

    var existingTable = document.getElementById("recSetTable");

    if (existingTable) {
        existingTable.parentNode.removeChild(existingTable);
    }

    document.getElementById("tableContainer").appendChild(createTable(recSet));
}

function displayRecSetList() {
    var recSetListLength = data.recSetList.length;

    document.getElementById("recSetListLength").innerText = recSetListLength;
    var hyperlinkNode = document.createElement("a");
    hyperlinkNode.href = data.pageUrl;
    hyperlinkNode.appendChild(document.createTextNode(data.pageUrl));
    hyperlinkNode.className = "alert-link";
    document.getElementById("pageUrl").appendChild(hyperlinkNode);

    var extractionTime = Math.floor(data.extractionTime);
    document.getElementById("extractionTime").innerText = addThreeDigitSeparator(extractionTime);

    var memoryUsage = data.memoryUsage;
    document.getElementById("memoryUsage").innerText = addThreeDigitSeparator(memoryUsage);

    currentPage = 1;
    document.getElementById("totalRecSet").innerText = recSetListLength;
    var pageNumberList = createPageNumberList(recSetListLength, currentPage);
    document.getElementById("recSetNumber").appendChild(pageNumberList);
    displayRecSet(data.recSetList[0]);

    var prevPageButton = document.getElementById("prevRecSetButton");
    prevPageButton.disabled = true;
    var nextPageButton = document.getElementById("nextRecSetButton");
    if (recSetListLength === 1) {
        nextPageButton.disabled = true;
    }
}

function displayRecSetNumber() {
    var recSet = data.recSetList[currentPage-1];
    displayRecSet(recSet);
    updateSelectedPageNumber(currentPage);
}

function pageNumberChangedCallback() {
    var selectedPage = document.getElementById("pageNumberList").value;
    currentPage = parseInt(selectedPage);
    displayRecSetNumber();

    var prevPageButton = document.getElementById("prevRecSetButton");
    var nextPageButton = document.getElementById("nextRecSetButton");

    if (currentPage === 1) {
        prevPageButton.disabled = true;
    } else {
        prevPageButton.disabled = false;
    }

    if (currentPage === data.recSetList.length) {
        nextPageButton.disabled = true;
    } else {
        nextPageButton.disabled = false;
    }
}

chrome.runtime.sendMessage({info: "resultPageLoaded"}, function(response) {
    data = response.data;

    if (data.recSetList.length > 0) {
        displayRecSetList();
    } else {
        var container = document.getElementById("container");
        container.parentNode.removeChild(container);
        document.body.appendChild(document.createTextNode("Can't extract any data."));
        alert("Can't extract any data.");
    }
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("prevRecSetButton").addEventListener("click", function() {
        if (currentPage > 1) {
            currentPage--;
            displayRecSetNumber();

            if (currentPage === 1) {
                document.getElementById("prevRecSetButton").disabled = true;
            }

            var nextPageButton = document.getElementById("nextRecSetButton");
            if (nextPageButton.disabled) {
                nextPageButton.disabled = false;
            }
        }
    });

    document.getElementById("nextRecSetButton").addEventListener("click", function() {
        if (currentPage < data.recSetList.length) {
            currentPage++;
            displayRecSetNumber();

            if (currentPage === data.recSetList.length) {
                document.getElementById("nextRecSetButton").disabled = true;
            }

            var prevPageButton = document.getElementById("prevRecSetButton");
            if (prevPageButton.disabled) {
                prevPageButton.disabled = false;
            }
        }
    });
});
