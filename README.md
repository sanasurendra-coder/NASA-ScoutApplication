
# NasaApplication

This project is an asteroid monitoring dashboard designed to track Near-Earth Object (NEO) telemetry data from NASA's Jet Propulsion Laboratory (JPL) Scout API. It was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.26 and is built with a zoneless Signals architecture, `@ngrx/signals`, and AG Grid.

---

## About the Project

* **Zoneless Architecture**: Runs without `zone.js` using `provideZonelessChangeDetection()`, keeping change detection lightweight and bound to Angular Signals.
* **NgRx Signals Store**: State management is handled by `@ngrx/signals`, using `rxMethod` to fetch, cache, and update candidate telemetry without race conditions.
* **NASA JPL Integration**: Connects to the JPL Scout API, mapping the raw matrix response into structured, typed candidate models.
* **Resilient HTTP Handling**: Functional interceptors handle network issues and errors, translating status codes into clear status messages and retry states.
* **Local CORS Proxy**: Uses an Angular CLI proxy to prevent browser CORS and preflight blocks when querying NASA endpoints locally.

---



## Development server & Proxy Setup

Because `ssd-api.jpl.nasa.gov` rejects cross-origin requests from `localhost`, the project proxies calls through the Angular dev server.

1. Ensure `proxy.conf.json` exists in your project root:
   ```json
   {
     "/api-scout": {
       "target": "[https://ssd-api.jpl.nasa.gov](https://ssd-api.jpl.nasa.gov)",
       "secure": true,
       "changeOrigin": true,
       "pathRewrite": {
         "^/api-scout": ""
       }
     }
   }
## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
