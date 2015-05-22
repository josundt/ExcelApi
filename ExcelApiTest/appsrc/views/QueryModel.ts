import {computedFrom} from 'aurelia-framework';
import {ObserverLocator} from 'aurelia-binding'; 

import {array} from "core/utils";
import {PropertyInfo, FilterOperator, FilterOperators, DataType, EntityMetadata, LabeledItem} from "services/OData";

export class QueryModel {
    constructor(
        metadata: EntityMetadata,
        defaultSort?: string,
        pageSize?: number,
        changeHandler?: () => void) {

        this.metadata = metadata;
        if (defaultSort) {
            let property = array.firstOrDefault(metadata.properties, pi => pi.value.name === defaultSort);
            if (!property) {
                throw new Error("Invalid argument defaultSort: Property does not exist");
            }
            this.sortings.push(new Sorting(property, false));
        }
        if (pageSize !== undefined) {
            this.pagination = new Pagination(pageSize, changeHandler);
        }

        this._changeHandler = changeHandler;
    }

    private _changeHandler: () => void;
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
    toggleSorting(property: LabeledItem<PropertyInfo>): void {
        let lastSorting = this.sortings.length ? this.sortings.shift() : null;
        let descending = false;
        if (lastSorting && lastSorting.property === property) {
            descending = !lastSorting.descending;
        }
        this.sortings.unshift(new Sorting(property, descending));


        if (this.pagination) {
            if (this.pagination.pageNumber === 1) {
                this._changeHandler();
            } else {
                this.pagination.pageNumber = 1;
            }
        } else {
            this._changeHandler();
        }
        
    }
    toQueryString(): string {
        let queryParams: string[] = [];

        let sortings = this.sortings;
        if (sortings && sortings.length > 0) {
            let sortParams: string[] = [];
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
            let p = this.pagination;
            queryParams.push(`$top=${p.pageSize}`);
            if (p.pageNumber > 1) {
                queryParams.push(`$skip=${(p.pageNumber * p.pageSize) - p.pageSize}`);
            }
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
    constructor(property?: LabeledItem<PropertyInfo>, descending?: boolean) {
        this.property = property || null;
        this.descending = !!descending;
    }

    property: LabeledItem<PropertyInfo> = null;

    descending: boolean = false;
}

export class Pagination {
    constructor(pageSize: number, changeHandler: () => void) {
        this._pageSize = pageSize;
        this._changeHandler = changeHandler;
    }

    private _changeHandler: () => void;

    private _pageSize: number;
    get pageSize(): number { return this._pageSize; }

    private _totalCount: number = null;
    get totalCount(): number { return this._totalCount };
    set totalCount(value: number) { this._totalCount = value; }

    private _pageNumber: number = 1;
    get pageNumber(): number { return this._pageNumber };
    set pageNumber(value: number) {
        if (value !== this._pageNumber) {
            this._pageNumber = value;
            this._changeHandler();
        }
    }

    @computedFrom("totalCount", "pageSize")
    get enabled(): boolean {
        return !!this.totalCount && !!this.pageSize;
    }

    @computedFrom("totalCount", "pageSize")
    get pageCount(): number {
        var result = 0;
        let tot = this._totalCount;
        let ps = this._pageSize;
        if (!!tot && !!ps) {
            result = (tot % ps) ? Math.floor(tot / ps) + 1 : tot / ps;
        }
        return result;
    }

    @computedFrom("totalCount", "pageSize", "pageNumber")
    get nextEnabled(): boolean {
        var result = !!this.totalCount && !!this.pageSize &&
            (this.pageNumber * this.pageSize) < this.totalCount;
        return result;
    }

    @computedFrom("totalCount", "pageSize", "pageNumber")
    get prevEnabled(): boolean {
        var result = !!this.totalCount && !!this.pageSize && !!this.pageNumber && this.pageNumber > 1;
        return result;
    }

    @computedFrom("pageCount", "pageNumber")
    get buttons(): { pageNumber: number; active: boolean; }[] {
        let buttons: { pageNumber: number; active: boolean; }[] = [];
        const maxButtons = 11;
        let buttonCount = Math.min(maxButtons, this.pageCount);
        let buttonNumber = Math.min(this.pageCount - buttonCount + 1, Math.max(1, this.pageNumber - Math.floor(buttonCount / 2)));
        for (let i = buttonNumber; i < buttonCount + buttonNumber; i++) {
            buttons.push({ pageNumber: i, active: i === this._pageNumber });
        }
        return buttons;
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

    gotoPage(pageNumber: number): void {
        if (pageNumber > 0 && pageNumber <= this.pageCount) {
            this.pageNumber = pageNumber;
        }
    }

}

