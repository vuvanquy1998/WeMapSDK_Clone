# WeMap SDK

-------------
## Version 0.2

### Date: 2020/03/07

1. WeGeolocationControl: A control provides a button that uses the browser's geolocation API to locate the user on the map.

-------------
## Version 0.2

### Date: 2020/03/02

### ✨ Features
1. Changed option build library `mapboxgl` -> `wemapgl`

2. Map: Init map and change option
    1. key: for using map api and replace `accessToken` -> `key`
    2. style: changed option `default` | `bright` | `dark`
    3. revert: point/polygon
    4. url control: utility for get url, update url, delete url. Currently always set `urlController: "true"`
    5. hover: Changed `cursor: "point"` when hover to icon on map
    6. Click show detail: Show point detail in left sidebar when clicked a point or click to revert banner
    7. Switch to route: When click to icon direction revert banner
    8. Right click: Added context menu when right click to map: `What's here?`, `Direction from here`, `Directions to here`

3. Search
    1. Engine: Added Pelias Geocode Engine
    2. Suggestion: Suggestion 10 result search when input char > `suggestion.min_chars` default is `4`
    3. Switch suggestion list using keyboard page up and page down
    3. Enter search: Show list result more exactly
    4. Show place detail when click search search suggestion list or enter search list
    5. Click to icon direction switch to `Directions` with input current place to destination
    6. Show hide marker base on suggestion list and search list

4. Route
    1. Click to map add Origin and Destination to input direction
    2. Engine: Geocode Pelias
    3. Switch between Origin and Destination
    4. Set default vehicle is `driving`
    5. When in directions click to map, if Origin and Destination
already have information then show revert
    6. Add control button to Search input

### ★ Future
1. Place:
    1. Rating:
    2. Comment:

### 🍏 Improvements

### 🐞 Bug Fixes

### 🐛 Bug Created

### ⚠ Breaking changes
- Added URL control

-------------
## Version 0.1

- Integration `Mapbox GL JS`, `Mapbox Directions JS`, `Pelias Geocode` together
