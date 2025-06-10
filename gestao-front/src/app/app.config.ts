// Em src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Importe withInterceptors
import { authInterceptor } from './services/auth.interceptor'; // Importe a nova função

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),

    // A configuração do HttpClient e do Interceptor agora é feita em uma única linha
    provideHttpClient(withInterceptors([authInterceptor])),
  ]
};