import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
    router: Router;

    configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'OData WebAPI Output Format';
        config.map([
            { route: ['', 'query'], moduleId: './query', nav: true, title: 'Custom query' },
            { route: 'grid', moduleId: './grid', nav: true }
            //{ route: 'child-router', moduleId: './child-router', nav: true, title: 'Child Router' }
        ]);

        this.router = router;
    }
}
