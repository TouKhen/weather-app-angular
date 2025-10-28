import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { fetchWeatherApi } from 'openmeteo';
import { WeatherSignalsService } from './city-weather.service';

@Component({
  selector: 'app-city-weather',
  imports: [ReactiveFormsModule],
  templateUrl: './city-weather.html',
  styleUrl: './city-weather.scss'
})
export class CityWeather {
  cityForm = new FormGroup({
    city: new FormControl('')
  })

  constructor(private weatherSignals: WeatherSignalsService) {}

  getCityWeather() {
    // alert(this.cityForm.value.city);
    const city = this.cityForm.value.city!.trim();
    this.fetchCoordinates(city);
  }

  fetchCoordinates(city:string) {
    this.weatherSignals.cityLoading.set(true);

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const location = data[0];
          const lat = location.lat;
          const lon = location.lon;

          this.weatherSignals.cityName.set(location.name);

          this.fetchWeatherData(lat, lon);
        } else {
          alert('Nothing Found!')
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  async fetchWeatherData(foundLatitude:any, foundLongitude:any) {
    const params = {
      latitude: foundLatitude,
      longitude: foundLongitude,
      "hourly": ["temperature_2m", "precipitation", "relative_humidity_2m", "wind_speed_10m", "apparent_temperature", "weather_code"],
      "forecast_hours": 12,
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);

    // Process first location.
    const response = responses[0];

    // Attributes for timezone and location
    const latitude = response.latitude();
    const longitude = response.longitude();
    const elevation = response.elevation();
    const utcOffsetSeconds = response.utcOffsetSeconds();

    console.log(
      `\nCoordinates: ${latitude}°N ${longitude}°E`,
      `\nElevation: ${elevation}m asl`,
      `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
    );

    const hourly = response.hourly()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      hourly: {
        time: Array.from(
          { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
          (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
        ),
        temperature_2m: hourly.variables(0)!.valuesArray(),
        precipitation: hourly.variables(1)!.valuesArray(),
        relative_humidity_2m: hourly.variables(2)!.valuesArray(),
        wind_speed_10m: hourly.variables(3)!.valuesArray(),
        apparent_temperature: hourly.variables(4)!.valuesArray(),
        weather_code: hourly.variables(5)!.valuesArray(),
      },
    };

    console.log("\nHourly data", weatherData.hourly)

    // 'weatherData' now contains a simple structure with arrays with datetime and weather data
    // console.log(weatherData);
    console.log(
      `\nCurrent time: ${weatherData.hourly.time[0]}`,
      `\nCurrent temperature_2m: ${weatherData.hourly.temperature_2m![0]}`,
      `\nCurrent weather_code: ${weatherData.hourly.weather_code![0]}`,
      `\nCurrent precipitation: ${weatherData.hourly.precipitation![0]}`,
      `\nCurrent wind_speed_10m: ${weatherData.hourly.wind_speed_10m![0]}`,
      `\nCurrent apparent_temperature: ${weatherData.hourly.apparent_temperature![0]}`,
      `\nCurrent relative_humidity_2m: ${weatherData.hourly.relative_humidity_2m![0]}`,
    );

    this.weatherSignals.cityTemps.set(Math.floor(weatherData.hourly.temperature_2m![0]));
    this.weatherSignals.cityFeelsTemps.set(Math.floor(weatherData.hourly.apparent_temperature![0]));
    this.weatherSignals.cityHumidity.set(Math.floor(weatherData.hourly.relative_humidity_2m![0]));
    this.weatherSignals.cityWind.set(Math.floor(weatherData.hourly.wind_speed_10m![0]));
    this.weatherSignals.cityPrecipitation.set(Math.floor(weatherData.hourly.precipitation![0]));

    this.weatherSignals.cityHours.set(weatherData.hourly.time);
    this.weatherSignals.cityHourlyTemps.set(weatherData.hourly.temperature_2m!.slice(0, 8));

    this.weatherSignals.cityLoading.set(false);
  }
}
