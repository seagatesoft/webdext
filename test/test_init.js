QUnit.module("evaluateXPath");
QUnit.test("evaluateXPath", function(assert) {
    assert.strictEqual(
        Webdext.evaluateXPath("//*[@id='textNodeElement']/text()")[0].nodeValue,
        "Example of text node element"
    );
    assert.strictEqual(
        Webdext.evaluateXPath("//*[@id='hyperlinkElement']/text()")[0].nodeValue,
        "Example of hyperlink"
    );
    assert.strictEqual(
        Webdext.evaluateXPath("//*[@id='hyperlinkElement']/@href")[0].nodeValue,
        "http://amazon.com"
    );
    assert.strictEqual(
        Webdext.evaluateXPath("//*[@id='imageElement']/@src")[0].nodeValue,
        "yahoo_open_hack_day.jpg"
    );
    assert.strictEqual(
        Webdext.evaluateXPath("//*[@id='main']")[0].nodeName,
        "DIV"
    );
});
