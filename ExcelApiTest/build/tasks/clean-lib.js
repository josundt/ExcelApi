var gulp = require("gulp");
var paths = require("../paths");

var rimraf = require("rimraf");

gulp.task("clean-lib", function (cb) {
    rimraf(paths.lib, cb);
});
