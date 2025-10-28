import { Component, signal } from '@angular/core';
import { CityWeather } from "./city-weather/city-weather";
import { WeatherSignalsService } from './city-weather/city-weather.service';
import {Table} from './table/table';
import {Units} from './units/units';
import {UnitsSignalsService} from './units/units.service';
import {DatePipe, DecimalPipe} from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [CityWeather, Table, Units, DecimalPipe, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('weather-app-angular');

  constructor(public weatherSignals: WeatherSignalsService, public unitsSignals: UnitsSignalsService) {}

  celsiusToFahrenheit(value:any) {
    return Math.floor((value * 1.8) + 32);
  }

  kmhToMph(value:any) {
    return Math.floor(value * 0.621371);
  }

  mmToInch(value:any) {
    return Math.floor(value / 25.4);
  }
}
