export default class UrlController {

    /**
     * Returns all current Url parameters
     * @returns {Object} all params in Url
     */
    getParams() {
        let paramNames = [
            "x", "y", "z",
            "ox", "oy", "dx", "dy", "vehicle",
            "osmid", "osmtype"
        ];
        let allParams = {};
        paramNames.forEach((element) => {
            allParams[element] = this.parseParam(element);
        });
        return allParams;
    }

    /**
     * Updates view parameters in Url (x: long, y: lat, z: zoom level)
     * @param {*} viewParams {x, y, z}
     */
    updateViewParams(viewParams) {
        viewParams = viewParams || {};
        let url = new URL(window.location);
        let search_params = new URLSearchParams(url.search);

        search_params.set("x", viewParams.x);
        search_params.set("y", viewParams.y);
        search_params.set("z", viewParams.z);
        
        url.search = search_params.toString();
        window.history.replaceState("", "", url);
    }

    /**
     * Updates place parameters in Url
     * @param {*} placeParams {osmid, osmtype}
     */
    updatePlaceParams(placeParams) {
        placeParams = placeParams || {};
        let url = new URL(window.location);
        let search_params = new URLSearchParams(url.search);

        search_params.set("osmid", placeParams.osmid);
        search_params.set("osmtype", placeParams.osmtype);
        
        url.search = search_params.toString();
        window.history.pushState("", "", url);
    }

    /**
     * Deletes place parameters in Url
     */
    deletePlaceParams() {
        let url = new URL(window.location);
        let search_params = new URLSearchParams(url.search);

        search_params.delete("osmid");
        search_params.delete("osmtype");
        
        url.search = search_params.toString();
        window.history.pushState("", "", url);
    }

    /**
     * Updates route parameters in Url (ox, oy: origin, dx, dy: destination, vehicle)
     * @param {*} placeParams {ox, oy, dx, dy, vehicle}
     */
    updateRouteParams(routeParams) {
        routeParams = routeParams || {};
        let url = new URL(window.location);
        let search_params = new URLSearchParams(url.search);

        search_params.set("ox", routeParams.ox);
        search_params.set("oy", routeParams.oy);
        search_params.set("dx", routeParams.dx);
        search_params.set("dy", routeParams.dy);
        search_params.set("vehicle", routeParams.vehicle);
        
        url.search = search_params.toString();
        window.history.pushState("", "", url);
    }

    /**
     * Deletes route parameters in Url
     */
    deleteRouteParams() {
        let url = new URL(window.location);
        let search_params = new URLSearchParams(url.search);

        search_params.delete("ox");
        search_params.delete("oy");
        search_params.delete("dx");
        search_params.delete("dy");
        search_params.delete("vehicle");
        
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