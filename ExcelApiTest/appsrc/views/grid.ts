import {computedFrom, inject} from 'aurelia-framework';
import {ObserverLocator} from 'aurelia-binding'; 
import {QueryModel} from "views/QueryModel";
import {PersonService} from "services/PersonService";
import {PersonQueryOptions} from "services/PersonService";
import {DataType, PropertyInfo, FilterParameter, FilterOperator, FilterOperators, LabeledItem} from "services/OData";
import {PersonMetadata, Person} from "services/modelmetadata";

@inject(ObserverLocator, PersonService)
export class GridPage {
    constructor(
        observerLocator: ObserverLocator,
        personService: PersonService) {

        this._personService = personService;
    }

    private _personService: PersonService;

    query: QueryModel = new QueryModel(PersonMetadata, true);

    dataSource: Person[];

    entityProps: LabeledItem<PropertyInfo>[] = PersonMetadata.properties;

    getDataForGrid(): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            this._personService.getPersons(this.query.toQueryString()).then((data) => {
                this.dataSource = data;
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
        return this.getDataForGrid(); 
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
