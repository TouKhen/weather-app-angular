import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WeatherSignalsService {
  cityName = signal('');
  cityTemps = signal(0);
  cityFeelsTemps = signal(0);
  cityHumidity = signal(0);
  cityWind = signal(0);
  cityPrecipitation = signal(0);
  cityLoading = signal(false);
}