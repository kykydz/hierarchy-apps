<!-- > Author: Rizky Heri S -->

### Requirement

Below are author environment to run the script:

1. Node: v16.13.0
2. OS: Mac OSX
3. NodeJs additional package can be seen inside `package.json`
4. project is using TypeScript Version 5.3.3

### Start Apps using NPM

1. Open terminal with root folder `{workdir}/`
2. Run `npm i` to install all dependencies
3. Run `npm run build` to build the apps
4. Run `npm test` to run unit test and integration test
5. Run `npm run server` to run server

### Start Apps using Docker

You need to have `docker` apps in your host machine.

1. Open terminal with root folder `{workdir}/`
2. Run command `docker compose -f docker-compose.yaml up`
