;(function(undefined) {
    "use strict";

    // imports
    var evaluateXPath = Webdext.evaluateXPath,
        DATA_TYPE = Webdext.Model.DATA_TYPE,
        WNode = Webdext.Model.WNode,
        WElementNode = Webdext.Model.WElementNode,
        createWTree = Webdext.Model.createWTree,
        findWNode = Webdext.Model.findWNode,
        THRESHOLDS = Webdext.Similarity.THRESHOLDS,
        clusterSimilarity = Webdext.Similarity.clusterSimilarity,
        findClusters = Webdext.Similarity.findClusters,
        memoizedWTreeSimilarity = Webdext.Similarity.memoizedWTreeSimilarity,
        clusterWTrees = Webdext.Similarity.clusterWTrees;

    var AREA_FACTOR = 0.8;

    function CoarseGrainedRegion(parent, minIndex, maxIndex) {
        this.parent = parent;
        this.minIndex = minIndex;
        this.maxIndex = maxIndex;
    }
    CoarseGrainedRegion.prototype.getSiblingNodes = function() {
        return this.parent.getChildrenSubset(this.minIndex, this.maxIndex);
    };

    function Record(wNodeSet) {
        this.wNodeSet = wNodeSet;
    }
    Record.prototype.size = function() {
        return this.wNodeSet.length;
    };
    Record.prototype.equals = function(anotherRec) {
        var wNodeSetLength = this.wNodeSet.length;

        if (wNodeSetLength !== anotherRec.wNodeSet.length) {
            return false;
        }

        for (var i=wNodeSetLength; i--; ) {
            if (anotherRec.wNodeSet.indexOf(this.wNodeSet[i]) === -1) {
                return false;
            }
        }

        return true;
    };
    Record.prototype.getLeafNodes = function() {
        var wNodeSetLength = this.wNodeSet.length,
            leafNodes = [];

        for (var i=0; i < wNodeSetLength; i++) {
            var lns = this.wNodeSet[i].getLeafNodes();
            if (lns.length > 0) {
                leafNodes.push.apply(leafNodes, lns);
            }
        }

        return leafNodes;
    };
    Record.prototype.toString = function() {
        var leafNodes = this.getLeafNodes();
        var leafNodesLength = leafNodes.length,
            nodeValues = [];

        for (var i=0; i < leafNodesLength; i++) {
            var wNode = leafNodes[i];

            if (wNode.dataType === DATA_TYPE.TEXT) {
                nodeValues.push(wNode.textContent);
            } else if (wNode.dataType === DATA_TYPE.HYPERLINK) {
                if (wNode.href === null) {
                    nodeValues.push("");
                } else {
                    nodeValues.push(wNode.href.url);
                }
            } else if (wNode.dataType === DATA_TYPE.IMAGE) {
                if (wNode.src === null) {
                    nodeValues.push("");
                } else {
                    nodeValues.push(wNode.src.url);
                }
            }
        }

        return nodeValues.join(", ");
    };
    Record.prototype.getAverageSimilarity = function() {
        var sumSimilarity = 0,
            divisor = 0,
            wNodeSetLength = this.wNodeSet.length;

        for (var i=0, firstLimit=wNodeSetLength-1; i < firstLimit; i++) {
            for (var j=i+1, secondLimit=wNodeSetLength; j < secondLimit; j++) {
                sumSimilarity += memoizedWTreeSimilarity(this.wNodeSet[i], this.wNodeSet[j]);
                divisor++;
            }
        }

        if (divisor === 0) {
            return 0;
        }

        return sumSimilarity / divisor;
    };
    Record.prototype.getArea = function() {
        var sumArea = 0,
            wNodeSetLength = this.wNodeSet.length;

        for (var i=wNodeSetLength; i--; ) {
            var wNode = this.wNodeSet[i];

            if (wNode instanceof WElementNode) {
                sumArea += wNode.area;
            }
        }

        return sumArea;
    };

    function RecordSet(recSet) {
        this.recordSet = recSet;
    }
    RecordSet.prototype.size = function() {
        return this.recordSet.length;
    };
    RecordSet.prototype.getSiblingIndexRange = function() {
        var siblingIndexes = [],
            recSetLength = this.recordSet.length;

        for (var i=0; i < recSetLength; i++) {
            var record = this.recordSet[i],
                recordLength = record.size();

            for (var j=0; j < recordLength; j++) {
                siblingIndexes.push(record.wNodeSet[j].getSiblingIndex());
            }
        }

        return {
            min: Math.min.apply(null, siblingIndexes),
            max: Math.max.apply(null, siblingIndexes)
        };
    };
    RecordSet.prototype.getArea = function() {
        var sumArea = 0,
            recSetLength = this.recordSet.length;

        for (var i=recSetLength; i--; ) {
            sumArea += this.recordSet[i].getArea();
        }

        return sumArea;
    };
    RecordSet.prototype.getAverageSimilarity = function() {
        var sumSimilarity = 0,
            divisor = 0,
            recSetLength = this.recordSet.length;

        for (var i=0, firstLimit=recSetLength-1; i < firstLimit; i++) {
            for (var j=i+1, secondLimit=recSetLength; j < secondLimit; j++) {
                sumSimilarity += memoizedWTreeSimilarity(
                    this.recordSet[i].wNodeSet,
                    this.recordSet[j].wNodeSet
                );
                divisor++;
            }
        }

        if (divisor === 0) {
            return 0;
        }

        return sumSimilarity / divisor;
    };
    RecordSet.prototype.getSumOfCRecordSimilarity = function() {
        var sumSimilarity = 0,
            recSetLength = this.recordSet.length;

        for (var i=recSetLength; i--; ) {
            sumSimilarity += this.recordSet[i].getAverageSimilarity();
        }

        return sumSimilarity;
    };
    RecordSet.prototype.getCohesion = function() {
        var avgCRecordsSimilarity = this.getSumOfCRecordSimilarity() / this.recordSet.length;

        return this.getAverageSimilarity() / (1 + avgCRecordsSimilarity);
    };

    /**
    * Expecting a WNode or Record 
    */
    function mineCRecFromTree(wTree) {
        var wNodeSet = null;

        if (wTree instanceof Record) {
            wNodeSet = wTree.wNodeSet;
        } else if (wTree instanceof WNode) {
            if (wTree.isLeafNode()) {
                return [];
            } else {
                wNodeSet = wTree.children;
            }
        }

        var cRecSetList = mineCRecFromNodeSet(wNodeSet);

        var cRecSetListLength = cRecSetList.length,
            coveredChildren = [];

        for (var i=cRecSetListLength; i--; ) {
            var cRecSet = cRecSetList[i],
                cRecSetLength = cRecSet.size();

            for (var j=cRecSetLength; j--; ) {
                coveredChildren.push.apply(coveredChildren, cRecSet.recordSet[j].wNodeSet);
            }
        }

        var wNodeSetLength = wNodeSet.length,
            uncoveredChildren = [];

        for (i=0; i < wNodeSetLength; i++) {
            var wNode = wNodeSet[i];
            if (coveredChildren.indexOf(wNode) === -1) {
                uncoveredChildren.push(wNode);
            }
        }

        var uncoveredChildrenLength = uncoveredChildren.length;

        for (i=0; i < uncoveredChildrenLength; i++) {
            var childCRecSetList = mineCRecFromTree(uncoveredChildren[i]);
            if (childCRecSetList.length > 0) {
                cRecSetList.push.apply(cRecSetList, childCRecSetList);
            }
        }

        return cRecSetList;
    }

    function mineCRecFromNodeSet(wNodeSet) {
        if (wNodeSet.length < 2) {
            return [];
        }

        var coarseGrainedRegions = identifyCoarseGrainedRegions(wNodeSet);
        var cgrsLength = coarseGrainedRegions.length,
            cRecSetList = [];

        for (var i=0; i < cgrsLength; i++) {
            var cgr = coarseGrainedRegions[i];
            var cRecSet = segmentCoarseGrainedRegion(cgr);

            if (cRecSet) {
                cRecSetList.push(cRecSet);
                var indexRange = cRecSet.getSiblingIndexRange();

                if (indexRange.min > cgr.minIndex) {
                    var leftSiblingNodes = cgr.parent.getChildrenSubset(
                        cgr.minIndex,
                        indexRange.min-1
                    );
                    var leftCRecSetList = mineCRecFromNodeSet(leftSiblingNodes);
                    if (leftCRecSetList.length > 0) {
                        cRecSetList.push.apply(cRecSetList, leftCRecSetList);
                    }
                }

                if (indexRange.max < cgr.maxIndex) {
                    var rightSiblingNodes = cgr.parent.getChildrenSubset(
                        indexRange.max+1,
                        cgr.maxIndex
                    );
                    var rightCRecSetList = mineCRecFromNodeSet(rightSiblingNodes);
                    if (rightCRecSetList.length > 0) {
                        cRecSetList.push.apply(cRecSetList, rightCRecSetList);
                    }
                }
            }
        }

        return cRecSetList;
    }

    function identifyCoarseGrainedRegions(wNodeSet) {
        var clusters = clusterWTrees(wNodeSet);
        var clustersLength = clusters.length,
            coarseGrainedRegions = [];

        // filter only non all separator nodes cluster + length > 1
        // create CoarseGrainedRegion from those clusters
        for (var i=0; i < clustersLength; i++) {
            var cluster = clusters[i],
                clusterLength = cluster.length,
                allSeparatorCluster = true;

            for (var j=clusterLength; j--; ) {
                if (!cluster[j].isSeparatorNode()) {
                    allSeparatorCluster = false;
                    break;
                }
            }

            if (!allSeparatorCluster && cluster.length > 1) {
                var siblingIndexes = [];

                for (j=clusterLength; j--; ) {
                    siblingIndexes.push(cluster[j].getSiblingIndex());
                }

                var cgr = new CoarseGrainedRegion(
                    cluster[0].parent,
                    Math.min.apply(null, siblingIndexes),
                    Math.max.apply(null, siblingIndexes)
                );

                coarseGrainedRegions.push(cgr);
            }
        }

        // merge overlapping coarse grained regions
        var merge;

        do {
            merge = false;
            var cgrsLength = coarseGrainedRegions.length,
                toMergeIndex1 = null,
                toMergeIndex2 = null;

            for (var i=0; i < cgrsLength-1; i++) {
                var cgr1 = coarseGrainedRegions[i];
                for (var j=i+1; j < cgrsLength; j++) {
                    var cgr2 = coarseGrainedRegions[j];

                    if (cgr1.minIndex <= cgr2.minIndex && cgr2.minIndex <= cgr1.maxIndex) {
                        merge = true;
                    } else if (cgr2.minIndex <= cgr1.minIndex && cgr1.minIndex <= cgr2.maxIndex) {
                        merge = true;
                    }

                    if (merge) {
                        toMergeIndex1 = i;
                        toMergeIndex2 = j;
                        break;
                    }
                }

                if (merge) {
                    break;
                }
            }

            if (merge) {
                var toMerge1 = coarseGrainedRegions.splice(toMergeIndex1, 1)[0],
                    toMerge2 = coarseGrainedRegions.splice(toMergeIndex2-1, 1)[0],
                    mergedCGR = new CoarseGrainedRegion(
                        toMerge1.parent,
                        Math.min(toMerge1.minIndex, toMerge2.minIndex),
                        Math.max(toMerge1.maxIndex, toMerge2.maxIndex)
                    );
                coarseGrainedRegions.push(mergedCGR);
            }
        } while(merge);

        return coarseGrainedRegions;
    }

    function isSubsetOfExistingCRecSet(cRecSetList, cRecSet) {
        return cRecSetList.some(function(crs) {
            return cRecSet.recordSet.every(function(record) {
                return crs.recordSet.some(function(rec) {
                    return rec.equals(record);
                });
            });
        });
    }

    function segmentCoarseGrainedRegion(cgr) {
        var wNodeSet = cgr.getSiblingNodes();
        var wNodeSetLength = wNodeSet.length,
            cRecSetList = [];

        for (var i=0; i < wNodeSetLength; i++) {
            var wNode = wNodeSet[i];
            if (!wNode.isSeparatorNode()) {
                var cRecSet = integratedCRecMine(wNodeSet.slice(i));

                if (cRecSet !== null) {
                    if (isSubsetOfExistingCRecSet(cRecSetList, cRecSet)) {
                        break;
                    }

                    cRecSetList.push(cRecSet);
                }
            }
        }

        var areaList = cRecSetList.map(function(cRecSet) {
            return cRecSet.getArea();
        });
        var maxArea = Math.max.apply(null, areaList) * AREA_FACTOR;
        var largeCRecSetList = cRecSetList.filter(function(cRecSet) {
            return cRecSet.getArea() > maxArea;
        });

        var cohesionList = largeCRecSetList.map(function(cRecSet) {
            return cRecSet.getCohesion();
        });
        var maxCohesion = Math.max.apply(null, cohesionList);

        return largeCRecSetList[cohesionList.indexOf(maxCohesion)];
    }

    function integratedCRecMine(wNodeSet) {
        var anySeparatorNode = wNodeSet.some(function(wNode) {
            return wNode.isSeparatorNode();
        });

        if (!anySeparatorNode) {
            return headOrderBasedCRecMine(wNodeSet);
        }

        var separatorCRecSet = separatorBasedCRecMine(wNodeSet);
        var headOrderCRecSet = headOrderBasedCRecMine(wNodeSet);

        if (separatorCRecSet !== null && headOrderCRecSet === null) {
            return separatorCRecSet;
        } else if (separatorCRecSet === null && headOrderCRecSet !== null) {
            return headOrderCRecSet;
        } else if (separatorCRecSet === null && headOrderCRecSet === null) {
            return null;
        }

        var separatorCRecSetArea = separatorCRecSet.getArea();
        var headOrderCRecSetArea = headOrderCRecSet.getArea();

        if (separatorCRecSetArea > headOrderCRecSetArea) {
            return separatorCRecSet;
        } else if (separatorCRecSetArea < headOrderCRecSetArea) {
            return headOrderCRecSet;
        }

        if (separatorCRecSet.getCohesion() > headOrderCRecSet.getCohesion()) {
            return separatorCRecSet;
        } else {
            return headOrderCRecSet;
        } 
    };

    function createRecordSetFromTreeCluster(treeCluster) {
        var recordSet = treeCluster.map(function(wNodeSet) {
            return new Record(wNodeSet);
        });

        return new RecordSet(recordSet);
    }

    function generatePrefixSubparts(wNodeSet) {
        var wNodeSetLength = wNodeSet.length,
            prefixSubparts = [];

        for (var i=1; i <= wNodeSetLength; i++) {
            prefixSubparts.push(wNodeSet.slice(0, i));
        }

        return prefixSubparts;
    }

    function findSimilarPrefixSubpart(treeCluster, prefixSubparts) {
        var prefixSubpartsLength = prefixSubparts.length,
            similarPrefixSubparts = [];

        for (var i=0; i < prefixSubpartsLength; i++) {
            var prefixSubpart = prefixSubparts[i];
            var similarity = clusterSimilarity(
                treeCluster,
                [prefixSubpart],
                memoizedWTreeSimilarity
            );

            if (similarity > THRESHOLDS.TREE) {
                similarPrefixSubparts.push(prefixSubpart);
            }
        }

        var similarPrefixSubpartsLength = similarPrefixSubparts.length,
            selectedRecordSet, maxCohesion;

        for (i=0; i < similarPrefixSubpartsLength; i++) {
            var prefixSubpart = similarPrefixSubparts[i];
            var newTreeCluster = treeCluster.concat([prefixSubpart]);
            var rs = createRecordSetFromTreeCluster(newTreeCluster);
            var rsCohesion = rs.getCohesion();

            if (typeof maxCohesion === "undefined" || rsCohesion > maxCohesion) {
                maxCohesion = rsCohesion;
                selectedRecordSet = rs;
            }
        }

        return selectedRecordSet;
    }

    function mineCRecFromSubParts(subPartList) {
        var treeClusters = findClusters(
            subPartList,
            THRESHOLDS.TREE,
            clusterSimilarity,
            memoizedWTreeSimilarity
        );
        var firstSubPart = subPartList[0];
        var treeCluster;

        for (var i=0; i < treeClusters.length; i++) {
            if (treeClusters[i].indexOf(firstSubPart) > -1) {
                treeCluster = treeClusters[i];
                break;
            }
        }

        var treeClusterLength = treeCluster.length,
            treeClusterIndexes = [];

        for (i=0; i < treeClusterLength; i++) {
            treeClusterIndexes.push(subPartList.indexOf(treeCluster[i]));
        }

        var lastSubPartIndexInTC = Math.max.apply(null, treeClusterIndexes);
        var lastSubPartIndex = subPartList.length - 1;

        if (lastSubPartIndexInTC < lastSubPartIndex) {
            var nextTree = subPartList[lastSubPartIndexInTC+1];
            var prefixSubparts = generatePrefixSubparts(nextTree);
            var recordSet = findSimilarPrefixSubpart(treeCluster, prefixSubparts);

            if (recordSet) {
                return recordSet;
            }
        }

        if (lastSubPartIndexInTC > 0) {
            var lastTreeinTC = subPartList[lastSubPartIndexInTC];

            if (lastTreeinTC.length === 1) {
                return createRecordSetFromTreeCluster(treeCluster);
            }

            var prefixSubparts = generatePrefixSubparts(lastTreeinTC);
            treeCluster.splice(treeCluster.indexOf(lastTreeinTC), 1);
            var recordSet = findSimilarPrefixSubpart(treeCluster, prefixSubparts);

            if (recordSet) {
                return recordSet;
            }
        }

        return null;
    }

    function findSeparatorTagsSet(wNodeSet) {
        var separatorList = [],
            separator = null,
            wNodeSetLength = wNodeSet.length;

        for (var i=0; i < wNodeSetLength; i++) {
            var wNode = wNodeSet[i];

            if (wNode.isSeparatorNode()) {
                if (separator === null) {
                    separator = [];
                    separator.push(wNode.tagName);
                    separatorList.push(separator);
                } else {
                    separator.push(wNode.tagName);
                }
            } else {
                separator = null;
            }
        }

        var separatorListLength = separatorList.length,
            separatorTagsList = [];

        for (i=0; i < separatorListLength; i++) {
            separatorTagsList.push(separatorList[i].join(","));
        }

        var separatorTagsSet = [];

        for (i=0; i < separatorListLength; i++) {
            var separatorTags = separatorTagsList[i];
            if (separatorTagsSet.indexOf(separatorTags) === -1) {
                separatorTagsSet.push(separatorTags);
            }
        }

        return separatorTagsSet;
    }

    function separateSiblings(siblings, separatorTags) {
        var separatorNodesLength = separatorTags.split(",").length,
            siblingsLength = siblings.length,
            i = 0,
            subPartList = [],
            subPart = [];

        while (i < siblingsLength) {
            var currentLength = siblingsLength - i;

            if (separatorNodesLength <= currentLength) {
                var currentElements = siblings.slice(i, i+separatorNodesLength);
                var currentTagList = currentElements.map(function(e) {
                    return e.tagName;
                });
                var currentTags = currentTagList.join(",");

                if (currentTags === separatorTags) {
                    if (subPart.length > 0) {
                        subPartList.push(subPart);
                    }
                    subPart = [];
                    i += separatorNodesLength;
                } else {
                    subPart.push(siblings[i]);
                    i++;
                }
            } else {
                subPart.push.apply(subPart, siblings.slice(i));
                subPartList.push(subPart);
                subPart = [];
                i = siblingsLength;
            }
        }

        if (subPart.length > 0) {
            subPartList.push(subPart);
        }

        return subPartList;
    }

    function separatorBasedCRecMine(wNodeSet) {
        var separatorTagsSet = findSeparatorTagsSet(wNodeSet);
        var separatorTagsSetLength = separatorTagsSet.length,
            cRecSetList = [];


        for (var i=0; i < separatorTagsSetLength; i++) {
            var separatorTags = separatorTagsSet[i];
            var subPartList = separateSiblings(wNodeSet, separatorTags);
            var subPartListLength = subPartList.length,
                subPartListWOSeparator = [];

            for (var j=0; j < subPartListLength; j++) {
                var subPart = subPartList[j];
                var subPartWOSeparator = subPart.filter(function(wNode) {
                    return !wNode.isSeparatorNode();
                });
                if (subPartWOSeparator.length > 0) {
                    subPartListWOSeparator.push(subPartWOSeparator);
                }
            }

            if (subPartListWOSeparator.length > 0) {
                var cRecSet = mineCRecFromSubParts(subPartListWOSeparator);

                if (cRecSet) {
                    cRecSetList.push(cRecSet);
                }
            }
        }

        if (cRecSetList.length === 0) {
            return null;
        }

        var areaList = cRecSetList.map(function(cRecSet) {
            return cRecSet.getArea();
        });
        var maxArea = Math.max.apply(null, areaList);
        var largeCRecSetList = cRecSetList.filter(function(cRecSet) {
            return cRecSet.getArea() === maxArea;
        });

        if (largeCRecSetList.length === 1) {
            return largeCRecSetList[0];
        }

        var cohesionList = largeCRecSetList.map(function(cRecSet) {
            return cRecSet.getCohesion();
        });
        var maxCohesion = Math.max.apply(null, cohesionList);

        return largeCRecSetList[cohesionList.indexOf(maxCohesion)];
    }

    function headBasedCRecMine(wNodeSet) {
        var clusters = clusterWTrees(wNodeSet);
        var clustersLength = clusters.length,
            firstHeadNode = wNodeSet[0],
            firstHeadNodeCluster = null;

        for (var i=0; i < clustersLength; i++) {
            if (clusters[i].indexOf(firstHeadNode) > -1) {
                firstHeadNodeCluster = clusters[i];
                break;
            }
        }

        var wNodeSetLength = wNodeSet.length,
            subPartList = [],
            subPart = [];

        for (i=0; i < wNodeSetLength; i++) {
            var wNode = wNodeSet[i];

            if (firstHeadNodeCluster.indexOf(wNode) > -1) {
                if (subPart.length > 0) {
                    subPartList.push(subPart);
                }

                subPart = [];
                subPart.push(wNode);
            } else {
                subPart.push(wNode);
            }
        }

        if (subPart.length > 0) {
            subPartList.push(subPart);
        }

        return mineCRecFromSubParts(subPartList);
    }

    function DirectedAcyclicGraph(clusters) {
        this.clusters = clusters;
        this.graph = new Map();
        for (var i=0, clustersLength=this.clusters.length; i < clustersLength; i++) {
            this.graph.set(this.clusters[i], []);
        }
    }
    DirectedAcyclicGraph.prototype._isBeforeOrder = function(cluster1, cluster2) {
        var afterCluster1 = this.graph.get(cluster1);

        if (afterCluster1.length === 0) {
            return false;
        }

        if (afterCluster1.indexOf(cluster2) > -1) {
            return true;
        }

        for (var i=0; i < afterCluster1.length; i++) {
            var isBefore = this._isBeforeOrder(afterCluster1[i], cluster2);
            if (isBefore) {
                return true;
            }
        }

        return false;
    };
    DirectedAcyclicGraph.prototype.isBeforeOrder = function(wNode1, wNode2) {
        var cluster1 = null,
            cluster2 = null,
            clustersLength = this.clusters.length;

        for (var i=0; i < clustersLength; i++) {
            var currentCluster = this.clusters[i];

            if (currentCluster.indexOf(wNode1) > -1) {
                cluster1 = currentCluster;
            }

            if (currentCluster.indexOf(wNode2) > -1) {
                cluster2 = currentCluster;
            }

            if (cluster1 !== null && cluster2 !== null) {
                break;
            }
        }

        if (cluster1 === cluster2) {
            return false;
        }

        var isCluster1BeforeCluster2 = this._isBeforeOrder(cluster1, cluster2);
        var isCluster2BeforeCluster1 = this._isBeforeOrder(cluster2, cluster1);

        if (isCluster1BeforeCluster2) {
            return true;
        }

        if (isCluster2BeforeCluster1) {
            return false;
        }

        var afterCluster1 = this.graph.get(cluster1);
        afterCluster1.push(cluster2);

        return true;
    };

    function orderBasedCRecMine(wNodeSet) {
        var clusters = clusterWTrees(wNodeSet);
        var dag = new DirectedAcyclicGraph(clusters);
        var subPartList = [],
            wNodeSetLength = wNodeSet.length,
            maxIndex = wNodeSetLength-1,
            i = 0;

        while (i < wNodeSetLength) {
            var j = i;

            while (j < maxIndex && dag.isBeforeOrder(wNodeSet[j], wNodeSet[j+1])) {
                j++;
            }

            
            subPartList.push(wNodeSet.slice(i, j+1));
            i = j + 1;
        }

        return mineCRecFromSubParts(subPartList);
    }

    function headOrderBasedCRecMine(wNodeSet) {
        var wNodeSetWOSeparator = wNodeSet.filter(function(wNode) {
            return !wNode.isSeparatorNode();
        });
        var headCRecSet = headBasedCRecMine(wNodeSetWOSeparator);
        var orderCRecSet = orderBasedCRecMine(wNodeSetWOSeparator);

        if (headCRecSet !== null && orderCRecSet === null) {
            return headCRecSet;
        } else if (headCRecSet === null && orderCRecSet !== null) {
            return orderCRecSet;
        } else if (headCRecSet === null && orderCRecSet === null) {
            return null;
        }

        var headCRecSetArea = headCRecSet.getArea();
        var orderCRecSetArea = orderCRecSet.getArea();

        if (headCRecSetArea > orderCRecSetArea) {
            return headCRecSet;
        } else if (headCRecSetArea < orderCRecSetArea) {
            return orderCRecSet;
        } else {
            if (headCRecSet.getCohesion() > orderCRecSet.getCohesion()) {
                return headCRecSet;
            } else {
                return orderCRecSet;
            }
        }
    }

    function mineRecFromCRec(cRecSetList) {
        var cRecSetListLength = cRecSetList.length,
            recSetList = [];

        for (var i=0; i < cRecSetListLength; i++) {
            var cRecSet = cRecSetList[i];
            var furtherCRecSet = furtherMineCRec(cRecSet);

            if (furtherCRecSet === null || isSingleColumnTable(furtherCRecSet)) {
                recSetList.push(cRecSet);
            } else {
                recSetList.push.apply(recSetList, mineRecFromCRec([furtherCRecSet]));
            }
        }

        return recSetList;
    }

    function isSingleColumnTable(cRecSet) {
        return cRecSet.recordSet.every(function (record) {
            return record.getLeafNodes().length === 1;
        });
    }

    function furtherMineCRec(cRecSet) {
        var cRecSetSize = cRecSet.size(),
            cRecSetList = [];

        for (var i=0; i < cRecSetSize; i++) {
            var furtherCRecSetList = mineCRecFromTree(cRecSet.recordSet[i]);
            cRecSetList.push.apply(cRecSetList, furtherCRecSetList);
        }

        cRecSetList = aggregateSimilarCRecSets(cRecSetList);
        var areaList = cRecSetList.map(function(crs) {
            return crs.getArea();
        });
        var maxArea = Math.max.apply(null, areaList);
        var maxCRecSet = cRecSetList[areaList.indexOf(maxArea)];

        return maxArea > AREA_FACTOR * cRecSet.getArea() ? maxCRecSet : null;
    }

    function recordSetSimilarity(recSet1, recSet2) {
        var recSet1Size = recSet1.size(),
            recSet2Size = recSet2.size(),
            sum = 0;

        for (var i=0; i < recSet1Size; i++) {
            for (var j=0; j < recSet2Size; j++) {
                sum += memoizedWTreeSimilarity(
                    recSet1.recordSet[i].wNodeSet,
                    recSet2.recordSet[j].wNodeSet
                );
            }
        }

        return sum / (recSet1Size * recSet2Size);
    }

    function aggregateSimilarCRecSets(cRecSetList) {
        while(cRecSetList.length > 1) {
            var cRecSetListLength = cRecSetList.length,
                anyMerging = false;

            for (var i=0; i < cRecSetListLength-1; i++) {
                for (var j=i+1; j < cRecSetListLength; j++) {
                    var similarity = recordSetSimilarity(
                        cRecSetList[i],
                        cRecSetList[j]
                    );
                    if (similarity > THRESHOLDS.TREE) {
                        var recordSet = cRecSetList[i].recordSet.concat(cRecSetList[j].recordSet);
                        cRecSetList.splice(i, 1);
                        cRecSetList.splice(j-1, 1);
                        cRecSetList.push(new RecordSet(recordSet));
                        anyMerging = true;
                        break;
                    }
                }

                if (anyMerging) {
                    break;
                }
            }

            if (!anyMerging) {
                break;
            }
        }

        return cRecSetList;
    }

    function recordComparator(r1, r2) {
        var r1FirstNodeSiblingIndex = r1.wNodeSet[0].getSiblingIndex();
        var r2FirstNodeSiblingIndex = r2.wNodeSet[0].getSiblingIndex();

        if (r1FirstNodeSiblingIndex < r2FirstNodeSiblingIndex) {
            return -1;
        } else if (r1FirstNodeSiblingIndex > r2FirstNodeSiblingIndex) {
            return 1;
        } else {
            return 0;
        }
    }

    function sortRecordSet(rs) {
        rs.recordSet.sort(recordComparator);
    }

    function alignRecSetList(cRecSet) {
        // @TODO
    }

    function extract() {
        var wTree = createWTree();
        var bodyNode = evaluateXPath("/html/body")[0];
        var wBodyNode = findWNode(bodyNode, wTree);
        var cRecSetList = mineCRecFromTree(wBodyNode);
        var cRecSetListLength = cRecSetList.length;

        for (var i=cRecSetListLength; i--; ) {
            sortRecordSet(cRecSetList[i]);
        }

        var recSetList = mineRecFromCRec(cRecSetList);
        return recSetList;
        // return alignRecSetList(recSetList);
    }

    // exports
    Webdext.Extraction = {
        CoarseGrainedRegion: CoarseGrainedRegion,
        Record: Record,
        RecordSet: RecordSet,

        isSubsetOfExistingCRecSet: isSubsetOfExistingCRecSet,
        findSeparatorTagsSet: findSeparatorTagsSet,
        separateSiblings: separateSiblings,        

        identifyCoarseGrainedRegions: identifyCoarseGrainedRegions,
        segmentCoarseGrainedRegion: segmentCoarseGrainedRegion,

        integratedCRecMine: integratedCRecMine,
        separatorBasedCRecMine: separatorBasedCRecMine,
        headOrderBasedCRecMine: headOrderBasedCRecMine,
        headBasedCRecMine: headBasedCRecMine,
        orderBasedCRecMine: orderBasedCRecMine,

        mineCRecFromTree: mineCRecFromTree,
        mineCRecFromNodeSet: mineCRecFromNodeSet,

        furtherMineCRec: furtherMineCRec,
        recordSetSimilarity: recordSetSimilarity,
        aggregateSimilarCRecSets: aggregateSimilarCRecSets,

        mineRecFromCRec: mineRecFromCRec,

        sortRecordSet: sortRecordSet
    };
    Webdext.extract = extract;
}).call(this);
