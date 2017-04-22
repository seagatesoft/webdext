QUnit.module("Map");
QUnit.test("SimpleMap", function(assert) {
    var map = new Map();
    assert.strictEqual(map.size, 0);
    assert.notOk(map.has("telo"));

    map.set("telo", "bakar");
    assert.strictEqual(map.get("telo"), "bakar");
    assert.strictEqual(map.size, 1);
    assert.ok(map.has("telo"));

    map.delete("telo", "bakar");
    assert.strictEqual(map.get("telo"), undefined);
    assert.strictEqual(map.size, 0);
    assert.notOk(map.has("telo"));

    map.set("telo", "bakar");
    map.clear();
    assert.strictEqual(map.get("telo"), undefined);
    assert.strictEqual(map.size, 0);
    assert.notOk(map.has("telo"));

    map.set("telo", "bakar");
    map.set("gedhang", "goreng");
    map.set("tempe", "bacem");
    var keyIterator = map.keys(),
        key = keyIterator.next(),
        valueIterator = map.values(),
        value = valueIterator.next(),
        entryIterator = map.entries(),
        entry = entryIterator.next();

    while (!key.done) {
        assert.ok(["telo", "gedhang", "tempe"].indexOf(key.value) > -1);
        key = keyIterator.next();
    }

    while (!value.done) {
        assert.ok(["bakar", "goreng", "bacem"].indexOf(value.value) > -1);
        value = valueIterator.next();
    }

    while (!entry.done) {
        assert.ok(["telo", "gedhang", "tempe"].indexOf(entry.value[0]) > -1);
        assert.ok(["bakar", "goreng", "bacem"].indexOf(entry.value[1]) > -1);
        entry = entryIterator.next();
    }
});

QUnit.module("normVector");
var tfv1 = {
    "The": 1,
    "Principles": 1,
    "of": 1,
    "Object-Oriented": 1,
    "JavaScript": 1
};
var tfv2 = {
    "Web Design": 1,
    "with": 1,
    "HTML,": 1,
    "CSS,": 1,
    "JavaScript": 1,
    "and": 1,
    "jQuery": 1,
    "Set": 1
};
QUnit.test("normVector", function(assert) {
    assert.strictEqual(Webdext.Model.normVector(tfv1), Math.sqrt(5));
    assert.strictEqual(Webdext.Model.normVector(tfv2), Math.sqrt(8));
});

QUnit.module("parseUrl");
QUnit.test("parseUrl", function(assert) {
    assert.strictEqual(Webdext.Model.normVector(tfv1), Math.sqrt(5));
    assert.strictEqual(Webdext.Model.normVector(tfv2), Math.sqrt(8));
});

