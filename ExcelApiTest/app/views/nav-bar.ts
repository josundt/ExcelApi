import {bindable} from 'aurelia-framework';
import {Router} from 'aurelia-router/router';

export class NavBar {
  @bindable router: Router = null;
}
