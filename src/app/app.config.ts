import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
  enableProdMode,
} from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';

import { routes } from './app.routes';
import { icons } from './icons-provider';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { fr_FR, provideNzI18n } from 'ng-zorro-antd/i18n';
import {
  DOCUMENT,
  LocationStrategy,
  PathLocationStrategy,
  registerLocaleData,
} from '@angular/common';
import fr from '@angular/common/locales/fr';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

registerLocaleData(fr);

if (environment.production) {
  enableProdMode();

  // HACK: Don't log to console in production environment.
  // TODO: This can be done in better way using logger service and logger factory.
  if (window) {
    window.console.log =
      window.console.warn =
      window.console.info =
      window.console.error =
        function () {};
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzIcons(icons),
    provideNzI18n(fr_FR),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
};
