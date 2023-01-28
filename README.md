# Oracc

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Development server on mobile

Run `ng serve --host 0.0.0.0`. Find your local IP address. Navigate to `<local IP address>:4200/`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Deploy to GH-pages

We currently deploy a staging version of this site to GitHub pages (the prod version is deployed onto an ubuntu server). Use the following commands to deploy to GH-pages:

Run `ng deploy --base-href=/oracc-search-front-end/`

or

`npm run deploy`

Make sure that the project has first been initialised through Git and linked to your local repository.
See the [documentation for the package we use](https://www.npmjs.com/package/angular-cli-ghpages) for more information.

## Serving the app under a custom url directory

The app is configured to run under a `/new` directory to satisfy production requirements on the production ubuntu server (this is not applicable to the GH-pages deployment). To change this you need to edit the `angular.json` file and change the `"baseHref": "/new/"` value accordingly.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
