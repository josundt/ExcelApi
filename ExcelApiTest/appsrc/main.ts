/// <reference path="../tsd.d.ts" />

/// <amd-dependency path="bootstrap"/>

require(["aurelia/aurelia-bundle-latest"], (au: any) => {
    require(["aurelia-bundle-manifest"], (abm: any) => {
        require(["aurelia-bootstrapper"], (b: any) => {});
    })
});
