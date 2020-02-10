## Bước 1:

Install [git](https://git-scm.com/), [node.js](https://nodejs.org/) (version 6 or greater), [GNU Make](http://www.gnu.org/software/make/), and libglew-dev
```bash
sudo apt-get update &&
sudo apt-get install build-essential git nodejs libglew-dev libxi-dev
```

Install [yarn](https://yarnpkg.com/en/docs/install#linux-tab)
```bash
curl -o- -L https://yarnpkg.com/install.sh | bash
```
(It is also possible to install yarn from Debian/Ubuntu packages. See [yarn's install instructions](https://yarnpkg.com/en/docs/install#linux-tab)).


Clone the repository
```bash
git clone git@github.com:mapbox/mapbox-gl-js.git
```

```bash
git clone 

# Install yarn: https://yarnpkg.com/getting-started/install  - Ubuntu

npm install -g yarn@berry

# Dependencies
yarn install

# Build directions
yarn run build-directions

# Build project
yarn run build-prod-min

```

## Bước 2: Sửa code
```bash
cd src/wemap

# Ex: WeMap-Web-SDK\src\wemap\form.js
nano functionName.js

# import functionName to index.js
nano  ../index.js
    

# Style
cd sass

# src/wemap/sass/_form.scss
touch _functionName.scss

# import _functionName to style.scss
nano style.scss
     @import "functionName";

# watch style

cd rootProject

gulp watch

# Edit file _functionName.scss and save

# Stop watch 

# Rebuild
yarn run build-prod-min

```

## Bước 3: Test code
```bash
cd rootProject/example

# Edit file index.html
nano index.html

```


## Quy trình code
- Bước 1: Chạy test để đảm bảo chương trình đang hoạt động bình thường
- Bước 2: Viết test trong folder example tương tự như đã code xong thư viện
- Bước 3: Code thư viện
- Bước 4: Chạy test để kiểm tra
