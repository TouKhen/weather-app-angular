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
      current: ["temperature_2m", "weather_code", "precipitation", "wind_speed_10m", "apparent_temperature", "relative_humidity_2m"],
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

    const current = response.current()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature_2m: current.variables(0)!.value(),
        weather_code: current.variables(1)!.value(),
        precipitation: current.variables(2)!.value(),
        wind_speed_10m: current.variables(3)!.value(),
        apparent_temperature: current.variables(4)!.value(),
        relative_humidity_2m: current.variables(5)!.value(),
      },
    };

    // 'weatherData' now contains a simple structure with arrays with datetime and weather data
    console.log(weatherData);
    console.log(
      `\nCurrent time: ${weatherData.current.time}`,
      `\nCurrent temperature_2m: ${weatherData.current.temperature_2m}`,
      `\nCurrent weather_code: ${weatherData.current.weather_code}`,
      `\nCurrent precipitation: ${weatherData.current.precipitation}`,
      `\nCurrent wind_speed_10m: ${weatherData.current.wind_speed_10m}`,
      `\nCurrent apparent_temperature: ${weatherData.current.apparent_temperature}`,
      `\nCurrent relative_humidity_2m: ${weatherData.current.relative_humidity_2m}`,
    );

    this.weatherSignals.cityTemps.set(Math.floor(weatherData.current.temperature_2m));
    this.weatherSignals.cityFeelsTemps.set(Math.floor(weatherData.current.apparent_temperature));
    this.weatherSignals.cityHumidity.set(Math.floor(weatherData.current.relative_humidity_2m));
    this.weatherSignals.cityWind.set(Math.floor(weatherData.current.wind_speed_10m));
    this.weatherSignals.cityPrecipitation.set(Math.floor(weatherData.current.precipitation));

    this.weatherSignals.cityLoading.set(false);
  }
}
