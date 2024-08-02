import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
  enableProdMode,
  DEFAULT_CURRENCY_CODE,
} from '@angular/core';
import { provideRouter } from '@angular/router';

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
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from '@env/environment.development';
import interceptors from './services/interceptors';

registerLocaleData(fr);

if (environment.production) {
  enableProdMode();

  // Don't log to console in production environment
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
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'MGA' },
    importProvidersFrom(FormsModule),
    ...interceptors,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    provideHttpClient(),
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
};
