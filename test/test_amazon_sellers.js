console.log("Start Amazon Sellers test");
WUnit.test("separatorBasedCRecMine", function(assert) {
    var wTree = Webdext.Model.createWTree();
    var n = Webdext.evaluateXPath('//*[@id="olpOfferList"]/div/div')[0];
    var w = Webdext.Model.findWNode(n, wTree);
    var wNodeSet = w.children;
    var separatorTagsSet = Webdext.Extraction.findSeparatorTagsSet(wNodeSet);

    assert.strictEqual(separatorTagsSet.length, 1, "separatorTagsSet.length != 11");
    assert.strictEqual(separatorTagsSet[0], "HR", "separatorTagsSet[0] != HR"); 

    var subPartList = Webdext.Extraction.separateSiblings(wNodeSet, separatorTagsSet[0]);
    assert.strictEqual(subPartList.length, 11, "subPartList.length != 11");

    var cRecSet = Webdext.Extraction.separatorBasedCRecMine(wNodeSet.slice(1));
    assert.strictEqual(cRecSet.size(), 10, "cRecSet.size() != 10");
});

WUnit.test("extract", function(assert) {
    var recSetList = Webdext.extract();
    assert.strictEqual(recSetList.length, 22, "recSetList.length != 22");
    assert.strictEqual(recSetList[0].size(), 10, "recSetList[0].size() != 10");
    assert.strictEqual(
        recSetList[0].recordSet[0].dataItems[0].dataContent,
        "$21.99",
        "recSetList[0].recordSet[9].dataItems[0].dataContent != $21.99"
    );
    assert.strictEqual(
        recSetList[0].recordSet[1].dataItems[28].dataContent,
        "5 out of 5 stars",
        "recSetList[0].recordSet[1].dataItems[28].dataContent != 5 out of 5 stars"
    );
    assert.strictEqual(
        recSetList[0].recordSet[9].dataItems[0].dataContent,
        "$46.04",
        "recSetList[0].recordSet[9].dataItems[0].dataContent != $46.04"
    );
    assert.strictEqual(
        recSetList[0].recordSet[9].dataItems[28].dataContent,
        "5 out of 5 stars",
        "recSetList[0].recordSet[9].dataItems[28].dataContent != 5 out of 5 stars"
    );
});
console.log("End Amazon Sellers test");
