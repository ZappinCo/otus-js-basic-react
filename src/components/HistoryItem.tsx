import type { WeatherData } from "../types/weather"
import { translateWeatherDesc } from "../utils/translateWeatherDesc";

export default function HistoryItem({ weatherData }: { weatherData: WeatherData }){
    if(!weatherData.list)
        return(<></>)
    const data = weatherData.list[0];
    const tempDay = Math.round(data.temp);
    const tempNight = Math.round(data.temp_min);
    const tempDayStr = tempDay > 0 ? `+${tempDay}°` : `${tempDay}°`;
    const tempNightStr = tempNight > 0 ? `+${tempNight}°` : `${tempNight}°`;

    return(
        <div className="history-city-card">
            <div className="history-city-name">{weatherData.city}</div>
            <div className="history-temp">{`${tempDayStr} / ${tempNightStr}`}</div>
            <img src={`https://openweathermap.org/img/wn/${data.icon}.png`} alt={data.description} className="history-icon" />
            <div className="history-desc">{translateWeatherDesc(data.description)}</div>
        </div>
    )
}