QUnit.module("XPath");
QUnit.test("XPathStep", function(assert) {
    var step = new Webdext.Model.XPathStep({"abbreviation": "."});
    assert.strictEqual(step.toString(), ".");

    step = new Webdext.Model.XPathStep({"nodetest": "a"});
    assert.strictEqual(step.toString(), "a");

    step = new Webdext.Model.XPathStep({"nodetest": "text()"});
    assert.strictEqual(step.toString(), "text()");

    step = new Webdext.Model.XPathStep({"nodetest": "@href"});
    assert.strictEqual(step.toString(), "@href");

    step = new Webdext.Model.XPathStep({"nodetest": "a", "axis": "self"});
    assert.strictEqual(step.toString(), "self::a");

    step = new Webdext.Model.XPathStep({
        "nodetest": "a",
        "axis": "self",
        "predicates": ["1", "contains(@href, 'amazon.com')"],
    });
    assert.strictEqual(step.toString(), "self::a[1][contains(@href, 'amazon.com')]");
});
QUnit.test("LocationXPath", function(assert) {
    var steps = [];
    steps.push(new Webdext.Model.XPathStep({"nodetest": "html"}));
    steps.push(new Webdext.Model.XPathStep({"nodetest": "head"}));
    steps.push(new Webdext.Model.XPathStep({"nodetest": "title"}));
    steps.push(new Webdext.Model.XPathStep({"nodetest": "text()", "predicates": [1]}));

    var locXPath = new Webdext.Model.LocationXPath(steps);
    assert.strictEqual(locXPath.toString(), "/html/head/title/text()[1]");

    locXPath = new Webdext.Model.LocationXPath(steps, true);
    assert.strictEqual(locXPath.toString(), "/html/head/title/text()[1]");

    locXPath = new Webdext.Model.LocationXPath(steps, false);
    assert.strictEqual(locXPath.toString(), "./html/head/title/text()[1]");
});
QUnit.test("IndexedXPathStep", function(assert) {
    var step = new Webdext.Model.IndexedXPathStep("div", 1);
    assert.strictEqual(step.toString(), "div[1]");
    assert.strictEqual(step.position, 1);

    step = new Webdext.Model.IndexedXPathStep("text()", 2);
    assert.strictEqual(step.toString(), "text()[2]");
    assert.strictEqual(step.position, 2);
});
QUnit.test("IndexedXPath", function(assert) {
    var steps = [];
    steps.push(new Webdext.Model.IndexedXPathStep("html", 1));
    steps.push(new Webdext.Model.IndexedXPathStep("head", 1));
    steps.push(new Webdext.Model.IndexedXPathStep("title", 1));
    steps.push(new Webdext.Model.IndexedXPathStep("text()", 1));

    var locXPath = new Webdext.Model.LocationXPath(steps);
    assert.strictEqual(locXPath.toString(), "/html[1]/head[1]/title[1]/text()[1]");

    locXPath = new Webdext.Model.LocationXPath(steps, true);
    assert.strictEqual(locXPath.toString(), "/html[1]/head[1]/title[1]/text()[1]");

    locXPath = new Webdext.Model.LocationXPath(steps, false);
    assert.strictEqual(locXPath.toString(), "./html[1]/head[1]/title[1]/text()[1]");
});
QUnit.test("getIndexedXPathStepText", function(assert) {
    var node = document.getElementById("textNodeElement").childNodes[0];
    var ixs = Webdext.Model.getIndexedXPathStep(node);
    assert.strictEqual(ixs.toString(), "text()[1]"); 
});
QUnit.test("getIndexedXPathStepHyperlink", function(assert) {
    var node = document.getElementById("hyperlinkElement");
    var ixs = Webdext.Model.getIndexedXPathStep(node);
    assert.strictEqual(ixs.toString(), "a[1]"); 
});
QUnit.test("getIndexedXPathStepImage", function(assert) {
    var node = document.getElementById("imageElement");
    var ixs = Webdext.Model.getIndexedXPathStep(node);
    assert.strictEqual(ixs.toString(), "img[1]"); 
});
QUnit.test("getIndexedXPathText", function(assert) {
    var node = document.getElementById("textNodeElement").childNodes[0];
    var ix = Webdext.Model.getIndexedXPath(node);
    assert.strictEqual(ix.toString(), "/html[1]/body[1]/div[2]/div[1]/span[1]/text()[1]"); 
});
QUnit.test("getIndexedXPathHyperlink", function(assert) {
    var node = document.getElementById("hyperlinkElement");
    var ix = Webdext.Model.getIndexedXPath(node);
    assert.strictEqual(ix.toString(), "/html[1]/body[1]/div[2]/div[1]/a[1]"); 
});
QUnit.test("getIndexedXPathImage", function(assert) {
    var node = document.getElementById("imageElement");
    var ix = Webdext.Model.getIndexedXPath(node);
    assert.strictEqual(ix.toString(), "/html[1]/body[1]/div[2]/div[1]/img[1]"); 
});

