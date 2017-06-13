"use strict";
var system = require("system");

if (system.args.length !== 4) {
    console.log("Usage: wrapperextract.js wrapper_path URL output_path");
    phantom.exit(1);
}

var wrapperExtractScript = "webdext-wrapperextract.js";
var fs = require("fs"),
    page = require("webpage").create();

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

function wrapperExtract(wrapperData) {
    var wrapper = new Webdext.Wrapper(
        wrapperData.dataRecordXPath,
        wrapperData.dataItemXPaths
    );
    var dataRecords = wrapper.extract();
    return JSON.stringify(dataRecords);
}

console.log("Loading wrapper "+system.args[1]);
var wrapperFile = fs.open(system.args[1], 'r');
var wrapperJSON = wrapperFile.read();
wrapperFile.close();
var wrapperData = JSON.parse(wrapperJSON);
console.log("Wrapper loaded");

page.open(system.args[2], function(status){
    if (status !== "success") {
        console.error("Unable to access network");
        phantom.exit(1);
    } else {
        console.log("Page opened");

        var injected = page.injectJs(wrapperExtractScript);
        if (!injected) {
            console.error("Error when injecting "+wrapperExtractScript);
            phantom.exit(1);
        }

        console.log("Extracting data records...");
        var startTime = +new Date();
        var recSetJSON = page.evaluate(wrapperExtract, wrapperData);
        var extractionTime = +new Date() - startTime;
        console.log("Extraction finished ("+extractionTime+" milliseconds)");

        console.log("Writing extraction result to "+system.args[3]);
        fs.write(system.args[3], recSetJSON);
        phantom.exit(0);
    }
});
