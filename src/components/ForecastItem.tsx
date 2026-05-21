import type { WeatherItem } from "../types/weather"
import { formatDate } from "../utils/formatDate";
import { translateWeatherDesc } from "../utils/translateWeatherDesc";

export default function ForecastItem({ data }: { data: WeatherItem }) {
    const date: string = data.dt.split(' ')[0] ?? "";
    const tempDay = Math.round(data.temp);
    const tempNight = Math.round(data.temp_min);
    const tempDayStr = tempDay > 0 ? `+${tempDay}°` : `${tempDay}°`;
    const tempNightStr = tempNight > 0 ? `+${tempNight}°` : `${tempNight}°`;
    return (
        <div className="forecast-item">
            <div className="forecast-day">{formatDate(date)}</div>
            <div className="forecast-icon"> <img src={`https://openweathermap.org/img/wn/${data.icon}.png`} alt={data.description} /></div>
            <div className="forecast-temp">{`${tempDayStr} / ${tempNightStr}`}</div>
            <div className="forecast-desc">{translateWeatherDesc(data.description)}</div>
        </div>
    )
}