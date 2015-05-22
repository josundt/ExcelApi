import {computedFrom, inject} from 'aurelia-framework';
import {QueryModel} from "views/QueryModel";
import {PeopleService} from "services/PeopleService";
import {PropertyInfo, FilterParameter, FilterOperator, FilterOperators, LabeledItem} from "services/OData";
import {cookies, array} from "core/utils";
import {PersonMetadata} from "services/modelmetadata";

@inject(PeopleService)
export default class CustomQueryPage {

    constructor(peopleService: PeopleService) {
        this._peopleService = peopleService; 
    }

    private _peopleService: PeopleService;

    outputTypes: LabeledItem<string>[] = [
        { text: "Excel (xslx)", value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
        { text: "CSV", value: "text/csv" },
        { text: "JSON", value: "application/json" },
        { text: "XML", value: "text/xml" }
    ];
    entityProps: LabeledItem<PropertyInfo>[] = PersonMetadata.properties;

    outputType: LabeledItem<string> = this.outputTypes[0];

    sortProperty: LabeledItem<PropertyInfo> = this.entityProps[0];
    sortDescending: boolean = false;

    query = new QueryModel(PersonMetadata);

    rawResponseBody: string = null;

    lastQueryString: string = null;

    getData() {

        let queryString = this.query.toQueryString();

        this._peopleService.getPersonsRaw(queryString, this.outputType.value).then((data: string) => {
            this.rawResponseBody = data;
            this.lastQueryString = queryString;
        }).catch((error: Error) => {
            alert(error.message);
        });
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
