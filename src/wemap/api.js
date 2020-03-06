import { makeRequest } from '../util/ajax';
import { default as config } from '../config.json';

export default class API {
    /**
     * Returns detail infomation of an OSM Id (with or without OSM type)
     * @returns {Object} detail infomation
     */
    static lookup({ osmId, osmType, key }, callback) {	  
        if (osmType != null && osmType != undefined && osmType != "") {
            var url = config.lookup.osmTypeId + "?key=" + key + "&id=" + osmType + osmId;	
        } else {	
            var url = config.lookup.osmId + osmId + "?key=" + key;	
        }
        makeRequest({
            url: url,
            method: 'GET',
            key: key
        }, (error, data) => {
            if(error) console(error)
            else {
                data = JSON.parse(data);
                callback(data)
            }
        });
    }
}
