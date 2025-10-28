import {Injectable, signal, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WeatherSignalsService {
  searchBool = false;
  cityName = signal('');
  cityTemps = signal(0);
  cityFeelsTemps = signal(0);
  cityHumidity = signal(0);
  cityWind = signal(0);
  cityPrecipitation = signal(0);
  cityLoading = signal(false);
  cityHours:WritableSignal<any> = signal([]);
  cityHourlyTemps:WritableSignal<any> = signal([]);
  cityWeatherCode:WritableSignal<any> = signal([]);
}
