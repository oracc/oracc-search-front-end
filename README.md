# OraccSearchTable

This Angular 4 project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.2 and customised using components ng2-search-filter, 'ng2-order-pipe' and 'ngx-pagination'.

This is just a test for showing ORACC data on a search table, and more tests using other components can be found in different branches.

## Install requirements

### npm

https://www.npmjs.com/get-npm

### Angular CLI

https://cli.angular.io

### Project dependencies

Go to project root directory and run

```
npm install
```

to get all the dependencies set up. These are listed in `package.json`.

If you add any new dependencies, remember to install them with:

```
npm install --save
```

so they are added to `package.json` which is version controlled.

### json-server

We need to serve the data with json-server in localhost:3000 so it's accessible from the table.
This is temporary until we get the ElasticSearch/Flask-Restful backend ready.

To run json-server:
```
json-server --watch src/assets/data/entries_db.json &
```

Note it might be that it's not enough with `npm install` and it needs to be uninstalled locally, then installed globally:

```
npm uninstall json-server
npm install json-server [--save] -g
```

See more in https://github.com/typicode/json-server.

### yarn, optionally

Needed to automatically install dependencies when installing a new package e.g. ng2-search-table has dependencies that need manual installing - yarn will install these automatically.

In Mac OS X:

```
brew install yarn
```

Sample usage:

```
yarn install --peer
```

See more in https://yarnpkg.com.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
