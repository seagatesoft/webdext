console.log("Start TBDW 1 test");
WUnit.test("wNodeSimilarity", function(assert) {
    var THRESHOLDS = Webdext.Similarity.THRESHOLDS,
        wNodeSimilarity = Webdext.Similarity.wNodeSimilarity;

    var wTree = Webdext.Model.createWTree();

    var titleNode1 = Webdext.evaluateXPath(
        '/html/body/table[4]/tbody/tr/td[2]/blockquote/p[1]/a/b/text()[1]'
    )[0];
    var wTitleNode1 = Webdext.Model.findWNode(titleNode1, wTree);
    var titleNode2 = Webdext.evaluateXPath(
        '/html/body/table[4]/tbody/tr/td[2]/blockquote/p[2]/a/b/text()[1]'
    )[0];
    var wTitleNode2 = Webdext.Model.findWNode(titleNode2, wTree);

    var descNode1 = Webdext.evaluateXPath(
        '/html/body/table[4]/tbody/tr/td[2]/blockquote/p[1]/text()[5]'
    )[0];
    var wDescNode1 = Webdext.Model.findWNode(descNode1, wTree);
    var descNode2 = Webdext.evaluateXPath(
        '/html/body/table[4]/tbody/tr/td[2]/blockquote/p[2]/text()[5]'
    )[0];
    var wDescNode2 = Webdext.Model.findWNode(descNode2, wTree);

    var urlNode1 = Webdext.evaluateXPath(
        '/html/body/table[4]/tbody/tr/td[2]/blockquote/p[1]/font[1]/text()[2]'
    )[0];
    var wUrlNode1 = Webdext.Model.findWNode(urlNode1, wTree);
    var urlNode2 = Webdext.evaluateXPath(
        '/html/body/table[4]/tbody/tr/td[2]/blockquote/p[2]/font[1]/text()[2]'
    )[0];
    var wUrlNode2 = Webdext.Model.findWNode(urlNode2, wTree);

    var pageSizeNode1 = Webdext.evaluateXPath(
        '/html/body/table[4]/tbody/tr/td[2]/blockquote/p[1]/font[2]/text()[1]'
    )[0];
    var wPageSizeNode1 = Webdext.Model.findWNode(pageSizeNode1, wTree);
    var pageSizeNode2 = Webdext.evaluateXPath(
        '/html/body/table[4]/tbody/tr/td[2]/blockquote/p[2]/font[2]/text()[1]'
    )[0];
    var wPageSizeNode2 = Webdext.Model.findWNode(pageSizeNode2, wTree);

    var ratingNode1 = Webdext.evaluateXPath(
        '/html/body/table[4]/tbody/tr/td[2]/blockquote/p[1]/font[2]/font/text()[1]'
    )[0];
    var wRatingNode1 = Webdext.Model.findWNode(ratingNode1, wTree);
    var ratingNode2 = Webdext.evaluateXPath(
        '/html/body/table[4]/tbody/tr/td[2]/blockquote/p[2]/font[2]/font/text()[1]'
    )[0];
    var wRatingNode2 = Webdext.Model.findWNode(ratingNode2, wTree);

    var percentNode1 = Webdext.evaluateXPath(
        '/html/body/table[4]/tbody/tr/td[2]/blockquote/p[1]/font[2]/font/b/text()[1]'
    )[0];
    var wPercentNode1 = Webdext.Model.findWNode(percentNode1, wTree);
    var percentNode2 = Webdext.evaluateXPath(
        '/html/body/table[4]/tbody/tr/td[2]/blockquote/p[17]/font[2]/font/b/text()[1]'
    )[0];
    var wPercentNode2 = Webdext.Model.findWNode(percentNode2, wTree);

    var titleLinkNode1 = Webdext.evaluateXPath(
        '/html/body/table[4]/tbody/tr/td[2]/blockquote/p[1]/a[1]'
    )[0];
    var wTitleLinkNode1 = Webdext.Model.findWNode(titleLinkNode1, wTree).children[0];
    var titleLinkNode2 = Webdext.evaluateXPath(
        '/html/body/table[4]/tbody/tr/td[2]/blockquote/p[2]/a[1]'
    )[0];
    var wTitleLinkNode2 = Webdext.Model.findWNode(titleLinkNode2, wTree).children[0];

    var translateLinkNode1 = Webdext.evaluateXPath(
        '/html/body/table[4]/tbody/tr/td[2]/blockquote/p[1]/font[2]/a[1]'
    )[0];
    var wTranslateLinkNode1 = Webdext.Model.findWNode(translateLinkNode1, wTree).children[0];
    var translateLinkNode2 = Webdext.evaluateXPath(
        '/html/body/table[4]/tbody/tr/td[2]/blockquote/p[2]/font[2]/a[1]'
    )[0];
    var wTranslateLinkNode2 = Webdext.Model.findWNode(translateLinkNode2, wTree).children[0];

    assert.ok(
        wNodeSimilarity(wTitleNode1, wTitleNode2) > THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wTitleNode1, wTitleNode2) > THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wDescNode1, wDescNode2) > THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wDescNode1, wDescNode2) > THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wUrlNode1, wUrlNode2) > THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wUrlNode1, wUrlNode2) > THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wPageSizeNode1, wPageSizeNode2) > THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wPageSizeNode1, wPageSizeNode2) > THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wRatingNode1, wRatingNode2) > THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wRatingNode1, wRatingNode2) > THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wPercentNode1, wPercentNode2) > THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wPercentNode1, wPercentNode2) > THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wTitleNode1, wDescNode2) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wTitleNode1, wDescNode2) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wTitleNode2, wDescNode1) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wTitleNode2, wDescNode1) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wTitleNode1, wUrlNode2) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wTitleNode1, wUrlNode2) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wTitleNode2, wUrlNode1) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wTitleNode2, wUrlNode1) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wTitleNode1, wPageSizeNode2) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wTitleNode1, wPageSizeNode2) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wTitleNode2, wPageSizeNode1) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wTitleNode2, wPageSizeNode1) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wTitleNode1, wRatingNode2) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wTitleNode1, wRatingNode2) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wTitleNode2, wRatingNode1) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wTitleNode2, wRatingNode1) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wTitleNode1, wPercentNode2) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wTitleNode1, wPercentNode2) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wTitleNode2, wPercentNode1) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wTitleNode2, wPercentNode1) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wDescNode1, wUrlNode2) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wDescNode1, wUrlNode2) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wDescNode2, wUrlNode1) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wDescNode2, wUrlNode1) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wDescNode1, wPageSizeNode2) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wDescNode1, wPageSizeNode2) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wDescNode2, wPageSizeNode1) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wDescNode2, wPageSizeNode1) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wDescNode1, wRatingNode2) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wDescNode1, wRatingNode2) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wDescNode2, wRatingNode1) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wDescNode2, wRatingNode1) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wDescNode1, wPercentNode2) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wDescNode1, wPercentNode2) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wDescNode2, wRatingNode1) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wDescNode2, wRatingNode1) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wPageSizeNode1, wRatingNode2) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wPageSizeNode1, wRatingNode2) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wPageSizeNode2, wRatingNode1) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wPageSizeNode2, wRatingNode1) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wPageSizeNode1, wPercentNode2) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wPageSizeNode1, wPercentNode2) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wPageSizeNode2, wPercentNode1) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wPageSizeNode2, wPercentNode1) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wRatingNode1, wPercentNode2) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wRatingNode1, wPercentNode2) <= THRESHOLDS.TEXT_NODE"
    );
    assert.ok(
        wNodeSimilarity(wRatingNode2, wPercentNode1) <= THRESHOLDS.TEXT_NODE,
        "wNodeSimilarity(wRatingNode2, wPercentNode1) <= THRESHOLDS.TEXT_NODE"
    );

    assert.ok(
        wNodeSimilarity(wTitleLinkNode1, wTitleLinkNode2) > THRESHOLDS.HYPERLINK_NODE,
        "wNodeSimilarity(wTitleLinkNode1, wTitleLinkNode2) > THRESHOLDS.HYPERLINK_NODE"
    );
    assert.ok(
        wNodeSimilarity(wTranslateLinkNode1, wTranslateLinkNode2) > THRESHOLDS.HYPERLINK_NODE,
        "wNodeSimilarity(wTranslateLinkNode1, wTranslateLinkNode2) > THRESHOLDS.HYPERLINK_NODE"
    );
    assert.ok(
        wNodeSimilarity(wTitleLinkNode1, wTranslateLinkNode2) <= THRESHOLDS.HYPERLINK_NODE,
        "wNodeSimilarity(wTitleLinkNode1, wTranslateLinkNode2) <= THRESHOLDS.HYPERLINK_NODE"
    );
    assert.ok(
        wNodeSimilarity(wTitleLinkNode2, wTranslateLinkNode1) <= THRESHOLDS.HYPERLINK_NODE,
        "wNodeSimilarity(wTitleLinkNode2, wTranslateLinkNode1) <= THRESHOLDS.HYPERLINK_NODE"
    );
});

