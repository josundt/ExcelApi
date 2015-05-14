import * as ko from "knockout";
import {PropertyInfo, FilterOperator, FilterOperators, DataType} from "OData";

interface LabeledItem<T> {
    text: string | KnockoutObservable<string>;
    value: T;
}

export default class QueryModel {
    constructor(properties: LabeledItem<PropertyInfo>[]) {
        this.properties = properties;
    }
    properties: LabeledItem<PropertyInfo>[];
    filters: KnockoutObservableArray<Filter> = ko.observableArray<Filter>([]);
    sortings: KnockoutObservableArray<Sorting> = ko.observableArray<Sorting>([]);
    addFilter(): void {
        this.filters.push(new Filter());
    }
    removeFilter(filter: Filter): void {
        this.filters.remove(filter);
    }
    addSorting(): void {
        this.sortings.push(new Sorting());
    }
    removeSorting(sorting: Sorting): void {
        this.sortings.remove(sorting);
    }
    toQueryString(): string {
        let queryParams = [];

        let sortings = this.sortings();
        if (sortings && sortings.length > 0) {
            var sortParams: string[] = [];
            sortings.forEach((sorting) => {
                let property: PropertyInfo = sorting.property().value;
                let direction: string = sorting.descending() ? encodeURIComponent(" desc") : "";

                sortParams.push(`${encodeURIComponent(property.name) }${direction}`);
            });
            queryParams.push(`$orderby=${sortParams.join(',')}`);

        }

        let filters = this.filters();
        if (filters && filters.length > 0) {
            let filterParams: string[] = [];
            filters.forEach((filter) => {
                let property: PropertyInfo = filter.property().value;
                let operator: FilterOperator = filter.operator().value;
                let value: string = filter.value();

                let useQuotes: boolean = [DataType.string, DataType.enum, DataType.date].some(d => d === property.dataType);
                let valueParam: string = useQuotes ? `'${value}'` : value;
                
                // Special handling for Gender enum
                valueParam = property.dataType === DataType.enum && property.name == "Gender"
                    ? "ExcelApiTest.Model.Gender" + valueParam
                    : valueParam;

                filterParams.push(
                    encodeURIComponent(
                        operator.formatString.replace("%1", property.name).replace("%2", valueParam)));
            });
            queryParams.push(`$filter=${filterParams.join(' and ') }`);
        }

        return queryParams.length > 0
            ? `?${queryParams.join('&') }`
            : "";


    }
}

export class Filter {
    constructor() {
        this.operators = ko.computed(this._getFilterOperators, this);
    }
    property: KnockoutObservable<LabeledItem<PropertyInfo>> = ko.observable(null);
    operators: KnockoutComputed<LabeledItem<FilterOperator>[]>;
    operator: KnockoutObservable<LabeledItem<FilterOperator>> = ko.observable(null);
    value: KnockoutObservable<string> = ko.observable(<string>null);
    private _getFilterOperators(): LabeledItem<FilterOperator>[] {
        let result: LabeledItem<FilterOperator>[] = [];
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

export class Sorting {
    property: KnockoutObservable<LabeledItem<PropertyInfo>> = ko.observable(null);
    descending: KnockoutObservable<boolean> = ko.observable(false);
}