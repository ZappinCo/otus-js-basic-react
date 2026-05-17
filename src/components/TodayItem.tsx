import type { WeatherItem } from "../types/weather";
import { translateWeatherDesc } from "../utils/translateWeatherDesc";

export default function TodayItem({item}:{item:WeatherItem}){
    const temp = Math.round(item.temp);

    return(
        <div className="today-item">
            <div className="today-time">{item.dt.split(' ')[1].slice(0, 5)}</div>
            <div className="today-temp">{temp > 0 ? `+${temp}°` : `${temp}°`}</div>
            <img src={`https://openweathermap.org/img/wn/${item.icon}.png`} alt={item.description} className="today-icon" />
            <div className="today-desc">{translateWeatherDesc(item.description)}</div>
        </div>
    );
}