;(function(undefined) {
    "use strict";

    // imports
    var DATA_TYPE = Webdext.Model.DATA_TYPE,
        getValueFromPairMap = Webdext.getValueFromPairMap,
        sequenceEditDistance = Webdext.Sequal.editDistance;

    var WEIGHTS = {
        DATA_TYPE: 1,
        DATA_CONTENT: 0.64,
        TAG_PATH: 0.48,
        PRESENTATION_STYLE: 0.81,
        RECTANGLE_SIZE: 0.81
    };
    var TOTAL_WEIGHTS = {
        TEXT: WEIGHTS.DATA_TYPE + WEIGHTS.DATA_CONTENT + WEIGHTS.PRESENTATION_STYLE,
        HYPERLINK: WEIGHTS.DATA_TYPE + WEIGHTS.DATA_CONTENT + WEIGHTS.PRESENTATION_STYLE,
        IMAGE: WEIGHTS.DATA_TYPE + WEIGHTS.DATA_CONTENT + WEIGHTS.RECTANGLE_SIZE
    };
    var THRESHOLDS = {
        ELEMENT_NODE: 0.99,
        TEXT_NODE: 0.735,
        HYPERLINK_NODE: 0.9,
        IMAGE_NODE: 0.9,
        TREE: 0.5,
    };
    var MATCH_WEIGHTS = {
        VISUALLY_ALIGNED: 3,
        NOT_VISUALLY_ALIGNED: 0.1
    };

    var treeClusterMap = new Map();

    function dotProduct(tfv1, tfv2) {
        var terms1 = Object.keys(tfv1),
            terms2 = Object.keys(tfv2),
            longerTerms = terms1,
            shorterTerms = terms2,
            terms1Length = terms1.length,
            terms2Length = terms2.length,
            shorterTermsLength = terms2Length;

        if (terms1Length < terms2Length) {
            longerTerms = terms2;
            shorterTerms = terms1;
            shorterTermsLength = terms1Length;
        }

        var dotProduct = 0;
        for (var i=shorterTermsLength; i--; ) {
            var term = shorterTerms[i];
            if (longerTerms.indexOf(term) > -1) {
                dotProduct += tfv1[term] * tfv2[term];
            }
        }

        return dotProduct;
    }

    function cosineSimilarity(wNode1, wNode2) {
        var tfv1 = wNode1.termFrequencyVector,
            tfv2 = wNode2.termFrequencyVector,
            dp = dotProduct(tfv1, tfv2);

        if (dp === 0) {
            return 0;
        }

        return dp / (wNode1.normVector * wNode2.normVector);
    }

    function urlSimilarity(url1, url2) {
        if (url1 === null && url2 === null) {
            return 1;
        } else if (url1 === null || url2 === null) {
            return 0;
        }

        var hostNameSimilarity = url1.hostname === url2.hostname ? 1 : 0;
        var pathNameSimilarity = url1.pathname === url2.pathname ? 1 : 0.5;
        // var pathNameEditDistance = sequenceEditDistance(url1.pathname, url2.pathname);
        // var normalizedEditDistance = pathNameEditDistance / (
        //     url1.pathname.length + url2.pathname.length
        // );
        // var pathNameSimilarity = 1 - normalizedEditDistance;

        return (hostNameSimilarity + pathNameSimilarity) / 2;
    }

    function tagPathSubstitutionCost(e1, e2) {
        if (e1.value === e2.value) {
            return 0;
        } else {
            return 2;
        }
    }

    function tagPathInsertionCost() {
        return 1;
    }

    function tagPathDeletionCost() {
        return 1;
    }

    function tagPathEditDistance(tp1, tp2) {
        return sequenceEditDistance(
            tp1,
            tp2,
            tagPathSubstitutionCost,
            tagPathInsertionCost,
            tagPathDeletionCost
        );
    }

    function tagPathSimilarity(tp1, tp2) {
        if (tp1.length === 0 && tp2.length === 0) {
            return 1;
        }

        var editDistance = tagPathEditDistance(tp1, tp2);

        return 1.0 - (editDistance / (tp1.length + tp2.length));
    }

    function presentationStyleSimilarity(ps1, ps2) {
        var styles = Object.keys(ps1);
        var stylesLength = styles.length,
            similarStylesCount = 0;

        for (var i=stylesLength; i--; ) {
            var style = styles[i];
            if (ps1[style] === ps2[style]) {
                similarStylesCount++;
            }
        }

        return similarStylesCount / stylesLength;
    }

    function rectangleSizeSimilarity(rs1, rs2) {
        var maxWidth = Math.max(rs1.width, rs2.width);
        var normalizedWidthDiff = 0;
        if (maxWidth !== 0) {
            normalizedWidthDiff = Math.abs(rs1.width - rs2.width) / maxWidth;
        }

        var maxHeight = Math.max(rs1.height, rs2.height);
        var normalizedHeightDiff = 0;
        if (maxHeight !== 0) {
            normalizedHeightDiff = Math.abs(rs1.height - rs2.height) / maxHeight;
        }

        return 1 - ((normalizedWidthDiff + normalizedHeightDiff) / 2);
    }

    function wElementNodeSimilarity(wen1, wen2) {
        return wen1.tagName === wen2.tagName ? 1 : 0;
    }

    function wTextNodeSimilarity(wtn1, wtn2) {
        var cosineSim = cosineSimilarity(wtn1, wtn2);
        var weightedCosineSim = cosineSim * WEIGHTS.DATA_CONTENT;

        // var tagPathSim = tagPathSimilarity(wtn1.tagPath, wtn2.tagPath);
        // var weightedTagPathSim = tagPathSim * WEIGHTS.TAG_PATH;

        var psSim = presentationStyleSimilarity(wtn1.presentationStyle, wtn2.presentationStyle);
        var weightedPSSim = psSim * WEIGHTS.PRESENTATION_STYLE;

        // var totalSim = weightedCosineSim + weightedTagPathSim + weightedPSSim + WEIGHTS.DATA_TYPE;
        var totalSim = weightedCosineSim + weightedPSSim + WEIGHTS.DATA_TYPE;

        return totalSim / TOTAL_WEIGHTS.TEXT;
    }

    function wHyperlinkNodeSimilarity(whn1, whn2) {
        var urlSim = urlSimilarity(whn1.href, whn2.href);
        var weightedUrlSim = urlSim * WEIGHTS.DATA_CONTENT;

        // var tagPathSim = tagPathSimilarity(whn1.tagPath, whn2.tagPath);
        // var weightedTagPathSim = tagPathSim * WEIGHTS.TAG_PATH;

        var psSim = presentationStyleSimilarity(whn1.presentationStyle, whn2.presentationStyle);
        var weightedPSSim = psSim * WEIGHTS.PRESENTATION_STYLE;

        // var totalSim = weightedUrlSim + weightedTagPathSim + weightedPSSim + WEIGHTS.DATA_TYPE;
        var totalSim = weightedUrlSim + weightedPSSim + WEIGHTS.DATA_TYPE;

        return totalSim / TOTAL_WEIGHTS.HYPERLINK;
    }

    function wImageNodeSimilarity(win1, win2) {
        var urlSim = urlSimilarity(win1.src, win2.src);
        var weightedUrlSim = urlSim * WEIGHTS.DATA_CONTENT;

        // var tagPathSim = tagPathSimilarity(win1.tagPath, win2.tagPath);
        // var weightedTagPathSim = tagPathSim * WEIGHTS.TAG_PATH;

        var rsSim = rectangleSizeSimilarity(win1.rectangleSize, win2.rectangleSize);
        var weightedRSSim = rsSim * WEIGHTS.RECTANGLE_SIZE;

        // var totalSim = weightedUrlSim + weightedTagPathSim + weightedRSSim + WEIGHTS.DATA_TYPE;
        var totalSim = weightedUrlSim + weightedRSSim + WEIGHTS.DATA_TYPE;

        return totalSim / TOTAL_WEIGHTS.IMAGE;
    }


    function wNodeSimilarity(wNode1, wNode2) {
        if (wNode1.dataType !== wNode2.dataType) {
            return 0;
        }

        if (wNode1.dataType === DATA_TYPE.TEXT) {
            return wTextNodeSimilarity(wNode1, wNode2);
        } else if (wNode1.dataType === DATA_TYPE.HYPERLINK) {
            return wHyperlinkNodeSimilarity(wNode1, wNode2);
        } else if (wNode1.dataType === DATA_TYPE.IMAGE) {
            return wImageNodeSimilarity(wNode1, wNode2);
        } else {
            return wElementNodeSimilarity(wNode1, wNode2);
        }
    }

    function SimilarityMap(similarityFunction) {
        this.map = new Map();
        this.similarityFunction = similarityFunction;
    }
    SimilarityMap.prototype.get = function(wNode1, wNode2) {
        if (this.map.has(wNode1) && this.map.get(wNode1).has(wNode2)) {
            return this.map.get(wNode1).get(wNode2);
        } else if (this.map.has(wNode2) && this.map.get(wNode2).has(wNode1)) {
            return this.map.get(wNode2).get(wNode1);
        }

        var similarity = this.similarityFunction(wNode1, wNode2);
        if (this.map.has(wNode1)) {
            this.map.get(wNode1).set(wNode2, similarity);
        } else if (this.map.has(wNode2)) {
            this.map.get(wNode2).set(wNode1, similarity);
        } else {
            var innerMap = new Map();
            innerMap.set(wNode2, similarity);
            this.map.set(wNode1, innerMap);
        }

        return similarity;
    };

    var wTextNodeSimilarityMap = new SimilarityMap(wTextNodeSimilarity);
    var wHyperlinkNodeSimilarityMap = new SimilarityMap(wHyperlinkNodeSimilarity);
    var wImageNodeSimilarityMap = new SimilarityMap(wImageNodeSimilarity);

    function memoizedWTextNodeSimilarity(wNode1, wNode2) {
        return wTextNodeSimilarityMap.get(wNode1, wNode2);
    }

    function memoizedWHyperlinkNodeSimilarity(wNode1, wNode2) {
        return wHyperlinkNodeSimilarityMap.get(wNode1, wNode2);
    }

    function memoizedWImageNodeSimilarity(wNode1, wNode2) {
        return wImageNodeSimilarityMap.get(wNode1, wNode2);
    }

    /*
    * Complexity = cluster1.length * cluster2.length
    */
    function clusterSimilarity(cluster1, cluster2, dataSimilarityFunc) {
        var sum = 0,
            cluster1Length = cluster1.length,
            cluster2Length = cluster2.length;

        for (var i=cluster1Length; i--; ) {
            for (var j=cluster2Length; j--; ) {
                sum += dataSimilarityFunc(cluster1[i], cluster2[j]);
            }
        }

        return sum / (cluster1Length * cluster2Length);
    }

    function findClusters(
        data, similarityThreshold, clusterSimilarityFunc, dataSimilarityFunc
    ) {
        var clusters = [],
            dataLength = data.length,
            simPairMap = new Map();

        for (var i=0; i < dataLength; i++) {
            clusters.push([data[i]]);
        }

        if (dataLength === 1) {
            return clusters;
        }

        // get distance for all possible pairs
        // consider removing this and rely on memoization
        for (i=0; i < dataLength-1; i++) {
            var innerMap = new Map();

            for (var j=i+1; j < dataLength; j++) {
                var similarity = dataSimilarityFunc(data[i], data[j]);
                innerMap.set(data[j], similarity);
            }

            simPairMap.set(data[i], innerMap);
        }

        // get nearest neighbor for each 1-element cluster
        var nearestNeighbors = new Map();
        for (i=0; i < dataLength; i++) {
            var maxSimilarity = Number.MIN_VALUE,
                nnIndex = i;

            for (j=0; j < dataLength; j++) {
                if (i !== j) {
                    var currSimilarity = getValueFromPairMap(
                        simPairMap,
                        data[i],
                        data[j]
                    );
                    if (currSimilarity > maxSimilarity) {
                        maxSimilarity = currSimilarity;
                        nnIndex = j;
                    }
                }
            }

            nearestNeighbors.set(
                clusters[i],
                {cluster: clusters[nnIndex], similarity: maxSimilarity}
            );
        }

        var csf = function(c1, c2) {
            return clusterSimilarityFunc(c1, c2, dataSimilarityFunc);
        };
        var clusterSimMap = new SimilarityMap(csf);

        while (clusters.length > 1) {
            var maxSimilarity = Number.MIN_VALUE,
                toMerge1 = null,
                toMerge2 = null;

            // find pair with maximum similarity
            var entryIterator = nearestNeighbors.entries(),
                entry = entryIterator.next();

            while (!entry.done) {
                var nn = entry.value[1];

                // consider speed up when similarity == 1
                if (nn.similarity > maxSimilarity) {
                    toMerge1 = entry.value[0];
                    toMerge2 = nn.cluster;
                    maxSimilarity = nn.similarity;
                }

                entry = entryIterator.next();
            }

            // stop clustering
            if (maxSimilarity <= similarityThreshold) {
                break;
            }

            // merging
            clusters.splice(clusters.indexOf(toMerge2), 1);
            toMerge1.push.apply(toMerge1, toMerge2);
            nearestNeighbors.delete(toMerge2);

            // find clusters whose nearest neighbor may be affected by merging
            var affectedClusters = [],
                newClusterLength = clusters.length;

            for (i=newClusterLength; i--; ) {
                var c = clusters[i];
                if (c !== toMerge1) {
                    var nn = nearestNeighbors.get(c).cluster;
                    if (nn === toMerge1 || nn === toMerge2) {
                        affectedClusters.push(c);
                    }
                }
            }

            affectedClusters.push(toMerge1);
            var acLength = affectedClusters.length;

            // update nearest neighbor for affected cluster
            for (i=acLength; i--; ) {
                var ac = affectedClusters[i],
                    maxSimilarity = Number.MIN_VALUE,
                    nnIndex;

                for (j=newClusterLength; j--; ) {
                    if (ac !== clusters[j]) {
                        var currSimilarity = clusterSimMap.get(ac, clusters[j]);
                        if (currSimilarity > maxSimilarity) {
                            maxSimilarity = currSimilarity;
                            nnIndex = j;
                        }
                    }
                }

                nearestNeighbors.set(
                    ac,
                    {cluster: clusters[nnIndex], similarity: maxSimilarity}
                );
            }
        }

        return clusters;
    }

    function clusterWNodes(wNodeSet) {
        var wTextNodes = [],
            wHyperlinkNodes = [],
            wImageNodes = [],
            wElementNodes = [],
            wNodeSetLength = wNodeSet.length;

        for (var i=0; i < wNodeSetLength; i++) {
            var wNode = wNodeSet[i];

            if (wNode.dataType === DATA_TYPE.TEXT) {
                wTextNodes.push(wNode);
            } else if (wNode.dataType === DATA_TYPE.HYPERLINK) {
                wHyperlinkNodes.push(wNode);
            } else if (wNode.dataType === DATA_TYPE.IMAGE) {
                wImageNodes.push(wNode);
            } else {
                wElementNodes.push(wNode);
            }
        }

        var elementClusters = [],
            textClusters = [],
            hyperlinkClusters = [],
            imageClusters = [];

        if (wElementNodes.length > 0) {
            elementClusters = findClusters(
                wElementNodes,
                THRESHOLDS.ELEMENT_NODE,
                clusterSimilarity,
                wElementNodeSimilarity
            );
        }

        if (wTextNodes.length > 0) {
            textClusters = findClusters(
                wTextNodes,
                THRESHOLDS.TEXT_NODE,
                clusterSimilarity,
                memoizedWTextNodeSimilarity
            );
        }

        if (wHyperlinkNodes.length > 0) {
            hyperlinkClusters = findClusters(
                wHyperlinkNodes,
                THRESHOLDS.HYPERLINK_NODE,
                clusterSimilarity,
                memoizedWHyperlinkNodeSimilarity
            );
        }

        if (wImageNodes.length > 0) {
            imageClusters = findClusters(
                wImageNodes,
                THRESHOLDS.IMAGE_NODE,
                clusterSimilarity,
                memoizedWImageNodeSimilarity
            );
        }

        var clusters = [];
        clusters.push.apply(clusters, elementClusters);
        clusters.push.apply(clusters, textClusters);
        clusters.push.apply(clusters, hyperlinkClusters);
        clusters.push.apply(clusters, imageClusters);

        return clusters;
    }

    /**
    * Complexity: 
    */
    function wTreeSimilarity(wTree1, wTree2) {
        var leafNodes1 = [],
            leafNodes2 = [];

        if (Array.isArray(wTree1)) {
            for (var i=0, wTree1Length=wTree1.length; i < wTree1Length; i++) {
                leafNodes1.push.apply(leafNodes1, wTree1[i].getLeafNodes());
            }
        } else {
            leafNodes1 = wTree1.getLeafNodes();
        }

        if (Array.isArray(wTree2)) {
            for (var i=0, wTree2Length=wTree2.length; i < wTree2Length; i++) {
                leafNodes2.push.apply(leafNodes2, wTree2[i].getLeafNodes());
            }
        } else {
            leafNodes2 = wTree2.getLeafNodes();
        }

        var leafNodes1Length = leafNodes1.length,
            leafNodes2Length = leafNodes2.length;

        for (var i=leafNodes1Length; i--; ) {
            leafNodes1[i].inTree1 = true;
        }

        for (i=leafNodes2Length; i--; ) {
            leafNodes2[i].inTree1 = false;
        }

        var leafNodesSet = leafNodes1.concat(leafNodes2);
        var leafNodeClusters = clusterWNodes(leafNodesSet);
        var leafNodeClustersLength = leafNodeClusters.length,
            nOfCluster1 = 0,
            nOfCluster2 = 0,
            nOfCluster1And2 = 0;

        for (i=leafNodeClustersLength; i--; ) {
            var cluster = leafNodeClusters[i];
            var containsTree1Node = cluster.some(function(wNode) {
                return wNode.inTree1;
            });
            var containsTree2Node = cluster.some(function(wNode) {
                return !wNode.inTree1;
            });
            var containsBoth = containsTree1Node && containsTree2Node;

            if (containsBoth) {
                nOfCluster1++;
                nOfCluster2++;
                nOfCluster1And2++;
            } else if (containsTree1Node) {
                nOfCluster1++;
            } else if (containsTree2Node) {
                nOfCluster2++;
            }
        }

        for (i=leafNodes1Length+leafNodes2Length; i--; ) {
            delete leafNodesSet[i].inTree1;
        }

        return nOfCluster1And2 / Math.max(nOfCluster1, nOfCluster2);
    }

    var wTreeSimilarityMap = new SimilarityMap(wTreeSimilarity);

    function memoizedWTreeSimilarity(wTree1, wTree2) {
        return wTreeSimilarityMap.get(wTree1, wTree2);
    }

    function filterTreeClusters(clusters, wNodeSet) {
        var clustersLength = clusters.length,
            filteredClusters = [];

        for (var i=0; i < clustersLength; i++) {
            var cluster = clusters[i],
                clusterLength = cluster.length,
                filteredCluster = [];

            for (var j=0; j < clusterLength; j++) {
                if (wNodeSet.indexOf(cluster[j]) > -1) {
                    filteredCluster.push(cluster[j]);
                }
            }

            if (filteredCluster.length > 0) {
                filteredClusters.push(filteredCluster);
            }
        }

        return filteredClusters;
    }

    function clusterWTrees(wNodeSet) {
        var parent = wNodeSet[0].parent;
        var clusters = treeClusterMap.get(parent);

        if (clusters) {
            if (parent.getChildrenCount() === wNodeSet.length) {
                return clusters;
            } else {
                return filterTreeClusters(clusters, wNodeSet);
            }
        }

        clusters = findClusters(
            wNodeSet,
            THRESHOLDS.TREE,
            clusterSimilarity,
            memoizedWTreeSimilarity
        );
        
        if (parent.getChildrenCount() === wNodeSet.length) {
            treeClusterMap.set(parent, clusters);
        }

        return clusters;
    }

    function wNodeMatchWeight(wNode1, wNode2) {
        if (wNode1.dataType && wNode2.dataType) {
            return wNodeSimilarity(wNode1, wNode2);
        }
        else {
            if (wNode1.tagName !== wNode2.tagName) {
                return 0;
            }

            var isSameLeftCoord = wNode1.coordinate.left === wNode2.coordinate.left;
            var isSameTopCoord = wNode1.coordinate.top === wNode2.coordinate.top;

            if (isSameLeftCoord || isSameTopCoord) {
                return MATCH_WEIGHTS.VISUALLY_ALIGNED;
            } else {
                return MATCH_WEIGHTS.NOT_VISUALLY_ALIGNED;
            }
        }
    }

    // exports
    Webdext.Similarity = {
        THRESHOLDS: THRESHOLDS,

        dotProduct: dotProduct,
        cosineSimilarity: cosineSimilarity,
        urlSimilarity: urlSimilarity,
        tagPathEditDistance: tagPathEditDistance,
        tagPathSimilarity: tagPathSimilarity,
        presentationStyleSimilarity: presentationStyleSimilarity,
        rectangleSizeSimilarity: rectangleSizeSimilarity,

        SimilarityMap: SimilarityMap,

        wElementNodeSimilarity: wElementNodeSimilarity,
        wTextNodeSimilarity: wTextNodeSimilarity,
        wHyperlinkNodeSimilarity: wHyperlinkNodeSimilarity,
        wImageNodeSimilarity: wImageNodeSimilarity,
        wNodeSimilarity: wNodeSimilarity,
        memoizedWTextNodeSimilarity: memoizedWTextNodeSimilarity,
        memoizedWHyperlinkNodeSimilarity: memoizedWHyperlinkNodeSimilarity,
        memoizedWImageNodeSimilarity: memoizedWImageNodeSimilarity,

        wNodeMatchWeight: wNodeMatchWeight,

        // @TODO add test
        clusterSimilarity: clusterSimilarity,
        // @TODO add test
        findClusters: findClusters,
        clusterWNodes: clusterWNodes,

        wTreeSimilarity: wTreeSimilarity,
        memoizedWTreeSimilarity: memoizedWTreeSimilarity,
        filterTreeClusters: filterTreeClusters,
        clusterWTrees: clusterWTrees
    };
}).call(this);
