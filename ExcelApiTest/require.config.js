var require = {
    waitSeconds: 60,
    paths: {
        "jquery": "/bower_components/jquery/dist/jquery",
        "knockout": "/bower_components/knockoutjs/dist/knockout.debug"
    },
    shim: {
        "jquery": { exports: "jQuery" },
        "knockout": { exports: "ko" }
    }
};