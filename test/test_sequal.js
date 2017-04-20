QUnit.module("editDistance");
var editDistanceTestData = [
    {
        input: ["XGYXYXYX", "XYXYXYTX"],
        output: 2
    },
    {
        input: ["XYXYXYTX", "XGYXYXYX"],
        output: 2
    },
    {
        input: ["", ""],
        output: 0
    },
    {
        input: ["telo bakar", "gedhang goreng"],
        output: 18
    },
    {
        input: ["gedhang goreng", "telo bakar"],
        output: 18
    },
    {
        input: ["telo bakar", ""],
        output: 10
    },
    {
        input: ["", "gedhang goreng"],
        output: 14
    },
    {
        input: ["course", "computer science"],
        output: 10
    },
    {
        input: ["computer science", "course"],
        output: 10
    },
    {
        input: [
            ['c', 'o', 'u', 'r', 's', 'e'],
            ['c', 'o', 'm', 'p', 'u', 't', 'e', 'r', ' ', 's', 'c', 'i', 'e', 'n', 'c', 'e']
        ],
        output: 10
    },
    {
        input: [
            ['c', 'o', 'm', 'p', 'u', 't', 'e', 'r', ' ', 's', 'c', 'i', 'e', 'n', 'c', 'e'],
            ['c', 'o', 'u', 'r', 's', 'e']
        ],
        output: 10
    }
];
QUnit.test("lcs edit distance", function(assert) {
    editDistanceTestData.forEach(function(data, index) {
        var result = Webdext.Sequal.editDistance(data.input[0], data.input[1]);
        assert.strictEqual(result, data.output);
    });
});

QUnit.module("alignPairwise");
var alignmentTestData = [
        {
            input: ["XGYXYXYX", "XYXYXYTX"],
            output: [
                ["X", "X"],
                ["G", null],
                ["Y", "Y"],
                ["X", "X"],
                ["Y", "Y"],
                ["X", "X"],
                ["Y", "Y"],
                [null, "T"],
                ["X", "X"]
            ]
        },
        {
            input: ["XYXYXYTX", "XGYXYXYX"],
            output: [
                ["X", "X"],
                [null, "G"],
                ["Y", "Y"],
                ["X", "X"],
                ["Y", "Y"],
                ["X", "X"],
                ["Y", "Y"],
                ["T", null],
                ["X", "X"]
            ]
        },
        {
            input: ["", ""],
            output: []
        },
        {
            input: ["telo bakar", ""],
            output: [
                ["t", null],
                ["e", null],
                ["l", null],
                ["o", null],
                [" ", null],
                ["b", null],
                ["a", null],
                ["k", null],
                ["a", null],
                ["r", null]
            ]
        },
        {
            input: ["", "gedhang goreng"],
            output: [
                [null, "g"],
                [null, "e"],
                [null, "d"],
                [null, "h"],
                [null, "a"],
                [null, "n"],
                [null, "g"],
                [null, " "],
                [null, "g"],
                [null, "o"],
                [null, "r"],
                [null, "e"],
                [null, "n"],
                [null, "g"]
            ]
        }
    ];
QUnit.test("align pairwise LCS cost scheme", function(assert) {
    alignmentTestData.forEach(function(data, index) {
        var result = Webdext.Sequal.alignPairwise(data.input[0], data.input[1]);
        assert.deepEqual(result, data.output);
    });
});

QUnit.module("commonSubsequenceLength");
var commonSubsequenceLengthTestData = [
    {
        input: ["XGYXYXYX", "XYXYXYTX"],
        output: 7
    },
    {
        input: ["XYXYXYTX", "XGYXYXYX"],
        output: 7
    },
    {
        input: ["", ""],
        output: 0
    },
    {
        input: ["telo bakar", "gedhang goreng"],
        output: 3
    },
    {
        input: ["gedhang goreng", "telo bakar"],
        output: 3
    },
    {
        input: ["telo bakar", ""],
        output: 0
    },
    {
        input: ["", "gedhang goreng"],
        output: 0
    },
    {
        input: ["course", "computer science"],
        output: 6
    },
    {
        input: ["computer science", "course"],
        output: 6
    },
    {
        input: [
            ['c', 'o', 'u', 'r', 's', 'e'],
            ['c', 'o', 'm', 'p', 'u', 't', 'e', 'r', ' ', 's', 'c', 'i', 'e', 'n', 'c', 'e']
        ],
        output: 6
    },
    {
        input: [
            ['c', 'o', 'm', 'p', 'u', 't', 'e', 'r', ' ', 's', 'c', 'i', 'e', 'n', 'c', 'e'],
            ['c', 'o', 'u', 'r', 's', 'e']
        ],
        output: 6
    }
];
QUnit.test("commonSubsequenceLength", function(assert) {
    commonSubsequenceLengthTestData.forEach(function(data, index) {
        var alignment = Webdext.Sequal.alignPairwise(data.input[0], data.input[1]);
        var commonSubsequenceLength = Webdext.Sequal.commonSubsequenceLength(alignment);
        assert.strictEqual(commonSubsequenceLength, data.output);
    });
});
