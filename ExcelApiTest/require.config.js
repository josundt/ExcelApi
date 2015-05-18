var require = {
    waitSeconds: 60,
    paths: {
        "jquery": "/lib/jquery/jquery",
        "bootstrap": "/lib/bootstrap/js/bootstrap",
        "bootstrap-switch": "/bootstrap-switch/js/bootstrap-switch",
        "aurelia": "/lib/aurelia",
        "webcomponentsjs": "/lib/webcomponentsjs"

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