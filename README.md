# OraccSearchTable

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.2.

## Serve the data with json-server in localhost:3000 so it's accessible from the table:

```
json-server --watch src/assets/data/entries_db.json &
```

Note it might be that it's not enough with `npm install` and it needs to be uninstalled locally, then installed globally: 

```
npm uninstall json-server
npm install json-server [--save] -g
```



## Requirements

Run

```
npm install
```

to get all the dependencies set up.

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
