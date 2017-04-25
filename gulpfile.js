var gulp = require("gulp");
var concat = require("gulp-concat");

var jsFiles = [
  "src/webdext.init.js",
  "src/webdext.sequal.js",
  "src/webdext.model.js",
  "src/webdext.similarity.js",
  "src/webdext.extraction.js",
  "src/webdext.wrapper.js"
];

gulp.task("build", [], function() {
  console.log("Concatenating and moving JS files to build directory");
  gulp.src(jsFiles)
      .pipe(concat("webdext.js"))
      .pipe(gulp.dest("build/"));
});

gulp.task("build-chrome", [], function() {
  console.log("Build as Chrome extension");
  gulp.src(jsFiles)
      .pipe(concat("webdext.js"))
      .pipe(gulp.dest("build/"));
  gulp.src("chrome/*")
      .pipe(gulp.dest("build/"));
});
