"use strict";

console.log("Start BCA test");
WUnit.test("wNodeSimilarity", function(assert) {
    var THRESHOLDS = Webdext.Similarity.THRESHOLDS,
        wNodeSimilarity = Webdext.Similarity.wNodeSimilarity;

    var wTree = Webdext.Model.createWTree();
    var currencyNode1 = Webdext.evaluateXPath(
        '/html/body/section[2]/div/section[1]/div[2]/div[1]/table/tbody/tr[1]/td[1]/text()[1]'
    )[0];
    var wCurrencyNode1 = Webdext.Model.findWNode(currencyNode1, wTree);
    var currencyNode2 = Webdext.evaluateXPath(
        '/html/body/section[2]/div/section[1]/div[2]/div[1]/table/tbody/tr[2]/td[1]/text()[1]'
    )[0];
    var wCurrencyNode2 = Webdext.Model.findWNode(currencyNode2, wTree);
    var rateNode1 = Webdext.evaluateXPath(
        '/html/body/section[2]/div/section[1]/div[2]/div[1]/table/tbody/tr[1]/td[2]/text()[1]'
    )[0];
    var wRateNode1 = Webdext.Model.findWNode(rateNode1, wTree);
    var rateNode2 = Webdext.evaluateXPath(
        '/html/body/section[2]/div/section[1]/div[2]/div[1]/table/tbody/tr[2]/td[2]/text()[1]'
    )[0];
    var wRateNode2 = Webdext.Model.findWNode(rateNode2, wTree);
    var headerNode = Webdext.evaluateXPath(
        '/html/body/section[2]/div/section[1]/div[2]/div[1]/table/thead/tr[1]/th[1]/text()[1]'
    )[0];
    var wHeaderNode = Webdext.Model.findWNode(headerNode, wTree);

    assert.ok(
        wNodeSimilarity(wCurrencyNode1, wCurrencyNode2) > THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wCurrencyNode1, wCurrencyNode2) > THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wRateNode1, wRateNode2) > THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wRateNode1, wRateNode2) > THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wCurrencyNode1, wRateNode2) > THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wCurrencyNode1, wRateNode2) > THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wCurrencyNode1, wHeaderNode) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wCurrencyNode1, wHeaderNode) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wRateNode2, wHeaderNode) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wRateNode2, wHeaderNode) <= THRESHOLDS.TEXT_NODE"
    );

});

WUnit.test("clusterWNodes", function(assert) {    
    var wTree = Webdext.Model.createWTree();
    var tbodyNode = Webdext.evaluateXPath(
        '/html/body/section[2]/div/section[1]/div[2]/div[1]/table/tbody'
    )[0];
    var wTbodyNode = Webdext.Model.findWNode(tbodyNode, wTree);
    var wTree1 = wTbodyNode.children[0];
    var wTree2 = wTbodyNode.children[1];
    var leafNodes1 = wTree1.getLeafNodes();
    var leafNodes2 = wTree2.getLeafNodes();
    var leafNodes = leafNodes1.concat(leafNodes2);
    var clusters = Webdext.Similarity.clusterWNodes(leafNodes);
    assert.strictEqual(
        clusters.length,
        1,
        "clusters.length != 1"
    );
    var allNodesInOneCluster = leafNodes.every(function(wNode) {
        return clusters[0].indexOf(wNode) > -1;
    });
    assert.ok(allNodesInOneCluster, "allNodesInOneCluster");
    var allClusterNodesInLeafNodes = clusters[0].every(function(wNode) {
        return leafNodes.indexOf(wNode) > -1;
    });
    assert.ok(allClusterNodesInLeafNodes, "allClusterNodesInLeafNodes");
});

WUnit.test("wTreeSimilarity", function(assert) {
    var THRESHOLDS = Webdext.Similarity.THRESHOLDS,
        wTreeSimilarity = Webdext.Similarity.wTreeSimilarity;
    var wTree = Webdext.Model.createWTree();
    var tbodyNode = Webdext.evaluateXPath(
        '/html/body/section[2]/div/section[1]/div[2]/div[1]/table/tbody'
    )[0];
    var wTbodyNode = Webdext.Model.findWNode(tbodyNode, wTree);
    var wTree1 = wTbodyNode.children[0];
    var wTree2 = wTbodyNode.children[1];

    var theadNode = Webdext.evaluateXPath(
        '/html/body/section[2]/div/section[1]/div[2]/div[1]/table/thead/tr[2]'
    )[0];
    var wTheadNode = Webdext.Model.findWNode(theadNode, wTree); 

    assert.ok(
        wTreeSimilarity(wTree1, wTree2) > THRESHOLDS.TREE,
        "wTreeSimilarity(wTree1, wTree2) > THRESHOLDS.TREE"
    );
    assert.ok(
        wTreeSimilarity(wTree1, wTheadNode) <= THRESHOLDS.TREE,
        "wTreeSimilarity(wTree1, wTheadNode) <= THRESHOLDS.TREE"
    );
});