WUnit.test("wTreeSimilarity", function(assert) {
    var THRESHOLDS = Webdext.Similarity.THRESHOLDS,
        wTreeSimilarity = Webdext.Similarity.wTreeSimilarity;
    var wTree = Webdext.Model.createWTree();
    var parentNode = Webdext.evaluateXPath('/html/body/table[4]/tbody/tr/td[2]/blockquote')[0];
    var wParentNode = Webdext.Model.findWNode(parentNode, wTree);
    var wTree1 = wParentNode.children[0];
    var wTree2 = wParentNode.children[1];
    var wTree3 = wParentNode.children[2];
    var wTree4 = wParentNode.children[20];
    var wTree5 = wParentNode.children[21];
    var wTree6 = wParentNode.children[22];

    assert.ok(
        wTreeSimilarity(wTree1, wTree2) <= THRESHOLDS.TREE,
        "wTreeSimilarity(wTree1, wTree2) <= THRESHOLDS.TREE"
    );
    assert.ok(
        wTreeSimilarity(wTree2, wTree3) > THRESHOLDS.TREE,
        "wTreeSimilarity(wTree2, wTree3) > THRESHOLDS.TREE"
    );
    assert.ok(
        wTreeSimilarity(wTree2, wTree4) > THRESHOLDS.TREE,
        "wTreeSimilarity(wTree2, wTree4) > THRESHOLDS.TREE"
    );
    assert.ok(
        wTreeSimilarity(wTree2, wTree5) <= THRESHOLDS.TREE,
        "wTreeSimilarity(wTree2, wTree5) <= THRESHOLDS.TREE"
    );
    assert.ok(
        wTreeSimilarity(wTree2, wTree6) <= THRESHOLDS.TREE,
        "wTreeSimilarity(wTree2, wTree6) <= THRESHOLDS.TREE"
    );

    assert.ok(
        wTreeSimilarity(wTree3, wTree4) > THRESHOLDS.TREE,
        "wTreeSimilarity(wTree3, wTree4) > THRESHOLDS.TREE"
    );
    assert.ok(
        wTreeSimilarity(wTree3, wTree5) <= THRESHOLDS.TREE,
        "wTreeSimilarity(wTree3, wTree5) <= THRESHOLDS.TREE"
    );
    assert.ok(
        wTreeSimilarity(wTree3, wTree6) <= THRESHOLDS.TREE,
        "wTreeSimilarity(wTree3, wTree6) <= THRESHOLDS.TREE"
    );
});

