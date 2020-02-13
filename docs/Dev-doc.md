## Clone project

## Run

```bash
# Install 
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt update && sudo apt install yarn

# Install Dependencies
cd [repo_dev]
yarn install

# First build
yarn run wemap-pre-build

# Dev build
yarn run wemap-dev

# Product Build
yarn run wemap-prod

# Recompile CSS
yarn run wemap-gulp

```
