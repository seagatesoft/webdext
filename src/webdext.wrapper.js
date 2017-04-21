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
                    dataRecord[dataItemName] = dataItem[0];
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
