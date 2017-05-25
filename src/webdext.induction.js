;(function(undefined) {
    "use strict";

    // imports
    var XPathStep = Webdext.Model.XPathStep,
        LocationXPath = Webdext.Model.LocationXPath,
        IndexedXPath = Webdext.Model.IndexedXPath;

    var operationsCosts = {
        alignmentCost: function(s1, s2) {
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
        },
        insertionCost: function() {
            return 4;
        },
        deletionCost: function() {
            return 4;
        }
    };

    function alignIndexedXPaths(indexedXPaths) {
        if (!Array.isArray(indexedXPaths)) {
            throw new Error("Parameter must be an array.");
        }

        for (var i=0, n = indexedXPaths.length; i < n; i++) {
            if (!(steps[i] instanceof IndexedXPath)) {
                throw new Error("All parameter elements must be an instance of IndexedXPath.");
            }
        }

        // @todo:
        // @return array of LocationXPath
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

    // exports
    Webdext.Induction = {
        alignIndexedXPaths: alignIndexedXPaths,
        mergeAlignedXPaths: mergeAlignedXPaths
    };
}).call(this);
