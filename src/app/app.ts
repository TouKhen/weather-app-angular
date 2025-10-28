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

  weatherType = {
    "clear": "/assets/images/icon-sunny.webp",
    "partly-cloudy": "/assets/images/icon-partly-cloudy.webp",
    "overcast": "/assets/images/icon-overcast.webp",
    "fog": "/assets/images/icon-fog.webp",
    "drizzle": "/assets/images/icon-drizzle.webp",
    "rain": "/assets/images/icon-rain.webp",
    "snow": "/assets/images/icon-snow.webp",
    "storm": "/assets/images/icon-storm.webp"
  };

  // @ts-ignore
  getWeatherIcon(weatherCode: any) {
    console.log("Weather code :" + weatherCode);

    if (weatherCode === 0) {
      return this.weatherType.clear;
    } else if (weatherCode === 1 ||
      weatherCode === 2) {
      return this.weatherType["partly-cloudy"];
    } else if (weatherCode === 3) {
      return this.weatherType["overcast"];
    } else if (weatherCode === 45 ||
      weatherCode === 48) {
      return this.weatherType["fog"];
    } else if (weatherCode === 51 ||
      weatherCode === 53 ||
      weatherCode === 55 ||
      weatherCode === 56 ||
      weatherCode === 57) {
      return this.weatherType["drizzle"];
    } else if (weatherCode === 61 ||
      weatherCode === 63 ||
      weatherCode === 65 ||
      weatherCode === 66 ||
      weatherCode === 67 ||
      weatherCode === 80 ||
      weatherCode === 81 ||
      weatherCode === 82) {
      return this.weatherType["rain"];
    } else if (weatherCode === 71 ||
      weatherCode === 73 ||
      weatherCode === 75 ||
      weatherCode === 77 ||
      weatherCode === 85 ||
      weatherCode === 86) {
      return this.weatherType["snow"];
    } else if (weatherCode === 95 ||
      weatherCode === 96 ||
      weatherCode === 99) {
      return this.weatherType["storm"];
    } else {
      console.log("Weather icons not supported");
    }
  }
}
