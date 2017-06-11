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
                    var dataValue = dataItem[0].nodeValue,
                        dataType;

                    if (dataItem[0].nodeType === Node.TEXT_NODE) {
                        dataType = "text";
                    } else if (dataItem[0].nodeName.toLowerCase() === "href") {
                        dataType = "hyperlink";
                    } else if (dataItem[0].nodeName.toLowerCase() === "src") {
                        dataType = "image";
                    } else if (dataItem[0].tagName.toLowerCase() === "img") {
                        dataValue = dataItem[0].src;
                        dataType = "image";
                    } else {
                        dataValue = dataItem[0].textContent;
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
