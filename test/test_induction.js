QUnit.test("xpathEditDistance", function(assert) {
    var xpaths = [
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[1]",
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[2]"
    ];
    var parsedXPaths = xpaths.map(function(xpath) {
        return Webdext.XPath.parseIndexedXPath(xpath);
    });
    assert.strictEqual(
        Webdext.Induction.xpathEditDistance(parsedXPaths[0], parsedXPaths[1]),
        1
    );
});
QUnit.test("alignPairwiseIndexedXPaths", function(assert) {
    var xpaths = [
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[1]",
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[2]"
    ];
    var parsedXPaths = xpaths.map(function(xpath) {
        return Webdext.XPath.parseIndexedXPath(xpath);
    });
    var alignedXPath = Webdext.Induction.alignPairwiseIndexedXPaths(parsedXPaths[0], parsedXPaths[1]);
    assert.strictEqual(alignedXPath.length, parsedXPaths[0].steps.length);
    assert.strictEqual(alignedXPath[10][0].nodetest, "li");
    assert.strictEqual(alignedXPath[10][0].position, 1);
    assert.strictEqual(alignedXPath[10][1].nodetest, "li");
    assert.strictEqual(alignedXPath[10][1].position, 2);
});
QUnit.test("alignPairwiseAndMerge", function(assert) {
    var xpaths = [
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[1]",
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[2]"
    ];
    var parsedXPaths = xpaths.map(function(xpath) {
        return Webdext.XPath.parseIndexedXPath(xpath);
    });
    var alignedXPath = Webdext.Induction.alignPairwiseAndMerge(parsedXPaths[0], parsedXPaths[1]);
    assert.strictEqual(
        alignedXPath.toString(),
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li"
    );
});
QUnit.test("alignMultipleIndexedXPaths", function(assert) {
    var xpaths = [
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[1]",
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[2]",
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[3]",
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[4]",
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[5]",
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[6]",
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[7]",
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[8]",
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[9]",
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[10]",
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[11]",
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[12]",
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[13]",
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[14]",
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[15]",
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li[16]"
    ];
    var parsedXPaths = xpaths.map(function(xpath) {
        return Webdext.XPath.parseIndexedXPath(xpath);
    });
    var mergedXPath = Webdext.Induction.alignMultipleIndexedXPaths(parsedXPaths);
    assert.strictEqual(
        mergedXPath.toString(),
        "/html[1]/body[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]/ul[1]/li"
    );
});
