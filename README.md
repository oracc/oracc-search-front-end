# Oracc

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Development server on mobile

Run `ng serve --host 0.0.0.0`. Find your local IP address. Navigate to `<local IP address>:4200/`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

---

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

---

## Deployment

Angular has guides for deploying across many hosting solutions, including the approaches we take below for staging and production. Please see [here](https://angular.io/guide/deployment) for more information.

We currently deploy the application in two locations: GitHub pages for the staging version and the Oracc build server for the production version. GitHub pages offers a very quick and convenient approach to deploying the staging version of the application for testing out new features. The production deployment involves more steps.

Both deployment strategies are described below.

---

## Deploy to GH-pages (for staging)

Use the following commands to deploy to GH-pages:

From the main project directory run: `ng deploy --base-href=/oracc-search-front-end/`

or

`npm run gh-pages-deploy`

This will build the project using a custom `baseHref` property defined in `angular.json`. The project will then automatically be deployed to github-pages.

Make sure that the project has first been initialised through Git and linked to your local repository.
See the [documentation for the package we use](https://www.npmjs.com/package/angular-cli-ghpages) for more information.

---

## Deploy to the Oracc build server (for production)

First, you will need to gain access to the Oracc build server which is currently managed by Steve Tinney. You should email Steve to gain access to the server, the project PI should be able to give you his contact details. To log in to the server you will need to generate an ssh key pair and store the public key on the server, Steve should be able to assist with this. Once you have access to the server, you can proceed to deploy the application there.

The following software needs to be installed on the server (ask Steve Tinney for help if this software has not yet been installed):

1. Git (for cloning the website repo)
2. NodeJs at least version 14
3. npm (should come bundled with NodeJs)
4. Angular CLI at least version 15

## Clone the repo

On the server, all our project code is located at `/home/rits` and the Angular code is in the `/home/rits/oracc-search-front-end` directory. If the `oracc-search-front-end` folder does not exits, you will need to clone the repo via git into `/home/rits`.

## Build the website for production

Inside `/home/rits/oracc-search-front-end` you need to run `npm install` to set up the Angular project. Then run `ng build` to build the production version of the website. This will create a `dist/oracc` folder where the production ready files exist.

## Link the production folder to an Apache directory

The website is currently served from a `/new` directory on the server. Therefore, the Angular application is symlinked from `/home/rits/oracc-search-front-end/dist/oracc` into `/home/oracc/www/new`.

This can be achieved by running the following command from the location where you'd like to create the symlink: `sudo ln -s /home/rits/oracc-search-front-end/dist/oracc new`.

This will symlink each file and folder to the new directory. You can check that the symlink has been created by running: `ls -la ./ | grep "\->"`

## Further Apache configurations

The Oracc server runs on Ubuntu and exposes the Oracc website via an Apache web server. Therefore, you may need to configure Apache to appropriately serve the static content generated via the Angular build process.

Specifically, you will need to add a rewrite rule so that the angular app pages fall back to `/new/index.html`. This has currenty been achieved by adding the following rewrite rules to `/etc/apache2/sites-enabled/oracc-vhost-ssl.conf` :

```apacheconf
<VirtualHost *:443>
...

# Angular website config - rewrites routes back to /new/index.html
RewriteCond %{REQUEST_FILENAME} "^/new(/.*)?$"
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
RewriteRule ^ - [L]
RewriteCond %{REQUEST_FILENAME} "^/new(/.*)?$"
RewriteRule ^(.+)$ /new/index.html [L]

...
</VirtualHost>
```

Apache may need to be restarted following any config modifications. You can restart Apache with the following: `sudo service apache2 restart` . You can verify that the configs are working by navigating to `https://build-oracc.museum.upenn.edu/new/404` in your browser and you should see the custom 404 page generated by the angular website.

There are other methods to achieve the same result as above. However, we have set it up this way so as not to conflict with the Apache configs previously set up by Steve Tinney. You can learn more about Apache configurations for an Angular app [here](https://angular.io/guide/deployment#server-configuration).

---

## Angular config for serving the app under a custom url directory

As explained above, the app is configured to run under a `/new` directory on the production ubuntu server (this does not apply to staging, see deployment steps above). If you want to change this you need to edit the `angular.json` file and change the `"baseHref": "/new/"` value accordingly.

It is also possible to define the `baseHref` property using a custom build configuration if desired. You can do this by setting a custom field within the `configurations` object within `angular.json`. For instance, we currently have set the `github-pages` configuration which sets a custom `baseHref`and is run with `ng build --configuration=github-pages`.

---

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
