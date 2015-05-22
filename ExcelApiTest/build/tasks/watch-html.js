var gulp = require("gulp");
var watch = require("gulp-watch");
var paths = require("../paths");

gulp.task("watch-html", function () {
    gulp.watch(paths.appsrc + "**/*.html", ["build-html"]);
});