QUnit.module("TagPathStep");
QUnit.test("TagPathStep", function(assert) {
    var tpStep = new Webdext.Model.TagPathStep("SPAN", "C");
    assert.strictEqual(tpStep.value, "SPAN,C");
    assert.strictEqual(tpStep.toString(), "<SPAN>C");
});

QUnit.module("getTagPath");
QUnit.test("getTagPathText", function(assert) {
    var t = document.getElementById("textNodeElement").childNodes[0];
    var tp = Webdext.Model.getTagPath(t);
    var expected = [
        new Webdext.Model.TagPathStep("HTML", "C"),
        new Webdext.Model.TagPathStep("HEAD", "S"),
        new Webdext.Model.TagPathStep("#text", "S"),
        new Webdext.Model.TagPathStep("BODY", "C"),
        new Webdext.Model.TagPathStep("#text", "S"),
        new Webdext.Model.TagPathStep("DIV", "S"),
        new Webdext.Model.TagPathStep("#text", "S"),
        new Webdext.Model.TagPathStep("DIV", "C"),
        new Webdext.Model.TagPathStep("#text", "S"),
        new Webdext.Model.TagPathStep("DIV", "C"),
        new Webdext.Model.TagPathStep("#text", "S"),
        new Webdext.Model.TagPathStep("SPAN", "C"),
    ];
    assert.deepEqual(tp, expected); 
});
QUnit.test("getTagPathHyperlink", function(assert) {
    var t = document.getElementById("hyperlinkElement");
    var tp = Webdext.Model.getTagPath(t);
    var expected = [
        new Webdext.Model.TagPathStep("HTML", "C"),
        new Webdext.Model.TagPathStep("HEAD", "S"),
        new Webdext.Model.TagPathStep("#text", "S"),
        new Webdext.Model.TagPathStep("BODY", "C"),
        new Webdext.Model.TagPathStep("#text", "S"),
        new Webdext.Model.TagPathStep("DIV", "S"),
        new Webdext.Model.TagPathStep("#text", "S"),
        new Webdext.Model.TagPathStep("DIV", "C"),
        new Webdext.Model.TagPathStep("#text", "S"),
        new Webdext.Model.TagPathStep("DIV", "C"),
        new Webdext.Model.TagPathStep("#text", "S"),
        new Webdext.Model.TagPathStep("SPAN", "S"),
        new Webdext.Model.TagPathStep("#text", "S"),
    ];
    assert.deepEqual(tp, expected); 
});
QUnit.test("getTagPathImage", function(assert) {
    var t = document.getElementById("imageElement");
    var tp = Webdext.Model.getTagPath(t);
    var expected = [
        new Webdext.Model.TagPathStep("HTML", "C"),
        new Webdext.Model.TagPathStep("HEAD", "S"),
        new Webdext.Model.TagPathStep("#text", "S"),
        new Webdext.Model.TagPathStep("BODY", "C"),
        new Webdext.Model.TagPathStep("#text", "S"),
        new Webdext.Model.TagPathStep("DIV", "S"),
        new Webdext.Model.TagPathStep("#text", "S"),
        new Webdext.Model.TagPathStep("DIV", "C"),
        new Webdext.Model.TagPathStep("#text", "S"),
        new Webdext.Model.TagPathStep("DIV", "C"),
        new Webdext.Model.TagPathStep("#text", "S"),
        new Webdext.Model.TagPathStep("SPAN", "S"),
        new Webdext.Model.TagPathStep("#text", "S"),
        new Webdext.Model.TagPathStep("A", "S"),
        new Webdext.Model.TagPathStep("#text", "S"),
    ];
    assert.deepEqual(tp, expected); 
});

