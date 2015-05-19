var gulp = require("gulp");
var paths = require("../paths");

var rimraf = require("rimraf");

gulp.task("clean-app", function (cb) {
    rimraf(paths.app, cb);
});
