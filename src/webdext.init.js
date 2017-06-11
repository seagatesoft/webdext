;(function(undefined) {
    "use strict";

    function evaluateXPath(xpath, contextNode) {
        var doc = document, found, out = [], next;

        if (contextNode && typeof contextNode === "object") {
            if (contextNode.nodeType === document.DOCUMENT_NODE) {
                doc = contextNode;
            }
            else {
                doc = contextNode.ownerDocument;
            }
        }

        found = doc.evaluate(xpath, contextNode || doc, null, XPathResult.ANY_TYPE, null);

        switch (found.resultType) {
        case found.STRING_TYPE: return found.stringValue;
        case found.NUMBER_TYPE: return found.numberValue;
        case found.BOOLEAN_TYPE: return found.booleanValue;
        default:
            while ((next = found.iterateNext())) {
                out.push(next);
            }
            return out;
        }
    }

    function getValueFromPairMap(map, e1, e2) {
        if (map.has(e1) && map.get(e1).has(e2)) {
            return map.get(e1).get(e2);
        } else if (map.has(e2) && map.get(e2).has(e1)) {
            return map.get(e2).get(e1);
        }
    }

    var Webdext = {
        evaluateXPath: evaluateXPath,
        getValueFromPairMap: getValueFromPairMap
    };
    Object.defineProperty(Webdext, "version", {value: "0.0.1"});

    // exports
    this.Webdext = Webdext;
}).call(this);
