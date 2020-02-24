import { default as config } from '../config.json';

export default class UrlController {

    /**
     * Returns all current Url parameters
     * @returns {Object} all params in Url
     */
    getParams() {
        let allParams = {};
        for (const p in config.url) {
            config.url[p].forEach((element) => {
                allParams[element] = this.parseParam(element);
            });
        }
        return allParams;
    }

    /**
     * Updates view parameters in Url (x: long, y: lat, z: zoom level)
     * @param {*} viewParams {x, y, z}
     */
    updateViewParams(viewParams) {
        this.updateParams("view", viewParams);
    }

    /**
     * Updates place parameters in Url
     * @param {*} placeParams {osmid, osmtype}
     */
    updatePlaceParams(placeParams) {
        this.updateParams("place", placeParams);
    }

    /**
     * Deletes place parameters in Url
     */
    deletePlaceParams() {
        this.deleteParams("place");
    }

    /**
     * Updates route parameters in Url (ox, oy: origin, dx, dy: destination, vehicle)
     * @param {*} placeParams {ox, oy, dx, dy, vehicle}
     */
    updateRouteParams(routeParams) {
       this.updateParams("route", routeParams);
    }

    /**
     * Deletes route parameters in Url
     */
    deleteRouteParams() {
        this.deleteParams("route");
    }

    updateParams(group, values) {
        let paramValues = values || {};
        let url = new URL(window.location);
        let search_params = new URLSearchParams(url.search);
        config.url[group].forEach((element) => {
            if(paramValues[element] != null && paramValues[element] != "" && paramValues[element] != undefined) {
                search_params.set(element, paramValues[element]);
            }
        });
        url.search = search_params.toString();
        window.history.pushState("", "", url);
    }

    deleteParams(group) {
        let url = new URL(window.location);
        let search_params = new URLSearchParams(url.search);
        config.url[group].forEach((element) => {
            search_params.delete(element);
        });
        url.search = search_params.toString();
        window.history.pushState("", "", url);
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
