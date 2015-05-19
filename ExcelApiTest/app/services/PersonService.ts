import { http, date } from "core/utils";
import { Person } from "services/modelmetadata";

export interface PersonQueryOptions {
    acceptHeader: string;
    acceptLanguageHeader: string;
}

export class PersonService {

    getPersonsRaw(queryString: string, options: PersonQueryOptions): Promise<string> {

        return new Promise((resolve, reject) => {

            var url = `/persons${queryString}`;

            if (options.acceptHeader.toLowerCase().indexOf("openxml") >= 0) {
                location.assign(url);
                resolve(null);
            } else {
                http.get(url, options.acceptHeader, options.acceptLanguageHeader).then((value: string) => {

                    resolve(value);

                }).catch((error: Error) => {
                    reject(new Error("Failed to get data from service. See console log for details."));
                    console.log(error);
                });
            }
        });
    }

    getPersons(queryString: string): Promise<Person[]> {

        return new Promise((resolve, reject) => {
            var url = `/persons${queryString}`;

            http.get(url, "application/json", "en-US").then((data: string) => {
                var resultDeserialized: Person[] = this._parseJson(data);
                resolve(resultDeserialized);
            }).catch((error: Error) => {
                reject(new Error("Failed to get data from service. See console log for details."));
                console.log(error);
            });
        });
    }

    private _parseJson(str: string) {
        return JSON.parse(str, (key: string, value: any) => 
            (typeof value === "string" && date.isIsoDateString(value)) ? new Date(value) : value);
    }
}
