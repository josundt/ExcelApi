var require = {
    waitSeconds: 60,
    paths: {
        "jquery": "/bower_components/jquery/dist/jquery",
        "knockout": "/bower_components/knockoutjs/dist/knockout.debug",
        "bootstrap": "/bower_components/bootstrap/dist/js/bootstrap",
        "bootstrap-switch": "/bower_components/bootstrap-switch/dist/js/bootstrap-switch"
},
    shim: {
        "jquery": { exports: "jQuery" },
        "knockout": { exports: "ko" },
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