QUnit.module("createTermFrequencyVector");
QUnit.test("createTermFrequencyVector", function(assert) {
    var text = "JavaScript and JQuery: Interactive Front-End Web Development";
    text += " A Smarter Way to Learn JavaScript: ";
    text += "The new approach that uses technology to cut your effort in half";
    var tfv = Webdext.Model.createTermFrequencyVector(text);
    var expected = {
        "javascript": 1,
        "and": 1,
        "jquery:": 1,
        "interactive": 1,
        "front-end": 1,
        "web": 1,
        "development": 1,
        "a": 1,
        "smarter": 1,
        "way": 1,
        "to": 2,
        "learn": 1,
        "javascript:": 1,
        "the": 1,
        "new": 1,
        "approach": 1,
        "that": 1,
        "uses": 1,
        "technology": 1,
        "cut": 1,
        "your": 1,
        "effort": 1,
        "in": 1,
        "half": 1
    };
    assert.deepEqual(tfv, expected); 
});

QUnit.module("getPresentationStyle");
QUnit.test("getPresentationStyle", function(assert) {
    var t = document.getElementById("textNodeElement").childNodes[0];
    var tps = Webdext.Model.getPresentationStyle(t); 
    var expected = {
        "fontFamily": "sans-serif",
        "fontSize": "14px",
        "color": "rgb(255, 0, 0)",
        "fontWeight": "700",
        "textDecoration": "underline",
        "fontStyle": "italic"
    };
    assert.deepEqual(tps, expected);
});

QUnit.module("addChild");
QUnit.test("addChild", function(assert) {
    var te = document.getElementById("textNodeElement");
    var t = te.childNodes[0];
    var wte = new Webdext.Model.WElementNode(te);
    var wt = new Webdext.Model.WTextNode(t);
    wte.addChild(wt);
    assert.strictEqual(wte.getChildrenCount(), 1);
    assert.deepEqual(wte.children, [wt]);
});

QUnit.module("createWNode");
QUnit.test("createWNodeElement", function(assert) {
    var node = document.getElementById("main");
    var wNode = Webdext.Model.createWNode(node);
    var expected = new Webdext.Model.WElementNode(node);
    assert.deepEqual(wNode, expected);
});
QUnit.test("createWNodeText", function(assert) {
    var node = document.getElementById("textNodeElement").childNodes[0];
    var wNode = Webdext.Model.createWNode(node);
    var expected = new Webdext.Model.WTextNode(node);
    assert.deepEqual(wNode, expected); 
});
QUnit.test("createWNodeHyperlink", function(assert) {
    var node = document.getElementById("hyperlinkElement");
    var wNode = Webdext.Model.createWNode(node);
    var pNode = new Webdext.Model.WElementNode(node);
    var cNode = new Webdext.Model.WHyperlinkNode(node, pNode);
    assert.deepEqual(wNode, pNode); 
});
QUnit.test("createWNodeImage", function(assert) {
    var node = document.getElementById("imageElement");
    var wNode = Webdext.Model.createWNode(node);
    var expected = new Webdext.Model.WImageNode(node);
    assert.deepEqual(wNode, expected); 
});

