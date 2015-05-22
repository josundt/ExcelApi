import { http, date } from "core/utils";
import { Person } from "services/modelmetadata";
import { RawQueryResult, QueryResult } from "services/OData";

export class PeopleService {

    private _baseUrl = "/api/people";
    private _odataBaseUrl = "/odata/People";

    getPersonsRaw(queryString: string, acceptHeader: string): Promise<string> {

        return new Promise((resolve, reject) => {

            var url = `${this._baseUrl}${queryString}`;

            if (acceptHeader.toLowerCase().indexOf("openxml") >= 0) {
                location.assign(url);
                resolve(null);
            } else {
                http.get(url, acceptHeader).then((value: string) => {

                    resolve(value);

                }).catch((error: Error) => {
                    reject(new Error("Failed to get data from service. See console log for details."));
                    console.log(error);
                });
            }
        });
    }

    getPersons(queryString: string): Promise<QueryResult<Person>> {

        return new Promise((resolve, reject) => {
            var url = `${this._odataBaseUrl}${queryString}`;

            http.get(url, "application/json").then((data: string) => {
                var odataResult: RawQueryResult<Person> = this._parseJson(data);
                var result: QueryResult<Person> = {
                    value: odataResult.value,
                    context: odataResult["@odata.context"],
                    count: odataResult["@odata.count"],
                    nextLink: odataResult["@odata.nextLink"],
                    prevLink: odataResult["@odata.prevLink"]
                }
                resolve(result);
            }).catch((error: Error) => {
                reject(new Error("Failed to get data from service. See console log for details."));
                console.log(error);
            });
        });
    }

    getPersonsAsExcel(queryString: string, allPages?: boolean): void {
        var queryStringParts = queryString.split("&");
        var excelQueryStringParts = queryStringParts.filter(s => {
            var include = s.indexOf("$count") !== 0;
            if (allPages) {
                include = include && (s.indexOf("$skip") !== 0 && s.indexOf("$top") !== 0);
            }
            return include;
        });
        location.assign(`${this._baseUrl}${excelQueryStringParts.join('&')}`);
    }

    private _parseJson(str: string) {
        return JSON.parse(str, (key: string, value: any) => 
            (typeof value === "string" && date.isIsoDateString(value)) ? new Date(value) : value);
    }
}