WUnit.test("clusterWTrees", function(assert) {
    var clusterWTrees = Webdext.Similarity.clusterWTrees;
    var wTree = Webdext.Model.createWTree();
    var tbodyNode = Webdext.evaluateXPath(
        '/html/body/section[2]/div/section[1]/div[2]/div[1]/table/tbody'
    )[0];
    var wTbodyNode = Webdext.Model.findWNode(tbodyNode, wTree);
    var clusters = clusterWTrees(wTbodyNode.children);

    assert.strictEqual(
        clusters.length,
        1,
        "clusters.length != 1"
    );
    var allNodesInOneCluster = wTbodyNode.children.every(function(wNode) {
        return clusters[0].indexOf(wNode) > -1;
    });
    assert.ok(allNodesInOneCluster, "allNodesInOneCluster");
    var allClusterNodesInTrees = clusters[0].every(function(wNode) {
        return wTbodyNode.children.indexOf(wNode) > -1;
    });
    assert.ok(allClusterNodesInTrees, "allClusterNodesInTrees");
});

WUnit.test("filterTreeClusters", function(assert) {
    var clusterWTrees = Webdext.Similarity.clusterWTrees;
    var wTree = Webdext.Model.createWTree();
    var tbodyNode = Webdext.evaluateXPath(
        '/html/body/section[2]/div/section[1]/div[2]/div[1]/table/tbody'
    )[0];
    var wTbodyNode = Webdext.Model.findWNode(tbodyNode, wTree);
    var clusters = clusterWTrees(wTbodyNode.children);
    var wNodeSet = wTbodyNode.children.slice(1);
    var filteredCluster = Webdext.Similarity.filterTreeClusters(clusters, wNodeSet);
    assert.strictEqual(
        filteredCluster.length,
        1,
        "filteredCluster.length != 1"
    );
    assert.strictEqual(
        filteredCluster[0].length,
        wTbodyNode.children.length-1,
        "filteredCluster[0].length != wTbodyNode.children.length-1"
    );
});

WUnit.test("identifyCoarseGrainedRegions", function(assert) {
    var identifyCoarseGrainedRegions = Webdext.Extraction.identifyCoarseGrainedRegions;
    var wTree = Webdext.Model.createWTree();
    var tbodyNode = Webdext.evaluateXPath(
        '/html/body/section[2]/div/section[1]/div[2]/div[1]/table/tbody'
    )[0];
    var wTbodyNode = Webdext.Model.findWNode(tbodyNode, wTree);
    var wNodeSet = wTbodyNode.children;
    var cgrs = identifyCoarseGrainedRegions(wNodeSet);
    assert.strictEqual(cgrs.length, 1, "cgrs.length != 1");
    assert.strictEqual(
        cgrs[0].parent.valueOf(),
        "/html[1]/body[1]/section[2]/div[1]/section[1]/div[2]/div[1]/table[1]/tbody[1]",
        "cgrs[0].parent.valueOf()"
    );
    assert.strictEqual(cgrs[0].minIndex, 1, "cgrs[0].minIndex != 1");
    assert.strictEqual(cgrs[0].maxIndex, 14, "cgrs[0].maxIndex != 14");
});

WUnit.test("headBasedCRecMine", function(assert) {
    var wTree = Webdext.Model.createWTree();
    var tbodyNode = Webdext.evaluateXPath(
        '/html/body/section[2]/div/section[1]/div[2]/div[1]/table/tbody'
    )[0];
    var wTbodyNode = Webdext.Model.findWNode(tbodyNode, wTree);
    var wNodeSet = wTbodyNode.children;
    var cRecSet = Webdext.Extraction.headBasedCRecMine(wNodeSet);
    assert.strictEqual(cRecSet.size(), 14, "cRecSet.size() != 14");
    assert.strictEqual(
        cRecSet.recordSet[0].toString(),
        "USD, 13.324,00, 13.308,00, 13.459,00, 13.159,00, 13.459,00, 13.159,00",
        "cRecSet.recordSet[0].toString()"
    );
});

WUnit.test("orderBasedCRecMine", function(assert) {
    var wTree = Webdext.Model.createWTree();
    var tbodyNode = Webdext.evaluateXPath(
        '/html/body/section[2]/div/section[1]/div[2]/div[1]/table/tbody'
    )[0];
    var wTbodyNode = Webdext.Model.findWNode(tbodyNode, wTree);
    var wNodeSet = wTbodyNode.children;
    var cRecSet = Webdext.Extraction.orderBasedCRecMine(wNodeSet);
    assert.strictEqual(cRecSet.size(), 14, "cRecSet.size() != 14");
    assert.strictEqual(
        cRecSet.recordSet[0].toString(),
        "USD, 13.324,00, 13.308,00, 13.459,00, 13.159,00, 13.459,00, 13.159,00",
        "cRecSet.recordSet[0].toString()"
    );
});

