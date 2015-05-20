var gulp = require("gulp");
var changed = require("gulp-changed");
var paths = require("../paths");

gulp.task("build-html", function () {

    gulp.src(paths.appsrc + "**/*.html")
        .pipe(changed(paths.app))
        .pipe(gulp.dest(paths.app));
});
