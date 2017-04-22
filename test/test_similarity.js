QUnit.module("CosineSimilarity");
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
QUnit.test("dotProduct", function(assert) {
    assert.strictEqual(Webdext.Similarity.dotProduct(tfv1, tfv1), 5);
    assert.strictEqual(Webdext.Similarity.dotProduct(tfv2, tfv2), 8);
    assert.strictEqual(Webdext.Similarity.dotProduct(tfv1, tfv2), 1);
});
QUnit.test("cosineSimilarity", function(assert) {
    var wNode1 = {"termFrequencyVector": tfv1};
    wNode1.normVector = Webdext.Model.normVector(wNode1.termFrequencyVector);
    var wNode2 = {"termFrequencyVector": tfv2};
    wNode2.normVector = Webdext.Model.normVector(wNode2.termFrequencyVector);
    assert.ok(
        Math.abs(Webdext.Similarity.cosineSimilarity(wNode1, wNode1) - 1) < 0.000000000000001   
    );
    assert.ok(
        Math.abs(Webdext.Similarity.cosineSimilarity(wNode2, wNode2) - 1) < 0.000000000000001
    );
    assert.strictEqual(
        Webdext.Similarity.cosineSimilarity(wNode1, wNode2),
        1/(Math.sqrt(5) * Math.sqrt(8))
    );
    assert.strictEqual(
        Webdext.Similarity.cosineSimilarity(wNode2, wNode1),
        1/(Math.sqrt(5) * Math.sqrt(8))
    );
});

QUnit.module("URLSimilarity");
QUnit.test("urlSimilarity", function(assert) {
    var parsedUrl1 = Webdext.Model.parseUrl("https://www.amazon.com/dp/0980455278");
    var parsedUrl2 = Webdext.Model.parseUrl("https://www.amazon.com/dp/0980576806");
    assert.strictEqual(
        Webdext.Similarity.urlSimilarity(parsedUrl1, parsedUrl2),
        0.75
    );
});

