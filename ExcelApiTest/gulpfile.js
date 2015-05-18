var gulp = require("gulp");
var rimraf = require("rimraf");
var fs = require("fs");

var webRoot = "./";

var paths = {
    bower: "./bower_components/",
    aurelia: "./aurelia/",
    lib: "./" + webRoot + "/lib/"
};

gulp.task("clean", function(cb) {
    rimraf(paths.lib, cb);
});

gulp.task("copy", ["clean"], function () {
    var bower = {
        "requirejs": "requirejs/**/*.js",
        "jquery": "jquery/dist/jquery.{js,map}",
        "bootstrap": "bootstrap/dist/**/*.{js,map,css,ttf,svg,woff,eot}",
        "webcomponentsjs": "webcomponentsjs/**/*.{js,map}",
        "bootstrap-switch": "bootstrap-switch/dist/**/*.{js,css}"
    };

    for (var destinationDir in bower) {
        gulp.src(paths.bower + bower[destinationDir])
          .pipe(gulp.dest(paths.lib + destinationDir));
    }

    gulp.src(paths.aurelia + "**/*.js")
        .pipe(gulp.dest(paths.lib + "aurelia/"))
});