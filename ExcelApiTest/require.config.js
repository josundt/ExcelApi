var require = {
    waitSeconds: 60,
    paths: {
        "jquery": "/bower_components/jquery/dist/jquery",
        "bootstrap": "/bower_components/bootstrap/dist/js/bootstrap",
        "bootstrap-switch": "/bower_components/bootstrap-switch/dist/js/bootstrap-switch",
        "aurelia": "/lib/aurelia",
        "webcomponentsjs": "/bower_components/webcomponentsjs"

    },
    shim: {
        "jquery": { exports: "jQuery" },
        "bootstrap": {
            deps: ["jquery"],
            exports: "jQuery"
        },
        "bootstrap-switch": {
            deps: ["bootstrap"],
            exports: "jquery"
        }
    }
};