QUnit.module("TagPathSimilarity");
var tp1 = [
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
var tp2 = [
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
    new Webdext.Model.TagPathStep("SPAN", "C"),
];
var tp3 = [
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
    new Webdext.Model.TagPathStep("P", "C"),
    new Webdext.Model.TagPathStep("SPAN", "C"),
];
QUnit.test("tagPathEditDistance", function(assert) {
    assert.strictEqual(Webdext.Similarity.tagPathEditDistance(tp1, tp1), 0);
    assert.strictEqual(Webdext.Similarity.tagPathEditDistance(tp2, tp2), 0);
    assert.strictEqual(Webdext.Similarity.tagPathEditDistance(tp3, tp3), 0);
    assert.strictEqual(Webdext.Similarity.tagPathEditDistance(tp1, tp2), 1);
    assert.strictEqual(Webdext.Similarity.tagPathEditDistance(tp1, tp3), 2);
    assert.strictEqual(Webdext.Similarity.tagPathEditDistance(tp2, tp3), 1);
    assert.strictEqual(Webdext.Similarity.tagPathEditDistance(tp2, tp1), 1);
    assert.strictEqual(Webdext.Similarity.tagPathEditDistance(tp3, tp1), 2);
    assert.strictEqual(Webdext.Similarity.tagPathEditDistance(tp3, tp2), 1);
});
QUnit.test("tagPathSimilarity", function(assert) {
    assert.strictEqual(Webdext.Similarity.tagPathSimilarity(tp1, tp1), 1);
    assert.strictEqual(Webdext.Similarity.tagPathSimilarity(tp2, tp2), 1);
    assert.strictEqual(Webdext.Similarity.tagPathSimilarity(tp3, tp3), 1);
    assert.strictEqual(Webdext.Similarity.tagPathSimilarity(tp1, tp2), 1-(1/23));
    assert.strictEqual(Webdext.Similarity.tagPathSimilarity(tp1, tp3), 1-(2/24));
    assert.strictEqual(Webdext.Similarity.tagPathSimilarity(tp2, tp3), 1-(1/23));
    assert.strictEqual(Webdext.Similarity.tagPathSimilarity(tp2, tp1), 1-(1/23));
    assert.strictEqual(Webdext.Similarity.tagPathSimilarity(tp3, tp1), 1-(2/24));
    assert.strictEqual(Webdext.Similarity.tagPathSimilarity(tp3, tp2), 1-(1/23));
});

QUnit.module("PresentationStyleSimilarity");
var ps1 = {
    "fontFamily": "sans-serif",
    "fontSize": "14px",
    "color": "rgb(255, 0, 0)",
    "fontWeight": "700",
    "textDecoration": "underline",
    "fontStyle": "italic"
};
var ps2 = {
    "fontFamily": "sans-serif",
    "fontSize": "12px",
    "color": "rgb(255, 0, 0)",
    "fontWeight": "400",
    "textDecoration": "underline",
    "fontStyle": "normal"
};
QUnit.test("presentationStyleSimilarity", function(assert) {
    assert.strictEqual(Webdext.Similarity.presentationStyleSimilarity(ps1, ps1), 1);
    assert.strictEqual(Webdext.Similarity.presentationStyleSimilarity(ps2, ps2), 1);
    assert.strictEqual(Webdext.Similarity.presentationStyleSimilarity(ps1, ps2), 0.5);
});

QUnit.module("RectangleSizeSimilarity");
var rs1 = {
    "width": 300,
    "height": 400
};
var rs2 = {
    "width": 400,
    "height": 300
};
var rs3 = {
    "width": 800,
    "height": 600
};
QUnit.test("rectangleSizeSimilarity", function(assert) {
    assert.strictEqual(Webdext.Similarity.rectangleSizeSimilarity(rs1, rs1), 1);
    assert.strictEqual(Webdext.Similarity.rectangleSizeSimilarity(rs2, rs2), 1);
    assert.strictEqual(Webdext.Similarity.rectangleSizeSimilarity(rs3, rs3), 1);

    assert.strictEqual(Webdext.Similarity.rectangleSizeSimilarity(rs1, rs2), 0.75);
    assert.ok(
        Math.abs(Webdext.Similarity.rectangleSizeSimilarity(rs1, rs3) - 0.520833333) < 0.0000001
    );
    assert.strictEqual(Webdext.Similarity.rectangleSizeSimilarity(rs2, rs3), 0.5);

    assert.strictEqual(Webdext.Similarity.rectangleSizeSimilarity(rs2, rs1), 0.75);
    assert.ok(
        Math.abs(Webdext.Similarity.rectangleSizeSimilarity(rs3, rs1) - 0.520833333) < 0.0000001
    );
    assert.strictEqual(Webdext.Similarity.rectangleSizeSimilarity(rs3, rs2), 0.5);
});

QUnit.module("WNodeSimilarity");
QUnit.test("WElementNodeSimilarity", function(assert) {
    var spanNode1 = document.getElementById("textNodeElement1"),
        wSpanNode1 = Webdext.Model.createWNode(spanNode1),
        spanNode2 = document.getElementById("textNodeElement2"),
        wSpanNode2 = Webdext.Model.createWNode(spanNode2),
        hyperlinkNode1 = document.getElementById("hyperlinkElement1"),
        wHyperlinkNode1 = Webdext.Model.createWNode(hyperlinkNode1),
        hyperlinkNode2 = document.getElementById("hyperlinkElement2"),
        wHyperlinkNode2 = Webdext.Model.createWNode(hyperlinkNode2);

    assert.ok(
        Math.abs(Webdext.Similarity.wElementNodeSimilarity(wSpanNode1, wSpanNode1) - 1) < 0.0000001
    );
    assert.ok(
        Math.abs(Webdext.Similarity.wElementNodeSimilarity(wSpanNode2, wSpanNode2) - 1) < 0.0000001
    );
    assert.ok(
        Math.abs(Webdext.Similarity.wElementNodeSimilarity(wHyperlinkNode1, wHyperlinkNode2) - 1) < 0.0000001
    );
    assert.ok(
        Math.abs(Webdext.Similarity.wElementNodeSimilarity(wHyperlinkNode1, wHyperlinkNode2) - 1) < 0.0000001
    );
    assert.strictEqual(
        Webdext.Similarity.wElementNodeSimilarity(wSpanNode1, wSpanNode2),
        1
    );
    assert.strictEqual(
        Webdext.Similarity.wElementNodeSimilarity(wHyperlinkNode1, wHyperlinkNode2),
        1
    );
    assert.strictEqual(
        Webdext.Similarity.wElementNodeSimilarity(wSpanNode1, wHyperlinkNode1),
        0
    );
    assert.strictEqual(
        Webdext.Similarity.wElementNodeSimilarity(wSpanNode2, wHyperlinkNode1),
        0
    );
    assert.strictEqual(
        Webdext.Similarity.wElementNodeSimilarity(wSpanNode1, wHyperlinkNode2),
        0
    );
    assert.strictEqual(
        Webdext.Similarity.wElementNodeSimilarity(wSpanNode2, wHyperlinkNode2),
        0
    );
    assert.strictEqual(
        Webdext.Similarity.wElementNodeSimilarity(wHyperlinkNode1, wSpanNode1),
        0
    );
    assert.strictEqual(
        Webdext.Similarity.wElementNodeSimilarity(wHyperlinkNode1, wSpanNode2),
        0
    );
    assert.strictEqual(
        Webdext.Similarity.wElementNodeSimilarity(wHyperlinkNode2, wSpanNode1),
        0
    );
    assert.strictEqual(
        Webdext.Similarity.wElementNodeSimilarity(wHyperlinkNode2, wSpanNode2),
        0
    );
});
QUnit.test("WTextNodeSimilarity", function(assert) {
    var node1 = document.getElementById("textNodeElement1").childNodes[0];
    var wNode1 = Webdext.Model.createWNode(node1);
    var node2 = document.getElementById("textNodeElement2").childNodes[0];
    var wNode2 = Webdext.Model.createWNode(node2);

    assert.ok(
        Math.abs(Webdext.Similarity.wTextNodeSimilarity(wNode1, wNode1) - 1) < 0.0000001
    );
    assert.ok(
        Math.abs(Webdext.Similarity.wTextNodeSimilarity(wNode2, wNode2) - 1) < 0.0000001
    );
    assert.strictEqual(
        Webdext.Similarity.wTextNodeSimilarity(wNode1, wNode2),
        0.7941895926480885
    );
});
QUnit.test("WHyperlinkNodeSimilarity", function(assert) {
    var node1 = document.getElementById("hyperlinkElement1");
    var wNode1 = Webdext.Model.createWNode(node1);
    wNode1 = wNode1.children[0];
    var node2 = document.getElementById("hyperlinkElement2");
    var wNode2 = Webdext.Model.createWNode(node2);
    wNode2 = wNode2.children[0];

    assert.ok(
        Math.abs(Webdext.Similarity.wHyperlinkNodeSimilarity(wNode1, wNode1) - 1) < 0.0000001
    ); 
    assert.ok(
        Math.abs(Webdext.Similarity.wHyperlinkNodeSimilarity(wNode2, wNode2) - 1) < 0.0000001
    );
    assert.strictEqual(
        Webdext.Similarity.wHyperlinkNodeSimilarity(wNode1, wNode2),
        0.9346938775510204
    );
});
QUnit.test("WImageNodeSimilarity", function(assert) {
    var node1 = document.getElementById("imageElement1");
    var wNode1 = Webdext.Model.createWNode(node1);
    var node2 = document.getElementById("imageElement2");
    var wNode2 = Webdext.Model.createWNode(node2);

    assert.ok(
        Math.abs(Webdext.Similarity.wImageNodeSimilarity(wNode1, wNode1) - 1) < 0.0000001
    ); 
    assert.ok(
        Math.abs(Webdext.Similarity.wImageNodeSimilarity(wNode2, wNode2) - 1) < 0.0000001
    );
    assert.strictEqual(
        Webdext.Similarity.wImageNodeSimilarity(wNode1, wNode2),
        0.9346938775510204
    );
});
QUnit.test("wNodeSimilarity", function(assert) {
    var textNode1 = document.getElementById("textNodeElement1").childNodes[0];
    var wTextNode1 = Webdext.Model.createWNode(textNode1);
    var textNode2 = document.getElementById("textNodeElement2").childNodes[0];
    var wTextNode2 = Webdext.Model.createWNode(textNode2);

    assert.ok(
        Math.abs(
            Webdext.Similarity.cosineSimilarity(wTextNode1, wTextNode1) - 1
        ) < 0.000000000000001   
    );
    assert.ok(
        Math.abs(
            Webdext.Similarity.cosineSimilarity(wTextNode2, wTextNode2) - 1
        ) < 0.000000000000001   
    );
    assert.strictEqual(
        Webdext.Similarity.cosineSimilarity(wTextNode1, wTextNode2),
        0.21213203435596423
    );
    assert.strictEqual(
        Webdext.Similarity.cosineSimilarity(wTextNode2, wTextNode1),
        0.21213203435596423
    );
    assert.strictEqual(
        Webdext.Similarity.tagPathSimilarity(wTextNode1.tagPath, wTextNode1.tagPath),
        1
    );
    assert.strictEqual(
        Webdext.Similarity.tagPathSimilarity(wTextNode2.tagPath, wTextNode2.tagPath),
        1
    );
    assert.strictEqual(
        Webdext.Similarity.tagPathSimilarity(wTextNode1.tagPath, wTextNode2.tagPath),
        0.9411764705882353
    );
    assert.strictEqual(
        Webdext.Similarity.tagPathSimilarity(wTextNode2.tagPath, wTextNode1.tagPath),
        0.9411764705882353
    );
    assert.strictEqual(
        Webdext.Similarity.presentationStyleSimilarity(
            wTextNode1.presentationStyle,
            wTextNode1.presentationStyle
        ),
        1
    );
    assert.strictEqual(
        Webdext.Similarity.presentationStyleSimilarity(
            wTextNode2.presentationStyle,
            wTextNode2.presentationStyle
        ),
        1
    );
    assert.strictEqual(
        Webdext.Similarity.presentationStyleSimilarity(
            wTextNode1.presentationStyle,
            wTextNode2.presentationStyle
        ),
        1
    );
    assert.strictEqual(
        Webdext.Similarity.presentationStyleSimilarity(
            wTextNode2.presentationStyle,
            wTextNode1.presentationStyle
        ),
        1
    );
    assert.ok(
        Math.abs(Webdext.Similarity.wNodeSimilarity(wTextNode1, wTextNode1) - 1) < 0.0000001
    ); 
    assert.ok(
        Math.abs(Webdext.Similarity.wNodeSimilarity(wTextNode2, wTextNode2) - 1) < 0.0000001
    );
    assert.strictEqual(
        Webdext.Similarity.wNodeSimilarity(wTextNode1, wTextNode2),
        0.7941895926480885
    );
    assert.strictEqual(
        Webdext.Similarity.wNodeSimilarity(wTextNode2, wTextNode1),
        0.7941895926480885
    );

    var hyperlinkNode1 = document.getElementById("hyperlinkElement1");
    var wHyperlinkNode1 = Webdext.Model.createWNode(hyperlinkNode1);
    wHyperlinkNode1 = wHyperlinkNode1.children[0];
    var hyperlinkNode2 = document.getElementById("hyperlinkElement2");
    var wHyperlinkNode2 = Webdext.Model.createWNode(hyperlinkNode2);
    wHyperlinkNode2 = wHyperlinkNode2.children[0];

    assert.ok(
        Math.abs(
            Webdext.Similarity.urlSimilarity(
                wHyperlinkNode1.href,
                wHyperlinkNode1.href
            ) - 1
        ) < 0.000000000000001   
    );
    assert.ok(
        Math.abs(
            Webdext.Similarity.urlSimilarity(
                wHyperlinkNode2.href,
                wHyperlinkNode2.href
            ) - 1
        ) < 0.000000000000001   
    );
    assert.strictEqual(
        Webdext.Similarity.urlSimilarity(
            wHyperlinkNode1.href,
            wHyperlinkNode2.href
        ),
        0.75
    );
    assert.strictEqual(
        Webdext.Similarity.urlSimilarity(
            wHyperlinkNode2.href,
            wHyperlinkNode1.href
        ),
        0.75
    );
    assert.strictEqual(
        Webdext.Similarity.tagPathSimilarity(wHyperlinkNode1.tagPath, wHyperlinkNode1.tagPath),
        1
    );
    assert.strictEqual(
        Webdext.Similarity.tagPathSimilarity(wHyperlinkNode2.tagPath, wHyperlinkNode2.tagPath),
        1
    );
    assert.strictEqual(
        Webdext.Similarity.tagPathSimilarity(wHyperlinkNode1.tagPath, wHyperlinkNode2.tagPath),
        0.9166666666666666
    );
    assert.strictEqual(
        Webdext.Similarity.tagPathSimilarity(wHyperlinkNode1.tagPath, wHyperlinkNode2.tagPath),
        0.9166666666666666
    );
    assert.strictEqual(
        Webdext.Similarity.presentationStyleSimilarity(
            wHyperlinkNode1.presentationStyle,
            wHyperlinkNode1.presentationStyle
        ),
        1
    );
    assert.strictEqual(
        Webdext.Similarity.presentationStyleSimilarity(
            wHyperlinkNode2.presentationStyle,
            wHyperlinkNode2.presentationStyle
        ),
        1
    );
    assert.strictEqual(
        Webdext.Similarity.presentationStyleSimilarity(
            wHyperlinkNode1.presentationStyle,
            wHyperlinkNode2.presentationStyle
        ),
        1
    );
    assert.strictEqual(
        Webdext.Similarity.presentationStyleSimilarity(
            wHyperlinkNode2.presentationStyle,
            wHyperlinkNode1.presentationStyle
        ),
        1
    );
    assert.ok(
        Math.abs(Webdext.Similarity.wNodeSimilarity(wHyperlinkNode1, wHyperlinkNode1) - 1) < 0.001
    ); 
    assert.ok(
        Math.abs(Webdext.Similarity.wNodeSimilarity(wHyperlinkNode2, wHyperlinkNode2) - 1) < 0.001
    );
    assert.strictEqual(
        Webdext.Similarity.wNodeSimilarity(wHyperlinkNode1, wHyperlinkNode2),
        0.9346938775510204
    );
    assert.strictEqual(
        Webdext.Similarity.wNodeSimilarity(wHyperlinkNode2, wHyperlinkNode1),
        0.9346938775510204
    );

    var imageNode1 = document.getElementById("imageElement1");
    var wImageNode1 = Webdext.Model.createWNode(imageNode1);
    var imageNode2 = document.getElementById("imageElement2");
    var wImageNode2 = Webdext.Model.createWNode(imageNode2);

    assert.ok(
        Math.abs(
            Webdext.Similarity.urlSimilarity(
                wImageNode1.src,
                wImageNode1.src
            ) - 1
        ) < 0.000000000000001   
    );
    assert.ok(
        Math.abs(
            Webdext.Similarity.urlSimilarity(
                wImageNode2.src,
                wImageNode2.src
            ) - 1
        ) < 0.000000000000001 
    );
    assert.strictEqual(
        Webdext.Similarity.urlSimilarity(
            wImageNode1.src,
            wImageNode2.src
        ),
        0.75
    );
    assert.strictEqual(
        Webdext.Similarity.urlSimilarity(
            wImageNode2.src,
            wImageNode1.src
        ),
        0.75
    );
    assert.strictEqual(
        Webdext.Similarity.tagPathSimilarity(wImageNode1.tagPath, wImageNode1.tagPath),
        1
    );
    assert.strictEqual(
        Webdext.Similarity.tagPathSimilarity(wImageNode2.tagPath, wImageNode2.tagPath),
        1
    );
    assert.strictEqual(
        Webdext.Similarity.tagPathSimilarity(wImageNode1.tagPath, wImageNode2.tagPath),
        0.9285714285714286
    );
    assert.strictEqual(
        Webdext.Similarity.tagPathSimilarity(wImageNode2.tagPath, wImageNode1.tagPath),
        0.9285714285714286
    );
    assert.strictEqual(
        Webdext.Similarity.rectangleSizeSimilarity(
            wImageNode1.rectangleSize,
            wImageNode1.rectangleSize
        ),
        1
    );
    assert.strictEqual(
        Webdext.Similarity.rectangleSizeSimilarity(
            wImageNode2.rectangleSize,
            wImageNode2.rectangleSize
        ),
        1
    );
    assert.strictEqual(
        Webdext.Similarity.rectangleSizeSimilarity(
            wImageNode1.rectangleSize,
            wImageNode2.rectangleSize
        ),
        1
    );
    assert.strictEqual(
        Webdext.Similarity.rectangleSizeSimilarity(
            wImageNode2.rectangleSize,
            wImageNode1.rectangleSize
        ),
        1
    );
    assert.ok(
        Math.abs(Webdext.Similarity.wNodeSimilarity(wImageNode1, wImageNode1) - 1) < 0.0000001
    ); 
    assert.ok(
        Math.abs(Webdext.Similarity.wNodeSimilarity(wImageNode2, wImageNode2) - 1) < 0.0000001
    );
    assert.strictEqual(
        Webdext.Similarity.wNodeSimilarity(wImageNode1, wImageNode2),
        0.9346938775510204
    );
    assert.strictEqual(
        Webdext.Similarity.wNodeSimilarity(wImageNode2, wImageNode1),
        0.9346938775510204
    );
});
QUnit.test("memoizedWNodeSimilarity", function(assert) {
    var textNode1 = document.getElementById("textNodeElement1").childNodes[0];
    var wTextNode1 = Webdext.Model.createWNode(textNode1);
    var textNode2 = document.getElementById("textNodeElement2").childNodes[0];
    var wTextNode2 = Webdext.Model.createWNode(textNode2);

    assert.ok(
        Math.abs(Webdext.Similarity.memoizedWTextNodeSimilarity(wTextNode1, wTextNode1) - 1) < 0.0000001
    ); 
    assert.ok(
        Math.abs(Webdext.Similarity.memoizedWTextNodeSimilarity(wTextNode2, wTextNode2) - 1) < 0.0000001
    );
    assert.strictEqual(
        Webdext.Similarity.memoizedWTextNodeSimilarity(wTextNode1, wTextNode2),
        0.7941895926480885
    );
    assert.strictEqual(
        Webdext.Similarity.memoizedWTextNodeSimilarity(wTextNode2, wTextNode1),
        0.7941895926480885
    );

    var hyperlinkNode1 = document.getElementById("hyperlinkElement1");
    var wHyperlinkNode1 = Webdext.Model.createWNode(hyperlinkNode1);
    wHyperlinkNode1 = wHyperlinkNode1.children[0];
    var hyperlinkNode2 = document.getElementById("hyperlinkElement2");
    var wHyperlinkNode2 = Webdext.Model.createWNode(hyperlinkNode2);
    wHyperlinkNode2 = wHyperlinkNode2.children[0];

    assert.ok(
        Math.abs(Webdext.Similarity.memoizedWHyperlinkNodeSimilarity(wHyperlinkNode1, wHyperlinkNode1) - 1) < 0.001
    ); 
    assert.ok(
        Math.abs(Webdext.Similarity.memoizedWHyperlinkNodeSimilarity(wHyperlinkNode2, wHyperlinkNode2) - 1) < 0.001
    );
    assert.strictEqual(
        Webdext.Similarity.memoizedWHyperlinkNodeSimilarity(wHyperlinkNode1, wHyperlinkNode2),
        0.9346938775510204
    );
    assert.strictEqual(
        Webdext.Similarity.memoizedWHyperlinkNodeSimilarity(wHyperlinkNode2, wHyperlinkNode1),
        0.9346938775510204
    );

    var imageNode1 = document.getElementById("imageElement1");
    var wImageNode1 = Webdext.Model.createWNode(imageNode1);
    var imageNode2 = document.getElementById("imageElement2");
    var wImageNode2 = Webdext.Model.createWNode(imageNode2);

    assert.ok(
        Math.abs(Webdext.Similarity.memoizedWImageNodeSimilarity(wImageNode1, wImageNode1) - 1) < 0.0000001
    ); 
    assert.ok(
        Math.abs(Webdext.Similarity.memoizedWImageNodeSimilarity(wImageNode2, wImageNode2) - 1) < 0.0000001
    );
    assert.strictEqual(
        Webdext.Similarity.memoizedWImageNodeSimilarity(wImageNode1, wImageNode2),
        0.9346938775510204
    );
    assert.strictEqual(
        Webdext.Similarity.memoizedWImageNodeSimilarity(wImageNode2, wImageNode1),
        0.9346938775510204
    );
});

QUnit.module("SimilarityMap");
QUnit.test("SimilarityMap", function(assert) {
    var simMap = new Webdext.Similarity.SimilarityMap(Webdext.Similarity.urlSimilarity);
    var parsedUrl1 = Webdext.Model.parseUrl("https://www.amazon.com/dp/0980455278");
    var parsedUrl2 = Webdext.Model.parseUrl("https://www.amazon.com/dp/0980576806");
    assert.strictEqual(
        simMap.get(parsedUrl1, parsedUrl2),
        0.75
    );
    assert.strictEqual(
        simMap.get(parsedUrl2, parsedUrl1),
        0.75
    );
});

QUnit.module("getValueFromSimPairMap");
QUnit.test("getValueFromSimPairMap", function(assert) {
    var parsedUrl1 = Webdext.Model.parseUrl("https://www.amazon.com/dp/0980455278");
    var parsedUrl2 = Webdext.Model.parseUrl("https://www.amazon.com/dp/0980576806");
    var similarity = Webdext.Similarity.urlSimilarity(parsedUrl1, parsedUrl2);
    var simPairMap = new Map();
    var innerMap = new Map();
    innerMap.set(parsedUrl2, similarity);
    simPairMap.set(parsedUrl1, innerMap);
    assert.strictEqual(
        Webdext.Similarity.getValueFromSimPairMap(simPairMap, parsedUrl1, parsedUrl2),
        0.75
    );
});

