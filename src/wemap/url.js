import { default as config } from '../config.json';

export default class UrlController {

    /**
     * Returns all current Url parameters
     * @returns {Object} all params in Url
     */
    getParams() {
        let allParams = {};
        for (const p in config.url) {
            config.url[p].params.forEach((element) => {
                allParams[element] = this.parseParam(element);
            });
        }
        return allParams;
    }

    /**
     * Update parameters in Url
     * @param {*} group Example: "view" or "route" ...
     * @param {*} values Object contain value
     */
    updateParams(group, values) {
        let paramValues = values || {};
        let url = new URL(window.location);
        let search_params = new URLSearchParams(url.search);
        config.url[group].params.forEach((element) => {
            if(paramValues[element] != null && paramValues[element] != "" && paramValues[element] != undefined) {
                search_params.set(element, paramValues[element]);
            }
        });
        url.search = search_params.toString();
        if(config.url[group].history) {
            window.history.pushState("", "", url);
        } else {
            window.history.replaceState("", "", url);
        }
    }

    /**
     * Delete parameters in Url
     * @param {*} group Example: "view" or "route" ...
     */
    deleteParams(group) {
        let url = new URL(window.location);
        let search_params = new URLSearchParams(url.search);
        config.url[group].params.forEach((element) => {
            search_params.delete(element);
        });
        url.search = search_params.toString();
        if(config.url[group].history) {
            window.history.pushState("", "", url);
        } else {
            window.history.replaceState("", "", url);
        }
    }

    /**
     * Returns string from Url with given parameter name
     * @param {String} paramName
     */
    parseParam(paramName) {
        let url = new URL(window.location);
        let param = url.searchParams.get(paramName);
        if(param == null || param == "" || param == undefined) {
            param = null;
        }
        return param;
    }
}
