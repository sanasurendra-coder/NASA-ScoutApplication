import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { ModuleRegistry, AllCommunityModule, ValidationModule } from 'ag-grid-community';

// Register AG-Grid modules globally before any Component Initializes
ModuleRegistry.registerModules([AllCommunityModule, ValidationModule]);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
