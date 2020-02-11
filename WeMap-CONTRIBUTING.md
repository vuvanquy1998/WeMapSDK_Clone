## Bước 1:
Install [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable)
```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt update && sudo apt install yarn
```

Clone the repository
```bash
git clone https://github.com/WEMAP-Official/WeMap-Web-SDK.git
```

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
