;(function(undefined) {
    "use strict";

    function evaluateXpath(xpath, contextNode) {
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

    var Webdext = {
        evaluateXpath: evaluateXpath
    };
    Object.defineProperty(Webdext, "version", {value: "0.0.1"});

    // exports
    this.Webdext = Webdext;
}).call(this);
