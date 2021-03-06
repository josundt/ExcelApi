﻿import {Router, RouterConfiguration} from 'aurelia-router';
import {cookies} from 'core/utils';

export class App {
    constructor() {
        cookies.add("language", "en-US");
    }
    router: Router;

    configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'OData WebAPI Output Format';
        config.map([
            { route: ['', 'grid'], moduleId: './grid', nav: true, title: 'Grid' },
            { route: 'query', moduleId: './query', nav: true, title: 'Custom query' }
            //{ route: 'child-router', moduleId: './child-router', nav: true, title: 'Child Router' }
        ]);

        this.router = router;
    }
}
