QUnit.module("XPath");
QUnit.test("XPathStep", function(assert) {
    var step = new Webdext.XPath.XPathStep({"abbreviation": "."});
    assert.strictEqual(step.toString(), ".");

    step = new Webdext.XPath.XPathStep({"nodetest": "a"});
    assert.strictEqual(step.toString(), "a");

    step = new Webdext.XPath.XPathStep({"nodetest": "text()"});
    assert.strictEqual(step.toString(), "text()");

    step = new Webdext.XPath.XPathStep({"nodetest": "@href"});
    assert.strictEqual(step.toString(), "@href");

    step = new Webdext.XPath.XPathStep({"nodetest": "a", "axis": "self"});
    assert.strictEqual(step.toString(), "self::a");

    step = new Webdext.XPath.XPathStep({
        "nodetest": "a",
        "axis": "self",
        "predicates": ["1", "contains(@href, 'amazon.com')"],
    });
    assert.strictEqual(step.toString(), "self::a[1][contains(@href, 'amazon.com')]");
});
QUnit.test("LocationXPath", function(assert) {
    var steps = [];
    steps.push(new Webdext.XPath.XPathStep({"nodetest": "html"}));
    steps.push(new Webdext.XPath.XPathStep({"nodetest": "head"}));
    steps.push(new Webdext.XPath.XPathStep({"nodetest": "title"}));
    steps.push(new Webdext.XPath.XPathStep({"nodetest": "text()", "predicates": [1]}));

    var locXPath = new Webdext.XPath.LocationXPath(steps);
    assert.strictEqual(locXPath.toString(), "/html/head/title/text()[1]");

    locXPath = new Webdext.XPath.LocationXPath(steps, true);
    assert.strictEqual(locXPath.toString(), "/html/head/title/text()[1]");

    locXPath = new Webdext.XPath.LocationXPath(steps, false);
    assert.strictEqual(locXPath.toString(), "./html/head/title/text()[1]");
});
QUnit.test("IndexedXPathStep", function(assert) {
    var step = new Webdext.XPath.IndexedXPathStep("div", 1);
    assert.strictEqual(step.toString(), "div[1]");
    assert.strictEqual(step.position, 1);

    step = new Webdext.XPath.IndexedXPathStep("text()", 2);
    assert.strictEqual(step.toString(), "text()[2]");
    assert.strictEqual(step.position, 2);
});
QUnit.test("IndexedXPath", function(assert) {
    var steps = [];
    steps.push(new Webdext.XPath.IndexedXPathStep("html", 1));
    steps.push(new Webdext.XPath.IndexedXPathStep("head", 1));
    steps.push(new Webdext.XPath.IndexedXPathStep("title", 1));
    steps.push(new Webdext.XPath.IndexedXPathStep("text()", 1));

    var locXPath = new Webdext.XPath.LocationXPath(steps);
    assert.strictEqual(locXPath.toString(), "/html[1]/head[1]/title[1]/text()[1]");

    locXPath = new Webdext.XPath.LocationXPath(steps, true);
    assert.strictEqual(locXPath.toString(), "/html[1]/head[1]/title[1]/text()[1]");

    locXPath = new Webdext.XPath.LocationXPath(steps, false);
    assert.strictEqual(locXPath.toString(), "./html[1]/head[1]/title[1]/text()[1]");
});
QUnit.test("getIndexedXPathStepText", function(assert) {
    var node = document.getElementById("textNodeElement").childNodes[0];
    var ixs = Webdext.XPath.getIndexedXPathStep(node);
    assert.strictEqual(ixs.toString(), "text()[1]"); 
});
QUnit.test("getIndexedXPathStepHyperlink", function(assert) {
    var node = document.getElementById("hyperlinkElement");
    var ixs = Webdext.XPath.getIndexedXPathStep(node);
    assert.strictEqual(ixs.toString(), "a[1]"); 
});
QUnit.test("getIndexedXPathStepImage", function(assert) {
    var node = document.getElementById("imageElement");
    var ixs = Webdext.XPath.getIndexedXPathStep(node);
    assert.strictEqual(ixs.toString(), "img[1]"); 
});
QUnit.test("getIndexedXPathText", function(assert) {
    var node = document.getElementById("textNodeElement").childNodes[0];
    var ix = Webdext.XPath.getIndexedXPath(node);
    assert.strictEqual(ix.toString(), "/html[1]/body[1]/div[2]/div[1]/span[1]/text()[1]"); 
});
QUnit.test("getIndexedXPathHyperlink", function(assert) {
    var node = document.getElementById("hyperlinkElement");
    var ix = Webdext.XPath.getIndexedXPath(node);
    assert.strictEqual(ix.toString(), "/html[1]/body[1]/div[2]/div[1]/a[1]"); 
});
QUnit.test("getIndexedXPathImage", function(assert) {
    var node = document.getElementById("imageElement");
    var ix = Webdext.XPath.getIndexedXPath(node);
    assert.strictEqual(ix.toString(), "/html[1]/body[1]/div[2]/div[1]/img[1]"); 
});
QUnit.test("parseIndexedXPathAbsolute", function(assert) {
    var steps = [
        new Webdext.XPath.IndexedXPathStep("html", 1),
        new Webdext.XPath.IndexedXPathStep("body", 1),
        new Webdext.XPath.IndexedXPathStep("div", 2),
        new Webdext.XPath.IndexedXPathStep("ul", 1),
        new Webdext.XPath.IndexedXPathStep("li", 1)
    ];
    assert.deepEqual(
        Webdext.XPath.parseIndexedXPath("/html[1]/body[1]/div[2]/ul[1]/li[1]"),
        new Webdext.XPath.IndexedXPath(steps)
    ); 
});
QUnit.test("parseIndexedXPathRelative", function(assert) {
    var steps = [
        new Webdext.XPath.IndexedXPathStep("a", 1),
        new Webdext.XPath.IndexedXPathStep("h2", 1),
        new Webdext.XPath.IndexedXPathStep("text()", 1)
    ];
    assert.deepEqual(
        Webdext.XPath.parseIndexedXPath("./a[1]/h2[1]/text()[1]"),
        new Webdext.XPath.IndexedXPath(steps, false)
    ); 
});
QUnit.test("parseIndexedXPathHyperlink", function(assert) {
    var steps = [
        new Webdext.XPath.IndexedXPathStep("a", 1),
        new Webdext.XPath.IndexedXPathStep("@href", 1),
    ];
    assert.deepEqual(
        Webdext.XPath.parseIndexedXPath("./a[1]/@href[1]"),
        new Webdext.XPath.IndexedXPath(steps, false)
    ); 
});
QUnit.test("parseIndexedXPathImage", function(assert) {
    var steps = [
        new Webdext.XPath.IndexedXPathStep("html", 1),
        new Webdext.XPath.IndexedXPathStep("body", 1),
        new Webdext.XPath.IndexedXPathStep("img", 1)
    ];
    assert.deepEqual(
        Webdext.XPath.parseIndexedXPath("/html[1]/body[1]/img[1]"),
        new Webdext.XPath.IndexedXPath(steps)
    ); 
});
