;(function(undefined) {
    "use strict";

    // imports
    var evaluateXPath = Webdext.evaluateXPath;
  
    function Wrapper(dataRecordXPath, dataItemXPaths) {
        this.dataRecordXPath = dataRecordXPath;
        this.dataItemXPaths = dataItemXPaths;
    };
    Wrapper.prototype.extract = function() {
        var dataRecords = [];
        var dataRecordElements = evaluateXPath(this.dataRecordXPath);
        var dataRecordsLength = dataRecordElements.length;

        for (var i=0; i < dataRecordsLength; i++) {
            var dataRecordElement = dataRecordElements[i],
                dataRecord = {};

            for (var dataItemName in this.dataItemXPaths) {
                var dataItemXPath = this.dataItemXPaths[dataItemName];
                var dataItem = evaluateXPath(dataItemXPath, dataRecordElement);

                if (dataItem.length > 0) {
                    var dataNode = dataItem[0],
                        dataValue,
                        dataType;

                    if (dataNode.nodeType === Node.TEXT_NODE) {
                        dataValue = dataNode.nodeValue.trim();
                        dataType = "text";
                    } else if (dataNode.nodeName.toLowerCase() === "href") {
                        dataValue = dataNode.ownerElement.href;
                        dataType = "hyperlink";
                    } else if (dataNode.nodeName.toLowerCase() === "src") {
                        dataValue = dataNode.ownerElement.src;
                        dataType = "image";
                    } else if (dataNode.tagName.toLowerCase() === "img") {
                        dataValue = dataNode.src;
                        dataType = "image";
                    } else {
                        dataValue = dataNode.textContent.trim();
                        dataType = "text";
                    }

                    dataRecord[dataItemName] = {type: dataType, value: dataValue};
                } else {
                    dataRecord[dataItemName] = {type: "text", value: ""};
                }
            }
            dataRecords.push(dataRecord);
        };

        return dataRecords;
    };

    // exports
    Webdext.Wrapper = Wrapper;
}).call(this);
