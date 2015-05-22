import {bindable, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router/router';
import {ObserverLocator} from 'aurelia-binding'; 
import {cookies} from 'core/utils';
interface DropListItem {
    text: string;
    value: string;
}

@inject(ObserverLocator)
export class NavBar {
    constructor(observerLocator: ObserverLocator) {

        let subscription = observerLocator
            .getObserver(this, "language")
            .subscribe(this._onLanguageChange);

    }

    @bindable router: Router = null;

    languages: DropListItem[] = [
        { text: "English (US)", value: "en-US" },
        { text: "English (UK)", value: "en-GB" },
        { text: "Norwegian", value: "nb-NO" }
    ];

    language: DropListItem = this.languages[0];

    private _onLanguageChange(languageItem: DropListItem) {
        cookies.add("language", languageItem.value);
    }
}