WUnit.test("headOrderBasedCRecMine", function(assert) {
    var wTree = Webdext.Model.createWTree();
    var tbodyNode = Webdext.evaluateXPath(
        '/html/body/section[2]/div/section[1]/div[2]/div[1]/table/tbody'
    )[0];
    var wTbodyNode = Webdext.Model.findWNode(tbodyNode, wTree);
    var wNodeSet = wTbodyNode.children;
    var cRecSet = Webdext.Extraction.headOrderBasedCRecMine(wNodeSet);
    assert.strictEqual(cRecSet.size(), 14, "cRecSet.size() != 14");
    assert.strictEqual(
        cRecSet.recordSet[0].toString(),
        "USD, 13.324,00, 13.308,00, 13.459,00, 13.159,00, 13.459,00, 13.159,00",
        "cRecSet.recordSet[0].toString()"
    );
});

WUnit.test("integratedCRecMine", function(assert) {
    var wTree = Webdext.Model.createWTree();
    var tbodyNode = Webdext.evaluateXPath(
        '/html/body/section[2]/div/section[1]/div[2]/div[1]/table/tbody'
    )[0];
    var wTbodyNode = Webdext.Model.findWNode(tbodyNode, wTree);
    var wNodeSet = wTbodyNode.children;
    var cRecSet = Webdext.Extraction.integratedCRecMine(wNodeSet);
    assert.strictEqual(cRecSet.size(), 14, "cRecSet.size() != 14");
    assert.strictEqual(
        cRecSet.recordSet[0].toString(),
        "USD, 13.324,00, 13.308,00, 13.459,00, 13.159,00, 13.459,00, 13.159,00",
        "cRecSet.recordSet[0].toString()"
    );
});

WUnit.test("segmentCoarseGrainedRegion", function(assert) {
    var identifyCoarseGrainedRegions = Webdext.Extraction.identifyCoarseGrainedRegions,
        segmentCoarseGrainedRegion = Webdext.Extraction.segmentCoarseGrainedRegion;
    var wTree = Webdext.Model.createWTree();
    var tbodyNode = Webdext.evaluateXPath(
        '/html/body/section[2]/div/section[1]/div[2]/div[1]/table/tbody'
    )[0];
    var wTbodyNode = Webdext.Model.findWNode(tbodyNode, wTree);
    var wNodeSet = wTbodyNode.children;
    var cgrs = identifyCoarseGrainedRegions(wNodeSet);
    var cRecSet = segmentCoarseGrainedRegion(cgrs[0]);
    assert.strictEqual(cRecSet.size(), 14, "cRecSet.size() != 14");
    assert.strictEqual(
        cRecSet.recordSet[0].toString(),
        "USD, 13.324,00, 13.308,00, 13.459,00, 13.159,00, 13.459,00, 13.159,00",
        "cRecSet.recordSet[0].toString()"
    );
});

WUnit.test("extractDataRecords", function(assert) {
    var recSetList = Webdext.Extraction.extractDataRecords();
    assert.strictEqual(recSetList.length, 13, "recSetList.length != 13");
    assert.strictEqual(recSetList[1].size(), 14, "recSetList[5].size() != 14");
    assert.strictEqual(
        recSetList[1].recordSet[0].toString(),
        "USD, 13.324,00, 13.308,00, 13.459,00, 13.159,00, 13.459,00, 13.159,00",
        "recSetList[1].recordSet[0] != ..."
    );
    assert.strictEqual(
        recSetList[1].recordSet[1].toString(),
        "SGD, 9.552,79, 9.532,79, 9.573,60, 9.495,60, 9.653,00, 9.430,00",
        "recSetList[1].recordSet[1] != ..."
    );
    assert.strictEqual(
        recSetList[1].recordSet[13].toString(),
        "CNY, 1.995,42, 1.875,42, 2.017,65, 1.852,55, 1.991,00, 1.863,00",
        "recSetList[1].recordSet[13] != ..."
    );
    assert.strictEqual(
        recSetList[1].recordSet[12].toString(),
        "SAR, 3.590,81, 3.510,81, 3.601,25, 3.497,25, 3.628,00, 3.458,00",
        "recSetList[1].recordSet[12] != ..."
    );
});

WUnit.test("extract", function(assert) {
    var recSetList = Webdext.extract();
    assert.strictEqual(recSetList.length, 13, "recSetList.length != 13");
    assert.strictEqual(recSetList[1].size(), 14, "recSetList[5].size() != 14");
    assert.strictEqual(
        recSetList[1].recordSet[0].dataItems[0].dataContent,
        "USD",
        "recSetList[1].recordSet[0].dataItems[0].dataContent != USD"
    );
    assert.strictEqual(
        recSetList[1].recordSet[0].dataItems[6].dataContent,
        "13.159,00",
        "recSetList[1].recordSet[0].dataItems[6].dataContent != 13.159,00"
    );
    assert.strictEqual(
        recSetList[1].recordSet[13].dataItems[0].dataContent,
        "CNY",
        "recSetList[1].recordSet[0].dataItems[0].dataContent != CNY"
    );
    assert.strictEqual(
        recSetList[1].recordSet[13].dataItems[6].dataContent,
        "1.863,00",
        "recSetList[1].recordSet[13].dataItems[6].dataContent != 1.863,00"
    );
});

// headBasedCRecMine === orderBasedCRecMine
console.log("End BCA test");
