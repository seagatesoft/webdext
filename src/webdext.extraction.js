;(function(undefined) {
    "use strict";

    // imports
    var evaluateXPath = Webdext.evaluateXPath,
        DATA_TYPE = Webdext.Model.DATA_TYPE,
        Vertex = Webdext.Model.Vertex,
        DirectedAcyclicGraph = Webdext.Model.DirectedAcyclicGraph,
        WNode = Webdext.Model.WNode,
        WElementNode = Webdext.Model.WElementNode,
        createWTree = Webdext.Model.createWTree,
        findWNode = Webdext.Model.findWNode,
        THRESHOLDS = Webdext.Similarity.THRESHOLDS,
        clusterSimilarity = Webdext.Similarity.clusterSimilarity,
        findClusters = Webdext.Similarity.findClusters,
        memoizedWTreeSimilarity = Webdext.Similarity.memoizedWTreeSimilarity,
        clusterWTrees = Webdext.Similarity.clusterWTrees,
        wNodeMatchWeight = Webdext.Similarity.wNodeMatchWeight;

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
        this.dataItems = null;
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
            dataContents = [];

        for (var i=0; i < leafNodesLength; i++) {
            var leafNode = leafNodes[i];

            if (!leafNode.isSeparatorNode()) {
                dataContents.push(leafNode.dataContent);
            }
        }

        return dataContents.join(", ");
    };
    Record.prototype.toJSON = function() {
        var wNodeSetLength = this.wNodeSet.length,
            nodeXPaths = [];

        for (var i=0; i < wNodeSetLength; i++) {
            nodeXPaths.push(this.wNodeSet[i].valueOf());
        }

        var dataItemsLength = this.dataItems.length,
            dataItems = [];

        for (var i=0; i < dataItemsLength; i++) {
            var dataNode = this.dataItems[i];
            var dataType, dataItem;

            if (dataNode === null) {
                dataItem = {xpath: null, type: null, value: ""};
            } else {
                if (dataNode.dataType === DATA_TYPE.HYPERLINK) {
                    dataType = "hyperlink";
                } else if (dataNode.dataType === DATA_TYPE.IMAGE) {
                    dataType = "image";
                } else {
                    dataType = "text";
                }

                dataItem = {
                    xpath: dataNode.valueOf(),
                    type: dataType,
                    value: dataNode.dataContent
                };
            }

            dataItems.push(dataItem);
        }

        return {
            nodeXPaths: nodeXPaths,
            dataItems: dataItems
        };
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
    RecordSet.prototype.toJSON = function() {
        var recordSetLength = this.recordSet.length,
            records = [];

        for (var i=0; i < recordSetLength; i++) {
            records.push(this.recordSet[i].toJSON());
        }

        return records;
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
    RecordSet.prototype.numOfColumns = function() {
        return this.dataItems[0].length;
    };
    RecordSet.prototype.getDataItem = function(row, column) {
        return this.dataItems[row][column].dataContent;
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

    function orderBasedCRecMine(wNodeSet) {
        var clusters = clusterWTrees(wNodeSet);
        var clustersLength = clusters.length,
            vertices = [];

        for (var i=clustersLength; i--; ) {
            var cluster = clusters[i];
            var vertex = new Vertex(cluster);
            vertices.push(vertex);

            for (var j=cluster.length; j--; ) {
                cluster[j].vertex = vertex;
            }
        }

        var dag = new DirectedAcyclicGraph(vertices);
        var subPartList = [],
            wNodeSetLength = wNodeSet.length,
            maxIndex = wNodeSetLength-1,
            i = 0;

        while (i < wNodeSetLength) {
            var j = i;

            while (j < maxIndex && dag.isBeforeOrder(wNodeSet[j].vertex, wNodeSet[j+1].vertex)) {
                j++;
            }

            
            subPartList.push(wNodeSet.slice(i, j+1));
            i = j + 1;
        }

        for (var i=wNodeSetLength; i--; ) {
            delete wNodeSet[i].vertex;
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
        var r1NodeIndex = r1.wNodeSet[0].nodeIndex;
        var r2NodeIndex = r2.wNodeSet[0].nodeIndex;

        if (r1NodeIndex < r2NodeIndex) {
            return -1;
        } else if (r1NodeIndex > r2NodeIndex) {
            return 1;
        } else {
            return 0;
        }
    }

    function sortRecordSet(rs) {
        rs.recordSet.sort(recordComparator);
    }

    function recordSetComparator(rs1, rs2) {
        var rs1Area = rs1.getArea();
        var rs2Area = rs2.getArea();

        if (rs1Area < rs2Area) {
            return -1;
        } else if (rs1Area > rs2Area) {
            return 1;
        } else {
            return 0;
        }
    }

    function extractDataRecords() {
        var wTree = createWTree();
        var bodyNode = evaluateXPath("/html/body")[0];
        var wBodyNode = findWNode(bodyNode, wTree);
        var cRecSetList = mineCRecFromTree(wBodyNode);
        var cRecSetListLength = cRecSetList.length;

        for (var i=cRecSetListLength; i--; ) {
            sortRecordSet(cRecSetList[i]);
        }

        var recSetList = mineRecFromCRec(cRecSetList);

        return recSetList.sort(recordSetComparator).reverse();
    }

    function pairwiseTreeMatchingWeight(wTree1, wTree2) {
        if (wTree1.isLeafNode() || wTree2.isLeafNode()) {
            return wNodeMatchWeight(wTree1, wTree2);
        } else if (wTree1.tagName !== wTree2.tagName) {
            return 0;
        }

        var children1 = wTree1.children;
        var children2 = wTree2.children;

        var children1Length = children1.length,
            children2Length = children2.length,
            m = new Array(children1Length+1);

        for (var i=0; i <= children1Length; i++) {
            m[i] = new Array(children2Length+1);
            m[i][0] = 0;
        }

        for (var j=1; j <= children2Length; j++) {
            m[0][j] = 0;
        }

        for (var i=1; i <= children1Length; i++) {
            for (var j=1; j <= children2Length; j++) {
                var matchWeight = pairwiseTreeMatchingWeight(children1[i-1], children2[j-1]);
                var alignment = m[i-1][j-1] + matchWeight;
                m[i][j] = Math.max(alignment, m[i][j-1], m[i-1][j]);
            }
        }

        return m[children1Length][children2Length] + wNodeMatchWeight(wTree1, wTree2);
    }

    function pairwiseTreeMatching(wNodeSet1, wNodeSet2) {
        var STEP = {
                "Alignment": 0,
                "Insertion": 1,
                "Deletion": 2
            },
            wNodeSet1Length = wNodeSet1.length,
            wNodeSet2Length = wNodeSet2.length,
            m = new Array(wNodeSet1Length+1),
            steps = new Array(wNodeSet1Length+1),
            pairwiseMatchWeightMap = new Map();
        
        for (var i=0; i <= wNodeSet1Length; i++) {
            m[i] = new Array(wNodeSet2Length+1);
            m[i][0] = 0;
            steps[i] = new Array(wNodeSet2Length+1);

            if (i === 0) {
                steps[i][0] = STEP.Alignment;
            } else {
                steps[i][0] = STEP.Deletion;
            }
        }

        for (var j=1; j <= wNodeSet2Length; j++) {
            m[0][j] = 0;
            steps[0][j] = STEP.Insertion;
        }

        for (var i=1; i <= wNodeSet1Length; i++) {
            for (var j=1; j <= wNodeSet2Length; j++) {
                var matchWeight = pairwiseTreeMatchingWeight(wNodeSet1[i-1], wNodeSet2[j-1]);
                var innerMap = pairwiseMatchWeightMap.get(wNodeSet1[i-1]);
                if (!innerMap) {
                    innerMap = new Map();
                    pairwiseMatchWeightMap.set(wNodeSet1[i-1], innerMap);
                }
                innerMap.set(wNodeSet2[j-1], matchWeight);

                var alignment = m[i-1][j-1] + matchWeight;
                var insertion = m[i][j-1];
                var deletion = m[i-1][j];

                m[i][j] = Math.max(alignment, insertion, deletion);

                if (m[i][j] === alignment) {
                    steps[i][j] = STEP.Alignment;
                } else if (m[i][j] === insertion) {
                    steps[i][j] = STEP.Insertion;
                } else if (m[i][j] === deletion) {
                    steps[i][j] = STEP.Deletion;
                }
            }
        }

        i = wNodeSet1Length;
        j = wNodeSet2Length;
        var matchedPairs = [];

        while(i > 0 || j > 0) {
            var step = steps[i][j];
            if (step === STEP.Alignment) {
                matchedPairs.push({
                    weight: pairwiseMatchWeightMap.get(wNodeSet1[i-1]).get(wNodeSet2[j-1]),
                    wNode1: wNodeSet1[i-1],
                    wNode2: wNodeSet2[j-1]
                });
                i--;
                j--;
            } else if (step === STEP.Insertion) {
                j--;
            } else if (step === STEP.Deletion) {
                i--;
            }
        }

        return matchedPairs;
    }

    function matchComparator(match1, match2) {
        if (match1.weight < match2.weight) {
            return -1;
        } else if (match1.weight > match2.weight) {
            return 1;
        } else {
            return 0;
        }   
    }

    function wNodeComparator(wNode1, wNode2) {
        if (wNode1.nodeIndex < wNode2.nodeIndex) {
            return -1;
        } else if (wNode1.nodeIndex > wNode2.nodeIndex) {
            return 1;
        } else {
            return 0;
        }
    }

    function vertexComparator(vertex1, vertex2) {
        if (vertex1.data[0].nodeIndex < vertex2.data[0].nodeIndex) {
            return -1;
        } else if (vertex1.data[0].nodeIndex > vertex2.data[0].nodeIndex) {
            return 1;
        } else {
            return 0;
        }   
    }

    function multiTreeMatching(wTreeSet, recNum) {
        var wTreeSetLength = wTreeSet.length;

        if (wTreeSetLength === 0) {
            return [];
        }

        var childNodeSetList = [];

        if (wTreeSet[0] instanceof Record) {
            for (var i=0; i < wTreeSetLength; i++) {
                var record = wTreeSet[i];
                childNodeSetList.push(record.wNodeSet);
                var recordWNodeSetLength = record.wNodeSet.length;

                for (var j=recordWNodeSetLength; j--; ) {
                    record.wNodeSet[j].rowNumber = i;                   
                }
            }
        } else {
            var wNodeSet = wTreeSet;

            var allAreSeparatorNodes = true;
            for (var i=wTreeSetLength; i--; ) {
                if (!wNodeSet[i].isSeparatorNode()) {
                    allAreSeparatorNodes = false;
                    break;
                }
            }

            if (allAreSeparatorNodes) {
                return [];
            }

            var anyDataItemNode = false;
            for (var i=wTreeSetLength; i--; ) {
                if (wNodeSet[i].dataType) {
                    anyDataItemNode = true;
                    break;
                }
            }

            if (anyDataItemNode) {
                var dataItems = new Array(recNum);
                for (var i=0; i < wTreeSetLength; i++) {
                    var wNode = wNodeSet[i];
                    dataItems[wNode.rowNumber] = [wNode];
                }
                for (var i=0; i < recNum; i++) {
                    if (typeof dataItems[i] === "undefined") {
                        dataItems[i] = [null];
                    }
                }

                return dataItems;
            }

            for (var i=0; i < wTreeSetLength; i++) {
                var wNode = wNodeSet[i];
                if (!wNode.isLeafNode()) {
                    childNodeSetList.push(wNode.children);
                    var childrenCount = wNode.getChildrenCount();

                    for (var j=childrenCount; j--; ) {
                        wNode.children[j].rowNumber = wNode.rowNumber;
                    }
                }
            }
        }
        
        var childNodeSetListLength = childNodeSetList.length,
            dag = new DirectedAcyclicGraph();

        for (var i=0; i < childNodeSetListLength; i++) {
            var childNodeSet = childNodeSetList[i];
            var childNodeSetLength = childNodeSet.length;

            for (var j=0; j < childNodeSetLength; j++) {
                var childNode = childNodeSet[j];
                var vertex = new Vertex([childNode]);
                dag.addVertex(vertex);
                childNode.vertex = vertex;

                if (j > 0) {
                    dag.createEdge(childNodeSet[j-1].vertex, childNode.vertex);
                }
            }
        }

        var pairwiseAlignments = [];
        for (var i=0; i < childNodeSetListLength-1; i++) {
            for (var j=i+1; j < childNodeSetListLength; j++) {
                var matchedPairs = pairwiseTreeMatching(childNodeSetList[i], childNodeSetList[j]);
                pairwiseAlignments.push.apply(pairwiseAlignments, matchedPairs);                
            }
        }
        pairwiseAlignments.sort(matchComparator);

        while (pairwiseAlignments.length > 0) {
            var pa = pairwiseAlignments.pop();
            
            if (dag.isPathExists(pa.wNode1.vertex, pa.wNode2.vertex)) {
                continue;
            }

            var mergedVertex = dag.mergeVertices(pa.wNode1.vertex, pa.wNode2.vertex);
            var mergedVertexDataLength = mergedVertex.data.length;

            for (var i=mergedVertexDataLength; i--; ) {
                mergedVertex.data[i].vertex = mergedVertex;
            }

            if (dag.numOfVertices() === 1) {
                break;
            }
        }

        var numOfVertices = dag.numOfVertices();
        for (var i=0; i < numOfVertices; i++) {
            dag.vertices[i].data.sort(wNodeComparator);
        }
        dag.vertices.sort(vertexComparator);

        var dataItemSet = new Array(recNum);
        for (var i=0; i < recNum; i++) {
            dataItemSet[i] = [];
        }

        for (var i=0; i < numOfVertices; i++) {
            var dataItems = multiTreeMatching(dag.vertices[i].data, recNum);
            if (dataItems.length > 0) {
                for (var j=0; j < recNum; j++) {
                    dataItemSet[j].push.apply(dataItemSet[j], dataItems[j]);
                }
            }
        }

        return dataItemSet;
    }

    function alignRecordSet(recSet) {
        var recNum = recSet.size();
        var dataItemSet = multiTreeMatching(recSet.recordSet, recNum);

        for (var i=recNum; i--; ) {
            recSet.recordSet[i].dataItems = dataItemSet[i];
        }

        return recSet;
    }

    function extract() {
        var recSetList = extractDataRecords();
        var recSetListLength = recSetList.length,
            alignedRecSetList = [];

        for (var i=0; i < recSetListLength; i++) {
            try {
                alignedRecSetList.push(alignRecordSet(recSetList[i]));
            }
            catch(error) {
                console.log("Failed aligning data items on record set = "+i);
                console.error(error);
            }
        }
        
        return alignedRecSetList;
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
        sortRecordSet: sortRecordSet,
        extractDataRecords: extractDataRecords,

        pairwiseTreeMatchingWeight: pairwiseTreeMatchingWeight,
        pairwiseTreeMatching: pairwiseTreeMatching,
        multiTreeMatching: multiTreeMatching,

        alignRecordSet: alignRecordSet
    };
    Webdext.extract = extract;
}).call(this);
