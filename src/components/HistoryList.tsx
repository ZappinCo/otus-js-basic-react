import type { WeatherData } from "../types/weather"
import HistoryItem from "./HistoryItem"

export default function HistoryList({ weatherData }: { weatherData: WeatherData[] }){
    return(
        <div className="history-weather">
         <h2 className="history-title">История поиска</h2>   
         <div className="history-cities-list">
                {
                    weatherData?.map((item: WeatherData) =>
                        (item && <HistoryItem key={item.city} weatherData={item} />)
                    )
                }
         </div>
        </div>
    )
}