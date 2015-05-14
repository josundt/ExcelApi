import * as ko from "knockout";
import QueryModel from "QueryModel";
import PersonService from "PersonService";
import { PersonQueryOptions } from "PersonService";
import { DataType, PropertyInfo, FilterParameter, FilterOperator, FilterOperators } from "OData";
import { cookies } from "utils";

interface DropListItem<T> {
    text: string;
    value: T;
}

export default class ViewModel {

    constructor() {
        this._personService = new PersonService();
        this.languageSelectorVisible = ko.computed(this._getLanguageSelectorVisible, this);
        this.language.subscribe(this._onLanguageChange, this);
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

    outputType: KnockoutObservable<DropListItem<string>> = ko.observable(this.outputTypes[0]);
    language: KnockoutObservable<DropListItem<string>> = ko.observable(this.languages[0]);
    languageSelectorVisible: KnockoutComputed<boolean>;

    sortProperty: KnockoutObservable<DropListItem<PropertyInfo>> = ko.observable(this.entityProps[0]);
    sortDescending: KnockoutObservable<boolean> = ko.observable(false);

    query = new QueryModel(this.entityProps);

    rawResponseBody = ko.observable(<string>null);

    lastQueryString = ko.observable(<string>null);

    getData() {
        let options: PersonQueryOptions = {
            acceptHeader: this.outputType().value,
            acceptLanguageHeader: this.language().value,
        };

        var queryString = this.query.toQueryString();

        this._personService.getPersons(
            queryString,
            options,
            (result) => {
                this.rawResponseBody(result);
                this.lastQueryString(queryString);
            }, (error: Error) => {
                alert(Error);
            });
    }

    private _onLanguageChange(languageItem: DropListItem<string>) {
        cookies.add("language", languageItem.value);
    }

    private _getLanguageSelectorVisible() {
        var outputType = this.outputType();
        var languageSupportedOutputTypes = [
            "text/csv",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
        return languageSupportedOutputTypes.some(lsot => outputType.value === lsot);
    }
}
