"use strict";
var system = require('system');

if (system.args.length !== 2) {
    console.log('Usage: run-wunit.js URL');
    phantom.exit(1);
}

var page = require('webpage').create();

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.open(system.args[1], function(status){
    if (status !== "success") {
        console.log("Unable to access network");
        phantom.exit(1);
    } else {
        console.log("Page opened");
        phantom.exit(0);
    }
});
