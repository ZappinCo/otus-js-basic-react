import type { WeatherData } from "../types/weather";
import type { WeatherApiResponse } from "../types/weatherApiResponse";

import { isWeatherApiResponse } from "../types/weatherApiResponse";
export interface PromiseResult {
  success: boolean;
  error: Error | null;
  data: unknown;
}

export function parseWeatherApiResponse(result: PromiseResult): WeatherData {
    if (!result.success || !result.data) {
        return { success: false };
    }

    if (!isWeatherApiResponse(result.data)) {
        console.error('Invalid API response');
        return { success: false };
    }

    const data = result.data as WeatherApiResponse;

    const weatherData = {
        success: true,
        city: data.city.name,
        list: data.list.map((item) => ({
            dt: item.dt_txt,
            description: item.weather[0]?.description ?? '',
            icon: item.weather[0]?.icon ?? '',
            temp: item.main.temp,
            temp_min: item.main.temp_min,
            speed: item.wind.speed,
            pressure: item.main.pressure,
            humidity: item.main.humidity
        }))
    }
    return weatherData
}