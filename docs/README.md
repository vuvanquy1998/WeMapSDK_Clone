## Compile: Mapbox GL JS vs Mapbox GL Directions and Pelias Mapbox GL JS
1. Mapbox GL JS Clone https://github.com/mapbox/mapbox-gl-js and checkout to last release
    ```bash
        git clone https://github.com/mapbox/mapbox-gl-js
    ```
2. Mapbox GL Directions Clone https://github.com/mapbox/mapbox-gl-directions into `mapbox-gl-js/src` folder and checkout to last release
    ```bash
        git clone https://github.com/mapbox/mapbox-gl-directions
    ```
3. Pelias Mapbox GL JS Clone https://github.com/Joxit/pelias-mapbox-gl-js into `mapbox-gl-js/src` folder and checkout to last release
    ```bash
        git clone https://github.com/Joxit/pelias-mapbox-gl-js
    ```
4. Update `package.json`
   1. Copy config `browserify`, `peerDependencies`, `dependencies`, `devDependencies`, from `/src/mapbox-gl-directions/package.json` to `./package.json` keep all dependencies of mapbox-gl-directions and remove existed
   2. Make custom build script: `"build-directions": "NODE_ENV=production mkdir -p src/mapbox-gl-directions/dist && browserify -s MapboxDirections src/mapbox-gl-directions/src/index.js > src/mapbox-gl-directions/dist/mapbox-gl-directions.js && cp src/mapbox-gl-directions/src/mapbox-gl-directions.css src/directions/dist"`
   3. Add gulp build scss:
   ```json
		"gulp": "^4.0.0",
		"gulp-sass": "^4.0.2",
		"gulp-clean-css": "^4.0.0",
		"gulp-autoprefixer": "^6.0.0",
		"gulp-ignore": "^2.0.2",
		"gulp-plumber": "^1.2.1",
		"gulp-rename": "^1.4.0",
		"gulp-sourcemaps": "^2.6.5",
		"gulp-watch": "^5.0.1"
   ```
5. Update code Mapbox GL JS
   - Open `./src/index.js` add `import MapboxDirections from './mapbox-gl-directions/dist/mapbox-gl-directions';` abow row `const exported = {`
   - Export `MapboxDirections` add abow row `config,`
6. Install dependencies and Build
   1. Install dependencies: `yarn install`
   2. Build Mapbox GL Directions: `yarn run build-directions`
   3. Build Mapbox GL JS: `yarn run build-prod-min`
7. Sample Code
    ```javascript
        // Old code
        <head>
            <script src="mapbox-gl.js"  type="text/javascript"></script>
        </head>
        <body>
            <script src="mapbox-gl-directions.js"></script>
            map.addControl(
                new MapboxDirections({
                    accessToken: mapboxgl.accessToken
                }),
                'top-left'
            );
        </body>
    ```

     ```javascript
        // New code
        <head>
            <script src="mapbox-gl.js"  type="text/javascript"></script>
        </head>
        <body>
            map.addControl(
                new mapboxgl.MapboxDirections({
                    accessToken: mapboxgl.accessToken
                }),
                'top-left'
            );
        </body>
    ```

