import DetailItem from "./DetailItem"
import type { WeatherItem } from "../types/weather";

interface DetailInfoItem {
    label: string;
    key: keyof WeatherItem;
    unit: string;
}
const items: DetailInfoItem[] = [
    { label: 'Температура', key: 'temp', unit: '°C' },
    { label: 'Давление', key: 'pressure', unit: 'гПа' },
    { label: 'Влажность', key: 'humidity', unit: '%' },
    { label: 'Ветер', key: 'speed', unit: 'м/с' }
];

export default function Details({ data }: { data: WeatherItem }) {
    let key = 0;
    return (
        <div className="details-container">
            {items.map((item) => <DetailItem key ={key++}  label={item.label} value={data[item.key] + " " + item.unit} />)}
        </div>
    )
}