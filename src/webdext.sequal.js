;(function(undefined) {
    "use strict";

    function defaultSubstitutionCost(e1, e2) {
        if (e1 === e2) {
            return 0;
        }

        return Number.MAX_VALUE;
    }

    function defaultInsertionCost() {
        return 1;
    }

    function defaultDeletionCost() {
        return 1;
    }

    function editDistance(s1, s2, substitutionCost, insertionCost, deletionCost) {
        if (typeof substitutionCost === "undefined" || substitutionCost === null) {
            substitutionCost = defaultSubstitutionCost;
        } else if (typeof substitutionCost !== "function") {
            throw new TypeError("substitutionCost must be a function.");
        }

        if (typeof insertionCost === "undefined" || insertionCost === null) {
            insertionCost = defaultInsertionCost;
        } else if (typeof insertionCost !== "function") {
            throw new TypeError("insertionCost must be a function.");
        }

        if (typeof deletionCost === "undefined" || deletionCost === null) {
            deletionCost = defaultDeletionCost;
        } else if (typeof deletionCost !== "function") {
            throw new TypeError("deletionCost must be a function.");
        }

        var m = new Array(s1.length+1);
        
        for (var i=0; i <= s1.length; i++) {
            m[i] = new Array(s2.length+1);
            m[i][0] = i;
        }

        for (var j=1; j <= s2.length; j++) {
            m[0][j] = j;
        }

        for (i=1; i <= s1.length; i++) {
            for (j=1; j <= s2.length; j++) {
                var alignment = m[i-1][j-1] + substitutionCost(s1[i-1], s2[j-1]);
                var insertion = m[i][j-1] + insertionCost(s2[j-1]);
                var deletion = m[i-1][j] + deletionCost(s1[i-1]);

                m[i][j] = Math.min(alignment, insertion, deletion);
            }
        }

        return m[s1.length][s2.length];
    }

    function alignPairwise(s1, s2, substitutionCost, insertionCost, deletionCost) {
        if (typeof substitutionCost === "undefined" || substitutionCost === null) {
            substitutionCost = defaultSubstitutionCost;
        } else if (typeof substitutionCost !== "function") {
            throw new TypeError("substitutionCost must be a function.");
        }

        if (typeof insertionCost === "undefined" || insertionCost === null) {
            insertionCost = defaultInsertionCost;
        } else if (typeof insertionCost !== "function") {
            throw new TypeError("insertionCost must be a function.");
        }

        if (typeof deletionCost === "undefined" || deletionCost === null) {
            deletionCost = defaultDeletionCost;
        } else if (typeof deletionCost !== "function") {
            throw new TypeError("deletionCost must be a function.");
        }

        var STEP = {
                "Alignment": 0,
                "Insertion": 1,
                "Deletion": 2
            },
            m = new Array(s1.length+1),
            steps = new Array(s1.length+1);
        
        for (var i=0; i <= s1.length; i++) {
            m[i] = new Array(s2.length+1);
            m[i][0] = i;
            steps[i] = new Array(s2.length+1);

            if (i === 0) {
                steps[i][0] = STEP.Alignment;
            } else {
                steps[i][0] = STEP.Deletion;
            }
        }

        for (var j=1; j <= s2.length; j++) {
            m[0][j] = j;
            steps[0][j] = STEP.Insertion;
        }

        for (i=1; i <= s1.length; i++) {
            for (j=1; j <= s2.length; j++) {
                var alignment = m[i-1][j-1] + substitutionCost(s1[i-1], s2[j-1]);
                var insertion = m[i][j-1] + insertionCost(s2[j-1]);
                var deletion = m[i-1][j] + deletionCost(s1[i-1]);

                m[i][j] = Math.min(alignment, insertion, deletion);

                if (m[i][j] === alignment) {
                    steps[i][j] = STEP.Alignment;
                } else if (m[i][j] === insertion) {
                    steps[i][j] = STEP.Insertion;
                } else if (m[i][j] === deletion) {
                    steps[i][j] = STEP.Deletion;
                }
            }
        }

        i = s1.length;
        j = s2.length;
        var alignedSequence = [];

        while(i > 0 || j > 0) {
            var step = steps[i][j];
            if (step === STEP.Alignment) {
                alignedSequence.push([s1[i-1], s2[j-1]]);
                i--;
                j--;
            } else if (step === STEP.Insertion) {
                alignedSequence.push([null, s2[j-1]]);
                j--;
            } else if (step === STEP.Deletion) {
                alignedSequence.push([s1[i-1], null]);
                i--;
            }
        }

        alignedSequence.reverse();

        return alignedSequence;
    }

    // @TODO
    // function alignMultiple = function(sequences) {
    // };

    function commonSubsequenceLength(alignment) {
        var counter = 0;

        for (var i=0; i < alignment.length; i++) {
            var common = true,
                first = alignment[i][0];

            if (first === null) {
                common = false;
            } else {
                for (var j=1; j < alignment[i].length; j++) {
                    if (alignment[i][j] === null) {
                        common = false;
                        break;
                    } else if (alignment[i][j] !== first) {
                        common = false;
                        break;
                    }
                }
            }

            if (common) {
                counter++;
            }
        }

        return counter;
    }

    Webdext.Sequal = {
        editDistance: editDistance,
        alignPairwise: alignPairwise,
        commonSubsequenceLength: commonSubsequenceLength
    };
}).call(this);
