var gulp = require("gulp");
var concat = require("gulp-concat");

var chromeFiles = [
  "src/webdext.init.js",
  "src/webdext.sequal.js",
  "src/webdext.model.js",
  "src/webdext.similarity.js",
  "src/webdext.extraction.js",
  "src/webdext.chrome.js"
];

gulp.task("build-chrome", [], function() {
  console.log("Build as Chrome extension");
  gulp.src(chromeFiles)
      .pipe(concat("webdext.js"))
      .pipe(gulp.dest("build/"));
  gulp.src("chrome/*")
      .pipe(gulp.dest("build/"));
});
