import ForecastItem from "./ForecastItem"
import type { WeatherData } from "../types/weather"

export default function ForecastList({ weatherData }: { weatherData: WeatherData }){
    const date: string = weatherData?.list?.[0]?.dt.split(' ')[0] ?? "";
    const forecast = weatherData.list?.filter((item)=>item.dt.endsWith("12:00:00") && !item.dt.startsWith(date))
    return(
        <>
        <div className="forecast-title">{`Прогноз на следующие ${forecast?.length} дня`}</div>
        <div className="forecast-list">
        {forecast?.map((data)=><ForecastItem key={data.dt} data={data}/>)}
        </div>
        </>
    )
}