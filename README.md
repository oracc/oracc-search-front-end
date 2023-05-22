# Oracc

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.1.

The guide below is sufficient for setting up the project. For additional technical and supplementary information please also refer to [this](https://github.com/oracc/website/wiki) wiki.

# Requirements

First, clone the project onto your local development machine.

## Nodejs and npm

You need to have [Node.js](https://nodejs.org/en/download/) installed on your local development machine. Nodejs comes bundled with npm which is used for managing the libraries that are used for the frontend. Node version `>=12` and npm version `>=8` should work with this project.

To install all the necessary frontend packages and libraries, run the following from the project root directory:

```shell script
npm install
```

This will install all of the project dependencies that are specified in `package.json`.

You can update the version numbers of individual packages in the `package.json` file when necessary. Running `npm install` again will install the specified dependencies.

## Install the Angular CLI

To install the Angular CLi run the following:

```shell script
npm install -g @angular/cli
```

This will allow you to run the necessary `ng` commands for performing several Angular tasks.

## Running a development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Development server on mobile

Run `ng serve --host 0.0.0.0`. Find your local IP address. Navigate to `<local IP address>:4200/`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

---

## Build the production ready website files

Run `ng build` to build the project. The build artifacts will be stored in the `dist` directory.

---

## Deployment

Angular has guides for deploying across many hosting solutions, including the approaches we take below for staging and production. Please see [here](https://angular.io/guide/deployment) for more information.

We currently deploy the application in two locations: GitHub pages for the staging version and the Oracc build server for the production version. GitHub pages offers a very quick and convenient approach to deploying the staging version of the application for testing out new features. The production deployment involves more steps.

Both deployment strategies are described below.

---

## Deploy to GH-pages (for staging)

Make sure that the project has first been initialised through Git and linked to your remote repository. See the [documentation for the package we use](https://www.npmjs.com/package/angular-cli-ghpages) for more information.

From the main project directory run: `npm run gh-pages-deploy`

This will run the `gh-pages-deploy` script defined in `package.json`. It will build the project using the `github-pages` build target defined in `angular.json`. This sets a custom `baseHref` property (which is the name of your github repo) and also sets the custom environment variables.

The project will automatically be deployed to github-pages.

---

## _to-do: add build instructions for the build-oracc server separate to oracc2_

---

## Deploy to the Oracc build server (for production)

The application is currently deployed for production to the Oracc build server (more details [here](https://github.com/oracc/website/wiki/ORACC-Server)) which runs on Ubuntu and exposes an Apache web server. Ask a senior team member or Steve Tinney to get access to this server.

The following software needs to be installed on the Ubuntu server:

1. `Git` (for cloning the website repo: `sudo apt-get install git`)
2. `NodeJs` (at least version 14: `sudo apt install nodejs npm`)
   - This may install outdated versions, so to upgrade to the latest versions of NodeJs and npm run `sudo npm install -g n` followed by `sudo n lts`
3. npm (should come bundled with NodeJs)
4. Angular CLI (at least version 15: `sudo npm install -g @angular/cli`)

## Clone the repo

On the Ubuntu server, our project code should be located at `/home/rits` so this is where you should clone the project into. You should end up with the Angular project code inside the `/home/rits/oracc-search-front-end` directory.

Use the `main` git branch for production deployments.

## Build the website for production

Inside `/home/rits/oracc-search-front-end` you need to run `npm install` to set up the Angular project. Then run `ng build` to build the production version of the website. This will create a `dist/oracc` folder where the production ready files exist.

## Link the production folder to an Apache directory

The website is currently served from a `/new` directory on the server. This can be achieved by running the following command to create a symlink: `sudo ln -sT /home/rits/oracc-search-front-end/dist/oracc /home/oracc/www/new`

This will symlink each file and folder to the new directory. You can check that the symlink has been created by running: `ls -la ./ | grep "\->"`

Note that if you are getting a `403 forbidden` error from Apache you probably need to set the correct folder privileges. Make sure that the `/home/rits` folder and all its child folders relating to Angular have at least `drwxr-xr-x` privileges. You can set these privileges with: `sudo chmod 755 /home/rits` and you can check current privileges with: `ls -l /home/rits` .

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

Once the above process is done, you can simply pull the latest changes to the `main` branch on the server. The website should then display these latest changes.

You can learn more about Apache configurations for an Angular app [here](https://angular.io/guide/deployment#server-configuration).

---

## Angular config for serving the app under a custom url directory

As explained above, the production and staging apps are configured to run under a `/new` directory while the gh-pages deployment just runs from the root directory. If you want to change this you need to edit the `angular.json` file and change the `"baseHref": "/new/"` value accordingly.

It is also possible to define the `baseHref` property using a custom build configuration if desired. You can do this by setting a custom field within the `configurations` object within `angular.json`. For instance, we currently have set the `github-pages` configuration which sets a custom `baseHref`and is run with `ng build --configuration=github-pages`.

---

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
