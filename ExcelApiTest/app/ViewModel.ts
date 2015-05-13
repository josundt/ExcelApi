import * as ko from "knockout";
import PersonService from "PersonService";
import { PersonQueryOptions } from "PersonService";
import { DataType, PropertyInfo, FilterParameter, FilterOperator, FilterOperators } from "OData";
import { cookies } from "utils";

interface DropListItem<T> {
    text: string;
    value: T;
}

class Filter {
    constructor(properties: DropListItem<PropertyInfo>[]) {
        this.operators = ko.computed(this._getFilterOperators, this);
        this.properties = properties;
    }
    properties: DropListItem<PropertyInfo>[]; 
    property: KnockoutObservable<DropListItem<PropertyInfo>> = ko.observable(null);
    operators: KnockoutComputed<DropListItem<FilterOperator>[]>;
    operator: KnockoutObservable<DropListItem<FilterOperator>> = ko.observable(null);
    value: KnockoutObservable<string> = ko.observable(<string>null);
    private _getFilterOperators(): DropListItem<FilterOperator>[]{
        let result: DropListItem<FilterOperator>[] = [];
        let currentProperty = this.property();
        if (currentProperty) {
            let propertyInfo: PropertyInfo = currentProperty.value;
            for (let propName in FilterOperators) {
                if (FilterOperators.hasOwnProperty(propName)) {
                    let operator: FilterOperator = <FilterOperator>FilterOperators[propName];
                    if (operator.supportedTypes.some(st => st === propertyInfo.dataType)) {
                        result.push({ text: propName, value: operator });
                    }
                }
            }
        }
        return result;
        //return [{ text: "Equals", value: FilterOperators.equals }];
    }
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
        { text: "None", value: null },
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

    filters: KnockoutObservableArray<Filter> = ko.observableArray([]);

    rawResponseBody = ko.observable(<string>null);

    getData() {
        let options: PersonQueryOptions = {
            acceptHeader: this.outputType().value,
            acceptLanguageHeader: this.language().value,
            sort: {
                property: this.sortProperty().value,
                descending: this.sortDescending()
            },
            filters: this.filters().map(f => {
                return {
                    property: f.property().value,
                    operator: f.operator().value,
                    value: f.value()
                };
            })
        };

        this._personService.getPersons(
            options,
            (result) => {
                this.rawResponseBody(result);
            }, (error: Error) => {
                alert(Error);
            });
    }

    addFilter() {
        this.filters.push(new Filter(this._getFilterProperties()));
    }

    removeFilter(filterItem: Filter) {
        this.filters.remove(filterItem);
    }

    private _onLanguageChange(languageItem: DropListItem<string>) {
        cookies.add("language", languageItem.value);
    }

    private _getFilterProperties(): DropListItem<PropertyInfo>[]{
        return this.entityProps.filter(ep => ep.value && ep.value.dataType !== DataType.date);
    }

    private _getLanguageSelectorVisible() {
        var outputType = this.outputType();
        var languageSupportedOutputTypes = [
            "text/csv",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
        return languageSupportedOutputTypes.some(lsot => outputType.value === lsot);
    }
}
