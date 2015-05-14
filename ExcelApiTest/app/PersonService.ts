import { http } from "utils";


export interface PersonQueryOptions {
    acceptHeader: string;
    acceptLanguageHeader: string;
}

export default class PersonService {
    getPersons(
        queryString: string,
        options: PersonQueryOptions,
        callback: (result: string) => void,
        errorCallback?: (error: Error) => void) {

        var url = `/persons${queryString}`;

        if (options.acceptHeader.toLowerCase().indexOf("openxml") >= 0) {
            location.assign(url);
            callback(null);
        } else {
            http.get(
                url,
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
}
