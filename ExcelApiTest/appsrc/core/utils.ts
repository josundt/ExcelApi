export module http {
    export function get(url: string, acceptHeader: string): Promise<string> {

        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    } else {
                        var error = <{ [key: string]: any }> <any> new Error("http get error");
                        error["statusCode"] = xhr.status;
                        error["xhr"] = xhr;
                        reject(error);
                    }
                }
            }
            xhr.open("GET", url, true);
            xhr.setRequestHeader("Accept", acceptHeader || "application/json");
            xhr.setRequestHeader("Accept-Language", cookies.get("language") || "en-US");
            xhr.send();
        });
    }
}

export module cookies {
    function getCookieRegex(cookieName: string): RegExp {
        return new RegExp(`${name}=([^;]+)`);
    }

    export function add(name: string, value: string, expires?: Date, path?: string): void {
        let parts: string[] = [];

        if (!name) {
            throw new Error("cookie name cannot be null");
        }
        expires = value ? expires : new Date(0);
        parts.push(`${name}=${encodeURIComponent(value)}`);
        if (path) {
            parts.push(`path=${path}`);
        }
        if (expires) {
            parts.push(`expires=${expires.toUTCString()}`);
        }
        document.cookie = parts.join("; ");
    }

    export function get(name: string): string {
        let result: string = null;
        if (document.cookie.length > 0) {
            let matches = getCookieRegex(name).exec(document.cookie);
            if (matches.length > 1) {
                result = decodeURIComponent(matches[1]);
            }
        }
        return result;
    }

    export function remove(name: string): boolean {
        var removed = false;
        if (get(name)) {
            add(name, null);
            removed = true;
        }
        return removed;
    }
}

export module array {
    export function first<T>(array: Array<T>, predicate: (item: T) => boolean): T {
        var filterResult: Array<T> = array.filter(predicate);
        if (!filterResult || !filterResult.length) {
            throw new Error("Item matching predicate not found.");
        }
        return filterResult[0];
    }

    export function firstOrDefault<T>(array: Array<T>, predicate: (item: T) => boolean): T {
        var filterResult: Array<T> = array.filter(predicate);
        return filterResult && filterResult.length ? filterResult[0] : null;
    }

    export function last<T>(array: Array<T>, predicate: (item: T) => boolean): T {
        var filterResult: Array<T> = array.filter(predicate);
        if (!filterResult || !filterResult.length) {
            throw new Error("Item matching predicate not found.");
        }
        return filterResult[filterResult.length - 1];
    }

    export function lastOrDefault<T>(array: Array<T>, predicate: (item: T) => boolean): T {
        var filterResult: Array<T> = array.filter(predicate);
        return filterResult && filterResult.length ? filterResult[filterResult.length - 1] : null;
    }

    export function single<T>(array: Array<T>, predicate: (item: T) => boolean): T {
        var filterResult: Array<T> = array.filter(predicate);
        if (!filterResult || !filterResult.length) {
            throw new Error("Item matching predicate not found.");
        }
        if (filterResult.length > 1) {
            throw new Error("Predicate yielded more than one result.");
        }
        return filterResult[0];
    }

    export function singleOrDefault<T>(array: Array<T>, predicate: (item: T) => boolean): T {
        var filterResult: Array<T> = array.filter(predicate);
        if (filterResult && filterResult.length > 1) {
            throw new Error("Predicate yielded more than one result.");
        }
        return filterResult && filterResult.length ? filterResult[0] : null;
    }

    export function remove<T>(array: Array<T>, predicate: (item: T) => boolean): boolean {
        var wasRemoved = false;
        var item = firstOrDefault(array, predicate);
        if (item) {
            var index = array.indexOf(item);
            if (index >= 0) {
                wasRemoved = true;
                array.splice(index, 1);
            }
        }
        return wasRemoved;
    }

    export function removeAll(array: Array<any>): void {
        array.splice(0, array.length);
    }

    export function count<T>(array: Array<T>, predicate: (item: T) => boolean): number {
        return array.reduce((prev: number, current: T) => {
            return predicate(current) ? prev + 1 : prev;
        }, 0);
    }

    export function distinct<T>(array: Array<T>, comparePredicate?: (a: T, b: T) => boolean): Array<T> {

        comparePredicate = comparePredicate || ((a1: T, b1: T) => a1 === b1);
        return array.reduce((prev: Array<T>, curr: T) => {
            if (!prev.some(p => comparePredicate(p, curr))) {
                prev.push(curr);
            }
            return prev;
        }, []);
    }
}

export module date {
    var isoDateStringRegex: RegExp = /^\d{4}\-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,7})?([\+\-]\d{2}:\d{2}|[A-Z])?$/i;

    export function isIsoDateString(dateString: string) {
        return isoDateStringRegex.test(dateString);
    }
}