WUnit.test("clusterWTrees", function(assert) {
    var clusterWTrees = Webdext.Similarity.clusterWTrees;
    var wTree = Webdext.Model.createWTree();
    var parentNode = Webdext.evaluateXPath('/html/body/table[4]/tbody/tr/td[2]/blockquote')[0];
    var wParentNode = Webdext.Model.findWNode(parentNode, wTree);
    var clusters = clusterWTrees(wParentNode.children);
    var atLeast1ClusterHas20Tree = clusters.some(function(c) {
        return c.length === 20;
    });
    assert.ok(atLeast1ClusterHas20Tree, "atLeast1ClusterHas20Tree");
});

WUnit.test("filterTreeClusters", function(assert) {
    var clusterWTrees = Webdext.Similarity.clusterWTrees;
    var wTree = Webdext.Model.createWTree();
    var parentNode = Webdext.evaluateXPath('/html/body/table[4]/tbody/tr/td[2]/blockquote')[0];
    var wParentNode = Webdext.Model.findWNode(parentNode, wTree);
    var clusters = clusterWTrees(wParentNode.children);
    var wNodeSet = wParentNode.children.slice(1, 21);
    var filteredCluster = Webdext.Similarity.filterTreeClusters(clusters, wNodeSet);
    assert.strictEqual(
        filteredCluster.length,
        1,
        "filteredCluster.length != 1"
    );
    assert.strictEqual(
        filteredCluster[0].length,
        20,
        "filteredCluster[0].length != 20"
    );
});
console.log("End TBDW 1 test");
