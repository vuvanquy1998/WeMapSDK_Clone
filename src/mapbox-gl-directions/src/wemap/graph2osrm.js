import { encode } from '@mapbox/polyline';

/**
 * convertGraph2OSRM
 * @param paths: response.paths
 * @param profile
 * @returns {[]}
 */
export function convertGraph2OSRM(paths, profile) {
    let routes = [], legs = [], steps = [];

    let inputPoints = paths[0].points.coordinates;
    let inputInstructions = paths[0].instructions;

    inputInstructions.forEach((ele, index) => {
        let interval = ele.interval;
        let geometry = [];
        let location = [];
        for(let i = interval[0], indexLocation = 0; i <= interval[1]; i++) {
            if (indexLocation === 0) {
                location = [inputPoints[i][0], inputPoints[i][1]];
            }
            geometry.push(inputPoints[i]);
            indexLocation++;
        }

        let maneuver =  maneuverGraph2OSRM(index, location, inputInstructions.length, ele.sign);

        steps.push({
            "intersections": [],
            "driving_side": "right",
            "geometry": swapCoordinatesLatLon(geometry),
            "duration": ele.time  / 3600.0, // seconds -> minutes
            "distance": ele.distance,
            "name": ele.street_name,
            "mode": profile,
            "maneuver": maneuver
        });
    });

    steps["weight"] = paths[0].weight;
    steps["distance"] = paths[0].distance;
    steps["summary"] = "...";
    steps["duration"] = paths[0].time / 3600.0; // seconds -> minutes

    legs[0] = {
        "steps": steps
    };

    routes[0] = {
        "legs": legs,
        "weight_name": "duration",
        "geometry": encode(swapCoordinatesLatLon(paths[0].points.coordinates)),
        "weight":  paths[0].weight,
        "distance": paths[0].distance,
        "duration": paths[0].time / 3600.0 // seconds -> minutes
    };

    return routes;
}

/**
 * maneuverGraph2OSRM
 * @param index
 * @param location
 * @param instructionsLength
 * @param sign
 * @returns {{}}
 */
function maneuverGraph2OSRM(index, location, instructionsLength, sign) {
    let maneuver =  {};
    switch (index) {
        case 0:
            maneuver = {
                "type": "depart",
                "location": location
            };
            break;
        case instructionsLength:
            maneuver = {
                "type": "arrive",
                "location": location
            };
            break;
        default:
            maneuver = {
                "type": "turn",
                "location": location,
                "modifier": modifierSignGraph2OSRM(sign)
            };
            break;
    }
    return maneuver;
}

/**
 * modifierSignGraph2OSRM
 * @param value
 * @returns {string}
 */
function modifierSignGraph2OSRM(value) {
    let out = '';
    switch (value) {
        case 0:
            out = 'straight';
            break;
        case 1:
            out = 'slight right';
            break;
        case -1:
            out = 'slight left';
            break;
        case 2:
            out = 'right';
            break;
        case -2:
            out = 'left';
            break;
        case 3:
            out = 'sharp right';
            break;
        case -3:
            out = 'sharp left';
            break;
        case 4:
            out = 'arrive';
            break;
        case 5:
            out = 'straight';
            break;
        case 6:
            out = 'uturn';
            break;
        case 7:
            out = 'straight';
            break;
        case -7:
            out = 'straight';
            break;
        case 8:
            out = 'uturn';
            break;
        default:
            out = 'straight';
            break;
    }
    return out;
}

/**
 * swapCoordinatesLatLon
 * @param coordinates
 * @returns {[]}
 */
function swapCoordinatesLatLon(coordinates) {
    let coors = [];
    coordinates.forEach(ele => {
        coors.push([ele[1], ele[0]])
    });
    return coors;
}

export default { convertGraph2OSRM };
