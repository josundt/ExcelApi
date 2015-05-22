var gulp = require("gulp");
var changed = require("gulp-changed");
var paths = require("../paths");

gulp.task("copy-lib", ["clean-lib"], function () {
    var bower = {
        "requirejs": "requirejs/**/*.js",
        "jquery": "jquery/dist/jquery.{js,map}",
        "bootstrap": "bootstrap/dist/**/*.{js,map,css,ttf,svg,woff,eot}",
        "webcomponentsjs": "webcomponentsjs/**/*.{js,map}",
        "bootstrap-switch": "bootstrap-switch/dist/**/*.{js,css}"
    };

    for (var destinationDir in bower) {
        gulp.src(paths.bower + bower[destinationDir])
          .pipe(changed(paths.lib + destinationDir))
          .pipe(gulp.dest(paths.lib + destinationDir));
    }

    gulp.src(paths.aurelia + "**/*.js")
        .pipe(changed(paths.lib + "aurelia/"))
        .pipe(gulp.dest(paths.lib + "aurelia/"))
});