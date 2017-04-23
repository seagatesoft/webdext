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
console.log("End BCA test");
