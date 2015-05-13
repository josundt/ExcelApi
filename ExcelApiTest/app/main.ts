/// <reference path="../tsd.d.ts" />
import * as ko from "knockout";
import ViewModel from "ViewModel";
import { cookies } from "utils";

function init() {
    // Set default language
    cookies.add("language", "en-US");

    let vm = new ViewModel();
    let view = document.body;
    ko.applyBindings(vm, view);
}

init();

//document.addEventListener("DOMContentLoaded", () => { init(); });