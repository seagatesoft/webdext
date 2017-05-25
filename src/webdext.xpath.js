;(function(undefined) {
    "use strict";

    // imports
    var evaluateXPath = Webdext.evaluateXPath;

    function XPathStep(properties) {
        if (typeof properties !== "object") {
            throw new TypeError("Constructor only accepts object as argument.");
        }

        if (properties === null) {
            throw new TypeError("Constructor argument must not null.");
        }

        var paramNames = ["abbreviation", "axis", "nodetest", "predicates"];
        for (var key in properties) {
            if (paramNames.indexOf(key) === -1) {
                throw new Error(
                    "Illegal constructor argument, property: " + key + " is not supported."
                );
            }
        }

        if ("abbreviation" in properties && Object.keys(properties).length > 1) {
            throw new Error("abbreviation property can't be passed with other properties.");
        }

        if (!("abbreviation" in properties || "nodetest" in properties)) {
            throw new Error(
                "nodetest property is mandatory when the XPathStep is not an abbreviation."
            );
        }

        if ("abbreviation" in properties) {
            this.abbreviation = properties.abbreviation;
        } else {
            if ("predicates" in properties) {
                if (Array.isArray(properties.predicates)) {
                    this.predicates = properties.predicates;
                } else {
                    throw new TypeError("predicates property must be an Array.");
                }
            }

            this.nodetest = properties.nodetest;

            if ("axis" in properties) {
                this.axis = properties.axis;
            }
        }
    }
    XPathStep.prototype.toString = function() {
        if (this.abbreviation) {
            return this.abbreviation;
        }

        var stepStr = "";

        if (this.axis) {
            stepStr += this.axis + "::" + this.nodetest;
        } else {
            stepStr += this.nodetest;
        }

        if (this.predicates) {
            var predicatesLength = this.predicates.length;
            for (var i=0; i < predicatesLength; i++) {
                stepStr += "[" + this.predicates[i] + "]";
            }
        }

        return stepStr;
    };

    function LocationXPath(steps, absolute) {
        if (!Array.isArray(steps)) {
            throw new TypeError("Constructor argument must be an array");
        }

        for (var i=steps.length; i--; ) {
            if (!(steps[i] instanceof XPathStep)) {
                throw new TypeError("All steps element must be an instance of XPathStep.");
            }
        }

        if (typeof absolute !== "undefined" && typeof absolute !== "boolean") {
            throw new TypeError("absolute parameter must be a boolean.");
        }

        this.steps = steps;

        if (typeof absolute === "undefined") {
            this.absolute = true;
        } else {
            this.absolute = absolute;
        }
    }
    LocationXPath.prototype.toString = function() {
        if (this.absolute) {
            return "/" + this.steps.join("/");
        } else {
            return "./" + this.steps.join("/");
        }
    };

    function IndexedXPathStep(nodetest, position) {
        if (!/^[1-9][0-9]*$/.test(position)) {
            throw new TypeError("Second parameter must be a positional predicate (an integer > 0).");
        }

        var properties = {
            nodetest: nodetest,
            predicates: [position]
        };
        XPathStep.call(this, properties);
    }
    IndexedXPathStep.prototype = Object.create(
        XPathStep.prototype,
        {
            constructor: {
                configurable: true,
                enumerable: true,
                value: IndexedXPathStep,
                writable: true
            },

            position: {
                configurable: true,
                enumerable: true,
                get: function() {
                    return this.predicates[0];
                }
            }
        }
    );

    function IndexedXPath(steps, absolute) {
        for (var i=steps.length; i--; ) {
            if (!(steps[i] instanceof IndexedXPathStep)) {
                throw new TypeError("All steps element must be an instance of IndexedXPathStep.");
            }
        }

        LocationXPath.call(this, steps, absolute);
    }
    IndexedXPath.prototype = Object.create(
        LocationXPath.prototype,
        {
            constructor: {
                configurable: true,
                enumerable: true,
                value: IndexedXPath,
                writable: true
            }
        }
    );

    function getIndexedXPathStep(node) {
        var nodetest = "node()";

        if (node.nodeType === Node.ELEMENT_NODE) {
            nodetest = node.tagName.toLowerCase();
        } else if (node.nodeType === Node.TEXT_NODE) {
            nodetest = "text()";
        }

        var elements = evaluateXPath("./" + nodetest, node.parentNode);
        var elementsLength =  elements.length, position = 0;

        for (var i=0; i < elementsLength; i++) {
            if (elements[i].isSameNode(node)) {
                position = i + 1;
                break;
            }
        }

        return new IndexedXPathStep(nodetest, position);
    }

    function getIndexedXPath(node) {
        var steps = [];
        var goUp = true;

        while (goUp) {
            if (node.nodeName.toUpperCase() === "HTML") {
                goUp = false;
            }

            var step = getIndexedXPathStep(node);
            steps.push(step);
            node = node.parentNode;
        }
        
        return new IndexedXPath(steps.reverse());
    }

    function parseIndexedXPath(str) {
        var splitted = str.split("/");
        var absolute = splitted[0] === "";
        splitted.shift();
        var stepPattern = /([0-9a-zA-Z@()]+)\[(\d+)\]/;
        var nOfSteps = splitted.length;
        var indexedXPathSteps = [];

        for (var i=0; i < nOfSteps; i++) {
            var matches = stepPattern.exec(splitted[i]);
            var step = new IndexedXPathStep(matches[1], parseInt(matches[2]));
            indexedXPathSteps.push(step);
        }

        return new IndexedXPath(indexedXPathSteps, absolute);
    }

    // exports
    Webdext.XPath = {
        XPathStep: XPathStep,
        LocationXPath: LocationXPath,
        IndexedXPathStep: IndexedXPathStep,
        IndexedXPath: IndexedXPath,
        getIndexedXPathStep: getIndexedXPathStep,
        getIndexedXPath: getIndexedXPath,
        parseIndexedXPath: parseIndexedXPath
    };
}).call(this);
