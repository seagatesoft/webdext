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
console.log("End Amazon Sellers test");
