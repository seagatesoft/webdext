var gulp = require("gulp");
var concat = require("gulp-concat");

var intellExtractChromeFiles = [
  "src/webdext.init.js",
  "src/webdext.xpath.js",
  "src/webdext.sequal.js",
  "src/webdext.model.js",
  "src/webdext.similarity.js",
  "src/webdext.extraction.js",
  "src/webdext.chrome.intellextract.js"
];
var wrapperExtractChromeFiles = [
  "src/webdext.init.js",
  "src/webdext.wrapper.js",
  "src/webdext.chrome.wrapperextract.js"
];
var inductWrapperChromeFiles = [
  "src/webdext.init.js",
  "src/webdext.xpath.js",
  "src/webdext.sequal.js",
  "src/webdext.induction.js",
  "src/webdext.chrome.inductwrapper.js"
];

var intellExtractHeadlessFiles = [
  "src/webdext.init.js",
  "src/webdext.xpath.js",
  "src/webdext.sequal.js",
  "src/webdext.model.js",
  "src/webdext.similarity.js",
  "src/webdext.extraction.js"
];
var wrapperExtractHeadlessFiles = [
  "src/webdext.init.js",
  "src/webdext.wrapper.js"
];

var chromeDebugFiles = [
  "src/webdext.init.js",
  "src/webdext.xpath.js",
  "src/webdext.sequal.js",
  "src/webdext.model.js",
  "src/webdext.similarity.js",
  "src/webdext.extraction.js",
  "src/webdext.wrapper.js",
  "src/webdext.induction.js"
];

gulp.task("build-chrome", [], function() {
  console.log("Build as Chrome extension");
  gulp.src(intellExtractChromeFiles)
      .pipe(concat("webdext-intellextract.js"))
      .pipe(gulp.dest("build/"));
  gulp.src(wrapperExtractChromeFiles)
      .pipe(concat("webdext-wrapperextract.js"))
      .pipe(gulp.dest("build/"));
  gulp.src(inductWrapperChromeFiles)
      .pipe(concat("webdext-inductwrapper.js"))
      .pipe(gulp.dest("build/"));
  gulp.src("chrome/**/*")
      .pipe(gulp.dest("build/"));
});

gulp.task("build-phantom", [], function() {
  console.log("Build as Chrome extension");
  gulp.src(intellExtractHeadlessFiles)
      .pipe(concat("webdext-intellextract.js"))
      .pipe(gulp.dest("build/"));
  gulp.src(wrapperExtractHeadlessFiles)
      .pipe(concat("webdext-wrapperextract.js"))
      .pipe(gulp.dest("build/"));
  gulp.src("phantom/**/*")
      .pipe(gulp.dest("build/"));
});

gulp.task("build-chrome-debug", [], function() {
  console.log("Build as Chrome extension for debugging");
  gulp.src(chromeDebugFiles)
      .pipe(concat("webdext.js"))
      .pipe(gulp.dest("build/"));
  gulp.src("chrome-debug/**/*")
      .pipe(gulp.dest("build/"));
});
