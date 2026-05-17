export interface WeatherData {
  city?: string;
  list?: WeatherItem[];
  success:boolean;
}

export interface  WeatherItem  {
    dt: string;
    description: string;
    icon: string;
    temp: number;
    temp_min: number;
    speed: number;
    pressure: number;     
    humidity: number;      
};

export type WeatherError = Error | null;