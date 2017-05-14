var gulp = require("gulp");
var concat = require("gulp-concat");

var intellExtractFiles = [
  "src/webdext.init.js",
  "src/webdext.sequal.js",
  "src/webdext.model.js",
  "src/webdext.similarity.js",
  "src/webdext.extraction.js",
  "src/webdext.chrome.intellextract.js"
];
var wrapperExtractFiles = [
  "src/webdext.init.js",
  "src/webdext.wrapper.js",
  "src/webdext.chrome.wrapperextract.js"
];

gulp.task("build-chrome", [], function() {
  console.log("Build as Chrome extension");
  gulp.src(intellExtractFiles)
      .pipe(concat("webdext-intellextract.js"))
      .pipe(gulp.dest("build/"));
  gulp.src(wrapperExtractFiles)
      .pipe(concat("webdext-wrapperextract.js"))
      .pipe(gulp.dest("build/"));
  gulp.src("chrome/**/*")
      .pipe(gulp.dest("build/"));
});
