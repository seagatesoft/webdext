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
                    var dataContent = dataItem[0].nodeValue,
                        dataType;

                    if (dataItem[0].nodeType === Node.TEXT_NODE) {
                        dataType = "text";
                    } else if (dataItem[0].nodeName.toLowerCase() === "href") {
                        dataType = "hyperlink";
                    } else if (dataItem[0].nodeName.toLowerCase() === "src") {
                        dataType = "image";
                    }

                    dataRecord[dataItemName] = {type: dataType, content: dataContent};
                } else {
                    dataRecord[dataItemName] = "";
                }
            }
            dataRecords.push(dataRecord);
        };

        return dataRecords;
    };

    // exports
    Webdext.Wrapper = Wrapper;
}).call(this);
