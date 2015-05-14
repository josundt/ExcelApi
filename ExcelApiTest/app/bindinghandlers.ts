/// <amd-dependency path="bootstrap-switch"/>
import * as ko from "knockout";
import * as $ from "jquery";


interface BootstrapSwitchBindingArgs {
    onText?: string | KnockoutObservable<string>;
    offText?: string | KnockoutObservable<string>;
    inverse?: boolean;
}
ko.bindingHandlers["bootstrapSwitch"] = ko.bindingHandlers["bootstrapSwitch"] || {
    init: function (
        element: HTMLElement,
        bindingArgsAccessor: () => BootstrapSwitchBindingArgs,
        allBindingsAccessor: KnockoutAllBindingsAccessor,
        viewModel: any,
        bindingContext: KnockoutBindingContext) {

        var args: BootstrapSwitchBindingArgs = bindingArgsAccessor(); 
        args.inverse = true;
        $(element)["bootstrapSwitch"](args);
    }
}; 