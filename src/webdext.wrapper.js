;(function(undefined) {
    "use strict";
  
    function Wrapper(dataRecordXPath, dataItemXPaths) {
        this.dataRecordXPath = dataRecordXPath;
        this.dataItemXPaths = dataItemXPaths;
    };

    Wrapper.prototype.extract = function() {
        var dataRecords = [];
        var dataRecordElements = Webdext.evaluateXpath(this.dataRecordXPath);
        var dataRecordsLength = dataRecordElements.length;

        for (var i=0; i < dataRecordsLength; i++) {
            var dataRecordElement = dataRecordElements[i],
                dataRecord = {};

            for (var dataItemName in this.dataItemXPaths) {
                var dataItemXPath = this.dataItemXPaths[dataItemName];
                var dataItem = Webdext.evaluateXpath(dataItemXPath, dataRecordElement);

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

    Webdext.Wrapper = Wrapper;
}).call(this);
