;(function(undefined) {
    "use strict";

    // imports
    var evaluateXPath = Webdext.evaluateXPath;

    var DATA_TYPE = {
        TEXT: 1,
        HYPERLINK: 2,
        IMAGE: 3
    };
    var SKIP_ELEMENTS = ["SCRIPT", "STYLE", "OBJECT", "PARAM"];

    var nodeIndexCounter = 0;

    /*
     * When native Map implementation is not available on the environment 
     */
    if (typeof Map === "undefined") {
        var Iterator = function(data) {
            this.data = data;
            this.currentIndex = 0;
        };
        Iterator.prototype.next = function() {
            if (this.currentIndex >= this.data.length) {
                return {value: undefined, done: true};
            }

            return {value: this.data[this.currentIndex++], done: false};
        };
        var MapIterator = function(map) {
            this.map = map;
            this.currentIndex = 0;
        };
        MapIterator.prototype.next = function() {
            if (this.currentIndex >= this.map._keys.length) {
                return {value: undefined, done: true};
            }

            var value = [];
            value.push(this.map._keys[this.currentIndex]);
            value.push(this.map._values[this.currentIndex]);
            this.currentIndex++;

            return {value: value, done: false};
        };

        this.Map = function() {
            this._keys = [];
            this._values = [];
        };
        this.Map.prototype.set = function(key, value) {
            var index = this._keys.indexOf(key);
            if (index === -1) {
                this._keys.push(key);
                this._values.push(value);
            } else {
                this._values[index] = value;
            }
        };
        this.Map.prototype.get = function(key) {
            var index = this._keys.indexOf(key);
            if (index !== -1) {
                return this._values[index];
            }
        };
        this.Map.prototype.delete = function(key) {
            var index = this._keys.indexOf(key);
            if (index > -1) {
                this._keys.splice(index, 1);
                return this._values.splice(index, 1)[0];
            } else {
                return null;
            }
        };
        this.Map.prototype.has = function(key) {
            return !(this._keys.indexOf(key) === -1);
        };
        this.Map.prototype.clear = function() {
            this._keys.splice(0, this._keys.length);
            this._values.splice(0, this._values.length);
        };
        this.Map.prototype.keys = function() {
            return new Iterator(this._keys);
        };
        this.Map.prototype.values = function() {
            return new Iterator(this._values);
        };
        this.Map.prototype.entries = function() {
            return new MapIterator(this);
        };

        Object.defineProperty(
            this.Map.prototype,
            "size",
            {
                get: function() {
                    return this._keys.length;
                }
            }
        );
    }

    function mergeArrayUnique(array1, array2) {
        var mergeArray = array1.concat([]);
        var array2Length = array2.length;

        for (var i=0; i < array2Length; i++) {
            var element = array2[i];
            if (mergeArray.indexOf(element) === -1) {
                mergeArray.push(element);
            }
        }

        return mergeArray;
    }

    function Vertex(data) {
        if (data) {
            this.data = data;
        } else {
            this.data = [];
        }
    }

    function DirectedAcyclicGraph(vertices) {
        if (vertices) {
            this.vertices = vertices;
        } else {
            this.vertices = [];
        }

        this.outboundMap = new Map();
    }

    DirectedAcyclicGraph.prototype.addVertex = function(vertex) {
        this.vertices.push(vertex);
    };
    DirectedAcyclicGraph.prototype.numOfVertices = function() {
        return this.vertices.length;
    };
    DirectedAcyclicGraph.prototype.createEdge = function(fromVertex, toVertex) {
        var outboundVertices = this.outboundMap.get(fromVertex);
        if (outboundVertices) {
            if (outboundVertices.indexOf(toVertex) === -1) {
                outboundVertices.push(toVertex);
            }
        } else {
            outboundVertices = [toVertex];
        }
    };
    DirectedAcyclicGraph.prototype._isBeforeOrder = function(vertex1, vertex2) {
        var outboundVertices = this.outboundMap.get(vertex1);

        if (!outboundVertices) {
            return false;
        }

        if (outboundVertices.indexOf(vertex2) > -1) {
            return true;
        }

        for (var i=outboundVertices.length; i--; ) {
            if (this._isBeforeOrder(outboundVertices[i], vertex2)) {
                return true;
            }
        }

        return false;
    };
    DirectedAcyclicGraph.prototype.isBeforeOrder = function(vertex1, vertex2) {
        if (vertex1 === vertex2) {
            return false;
        }

        var isVertex1BeforeVertex2 = this._isBeforeOrder(vertex1, vertex2);
        var isVertex2BeforeVertex1 = this._isBeforeOrder(vertex2, vertex1);

        if (isVertex1BeforeVertex2) {
            return true;
        }

        if (isVertex2BeforeVertex1) {
            return false;
        }

        this.createEdge(vertex1, vertex2);

        return true;
    };
    DirectedAcyclicGraph.prototype.isPathExists = function(vertex1, vertex2) {
        if (vertex1 === vertex2) {
            return true;
        }

        var isVertex1BeforeVertex2 = this._isBeforeOrder(vertex1, vertex2);
        var isVertex2BeforeVertex1 = this._isBeforeOrder(vertex2, vertex1);

        return isVertex1BeforeVertex2 || isVertex2BeforeVertex1;
    };
    DirectedAcyclicGraph.prototype.mergeVertices = function(vertex1, vertex2) {
        var mergedData = mergeArrayUnique(vertex1.data, vertex2.data);
        var mergedVertex = new Vertex(mergedData);
        this.vertices.splice(this.vertices.indexOf(vertex1), 1);
        this.vertices.splice(this.vertices.indexOf(vertex2), 1);
        this.vertices.push(mergedVertex);

        var outboundVertices1 = this.outboundMap.get(vertex1);
        var outboundVertices2 = this.outboundMap.get(vertex2);

        if (!outboundVertices1 && !Array.isArray(outboundVertices1)) {
            outboundVertices1 = [];
        }

        if (!outboundVertices2 && !Array.isArray(outboundVertices2)) {
            outboundVertices2 = [];
        }

        var outboundVertices = outboundVertices1.concat(outboundVertices2);
        if (outboundVertices.length > 0) {
            this.outboundMap.delete(vertex1);
            this.outboundMap.delete(vertex2);
            this.outboundMap.set(mergedVertex, outboundVertices);
        }

        var valueIterator = this.outboundMap.values(),
            value = valueIterator.next();

        while (!value.done) {
            var indexOfVertex1 = value.value.indexOf(vertex1);
            var indexOfVertex2 = value.value.indexOf(vertex2);

            if (indexOfVertex1 > -1) {
                value.value.splice(indexOfVertex1, 1);
            }

            if (indexOfVertex2 > -1) {
                value.value.splice(indexOfVertex2, 1);
            }

            if (indexOfVertex1 > -1 || indexOfVertex2 > -1) {
                value.value.push(mergedVertex);
            }

            value = valueIterator.next();
        }

        return mergedVertex;
    };

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

    function TagPathStep(tagName, direction) {
        this.tagName = tagName;
        this.direction = direction;
        this.value = this.tagName + "," + this.direction;
    }
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
        this.nodeIndex = null;
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
        this.coordinate = {
            "top": rect.top,
            "left": rect.left
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
            },
            dataContent: {
                get: function() {
                    var leafNodes = this.getLeafNodes();
                    var leafNodesLength = leafNodes.length;
                    var dc = [];

                    for (var i=0; i < leafNodesLength; i++) {
                        var leafNode = leafNodes[i];

                        if (!leafNode.isSeparatorNode()) {
                            dc.push(leafNode.dataContent);
                        }
                    }

                    return dc.join(" ");
                }
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
            },
            dataContent: {
                get: function() {
                    return this.textContent;
                }
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
            },
            dataContent: {
                get: function() {
                    if (this.href) {
                        return this.href.url;
                    }

                    return "";
                }
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
            },
            dataContent: {
                get: function() {
                    if (this.src) {
                        return this.src.url;
                    }

                    return "";
                }
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
                wNode.nodeIndex = nodeIndexCounter++;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.nodeName.toUpperCase() === "IMG") {
                wNode = new WImageNode(node, wParent);
                wNode.nodeIndex = nodeIndexCounter++;
            } else {
                try {
                    wNode = new WElementNode(node, wParent);
                    wNode.nodeIndex = nodeIndexCounter++;
                } catch (error) {
                    console.error(error);
                }

                if (node.nodeName.toUpperCase() === "A") {
                    var wHyperlinkNode = new WHyperlinkNode(node, wNode);
                    wHyperlinkNode.nodeIndex = nodeIndexCounter++;
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
                    var currentNode = evaluateXPath(child.indexedXPath.valueOf())[0];
                    if (node.isSameNode(currentNode)) {
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

        Vertex: Vertex,
        DirectedAcyclicGraph: DirectedAcyclicGraph,

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
