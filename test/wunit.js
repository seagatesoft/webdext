;(function(undefined) {
    "use strict";

    function Assert() {
        this.results = [];
    }
    Assert.prototype.ok = function(result, message) {
        this.results.push(
            {
                result: !!result,
                actual: result,
                expected: true,
                message: message
            }
        );
    };
    Assert.prototype.strictEqual = function(actual, expected, message) {
        this.results.push({
            result: expected === actual,
            actual: actual,
            expected: expected,
            message: message
        });
    };

    function test(testName, testFunc) {
        var assert = new Assert();
        testFunc(assert);
        var failedAssertions = assert.results.filter(function(r) {
            return !r.result;
        });
        if (failedAssertions.length === 0) {
            console.log(
                "All "+assert.results.length+" assertions on test "+testName+" passed."
            );
        } else {
            console.log(
                "There are "+failedAssertions.length+" failed assertions on test "+testName
            );
            failedAssertions.forEach(function(r) {
                console.log(r.message);
            });
        }
    }

    this.WUnit = {test: test};
}).call(this);
