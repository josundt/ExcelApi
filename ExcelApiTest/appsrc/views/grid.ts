import {computedFrom, inject} from 'aurelia-framework';
import {ObserverLocator} from 'aurelia-binding'; 
import {QueryModel} from "views/QueryModel";
import {PeopleService, PeopleQueryOptions} from "services/PeopleService";
import {DataType, PropertyInfo, FilterParameter, FilterOperator, FilterOperators, LabeledItem} from "services/OData";
import {PersonMetadata, Person} from "services/modelmetadata";

@inject(ObserverLocator, PeopleService)
export class GridPage {
    constructor(
        observerLocator: ObserverLocator,
        peopleService: PeopleService) {

        this._peopleService = peopleService;
        this.query = new QueryModel(PersonMetadata, "FirstName", 10, () => {
            this._getDataForGrid();
        });
    }

    private _peopleService: PeopleService;

    query: QueryModel = new QueryModel(PersonMetadata/*, 2*/);

    dataSource: Person[];

    entityProps: LabeledItem<PropertyInfo>[] = PersonMetadata.properties;

    private _getDataForGrid(): Promise<void> {
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

    getDataForExcel(): void {
        location.assign(`/persons{this.query.toQueryString()}`);
    }
    
    activate(): Promise<void> {
        return this._getDataForGrid(); 
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
