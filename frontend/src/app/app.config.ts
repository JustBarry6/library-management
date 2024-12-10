import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    // Améliore les performances de détection des changements
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Configure le routeur avec les routes définies
    provideRouter(routes),
    
    // Configure le client HTTP avec l'API Fetch pour de meilleures performances
    provideHttpClient(withFetch()),
    
    // Active l'hydratation côté client pour le SSR
    provideClientHydration(withEventReplay()),
  ],
};