QUnit.module("createWTree");
QUnit.test("createWTree", function(assert) {
    var tree = Webdext.Model.createWTree();
    assert.strictEqual(tree.tagName, "HTML");
    assert.strictEqual(tree.indexedXPath.toString(), "/html[1]");

    // tree structure
    assert.strictEqual(
        tree.valueOf(),
        "/html[1]"
    );
    assert.strictEqual(
        tree.children[0].valueOf(),
        "/html[1]/head[1]"
    );
    assert.strictEqual(
        tree.children[1].valueOf(),
        "/html[1]/body[1]"
    );
    assert.ok(tree.children[0].isLeafNode());
    assert.strictEqual(
        tree.children[1].children[1].valueOf(),
        "/html[1]/body[1]/div[2]"
    );
    assert.strictEqual(
        tree.children[1].children[1].valueOf(),
        "/html[1]/body[1]/div[2]"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].valueOf(),
        "/html[1]/body[1]/div[2]/div[1]"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[0].valueOf(),
        "/html[1]/body[1]/div[2]/div[1]/span[1]"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1].valueOf(),
        "/html[1]/body[1]/div[2]/div[1]/a[1]"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[2].valueOf(),
        "/html[1]/body[1]/div[2]/div[1]/img[1]"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[0].children[0].valueOf(),
        "/html[1]/body[1]/div[2]/div[1]/span[1]/text()[1]"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1].children[0].valueOf(),
        "/html[1]/body[1]/div[2]/div[1]/a[1]/@href"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1].children[1].valueOf(),
        "/html[1]/body[1]/div[2]/div[1]/a[1]/text()[1]"
    );

    // element node
    assert.strictEqual(
        tree.children[1].children[1].children[0].tagName,
        "DIV"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].valueOf(),
        "/html[1]/body[1]/div[2]/div[1]"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].area,
        404000
    );
    assert.deepEqual(
        tree.children[1].children[1].children[0].rectangleSize,
        {
            "height": 404,
            "width": 1000,
        }
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].isLeafNode(),
        false
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].isSeparatorNode(),
        false
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].getSiblingIndex(),
        1
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].getChildIndex(tree.children[1].children[1].children[0].children[0]),
        1
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].getChildIndex(tree.children[1].children[1].children[0].children[1]),
        2
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].getChildIndex(tree.children[1].children[1].children[0].children[2]),
        3
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].getChild(1).valueOf(),
        "/html[1]/body[1]/div[2]/div[1]/span[1]"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].getChild(2).valueOf(),
        "/html[1]/body[1]/div[2]/div[1]/a[1]"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].getChild(3).valueOf(),
        "/html[1]/body[1]/div[2]/div[1]/img[1]"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].getChildrenSubset(1, 1).length,
        1
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].getChildrenSubset(1, 2).length,
        2
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].getChildrenSubset(2, 3).length,
        2
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].getChildrenSubset(1, 3).length,
        3
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].getLeafNodes().length,
        4
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].getLeafNodes()[0].valueOf(),
        "/html[1]/body[1]/div[2]/div[1]/span[1]/text()[1]"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].getLeafNodes()[1].valueOf(),
        "/html[1]/body[1]/div[2]/div[1]/a[1]/@href"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].getLeafNodes()[2].valueOf(),
        "/html[1]/body[1]/div[2]/div[1]/a[1]/text()[1]"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].getLeafNodes()[3].valueOf(),
        "/html[1]/body[1]/div[2]/div[1]/img[1]"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].getChildrenCount(),
        3
    );

    // text node
    assert.ok(
        tree.children[1].children[1].children[0].children[0].children[0] instanceof Webdext.Model.WTextNode
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[0].children[0].valueOf(),
        "/html[1]/body[1]/div[2]/div[1]/span[1]/text()[1]"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[0].children[0].textContent,
        "Example of text node element"
    );
    assert.deepEqual(
        tree.children[1].children[1].children[0].children[0].children[0].termFrequencyVector,
        {
            "example": 1,
            "of": 1,
            "text": 1,
            "node": 1,
            "element": 1
        }
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[0].children[0].dataType,
        Webdext.Model.DATA_TYPE.TEXT
    );
    assert.deepEqual(
        tree.children[1].children[1].children[0].children[0].children[0].presentationStyle,
        {
            "color": "rgb(255, 0, 0)",
            "fontFamily": "sans-serif",
            "fontSize": "14px",
            "fontStyle": "italic",
            "fontWeight": "700",
            "textDecoration": "underline"
        }
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[0].children[0].isLeafNode(),
        true
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[0].children[0].isSeparatorNode(),
        false
    );
    assert.deepEqual(
        tree.children[1].children[1].children[0].children[0].children[0].getLeafNodes(),
        [tree.children[1].children[1].children[0].children[0].children[0]]
    );

    // hyperlink node
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1].tagName,
        "A"
    );
    assert.ok(
        tree.children[1].children[1].children[0].children[1].children[0] instanceof Webdext.Model.WHyperlinkNode
    );
    assert.ok(
        tree.children[1].children[1].children[0].children[1].children[1] instanceof Webdext.Model.WTextNode
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1].valueOf(),
        "/html[1]/body[1]/div[2]/div[1]/a[1]"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1].children[0].valueOf(),
        "/html[1]/body[1]/div[2]/div[1]/a[1]/@href"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1].children[1].valueOf(),
        "/html[1]/body[1]/div[2]/div[1]/a[1]/text()[1]"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1] instanceof Webdext.Model.WElementNode,
        true
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1].children[0] instanceof Webdext.Model.WHyperlinkNode,
        true
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1].children[1] instanceof Webdext.Model.WTextNode,
        true
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1].children[0].href.url,
        "http://amazon.com/"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1].children[0].dataType,
        Webdext.Model.DATA_TYPE.HYPERLINK
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1].children[1].dataType,
        Webdext.Model.DATA_TYPE.TEXT
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1].isLeafNode(),
        false
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1].children[0].isLeafNode(),
        true
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1].children[1].isLeafNode(),
        true
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1].isSeparatorNode(),
        false
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1].children[0].isSeparatorNode(),
        false
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[1].children[1].isSeparatorNode(),
        false
    );
    assert.deepEqual(
        tree.children[1].children[1].children[0].children[1].getLeafNodes(),
        tree.children[1].children[1].children[0].children[1].children
    );
    assert.deepEqual(
        tree.children[1].children[1].children[0].children[1].children[0].getLeafNodes(),
        [tree.children[1].children[1].children[0].children[1].children[0]]
    );
    assert.deepEqual(
        tree.children[1].children[1].children[0].children[1].children[1].getLeafNodes(),
        [tree.children[1].children[1].children[0].children[1].children[1]]
    );

    // image node
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[2].tagName,
        "IMG"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[2].valueOf(),
        "/html[1]/body[1]/div[2]/div[1]/img[1]"
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[2].area,
        120000
    );
    assert.deepEqual(
        tree.children[1].children[1].children[0].children[2].rectangleSize,
        {
            "height": 400,
            "width": 300,
        }
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[2] instanceof Webdext.Model.WImageNode,
        true
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[2].dataType,
        Webdext.Model.DATA_TYPE.IMAGE
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[2].isLeafNode(),
        true
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[2].isSeparatorNode(),
        false
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[2].getSiblingIndex(),
        3
    );
    assert.deepEqual(
        tree.children[1].children[1].children[0].children[2].getLeafNodes(),
        [tree.children[1].children[1].children[0].children[2]]
    );
    assert.strictEqual(
        tree.children[1].children[1].children[0].children[2].getChildrenCount(),
        0
    );
});

QUnit.module("findWNode");
QUnit.test("findWNode", function(assert) {
   var wTree = Webdext.Model.createWTree();

   var elementNode = Webdext.evaluateXPath("//*[@id='main']")[0];
   var wElementNode = Webdext.Model.findWNode(elementNode, wTree);
   assert.ok(elementNode.isSameNode(Webdext.evaluateXPath(wElementNode.valueOf())[0]));
   assert.strictEqual(wElementNode.tagName, elementNode.nodeName);

   var textNode = Webdext.evaluateXPath("//*[@id='textNodeElement']/text()")[0];
   var wTextNode = Webdext.Model.findWNode(textNode, wTree);
   assert.ok(textNode.isSameNode(Webdext.evaluateXPath(wTextNode.valueOf())[0]));
   assert.strictEqual(wTextNode.textContent, textNode.nodeValue);

   var imageNode = Webdext.evaluateXPath("//*[@id='imageElement']")[0];
   var wImageNode = Webdext.Model.findWNode(imageNode, wTree);
   assert.ok(imageNode.isSameNode(Webdext.evaluateXPath(wImageNode.valueOf())[0]));
   assert.strictEqual(wImageNode.src.url, imageNode.src);
});
