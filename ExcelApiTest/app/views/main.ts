/// <reference path="../../typings/aurelia/aurelia-framework.d.ts" />
export function configure(aurelia: any) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging();

    aurelia.start().then((a: any) => a.setRoot('views/app'));
}
 