// Get data form json file
const json = require('../config.json');

/**
 * Returns getWeMapForm.
 * @returns {String} '@WeMap Form'
 */
function getWeMapForm() {
    console.log(json);
    return '<form class="wemap-form"> Hello:  </form>';
}

if (typeof module !== 'undefined') { module.exports = getWeMapForm; }
