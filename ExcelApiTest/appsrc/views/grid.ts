import {computedFrom, inject, customAttribute} from 'aurelia-framework';
import {ObserverLocator} from 'aurelia-binding'; 
import {QueryModel} from "views/QueryModel";
import {PeopleService} from "services/PeopleService";
import {DataType, PropertyInfo, FilterParameter, FilterOperator, FilterOperators, LabeledItem} from "services/OData";
import {PersonMetadata, Person} from "services/modelmetadata";
import {array} from "core/utils";

@inject(ObserverLocator, PeopleService)
export class GridPage {
    constructor(
        observerLocator: ObserverLocator,
        peopleService: PeopleService) {

        this._peopleService = peopleService;
        this.query = new QueryModel(PersonMetadata, "FirstName", 5, () => {
            this.getData();
        });
    }

    private _peopleService: PeopleService;

    query: QueryModel;

    dataSource: Person[];

    entityProps: LabeledItem<PropertyInfo>[] = PersonMetadata.properties;

    pageSizes = [{ value: 5 }, { value: 10 }, { value: 20 }, { value: 50 }, { value: 100 }];
    get pageSize() {
        return array.firstOrDefault(this.pageSizes, p => p.value === this.query.pagination.pageSize);
    }
    set pageSize(size: { value: number }) {
        this.query.pagination.pageSize = size.value;
    }

    getData(): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            this._peopleService.getPersons(this.query.toQueryString()).then((data) => {
                this.dataSource = data.value;
                if (this.query.pagination) {
                    this.query.pagination.totalCount = data.count;
                }
                resolve();
            }).catch((error: Error) => {
                reject();
            });

        });
    }

    exportToExcel(allPages?: boolean): void {
        this._peopleService.getPersonsAsExcel(this.query.toQueryString(), allPages);
    }
    
    activate(): Promise<void> {
        return this.getData(); 
    }
}

export class DisplayFormatValueConverter {
    toView(value: any) {
        let result: string = null;
        if (!value) {
            if (typeof value === "number") {
                result = "0";
            } else if (typeof value === "boolean") {
                result = "false";
            } else if (value === null || value === undefined) {
                result = "";
            }
        } else if (typeof value === "string") {
            result = value;
        } else if (typeof value === "number") {
            result = value.toString();
        } else if (typeof value === "object" && value && value instanceof Date) {
            result = (<Date>value).toISOString().substring(0, 10);
        } else if (typeof value === "boolean") {
            result = value.toString();
        } else {
            result = value.toString();
        }
        return result;
    }
}

@customAttribute("enabled")
@inject(Element)
export class EnabledAttributeBinder {
    constructor(private _element: HTMLAnchorElement) { }

    valueChanged(newValue: boolean) {
        if (!!newValue) {
            this._element.removeAttribute("disabled");
        } else {
            this._element.setAttribute("disabled", "disabled");
        }
    }
}

@customAttribute("visible")
@inject(Element)
export class VisibleAttributeBinder {
    constructor(private _element: HTMLAnchorElement) { }

    valueChanged(newValue: boolean) {
        this._element.style.display = newValue ? "" : "none";
    }
}

@customAttribute("colspan")
@inject(Element)
export class ColspanAttributeBinder {
    constructor(private _element: HTMLTableCellElement) { }

    valueChanged(newValue: number) {
        this._element.colSpan = newValue;
    }
}
