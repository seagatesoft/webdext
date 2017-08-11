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
        getIndexedXPathStep = Webdext.XPath.getIndexedXPathStep,
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
        var recSetLength = recSet.length,
            dataRecordFirstNodes = [],
            parsedDataRecordXPaths = [];

        for (var i=0; i < recSetLength; i++) {
            var xpathString = recSet[i].nodeXPaths[0];
            parsedDataRecordXPaths.push(parseIndexedXPath(xpathString));

            var drFirstNode = evaluateXPath(xpathString)[0];
            dataRecordFirstNodes.push(drFirstNode);
        }

        var dataRecordXPath = inductDataRecordXPath(dataRecordFirstNodes);

        var columnNamesIndexes = Object.keys(columnNames),
            columnNamesLength = columnNamesIndexes.length,
            dataItemsLength = recSet[0].dataItems.length,
            dataItemXPaths = {};

        for (i=0; i < columnNamesLength; i++) {
            var columnIndex = columnNamesIndexes[i]-1,
                dataRecordNodes = [],
                dataItemNodes = [];

            for (var j=0; j < recSetLength; j++) {
                if (recSet[j].dataItems[columnIndex].xpath) {
                    dataRecordNodes.push(dataRecordFirstNodes[j]);
                    var diNode = evaluateXPath(recSet[j].dataItems[columnIndex].xpath)[0];
                    dataItemNodes.push(diNode);
                }
            }

            var dataItemXPath = inductDataItemXPath(dataRecordNodes, dataItemNodes);
            dataItemXPaths[columnNames[columnIndex+1]] = dataItemXPath;
        }

        return {
            dataRecordXPath: dataRecordXPath,
            dataItemXPaths: dataItemXPaths
        };
    }

    function getUniqueElements(array) {
        var arrayLength = array.length,
            valueMap = new Map(),
            uniqueElements = [];

        for (var i=arrayLength; i--; ) {
            valueMap.set(array[i], true);
        }

        var keys = valueMap.keys();
        var key = keys.next();
        while (!key.done) {
            uniqueElements.push(key.value);
            key = keys.next();
        }

        return uniqueElements;
    }

    function getCombinationList(array, size) {
        var arrayLength = array.length;

        if (size > arrayLength) {
            throw new Error("Combination size can't be greater than array.length");
        }

        var combinationIndexes = new Array(size),
            combinationList = [];

        for (var i=size; i--; ) {
            combinationIndexes[i] = i;
        }

        var anyIncrement = true;

        while(anyIncrement) {
            var combination = new Array(size);
            for (i=size; i--; ) {
                combination[i] = array[combinationIndexes[i]];
            }
            combinationList.push(combination);

            var j = arrayLength-1,
                anyIncrement = false;

            for (i=size; i--; ) {
                if (combinationIndexes[i] < j) {
                    anyIncrement = true;
                    combinationIndexes[i]++;
                    for (var k=i+1; k < size; k++) {
                        combinationIndexes[k] = combinationIndexes[k-1] + 1;
                    }
                    break;
                }
                j--;
            }
        }

        return combinationList;
    }

    function inductElementXPathStep(elementNodes) {
        var tags = elementNodes.map(function(e) { return e.nodeName.toLowerCase();});
        tags = getUniqueElements(tags);

        if (tags.length === 1) {
            return new XPathStep({nodetest: tags[0]});
        }

        var predicates = tags.map(function(tag) {
            return "self::" + tag;
        });
        var predicateString = predicates.join(" or ");

        return new XPathStep({nodetest: "*", predicates: [predicateString]});
    }

    function getCommonClasses(elementNodes) {
        var elementNodesLength = elementNodes.length,
            classCounter = new Map(),
            commonClasses = [];

        for (var i=elementNodesLength; i--; ) {
            var classList = getUniqueElements(elementNodes[i].classList);
            var classListLength = classList.length;
            for (var j=classListLength; j--; ) {
                if (classList[j] !== "") {
                    var counter = classCounter.get(classList[j]);
                    if (typeof counter === "undefined") {
                        classCounter.set(classList[j], 1);
                    } else {
                        classCounter.set(classList[j], counter + 1);
                    }
                }
            }
        }

        var entries = classCounter.entries();
        var entry = entries.next();
        while (!entry.done) {
            if (entry.value[1] === elementNodesLength) {
                commonClasses.push(entry.value[0]);
            }
            entry = entries.next();
        }

        return commonClasses;
    }

    function constructHasClassPredicate(className) {
        return "contains(concat(' ', @class, ' '), ' " + className + " ')";
    }

    function cloneWithClassPredicates(xpathStep, classes) {
        var classPredicates = classes.map(function(c) {
            return constructHasClassPredicate(c);
        });
        var nodetest = xpathStep.nodetest;
        var predicates = [];
        if (xpathStep.predicates) {
            predicates = xpathStep.predicates.concat(classPredicates);
        } else {
            predicates.push.apply(predicates, classPredicates);
        }

        return new XPathStep({nodetest: nodetest, predicates: predicates});
    }

    function testXPath(xpathString, elementNodes) {
        var elementNodesLength = elementNodes.length;
        var testNodes = evaluateXPath(xpathString);
        var testNodesLength = testNodes.length;

        return elementNodesLength === testNodesLength;
    }

    function anyBodyElement(nodes) {
        return nodes.some(function(node) {
            return node.nodeName.toLowerCase() === "body";
        });
    }

    function getCommonPosition(xpathStep, nodes) {
        var xpathString = "./" + xpathStep.toString(),
            nodesLength = nodes.length,
            positions = new Array(nodesLength);

        for (var i=nodesLength; i--; ) {
            var elements = evaluateXPath(xpathString, nodes[i].parentNode);
            var elementsLength = elements.length, position = 0;

            for (var j=0; j < elementsLength; j++) {
                if (elements[j].isSameNode(nodes[i])) {
                    position = j + 1;
                    break;
                }
            }

            positions[i] = position;
        }

        positions = getUniqueElements(positions);

        if (positions.length === 1) {
            return positions[0];
        }

        return 0;
    }

    function inductDataRecordXPath(elementNodes) {
        var nodes = elementNodes,
            steps = [];

        do {
            var baseStep = inductElementXPathStep(nodes);
            var xpathStep = baseStep;
            var commonClasses = getCommonClasses(nodes);
            var commonClassesLength = commonClasses.length;

            for (var i=1; i <= commonClassesLength; i++) {
                var classCombinationList = getCombinationList(commonClasses, i);
                var classCombinationListLength = classCombinationList.length;

                for (var j=0; j < classCombinationListLength; j++) {
                    xpathStep = cloneWithClassPredicates(baseStep, classCombinationList[j]);
                    var xpathSteps = [xpathStep].concat(steps);
                    var locXPath = new LocationXPath(xpathSteps);
                    var locXPathString = "/" + locXPath.toString();

                    if (testXPath(locXPathString, elementNodes)) {
                        return locXPathString;
                    }
                }
            }

            var commonPosition = getCommonPosition(xpathStep, nodes);
            if (commonPosition !== 0) {
                if (xpathStep.predicates) {
                    xpathStep.predicates.push(commonPosition);
                } else {
                    xpathStep.predicates = [commonPosition];
                }
            }

            steps.unshift(xpathStep);
            nodes = nodes.map(function(e) {
                return e.parentNode;
            });
            nodes = getUniqueElements(nodes);
        } while (!anyBodyElement(nodes));

        return "/" + new LocationXPath(steps).toString();
    }

    function reachedDataRecordNode(dataRecordNodes, nodes) {
        var nodesLength = nodes.length;

        for (var i=nodesLength; i--; ) {
            if (dataRecordNodes[i].isSameNode(nodes[i])) {
                return true;
            }
        }

        return false;
    }

    function inductLeafXPathStep(nodes) {
        if (nodes[0].nodeType === Node.ATTRIBUTE_NODE) {
            return new XPathStep({abbreviation: "@" + nodes[0].nodeName});
        }

        var nodeNames = nodes.map(function(n) {
            if (n.nodeType === Node.TEXT_NODE) {
                return "text()";
            }

            return n.nodeName.toLowerCase();
        });
        nodeNames = getUniqueElements(nodeNames);
        var xpathStep = null;

        if (nodeNames.length === 1) {
            xpathStep = new XPathStep({nodetest: nodeNames[0]});
        } else {
            var predicates = nodeNames.map(function(nodeName) {
                return "self::" + nodeName;
            });
            var predicateString = predicates.join(" or ");

            xpathStep = new XPathStep({nodetest: "node()", predicates: [predicateString]});
        }

        var indexedXPathSteps = nodes.map(function(node) {
            return getIndexedXPathStep(node);
        });
        var nodePositions = indexedXPathSteps.map(function(xs) {
            return xs.position;
        });
        nodePositions = getUniqueElements(nodePositions);

        if (nodePositions.length === 1) {
            if (xpathStep.predicates) {
                xpathStep.predicates.push(nodePositions[0]);
            } else {
                xpathStep.predicates = [nodePositions[0]];
            }
        }

        return xpathStep;
    }

    function testDataItemXPath(xpathString, dataRecordNodes, dataItemNodes) {
        var nodesLength = dataRecordNodes.length;

        for (var i=nodesLength; i--; ) {
            var testNode = evaluateXPath(xpathString, dataRecordNodes[i]);
            if (testNode.length === 0) {
                return false;
            }

            if (!testNode[0].isSameNode(dataItemNodes[i])) {
                return false;
            }
        }

        return true;
    }

    function inductDataItemXPath(dataRecordNodes, dataItemNodes) {
        var nodes = dataItemNodes,
            steps = [];

        var allNodesAreElement = nodes.every(function(node) {
            return node.nodeType === Node.ELEMENT_NODE;
        });

        if (!allNodesAreElement) {
            var leafStep = inductLeafXPathStep(nodes);
            steps.unshift(leafStep);
            nodes = nodes.map(function(e) {
                if (e.nodeType === Node.ATTRIBUTE_NODE) {
                    return e.ownerElement;
                }

                return e.parentNode;
            });
        }

        do {
            var baseStep = inductElementXPathStep(nodes);
            var xpathStep = baseStep;
            var commonClasses = getCommonClasses(nodes);
            var commonClassesLength = commonClasses.length;

            for (var i=1; i <= commonClassesLength; i++) {
                var classCombinationList = getCombinationList(commonClasses, i);
                var classCombinationListLength = classCombinationList.length;

                for (var j=0; j < classCombinationListLength; j++) {
                    xpathStep = cloneWithClassPredicates(baseStep, classCombinationList[j]);
                    var xpathSteps = [xpathStep].concat(steps);
                    var locXPath = new LocationXPath(xpathSteps);
                    var locXPathString = "./" + locXPath.toString();

                    if (testDataItemXPath(locXPathString, dataRecordNodes, dataItemNodes)) {
                        return locXPathString;
                    }
                }
            }

            var commonPosition = getCommonPosition(xpathStep, nodes);
            if (commonPosition !== 0) {
                if (xpathStep.predicates) {
                    xpathStep.predicates.push(commonPosition);
                } else {
                    xpathStep.predicates = [commonPosition];
                }
            }

            steps.unshift(xpathStep);
            nodes = nodes.map(function(e) {
                return e.parentNode;
            });
        } while (!reachedDataRecordNode(dataRecordNodes, nodes));

        return "./" + new LocationXPath(steps).toString();
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
