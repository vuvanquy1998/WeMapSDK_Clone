import {getJSON} from '../util/ajax';

export default class API {
    /**
     * Returns detail infomation of an OSM Id with OSM type
     * @returns {Object} detail infomation
     */
    static lookup({osmId, osmType, key}, cb) {
        // TODO: get lookup api from config file
        if(osmType != null && osmType != undefined && osmType != "") {
            var url = "https://apis.wemap.asia/we-tools/lookup?key=" + key + "&id=" + osmType + osmId;
        } else {
            var url = "https://apis.wemap.asia/we-tools/lookup/" + osmId + "?key=" + key;
        }
        getJSON({ 
            url: url,
            method: 'GET'
        }, (error, data) => {
            // TODO: handle error
            cb(data);
        });
    }
}