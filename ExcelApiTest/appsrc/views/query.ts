import {computedFrom, inject} from 'aurelia-framework';
import {ObserverLocator} from 'aurelia-binding'; 
import {QueryModel} from "views/QueryModel";
import {PersonService, PersonQueryOptions} from "services/PersonService";
import {PropertyInfo, FilterParameter, FilterOperator, FilterOperators, LabeledItem} from "services/OData";
import {cookies, array} from "core/utils";
import {PersonMetadata} from "services/modelmetadata";

@inject(ObserverLocator, PersonService)
export default class CustomQueryPage {

    constructor(
        observerLocator: ObserverLocator,
        personService: PersonService) {

        this._disposables.push(
            observerLocator
                .getObserver(this, "language")
                .subscribe(this._onLanguageChange));

        this._personService = personService; 
    }

    private _personService: PersonService;

    private _disposables: Array<() => void> = [];

    outputTypes: LabeledItem<string>[] = [
        { text: "Excel (xslx)", value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
        { text: "CSV", value: "text/csv" },
        { text: "JSON", value: "application/json" },
        { text: "XML", value: "text/xml" }
    ];
    languages: LabeledItem<string>[] = [
        { text: "English (US)", value: "en-US" },
        { text: "English (UK)", value: "en-GB" },
        { text: "Norwegian", value: "nb-NO" }
    ];
    entityProps: LabeledItem<PropertyInfo>[] = PersonMetadata.properties;

    outputType: LabeledItem<string> = this.outputTypes[0];
    language: LabeledItem<string> = this.languages[0];

    @computedFrom("outputType")
    get languageSelectorVisible(): boolean {
        let outputType = this.outputType;
        let languageSupportedOutputTypes = [
            "text/csv",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
        return languageSupportedOutputTypes.some(lsot => outputType.value === lsot);
    }

    sortProperty: LabeledItem<PropertyInfo> = this.entityProps[0];
    sortDescending: boolean = false;

    query = new QueryModel(PersonMetadata);

    rawResponseBody: string = null;

    lastQueryString: string = null;

    getData() {
        let options: PersonQueryOptions = {
            acceptHeader: this.outputType.value,
            acceptLanguageHeader: this.language.value,
        };

        let queryString = this.query.toQueryString();

        this._personService.getPersonsRaw(queryString, options).then((data: string) => {
            this.rawResponseBody = data;
            this.lastQueryString = queryString;
        }).catch((error: Error) => {
            alert(error.message);
        });
    }

    private _onLanguageChange(languageItem: LabeledItem<string>) {
        cookies.add("language", languageItem.value);
    }

    deactivate() {
        for (let disposable of this._disposables) {
            disposable();
        }
    }
}

export class QueryReadablifyValueConverter {
    toView(value: string) {
        let result = "";
        if (value) {
            let decoded = decodeURIComponent(value);
            if (decoded.indexOf("?") === 0) {
                decoded = decoded.substring(1);        
            }
            result = decoded.split("&").join("\n");
        }
        return result;
    }
}
