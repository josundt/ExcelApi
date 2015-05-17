import {computedFrom} from 'aurelia-framework';

import QueryModel from "views/QueryModel";
import PersonService from "../services/PersonService";
import { PersonQueryOptions } from "../services/PersonService";
import { DataType, PropertyInfo, FilterParameter, FilterOperator, FilterOperators } from "../services/OData";
import { cookies } from "../core/utils";

interface DropListItem<T> {
    text: string;
    value: T;
}

export default class ViewModel {

    constructor() {
        this._personService = new PersonService();
        //this.language.subscribe(this._onLanguageChange, this);
    }

    private _personService: PersonService;

    outputTypes: DropListItem<string>[] = [
        { text: "Excel (xslx)", value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
        { text: "CSV", value: "text/csv" },
        { text: "JSON", value: "application/json" },
        { text: "XML", value: "text/xml" }
    ];
    languages: DropListItem<string>[] = [
        { text: "English (US)", value: "en-US" },
        { text: "English (UK)", value: "en-GB" },
        { text: "Norwegian", value: "nb-NO" }
    ];
    entityProps: DropListItem<PropertyInfo>[] = [
        { text: "First name", value: { name: "FirstName", dataType: DataType.string } },
        { text: "Last name", value: { name: "LastName", dataType: DataType.string } },
        { text: "Birth date", value: { name: "BirthDate", dataType: DataType.date } },
        { text: "Gender", value: { name: "Gender", dataType: DataType.enum } },
        { text: "Yearly income", value: { name: "YearlyIncome", dataType: DataType.float } },
        { text: "Is student", value: { name: "IsStudent", dataType: DataType.boolean } }
    ];

    outputType: DropListItem<string> = this.outputTypes[0];
    language: DropListItem<string> = this.languages[0];

    @computedFrom("outputType")
    get languageSelectorVisible(): boolean {
        let outputType = this.outputType;
        let languageSupportedOutputTypes = [
            "text/csv",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
        return languageSupportedOutputTypes.some(lsot => outputType.value === lsot);
    }

    sortProperty: DropListItem<PropertyInfo> = this.entityProps[0];
    sortDescending: boolean = false;

    query = new QueryModel(this.entityProps);

    rawResponseBody: string = null;

    lastQueryString: string = null;

    getData() {
        let options: PersonQueryOptions = {
            acceptHeader: this.outputType.value,
            acceptLanguageHeader: this.language.value,
        };

        let queryString = this.query.toQueryString();

        this._personService.getPersons(
            queryString,
            options,
            (result) => {
                this.rawResponseBody = result;
                this.lastQueryString = queryString;
            }, (error: Error) => {
                alert(Error);
            });
    }

    private _onLanguageChange(languageItem: DropListItem<string>) {
        cookies.add("language", languageItem.value);
    }
}

export class QueryReadablifyValueConverter {
    toView(value: string) {
        var result = "";
        if (value) {
            var decoded = decodeURIComponent(value);
            if (decoded.indexOf("?") === 0) {
                decoded = decoded.substring(1);        
            }
            result = decoded.split("&").join("\n");
        }
        return result;
    }
}
