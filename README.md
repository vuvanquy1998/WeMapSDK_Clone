# WeMap-Web-SDK
WeMap-Web-SDK

## Compile: Mapbox GL JS vs Mapbox GL Directions
1. Clone https://github.com/mapbox/mapbox-gl-js
    ```bash
        git clone https://github.com/mapbox/mapbox-gl-js
    ```
2. Clone https://github.com/mapbox/mapbox-gl-directions into `src` folder with name `directions`
    ```bash
        cd mapbox-gl-js
        cd src
        git clone https://github.com/mapbox/mapbox-gl-directions directions
    ```
3. Update `package.json`
   1. Copy config `browserify`, `peerDependencies`, `dependencies`, `devDependencies`, from `/src/directions/package.json` to `./package.json`
   2. Make custom build script: `"build-directions": "NODE_ENV=production mkdir -p src/directions/dist && browserify -s MapboxDirections src/directions/src/index.js > src/directions/dist/mapbox-gl-directions.js && cp src/directions/src/mapbox-gl-directions.css src/directions/dist"`

4. Update code Mapbox GL JS
   - Open `./src/index.js` add `import MapboxDirections from './directions/dist/mapbox-gl-directions';` abow row `const exported = {`
   - Export `MapboxDirections` add abow row `config,`
5. Install dependencies and Build
   1. Install dependencies: `yarn install`
   2. Build Mapbox GL Directions: `yarn run build-directions`
   3. Build Mapbox GL JS: `yarn run build-prod-min`
6. Sample Code
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
7. ....