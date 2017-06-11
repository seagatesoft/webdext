;(function(undefined) {
    "use strict";

    // imports
    var evaluateXPath = Webdext.evaluateXPath,
        getValueFromPairMap = Webdext.getValueFromPairMap,
        XPathStep = Webdext.XPath.XPathStep,
        IndexedXPathStep = Webdext.XPath.IndexedXPathStep,
        LocationXPath = Webdext.XPath.LocationXPath,
        IndexedXPath = Webdext.XPath.IndexedXPath,
        parseIndexedXPath = Webdext.XPath.parseIndexedXPath,
        editDistance = Webdext.Sequal.editDistance,
        alignPairwise = Webdext.Sequal.alignPairwise;

    function xpathSubstitutionCost(s1, s2) {
        if (s1.abbreviation && s2.abbreviation) {
            return 0;
        } else if (s1.abbreviation) {
            return 4;
        } else if (s2.abbreviation) {
            return 4;
        }

        var cost = 0;
        if (s1.axis !== s2.axis) {
            cost += 1;
        }
        if (s1.nodetest !== s2.nodetest) {
            cost += 2;
        }
        if (s1.position !== s2.position) {
            cost += 1;
        }

        return cost;
    }

    function xpathInsertionCost() {
        return 4;
    }

    function xpathDeletionCost() {
        return 4;
    }

    function xpathEditDistance(xpath1, xpath2) {
        return editDistance(
            xpath1.steps,
            xpath2.steps,
            xpathSubstitutionCost,
            xpathInsertionCost,
            xpathDeletionCost
        );
    }

    function alignPairwiseIndexedXPaths(xpath1, xpath2) {
        return alignPairwise(
            xpath1.steps,
            xpath2.steps,
            xpathSubstitutionCost,
            xpathInsertionCost,
            xpathDeletionCost
        );
    }

    function alignPairwiseAndMerge(xpath1, xpath2) {
        var alignment = alignPairwiseIndexedXPaths(xpath1, xpath2);
        var alignmentLength = alignment.length;
        var alignedXPathSteps = [];

        for (var i=0; i < alignmentLength; i++) {
            var step;

            if (alignment[i][0] === null || alignment[i][1] === null) {
                step = new XPathStep({abbreviation: "/"});
            } else if (alignment[i][0].nodetest !== alignment[i][1].nodetest) {
                if (alignment[i][0].nodetest === "text()" || alignment[i][1].nodetest === "text()") {
                    step = new XPathStep({nodetest: "node()"});
                } else {
                    step = new XPathStep({abbreviation: "*"});
                }
            } else if (!alignment[i][0].predicates || !alignment[i][1].predicates) {
                step = new XPathStep({nodetest: alignment[i][0].nodetest});
            } else if (alignment[i][0].predicates[0] !== alignment[i][1].predicates[0]) {
                step = new XPathStep({nodetest: alignment[i][0].nodetest});
            } else {
                step = new XPathStep({
                    nodetest: alignment[i][0].nodetest,
                    predicates: alignment[i][0].predicates,
                });
            }

            alignedXPathSteps.push(step);
        }

        return new LocationXPath(alignedXPathSteps, xpath1.absolute);
    }

    function getAverageDistance(xpath, alignedXPaths, distancePairMap) {
        var alignedXPathsLength = alignedXPaths.length,
            totalDistance = 0;

        for (var i=alignedXPathsLength; i--; ) {
            totalDistance += getValueFromPairMap(distancePairMap, xpath, alignedXPaths[i]);
        }

        return totalDistance / alignedXPathsLength;
    }

    function alignMultipleIndexedXPaths(indexedXPaths) {
        if (!Array.isArray(indexedXPaths)) {
            throw new Error("Parameter must be an array.");
        }

        var indexedXPathsLength = indexedXPaths.length;

        for (var i=indexedXPathsLength; i--; ) {
            if (!(indexedXPaths[i] instanceof IndexedXPath)) {
                throw new Error("All parameter elements must be an instance of IndexedXPath.");
            }
        }

        var distancePairMap = new Map(),
            minDistance = Number.MAX_VALUE,
            toAlign1,
            toAlign2;

        for (i=0; i < indexedXPathsLength-1; i++) {
            var innerMap = new Map();

            for (var j=i+1; j < indexedXPathsLength; j++) {
                var distance = xpathEditDistance(indexedXPaths[i], indexedXPaths[j]);
                innerMap.set(indexedXPaths[j], distance);

                if (distance < minDistance) {
                    minDistance = distance;
                    toAlign1 = indexedXPaths[i];
                    toAlign2 = indexedXPaths[j];
                }
            }

            distancePairMap.set(indexedXPaths[i], innerMap);
        }

        var mergedXPath = alignPairwiseAndMerge(toAlign1, toAlign2);
        var alignedXPaths = [toAlign1, toAlign2];
        var indexedXPathsCopy = indexedXPaths.slice();
        indexedXPathsCopy.splice(indexedXPathsCopy.indexOf(toAlign1), 1);
        indexedXPathsCopy.splice(indexedXPathsCopy.indexOf(toAlign2), 1);

        while (indexedXPathsCopy.length > 0) {
            var distanceList = indexedXPathsCopy.map(function(xpath) {
                return getAverageDistance(xpath, alignedXPaths, distancePairMap);
            });
            var minDistance = Math.min.apply(null, distanceList);
            var toAlignIndex = distanceList.indexOf(minDistance);
            var toAlign = indexedXPathsCopy[toAlignIndex];
            mergedXPath = alignPairwiseAndMerge(mergedXPath, toAlign);
            alignedXPaths.push(toAlign);
            indexedXPathsCopy.splice(toAlignIndex, 1);
        }

        return mergedXPath;
    }

    function getRelativeXPath(dataRecordXPath, dataItemXPath) {
        var recordSteps = dataRecordXPath.steps,
            itemSteps = dataItemXPath.steps,
            lastIndex = dataRecordXPath.steps.length-1,
            lastEqualIndex;

        var nodetestEqual = recordSteps[lastIndex].nodetest === itemSteps[lastIndex].nodetest;
        var positionEqual = recordSteps[lastIndex].position === itemSteps[lastIndex].position;

        if (nodetestEqual && positionEqual) {
            var relativeSteps = itemSteps.slice(lastIndex+1);
            return new IndexedXPath(relativeSteps, false);
        }

        var dataRecordNode = evaluateXPath(dataRecordXPath)[0];
        var dataItemParentSteps = itemSteps.slice(lastIndex+1);
        var dataItemParentXPath = new IndexedXPath(dataItemParentSteps, true);
        var dataItemParentNode = evaluateXPath(dataItemParentXPath.toString());
        var siblingNode = dataRecordNode;
        var dataItemParentRelativePos = 0;

        while (siblingNode.nextElementSibling) {
            if (siblingNode.nextElementSibling.tagName === dataItemParentNode.tagName) {
                dataItemParentRelativePos++;
                if (siblingNode.nextElementSibling.isSameNode(dataItemParentNode)) {
                    break;
                }
            }

            siblingNode = siblingNode.nextElementSibling;
        }

        var dataItemParentStep = new XPathStep({
            "axis": "following-sibling",
            "nodetest": dataItemParentNode.tagName,
            "predicates": [dataItemParentRelativePos]
        });
        var relativeSteps = itemSteps.slice(lastIndex+2);
        relativeSteps.unshift(dataItemParentStep);

        return new LocationXPath(relativeSteps, false);
    }

    function mergeAlignedXPaths(alignedXPaths) {
        if (!Array.isArray(alignedXPaths)) {
            throw new Error("Parameter must be an array.");
        }

        var alignedXPathsLength = alignedXPaths.length;

        if (alignedXPathsLength === 0) {
            throw new Error("Array is empty, no XPath to merge.");   
        }

        for (var i=0; i < alignedXPathsLength; i++) {
            if (!(alignedXPaths[i] instanceof LocationXPath)) {
                throw new Error("All parameter element must be an instance of LocationXPath.");
            }
        }

        var firstAlignedXPath = alignedXPaths[0];

        if (alignedXPathsLength === 1) {
            return firstAlignedXPath;
        }

        var steps = [],
            stepsLength = alignedXPaths[0].steps.length;

        for (var i=0; i < stepsLength; i++) {
            // if any has different nodetest:
            //  if all nodetest are element -> use *
            //  if not all nodetest are element -> use node()
            // no predicate
            // only predicate differ: remove predicate
            // if all the steps are same => select one
            var step = null,
                anyNeutralStep = false,
                allNodetestAreElement = true,
                nodetestDiffer = false,
                predicateDiffer = false,
                prevStep = firstAlignedXPath.steps[i];

            if (prevStep.abbreviation === ".") {
                step = new XPathStep({abbreviation: "/"});
                steps.push(step);
                continue;
            }

            if (prevStep.nodetest === "text()") {
                allNodetestAreElement = false;
            }

            for (var j=1; j < alignedXPathsLength; j++) {
                var currentStep = alignedXPaths[j].steps[i];

                if (currentStep.abbreviation === ".") {
                    anyNeutralStep = true;
                    break;
                }

                if (prevStep.nodetest === "text()") {
                    allNodetestAreElement = false;
                }

                if (currentStep.nodetest !== prevStep.nodetest) {
                    nodetestDiffer = true;
                }

                if (currentStep.predicates[0] !== prevStep.predicates[0]) {
                    predicateDiffer = true;
                }
            }

            if (anyNeutralStep) {
                step = new XPathStep({abbreviation: "/"});
            } else if (nodetestDiffer && allNodetestAreElement) {
                step = new XPathStep({abbreviation: "*"});
            } else if (nodetestDiffer) {
                step = new XPathStep({nodetest: "node()"});
            } else if (predicateDiffer) {
                step = new XPathStep({nodetest: prevStep.nodetest});
            } else {
                step = new XPathStep({
                    nodetest: prevStep.nodetest,
                    predicates: prevStep.predicates,
                });
            }

            steps.push(step);
        }

        return new LocationXPath(steps, firstAlignedXPath.absolute);
    };

    function inductWrapper(recSet, columnNames) {
        var parsedDataRecordXPaths = recSet.map(function(record) {
            return parseIndexedXPath(record.nodeXPaths[0]);
        });
        var dataRecordXPath = alignMultipleIndexedXPaths(parsedDataRecordXPaths);

        var dataItemsLength = recSet[0].dataItems.length,
            recSetLength = recSet.length,
            dataItemXPaths = {};

        for (var i=0; i < dataItemsLength; i++) {
            var relativeDataItemXPaths = [];
            for (var j=0; j < recSetLength; j++) {
                if (recSet[j].dataItems[i].xpath) {
                    var relativeDataItemXPath = getRelativeXPath(
                        parsedDataRecordXPaths[j],
                        parseIndexedXPath(recSet[j].dataItems[i].xpath)
                    );
                    relativeDataItemXPaths.push(relativeDataItemXPath);
                }
            }

            if (relativeDataItemXPaths.length > 1) {
                var dataItemXPath = alignMultipleIndexedXPaths(relativeDataItemXPaths);
                dataItemXPaths[columnNames[i+1]] = dataItemXPath.toString();
            } else {
                dataItemXPaths[columnNames[i+1]] = relativeDataItemXPaths[0].toString();
            }
        }

        return {
            dataRecordXPath: dataRecordXPath.toString(),
            dataItemXPaths: dataItemXPaths
        };
    }

    // exports
    Webdext.Induction = {
        xpathEditDistance: xpathEditDistance,
        alignPairwiseIndexedXPaths: alignPairwiseIndexedXPaths,
        alignPairwiseAndMerge: alignPairwiseAndMerge,
        alignMultipleIndexedXPaths: alignMultipleIndexedXPaths,
        inductWrapper: inductWrapper
    };
}).call(this);
