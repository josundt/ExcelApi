export module http {
    export function get(
        url: string,
        acceptHeader: string,
        acceptLanguageHeader: string,
        fnSuccess: (data: string) => void,
        fnError?: (status: number, xhr: XMLHttpRequest) => void) {

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    fnSuccess(xhr.responseText);
                } else {
                    fnError(xhr.status, xhr);
                }
            }
        }
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Accept", acceptHeader || "application/json");
        xhr.setRequestHeader("Accept-Language", acceptLanguageHeader || "en-US");
        xhr.send();
    }
}

export module cookies {
    function getCookieRegex(cookieName: string): RegExp {
        return new RegExp(`${name}=([^;]+)`);
    }

    export function add(name: string, value: string, expires?: Date, path?: string): void {
        let parts = [];

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
        let result = null;
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