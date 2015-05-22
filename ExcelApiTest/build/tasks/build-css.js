var gulp = require("gulp");
var changed = require("gulp-changed");
var paths = require("../paths");

gulp.task("build-css", function () {

    gulp.src(paths.csssrc + "**/*.css")
        .pipe(changed(paths.app))
        .pipe(gulp.dest(paths.css));
});
