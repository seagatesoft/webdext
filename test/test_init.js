QUnit.module("evaluateXpath");
QUnit.test("evaluateXpath", function(assert) {
    assert.strictEqual(
        Webdext.evaluateXpath("//*[@id='textNodeElement']/text()")[0].nodeValue,
        "Example of text node element"
    );
    assert.strictEqual(
        Webdext.evaluateXpath("//*[@id='hyperlinkElement']/text()")[0].nodeValue,
        "Example of hyperlink"
    );
    assert.strictEqual(
        Webdext.evaluateXpath("//*[@id='hyperlinkElement']/@href")[0].nodeValue,
        "http://amazon.com"
    );
    assert.strictEqual(
        Webdext.evaluateXpath("//*[@id='imageElement']/@src")[0].nodeValue,
        "yahoo_open_hack_day.jpg"
    );
    assert.strictEqual(
        Webdext.evaluateXpath("//*[@id='main']")[0].nodeName,
        "DIV"
    );
});
