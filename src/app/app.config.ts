import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
};
