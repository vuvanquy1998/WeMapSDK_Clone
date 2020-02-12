import {getJSON} from '../util/ajax';

export default class API {
    /**
     * Returns detail infomation of an OSM Id with OSM type
     * @returns {Object} detail infomation
     */
    static lookup({osmId, osmType, key}) {
        var result = 1000;
        getJSON({
            // TODO: get lookup api
            url: 'https://apis.wemap.asia/we-tools/lookup?key=' + key + "&id=" + osmType + osmId,
            method: 'GET'
        }, (error, data) => {
            // TODO: handle error'
            console.log("Hello " + result);
            result = data;
            return result;
        });

        return result;
    }
}