"use strict";
var system = require("system");

if (system.args.length !== 3) {
    console.log("Usage: intellextract.js URL output_path");
    phantom.exit(1);
}

var intellExtractScript = "webdext-intellextract.js";
var fs = require("fs"),
    page = require("webpage").create();

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

function intellExtract() {
    var recSetList = Webdext.extract();
    return JSON.stringify(recSetList);
}

page.open(system.args[1], function(status){
    if (status !== "success") {
        console.error("Unable to access network");
        phantom.exit(1);
    } else {
        console.log("Page opened");

        var injected = page.injectJs(intellExtractScript);
        if (!injected) {
            console.error("Error when injecting "+intellExtractScript);
            phantom.exit(1);
        }

        console.log("Extracting data records...");
        var startTime = +new Date();
        var recSetListJSON = page.evaluate(intellExtract);
        var extractionTime = +new Date() - startTime;
        console.log("Extraction finished ("+extractionTime+" milliseconds)");

        console.log("Writing extraction result to "+system.args[2]);
        fs.write(system.args[2], recSetListJSON);
        phantom.exit(0);
    }
});
