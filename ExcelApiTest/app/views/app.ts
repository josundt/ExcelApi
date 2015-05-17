import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
    router: Router;

    configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'Aurelia';
        config.map([
            { route: ['', 'home'], moduleId: './home', nav: true, title: 'Excel OData WebApi' },
            { route: 'flickr', moduleId: './flickr', nav: true },
            { route: 'esri-map', moduleId: './esri-map', nav: true, title: 'ESRI Map' },
            { route: 'child-router', moduleId: './child-router', nav: true, title: 'Child Router' }
        ]);

        this.router = router;
    }
}
