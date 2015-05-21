import {computedFrom} from 'aurelia-framework';

import {array} from "core/utils";
import {PropertyInfo, FilterOperator, FilterOperators, DataType, EntityMetadata, LabeledItem} from "services/OData";


export class QueryModel {
    constructor(
        metadata: EntityMetadata,
        pageSize?: number) {

        this.metadata = metadata;
        if (pageSize !== undefined) {
            this.pagination = new Pagination(pageSize);
        }
    }
    private _odataVersion = 4;
    metadata: EntityMetadata;
    get properties(): LabeledItem<PropertyInfo>[] {
        return this.metadata.properties;
    }
    filters: Filter[] = [];
    sortings: Sorting[] = [];
    pagination: Pagination = null;
    addFilter(): void {
        this.filters.push(new Filter());
    }
    removeFilter(filter: Filter): void {
        array.remove(this.filters, f => f === filter);
    }
    addSorting(): void {
        this.sortings.push(new Sorting());
    }
    removeSorting(sorting: Sorting): void {
        array.remove(this.sortings, s => s === sorting);
    }
    toQueryString(): string {
        let queryParams: string[] = [];

        let sortings = this.sortings;
        if (sortings && sortings.length > 0) {
            var sortParams: string[] = [];
            sortings.forEach((sorting) => {
                let property: PropertyInfo = sorting.property.value;
                let direction: string = sorting.descending ? encodeURIComponent(" desc") : "";
                
                sortParams.push(`${encodeURIComponent(property.name) }${direction}`);
            });
            queryParams.push(`$orderby=${sortParams.join(',') }`);

        }

        let filters = this.filters;
        if (filters && filters.length > 0) {
            let filterParams: string[] = [];
            filters.forEach((filter) => {
                let property: PropertyInfo = filter.property.value;
                let operator: FilterOperator = filter.operator.value;
                let value: string = filter.value;

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

        if (this.pagination !== null) {
            queryParams.push(`$top=${this.pagination.pageSize}`);
            queryParams.push(this._odataVersion >= 4 ? "$count=true" : "$inlinecount=allpages");
        }

        return queryParams.length > 0
            ? `?${queryParams.join('&') }`
            : "";
    }
}

export class Filter {
    property: LabeledItem<PropertyInfo> = null;

    @computedFrom("property")
    get operators(): LabeledItem<FilterOperator>[] {
        let result: LabeledItem<FilterOperator>[] = [];
        let currentProperty = this.property;
        if (currentProperty) {
            let propertyInfo: PropertyInfo = currentProperty.value;
            for (let propName in FilterOperators) {
                if (FilterOperators.hasOwnProperty(propName)) {
                    let operator: FilterOperator = FilterOperators[propName];
                    if (operator.supportedTypes.some(st => st === propertyInfo.dataType)) {
                        result.push({ text: propName, value: operator });
                    }
                }
            }
        }
        return result;
    }

    operator: LabeledItem<FilterOperator> = null;

    value: string = null;
}

export class Sorting {
    property: LabeledItem<PropertyInfo> = null;

    descending: boolean = false;
}

export class Pagination {
    constructor(pageSize: number) {
        this.pageSize = pageSize;
    }
    pageSize: number = null;
    totalCount: number = null;
    pageNumber: number = 0;

    @computedFrom("totalCount", "pageSize")
    get enabled(): boolean {
        return !!this.totalCount && !!this.pageSize;
    }


    @computedFrom("totalCount", "pageSize", "pageNumber")
    get nextEnabled(): boolean {
        return !!this.totalCount && !!this.pageSize &&
            (this.totalCount % (this.pageNumber * this.pageSize) > this.pageSize);
    }

    @computedFrom("totalCount", "pageSize", "pageNumber")
    get prevEnabled(): boolean {
        return !!this.totalCount && !!this.pageSize && !!this.pageNumber && this.pageNumber > 1;
    }

    prev(): void {
        if (this.prevEnabled) {
            this.pageNumber -= 1;
        }
    }

    next(): void {
        if (this.nextEnabled) {
            this.pageNumber += 1;
        }
    }

}