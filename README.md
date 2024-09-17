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

Run `ng build` to build the project for `oracc-build`. The build artifacts will be stored in the `dist` directory.

To build for `oracc2` use `ng build -c oracc2`.

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

### Push the new assets to the server

Once we are happy with our front end code, we must update
the version number in `package.json`, then call `ng build`.
Now we can use `rsync` to push this new version to the
production server. Let's say our new version is `1.2.3`:

```sh
ng build -c build-oracc
rsync -r dist/oracc/ rits@build-oracc.museum.upenn.edu:www/oracc-search-front-end/1.2.3
```

### Switch to the new assets

The website is currently served from a `/search` directory on the production server. This is achieved through a
symlink from `/home/oracc/www/search` to the directory
containing the assets.

Use the `main` git branch for production deployments.

Firstly we need to ssh into the build-oracc server. If you want to be able to restore the current version,
take a note of the current link's target (only type the
characters after the $ on each line, and note that here
I'm also showing a possible result of the ls command):

```sh
$ ssh rits@build-oracc.museum.upenn.edu
rits@build-oracc:~$ ls -l /home/oracc/www/search
lrwxrwxrwx 1 root root 44 Nov 27 16:41 /home/oracc/www/search -> /home/rits/www/oracc-search-front-end/1.2.2
```

Inside `/home/rits/oracc-search-front-end` you need to run `npm install` to set up the Angular project. Then run `ng build` to build the production version of the website suitable for the `build-oracc` machine. This will create a `dist/oracc` folder where the production ready files exist.

For the `oracc2` machine the equivalent would be `ng build -c oracc2`

Now we can redirect this link:

```sh
rits@build-oracc:~$ sudo ln -sfT /home/rits/www/oracc-search-front-end/1.2.3 /home/oracc/www/search
```

In case of trouble, we can roll back to the old version using the same command with the old version number we found out earlier:

```sh
rits@build-oracc:~$ sudo ln -sfT /home/rits/www/oracc-search-front-end/1.2.2 /home/oracc/www/search
```

The production server will instantly begin serving this
new version. If you like, you can delete old, obsolete
versions like so:

```sh
rits@build-oracc:~$ rm /home/rits/www/oracc-search-front-end/1.1.0/ -rf
```

Note that if you are getting a `403 forbidden` error from Apache you probably need to set the correct folder privileges. Make sure that the `/home/rits/www` folder and all its child folders relating to Angular have at least `drwxr-xr-x` privileges. You can set these privileges with: `sudo chmod 755 /home/rits/www` and you can check current privileges with: `ls -l /home/rits/www` .

### Further Apache configurations

The Oracc server runs on Ubuntu and exposes the Oracc website via an Apache web server. Therefore, you may need to configure Apache to appropriately serve the static content generated via the Angular build process.

The following rules need to exist in the file `/etc/apache2/sites-enabled/oracc-vhost-ssl.conf`:

1. The angular app should be served at `/search`
2. The oracc-rest API should be served at `/oracc-rest-api/`

These rules look like this:

```apacheconf
<VirtualHost *:443>
...

    <Location /oracc-rest-api>
        ProxyPass http://localhost:5001
    </Location>

    RewriteEngine on

    # oracc-rest
    RewriteCond %{REQUEST_URI} "^/oracc-rest-api/"
    RewriteRule ^ - [L]

    # Angular website config - rewrites routes back to /new/index.html
    RewriteCond %{REQUEST_FILENAME} "^/new/?"
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
    RewriteRule ^ - [L]
    RewriteCond %{REQUEST_FILENAME} "^/new(/.*)?$"
    RewriteRule ^ /new/index.html [L]

...
</VirtualHost>
```

The line `ProxyPass http://localhost:5001` means that you will need an
`oracc-rest` backend listening on port `5001`. So set:

```sh
export ORACC_PORT=5001
export ORACC_INGEST_DIRECTORY=/home/rits/oracc-rest/neo
```

in your `~/.bashrc` file, restart your shell and start
`docker-compose up --build -d` in the `oracc-rest` source directory
as described in the instuctions in the `README.md` of `oracc-rest`.

The use of `ProxyPass` requires that Apache modules`proxy_http` and
`proxy_http2` are enabled. Check what is enabled with the command:

```sh
a2query -m
```

and enable missing modules (if needed) with:

```sh
a2enmod proxy_http proxy_http2
```

Apache will need to be restarted following any config modifications. You can restart Apache with the following:

```sh
$ sudo apache2ctl -t
Syntax OK
$ sudo systemctl restart apache2
```

(if you do not get the `Syntax OK` message, please don't run the
second command; check your edits to the configuration and try again).

You can verify that the configs are working by navigating to `https://build-oracc.museum.upenn.edu/new/404` in your browser and you should see the custom 404 page generated by the angular website.

Once the above process is done, you can simply pull the latest changes to the `main` branch on the server. The website should then display these latest changes.

You can learn more about Apache configurations for an Angular app [here](https://angular.io/guide/deployment#server-configuration).

---

### Angular config for serving the app under a custom url directory

As explained above, the production and staging apps are configured to run under a `/new` directory while the gh-pages deployment and development environment just run from the root directory `/`. If you want to change this you need to edit the `angular.json` file and change the `"baseHref": "/new/"` value accordingly.

It is also possible to define the `baseHref` property using a custom build configuration if desired. You can do this by setting a custom field within the `configurations` object within `angular.json`. For instance, we currently have set the `github-pages` configuration which sets a custom `baseHref`and is run with `ng build --configuration=github-pages`.

---

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
Although there are not unit tests at the moment.

## Running end-to-end tests

This project also uses Cypress for testing. Ensure you've got the backend and frontend apps running before attempting the tests. To run the tests without a window, run `npx cypress run` or `npm run cypress:run`. To open a window and see the tests run (more helpful when writing the tests and debugging), run `npx cypress open` or `npm run cypress:open` and choose the tests you'd like to run through the GUI.

`ng serve` (or equivalent) should be running while these tests
are run.

The `oracc-rest` server should also be running and the
build-oracc server should be reachable for those tests that
are not using stubbed calls.

### Backend stubs

Certain parts of the test now stub calls to the backend
(`oracc-rest` and build-oracc) servers using fixtures in the
`cypress/fixtures` directory. Running these tests, therefore,
does not require the build-oracc server to be reachable or the
`oracc-rest` server to be running.

### Updating the backend stubs

The last log line on the logs for each spec (`.cy.ts` file) either
says `log  All calls were stubbed` or `log written <n> new entries`.
If it says `written <n> new entries` for any spec then
you can copy all the files from `cypress/fixtures_new` to
`cypress/fixtures`:

```sh
cp -rt cypress/fixtures cypress/fixtures_new/*
```

It is a good idea to clean the `cypress/fixtures_new` directory before
running all the tests so that meaningless files aren't copied into the
`fixtures` directory. The backend `oracc-rest` server will need to be
running and the `build-oracc` server will need to be reachable for the
tests to pass for these new fixtures to be generated.

All of this is automated in the `./update-test-fixtures.sh`
bash script. If you want to delete the existing fixtures first,
run the `./replace-test-fixtures.sh` script.

Any future runs will use these updated responses. These new
files can be committed to source control.

### Debugging

Cypress is not interested in giving us a way to debug Cypress tests
in a normal IDE. Instead, we place a breakpoint by inserting
`cy.pause()` in the code, then run `npx cypress open` or
`npm run cypress:open`. You can't use `cypress:run`; you have to
use the GUI front end because this is how the debugger is displayed.
You then have "Resume" and "Next" buttons to click.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
