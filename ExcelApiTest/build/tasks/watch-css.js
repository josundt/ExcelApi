var gulp = require("gulp");
var watch = require("gulp-watch");
var paths = require("../paths");

gulp.task("watch-css", function () {
    gulp.watch(paths.appsrc + "**/*.css", ["build-css"]);
});