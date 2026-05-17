import TodayItem from "./TodayItem";
import { formatDate } from '../utils/formatDate.js';
import type { WeatherData, WeatherItem } from "../types/weather";

export default function TodayForecast({ weatherData }: { weatherData: WeatherData }) {
    const date: string = weatherData?.list?.[0]?.dt.split(' ')[0] ?? "";
    const today = weatherData?.list?.filter((item) =>  item.dt.startsWith(date));
    return (
        <div className="today-forecast">
            <div className="today-title">Сегодня, {formatDate(date)}</div>
            <div className="today-container">
                {
                    today?.map((item: WeatherItem) =>
                        <TodayItem key={item.dt} item={item} />
                    )
                }
            </div>
        </div>
    );
}