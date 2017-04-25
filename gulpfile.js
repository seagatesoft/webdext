var gulp = require("gulp");
var concat = require("gulp-concat");

gulp.task("default", [], function() {
  console.log("Concatenating and moving JS files to build directory");
  gulp.src("src/**.js")
      .pipe(concat("webdext.js"))
      .pipe(gulp.dest("build/"));
});
