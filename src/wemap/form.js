// Get data form json file
const json = require('../config.json');

/**
 * Returns getWeMapForm.
 * @returns {String} '@WeMap Form'
 */
function getWeMapForm() {
    // Test config json
    console.log(json);

    // Test fetch
    let pointLayers = [];
    let url = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=pk.eyJ1IjoidGhhb2d1bSIsImEiOiJjazJwbHI0eDIwNW82M210b2JnaTBneHY5In0.t4RveeJuHKVJt0RIgFOAGQ';

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw Error(response.status+' '+response.statusText)
            }
            if (!response.body) {
                throw Error('ReadableStream not yet supported in this browser.')
            }
            // store the size of the entity-body, in bytes
            // const contentLength = response.headers.get('content-length');
            //
            // // ensure contentLength is available
            // if (!contentLength) {
            //     throw Error('Content-Length response header unavailable');
            // }

            return response.json()
        })
        .then((data) => {
            // console.log(JSON.stringify(data));
            // console.log(data.layers);
            let layers = data.layers;
            layers.forEach(element => {
                // console.log(element);
                let layerId = element.id;
                if(layerId.includes('poi')){
                    pointLayers.push(layerId)
                }
            });
            console.log(pointLayers);
        }).catch(error => console.error(error));

    return '<form class="wemap-form"> Hello:  </form>';
}

if (typeof module !== 'undefined') { module.exports = getWeMapForm; }
