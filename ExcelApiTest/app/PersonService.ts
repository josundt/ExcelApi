import { http } from "utils";
import { DataType, PropertyInfo, SortParameter, FilterParameter, QueryOptions } from "OData";


export interface PersonQueryOptions extends QueryOptions {
    acceptHeader: string;
    acceptLanguageHeader: string;
}

export default class PersonService {
    getPersons(
        options: PersonQueryOptions,
        callback: (result: string) => void,
        errorCallback?: (error: Error) => void) {

        if (options.acceptHeader.toLowerCase().indexOf("openxml") >= 0) {
            location.assign(this._generateODataQuery(options));
        } else {
            http.get(
                this._generateODataQuery(options),
                options.acceptHeader,
                options.acceptLanguageHeader,
                (result: string) => {
                    callback(result);
                },
                (error) => {
                    if (errorCallback) {
                        errorCallback(new Error("Failed to get data from service. See console log for details."));
                    }
                    console.log(error);
                });
        }
    }

    private _generateODataQuery(options: PersonQueryOptions) {
        let baseUrl = "/persons";
        let queryParams = [];

        let sort = options.sort;
        if (sort && sort.property) {
            let direction = sort.descending ? encodeURIComponent(" desc") : ""; 
            queryParams.push(`$orderby=${sort.property.name}${direction}`);
        }

        let filters = options.filters;
        if (options.filters && options.filters.length > 0) {
            let filterParams: string[] = [];
            for (var filter of filters) {
                let useQuotes = [DataType.string, DataType.enum, DataType.date].some(d => d === filter.property.dataType);
                let valueParam = useQuotes ? `'${filter.value}'` : filter.value;
                
                // Special handling for Gender enum
                valueParam = filter.property.dataType === DataType.enum && filter.property.name == "Gender"
                    ? "ExcelApiTest.Model.Gender" + valueParam
                    : valueParam;

                filterParams.push(
                    encodeURIComponent(
                        filter.operator.formatString.replace("%1", filter.property.name).replace("%2", valueParam)));
            }
            queryParams.push(`$filter=${filterParams.join(' and ')}`);
        }
        return queryParams.length > 0
            ? `${baseUrl}?${queryParams.join('&') }`
            : baseUrl;

    }
}
