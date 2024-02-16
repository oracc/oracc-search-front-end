// Production environment file

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build -c oracc2` replaces `environment.ts` with `environment.oracc2.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  apiUrl: 'https://oracc2.museum.upenn.edu/oracc-rest-api',
  glossaryArticleURL: 'https://oracc2.museum.upenn.edu'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
