var gulp = require("gulp");
var runSequence = require("run-sequence");
var changed = require("gulp-changed");
var plumber = require("gulp-plumber");
var ts = require("gulp-typescript");
var typescript = require("typescript");
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");
var print = require("gulp-print");
var paths = require("../paths");


function getOutDir() {
    return require("../../tsconfig.json").compilerOptions.outDir;

}

function getTsConfigFromJsonFile() {

    function removePropIfExists(tsConfig, propName) {
        if (tsConfig[propName] !== undefined) {
            delete tsConfig[propName];
        }
    }


    var config = require("../../tsconfig.json");
    var options = config.compilerOptions;

    removePropIfExists(options, "sourceRoot");
    removePropIfExists(options, "listFiles");
    removePropIfExists(options, "outDir");
    options.typescript = typescript;
    options.sortOutput = true;

    return config;
}

var outDir = getOutDir();
var sourcemapOutDir = outDir + "../";
var sourcemapRootDir = paths.appsrc.substring(1);

var tsConfig = getTsConfigFromJsonFile();
var tsProject = ts.createProject(tsConfig.compilerOptions);

gulp.task("build-typescript", function () {

    var tsResult = gulp.src(tsConfig.filesGlob)
        //.pipe(print())
        .pipe(plumber())
        .pipe(changed(outDir, { extension: ".js" }))
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return tsResult.js
        .pipe(sourcemaps.write(sourcemapOutDir, { includeContent: false, sourceRoot: sourcemapRootDir}))
        .pipe(gulp.dest(outDir));
});