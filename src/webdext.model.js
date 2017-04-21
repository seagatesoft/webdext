;(function(undefined) {
    "use strict";

    var DATA_TYPE = {
        TEXT: 0,
        HYPERLINK: 1,
        IMAGE: 2
    };
    var SKIP_ELEMENTS = ["SCRIPT", "STYLE", "OBJECT", "PARAM"];

    /*
     * When native Map implementation is not available on the environment 
     */
    if (typeof Map === "undefined") {
        this.Map = function() {
            this.keys = [];
            this.values = [];
        };
        this.Map.prototype.set = function(key, value) {
            var index = this.keys.indexOf(key);
            if (index === -1) {
                this.keys.push(key);
                this.values.push(value);
            } else {
                this.values[index] = value;
            }
        };
        this.Map.prototype.get = function(key) {
            var index = this.keys.indexOf(key);
            if (index !== -1) {
                return this.values[index];
            }
        };
        this.Map.prototype.delete = function(key) {
            var index = this.keys.indexOf(key);
            if (index > -1) {
                this.keys.splice(index, 1);
                return this.values.splice(index, 1)[0];
            } else {
                return null;
            }
        };
        this.Map.prototype.has = function(key) {
            return !(this.keys.indexOf(key) === -1);
        };
        this.Map.prototype.clear = function() {
            this.keys.splice(0, this.keys.length);
            this.values.splice(0, this.values.length);
        };

        Object.defineProperty(
            this.Map.prototype,
            "size",
            {
                get: function() {
                    return this.keys.length;
                }
            }
        );
    }

    function normVector(vector) {
        var values = [];
        for (var key in vector) {
            values.push(vector[key]);
        }

        if (Math.hasOwnProperty("hypot")) {
            return Math.hypot.apply(null, values);
        } else {
            var sum = 0, valuesLength = values.length;
            for (var i=valuesLength; i--; ) {
                sum += Math.pow(values[i], 2);
            }
            return Math.sqrt(sum);
        }
    }

    function parseUrl(url) {
        var parsedUrl = new URL(url);

        if (Object.keys(parsedUrl).length > 0) {
            return {
                "url": url,
                "hostname": parsedUrl.hostname,
                "pathname": parsedUrl.pathname
            };
        }

        var parser = document.createElement("a");
        parser.href = url;

        return {
            "url": url,
            "hostname": parser.hostname,
            "pathname": parser.pathname
        };
    }

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

        var elements = Webdext.evaluateXpath("./" + nodetest, node.parentNode);
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

    function TagPathStep(tagName, direction) {
        this.tagName = tagName;
        this.direction = direction;
    }
    TagPathStep.prototype.valueOf = function() {
        return this.tagName + "," + this.direction;
    };
    TagPathStep.prototype.toString = function() {
        return "<" + this.tagName + ">" + this.direction;
    };

    function getTagPath(node, contextNode) {
        if (typeof contextNode === "undefined") {
            contextNode = document.documentElement.parentNode;
        }

        var tagPath = [],
            currentNode = node;

        while (currentNode !== contextNode) {
            var prevSibling = currentNode.previousSibling,
                parentNode = currentNode.parentNode;

            if (
                    prevSibling !== null && 
                    [Node.ELEMENT_NODE, Node.TEXT_NODE].indexOf(prevSibling.nodeType) > -1
            ) {
                tagPath.push(new TagPathStep(prevSibling.nodeName, "S"));
                currentNode = prevSibling;
            } else if (prevSibling !== null) {
                currentNode = prevSibling;
            } else if (parentNode.nodeType === Node.ELEMENT_NODE) {
                tagPath.push(new TagPathStep(parentNode.nodeName, "C"));
                currentNode = parentNode;
            } else {
                currentNode = contextNode;
            }
        }

        return tagPath.reverse();
    }

    function createTermFrequencyVector(text) {
        var termFrequencyVector = {},
            terms = text.toLocaleLowerCase().split(" ");

        for (var i=terms.length; i--; ) {
            var term = terms[i];
            if (term in termFrequencyVector) {
                termFrequencyVector[term]++;
            } else {
                termFrequencyVector[term] = 1;
            }
        }

        return termFrequencyVector;
    }

    function getPresentationStyle(node) {
        var computedNode = node.nodeType === Node.TEXT_NODE ? node.parentNode : node,
            style = window.getComputedStyle(computedNode),
            fontWeightMap = {
                "lighter": "100",
                "normal": "400",
                "bold": "700"
            },
            fontWeight = style.fontWeight;

        if (fontWeight in fontWeightMap) {
            fontWeight = fontWeightMap[fontWeight];
        }

        var textDecoration = style.textDecoration;
        if ("textDecorationLine" in style) {
            textDecoration = style.textDecorationLine;
        }

        return {
            "fontFamily": style.fontFamily,
            "fontSize": style.fontSize,
            "color": style.color,
            "fontWeight": fontWeight,
            "textDecoration": textDecoration,
            "fontStyle": style.fontStyle
        };
    }

    function WNode(node, wParent) {
        this.indexedXPath = getIndexedXPath(node);

        if (typeof wParent === "undefined" || wParent === null) {
            this.parent = null;
        } else {
            this.parent = wParent;
            this.parent.addChild(this);
        }
    }
    WNode.prototype.valueOf = function() {
        return this.indexedXPath.toString();
    };
    WNode.prototype.getSiblingIndex = function() {
        if (this.parent !== null) {
            return this.parent.getChildIndex(this);
        }

        return 0;
    };

    function WElementNode(node, wParent) {
        WNode.call(this, node, wParent);
        this.tagName = node.nodeName;
        this.children = null;

        var rect = node.getBoundingClientRect();
        this.area = rect.width * rect.height;
        this.rectangleSize = {
            "width": rect.width,
            "height": rect.height
        };    
    }
    WElementNode.prototype = Object.create(
        WNode.prototype,
        {
            constructor: {
                configurable: true,
                enumerable: true,
                value: WElementNode,
                writable: true
            }
        }
    );
    WElementNode.prototype.addChild = function(wNode) {
        if (this.children === null) {
            this.children = [];
        }

        if (wNode instanceof WNode) {
            this.children.push(wNode);
        } else {
            throw new TypeError("addChild() must receive a WNode argument.");
        }
    };
    WElementNode.prototype.isLeafNode = function() {
        return this.getChildrenCount() === 0;
    };
    WElementNode.prototype.isSeparatorNode = function() {
        if (this.isLeafNode()) {
            return true;
        } else {
            var leafNodes = this.getLeafNodes();
            return leafNodes.every(function(l) {
                return l.isSeparatorNode();
            });
        }
    };
    WElementNode.prototype.getChild = function(childIndex) {
        if (this.children === null) {
            throw new RangeError("This node doesn't have any children.");
        }

        if (childIndex > this.children.length || childIndex < 1) {
            throw new RangeError("childIndex is out of range when calling getChild().");
        }

        return this.children[childIndex-1];
    };
    WElementNode.prototype.getChildIndex = function(wNode) {
        if (this.children === null) {
            return 0;
        }

        return this.children.indexOf(wNode) + 1;
    };
    WElementNode.prototype.getChildrenCount = function() {
        if (this.children === null) {
            return 0;
        }

        return this.children.length;
    };
    WElementNode.prototype.getChildrenSubset = function(startIndex, stopIndex) {
        if (typeof stopIndex === "undefined") {
            stopIndex = this.children.length;
        }

        if (this.children === null) {
            throw new RangeError("This node doesn't have any children.");
        }

        var n_of_children = this.children.length;
        if (n_of_children === 0) {
            throw new RangeError("This node doesn't have any children.");
        } else if (startIndex > n_of_children) {
            throw new RangeError("startIndex is out of range.");
        } else if (stopIndex > n_of_children) {
            throw new RangeError("stopIndex is out of range.");
        } else if (startIndex <= 0) {
            throw new RangeError("startIndex can't be less than or equals to zero.");
        } else if (stopIndex <= 0) {
            throw new RangeError("stopIndex can't be less than or equals to zero.");
        } else if (startIndex > stopIndex) {
            throw new RangeError("startIndex can't be greater than stopIndex.");
        }

        return this.children.slice(startIndex-1, stopIndex);
    };
    WElementNode.prototype.getLeafNodes = function() {
        if (this.isLeafNode()) {
            return [this];
        }

        var leafNodes = [],
            childrenLength = this.children.length;

        for (var i=0; i < childrenLength; i++) {
            var c = this.children[i];

            if (c.isLeafNode()) {
                leafNodes.push(c);
            } else {
                var childLeafNodes = c.getLeafNodes();
                var childLeafNodesLength = childLeafNodes.length;

                for (var j=0; j < childLeafNodesLength; j++) {
                    leafNodes.push(childLeafNodes[j]);
                }
            }
        }

        return leafNodes;
    };

    function WTextNode (node, wParent) {
        WNode.call(this, node, wParent);
        this.tagPath = getTagPath(node);
        this.textContent = node.nodeValue.trim().replace(/\s+/, " ");
        this.termFrequencyVector = createTermFrequencyVector(this.textContent);
        this.normVector = normVector(this.termFrequencyVector);
        this.dataType = DATA_TYPE.TEXT;
        this.presentationStyle = getPresentationStyle(node);
    }
    WTextNode.prototype = Object.create(
        WNode.prototype,
        {
            constructor: {
                configurable: true,
                enumerable: true,
                value: WTextNode,
                writable: true
            }
        }
    );
    WTextNode.prototype.isLeafNode = function() {
        return true;
    };
    WTextNode.prototype.isSeparatorNode = function() {
        return false;
    };
    WTextNode.prototype.getLeafNodes = function() {
        return [this];
    };

    function WHyperlinkNode(node, wParent) {
        WNode.call(this, node, wParent);
        this.tagPath = getTagPath(node);

        if (node.href) {
            this.href = parseUrl(node.href);
        } else {
            this.href = null;
        }

        this.dataType = DATA_TYPE.HYPERLINK;
        this.presentationStyle = getPresentationStyle(node);
    }
    WHyperlinkNode.prototype = Object.create(
        WNode.prototype,
        {
            constructor: {
                configurable: true,
                enumerable: true,
                value: WHyperlinkNode,
                writable: true
            }
        }
    );
    WHyperlinkNode.prototype.valueOf = function() {
        return this.indexedXPath.toString() + "/@href";
    };
    WHyperlinkNode.prototype.isLeafNode = function() {
        return true;
    };
    WHyperlinkNode.prototype.isSeparatorNode = function() {
        return false;
    };
    WHyperlinkNode.prototype.getLeafNodes = function() {
        return [this];
    };

    function WImageNode (node, wParent) {
        WElementNode.call(this, node, wParent);
        this.tagPath = getTagPath(node);

        if (node.src) {
            this.src = parseUrl(node.src);
        } else {
            this.src = null;
        }

        this.dataType = DATA_TYPE.IMAGE;
    }
    WImageNode.prototype = Object.create(
        WElementNode.prototype,
        {
            constructor: {
                configurable: true,
                enumerable: true,
                value: WImageNode,
                writable: true
            }
        }
    );
    WImageNode.prototype.isLeafNode = function() {
        return true;
    };
    WImageNode.prototype.isSeparatorNode = function() {
        return false;
    };
    WImageNode.prototype.getLeafNodes = function() {
        return [this];
    };

    function createWNode(node, wParent) {
        var wNode = null;

        if (node.nodeType === Node.TEXT_NODE) {
            // don't create WTextNode for whitespace between elements
            if (node.nodeValue.trim().replace(/\s+/, " ") !== "") {
                wNode = new WTextNode(node, wParent);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.nodeName.toUpperCase() === "IMG") {
                wNode = new WImageNode(node, wParent);
            } else {
                try {
                    wNode = new WElementNode(node, wParent);
                } catch (error) {
                    console.error(error);
                }

                if (node.nodeName.toUpperCase() === "A") {
                    new WHyperlinkNode(node, wNode);
                }
            }
        }

        return wNode;
    }

    function createWTree(node, wParent) {
        if (typeof node === "undefined") {
            node = document.documentElement;
        }

        var wNode = createWNode(node, wParent);

        // skip HEAD children, we don't need them for data extraction
        if (node.nodeName === "HEAD") {
            return wNode;
        }

        var childNodes = node.childNodes;
        var cnLength = childNodes.length;

        for (var i=0; i < cnLength; i++) {
            var childNode = childNodes[i];
            if ([Node.ELEMENT_NODE, Node.TEXT_NODE].indexOf(childNode.nodeType) === -1) {
                continue;
            }
            if (SKIP_ELEMENTS.indexOf(childNode.nodeName.toUpperCase()) > -1) {
                continue;
            }
            createWTree(childNode, wNode);
        }

        return wNode;
    }

    function findWNode(node, wRoot) {
        var indexedXPath = getIndexedXPath(node);
        // we don't need HTML step
        var steps = indexedXPath.steps.slice(1);
        var wNode = wRoot;

        while (steps.length > 0) {
            var step = steps.shift();
            var childrenCount = wNode.getChildrenCount();
            var index = 0;
            var isFound = false;

            for (var i=0; i < childrenCount; i++) {
                var child = wNode.getChild(i+1);
                if (child instanceof WElementNode) {
                    if (child.tagName === step.nodetest.toUpperCase()) {
                        index++;
                        if (index === step.position) {
                            wNode = child;
                            isFound = true;
                            break;
                        }
                    }
                } else if (child.dataType === DATA_TYPE.TEXT) {
                    index++;
                    if (index === step.position) {
                        wNode = child;
                        isFound = true;
                        break;
                    }
                }
            }

            if (!isFound) {
                return null;
            }
        }

        return wNode;
    }

    // exports
    Webdext.Model = {
        DATA_TYPE: DATA_TYPE,
        SKIP_ELEMENTS: SKIP_ELEMENTS,

        normVector: normVector,
        parseUrl: parseUrl,

        XPathStep: XPathStep,
        LocationXPath: LocationXPath,
        IndexedXPathStep: IndexedXPathStep,
        IndexedXPath: IndexedXPath,
        getIndexedXPathStep: getIndexedXPathStep,
        getIndexedXPath: getIndexedXPath,

        TagPathStep: TagPathStep,
        getTagPath: getTagPath,

        createTermFrequencyVector: createTermFrequencyVector,
        getPresentationStyle: getPresentationStyle,

        WNode: WNode,
        WElementNode: WElementNode,
        WTextNode: WTextNode,
        WHyperlinkNode: WHyperlinkNode,
        WImageNode: WImageNode,

        createWNode: createWNode,
        createWTree: createWTree,
        findWNode: findWNode
    };
}).call(this);
