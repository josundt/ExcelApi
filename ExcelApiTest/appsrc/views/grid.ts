import {computedFrom} from 'aurelia-framework';

import {QueryModel} from "views/QueryModel";
import {PersonService} from "../services/PersonService";
import {PersonQueryOptions} from "../services/PersonService";
import {DataType, PropertyInfo, FilterParameter, FilterOperator, FilterOperators} from "../services/OData";
 
export class GridPage {
    title = "Grid page";
}