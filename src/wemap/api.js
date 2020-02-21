import { getJSON } from '../util/ajax';
import { default as config } from '../config.json';

export default class API {
    /**
     * Returns detail infomation of an OSM Id (with or without OSM type)
     * @returns {Object} detail infomation
     */
    static lookup({ osmId, osmType, key }, callback) {
        if (osmType != null && osmType != undefined && osmType != "") {
            var url = config.lookup.osmTypeId + key + "&id=" + osmType + osmId;
        } else {
            var url = config.lookup.osmId + osmId + "?key=" + key;
        }
        getJSON({
            url: url,
            method: 'GET'
        }, (error, data) => {
            callback(data);
        });
    }
}