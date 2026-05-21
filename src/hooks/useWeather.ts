import { useState, useCallback, useRef } from 'react';
import { HttpService } from '../services/httpService';
import { parseWeatherApiResponse } from '../utils/parseWeatherApiResponse';
import type { WeatherData, WeatherError } from '../types/weather';

const API_KEY = "7881bfb7be02c74633e5fdee4ff41329";
const DAYS = 70;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

interface FetchWeatherParams {
    city?: string;
    lat?: number;
    lon?: number;
    days: number;
    isHistory: boolean;
}

export const useWeather = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [historyData, setHistoryData] = useState<WeatherData[] | null>(null);
    const [error, setError] = useState<WeatherError | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const isHistoryLoading = useRef(false);

    const httpServiceRef = useRef<HttpService>(new HttpService(BASE_URL));

    const fetchWeatherData = useCallback(async (
        params: FetchWeatherParams,
    ) => {
        if (!params.isHistory)
            setIsLoading(true);
        setError(null);
        try {
            let url = '';
            if (params.city) {
                url = `/forecast?q=${params.city}&units=metric&cnt=${params.days}&appid=${API_KEY}`;
            } else if (params.lat !== undefined && params.lon !== undefined) {
                url = `/forecast?lat=${params.lat}&lon=${params.lon}&units=metric&cnt=${params.days}&appid=${API_KEY}`;
            } else {
                setError(new Error('Не указаны параметры для поиска погоды'));
                throw error;
            }
            const weatherResponse = await httpServiceRef.current?.get(url);

            if (weatherResponse?.list?.length > 0) {
                const parsedData = parseWeatherApiResponse({
                    success: true,
                    data: weatherResponse,
                    error: null
                });

                if (params.isHistory) {
                    return parsedData;
                } else {
                    setWeatherData(parsedData);
                }
            } else {
                const errorMsg = params.city
                    ? `Нет данных о погоде для города ${params.city}`
                    : 'Нет данных о погоде по координатам';
                setError(new Error(errorMsg));
                throw error;
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error(String(err));
            setError(errorObj);
            throw errorObj;
        } finally {
            setIsLoading(false);
        }
    }, [error]);

    const fetchByCity = useCallback(async (city: string) => {
        if (typeof city !== 'string' || !city.trim()) {
            return
        }
        setWeatherData(null);
        return fetchWeatherData({ city, isHistory: false, days: DAYS },);
    }, [fetchWeatherData]);

    const fetchByLocation = useCallback(async (lat: number, lon: number) => {
        return fetchWeatherData({ lat, lon, isHistory: false, days: DAYS });
    }, [fetchWeatherData]);

    const fetchHistoryWeather = useCallback(async (cities: string[]) => {
        if (isHistoryLoading.current) {
            return;
        }
        isHistoryLoading.current = true;
        const currentHistory = historyData ?? [];

        const citiesToFetch = cities.filter(city => {
            const alreadyExists = currentHistory.some(item => item.city === city);
            return !alreadyExists && typeof city === 'string' && city.trim();
        });


        if (citiesToFetch.length === 0) {
            isHistoryLoading.current = false;
            return;
        }

        const newHistoryItems = [];

        for (const city of citiesToFetch) {
            const result = await fetchWeatherData({ city, isHistory: true, days: 1 });

            if (result) {
                newHistoryItems.push(result);
            }
        }

        if (newHistoryItems.length === 0) {
            isHistoryLoading.current = false;
            return;
        }

        const updatedHistory = [...currentHistory, ...newHistoryItems];

        setHistoryData(updatedHistory);
        isHistoryLoading.current = false;

    }, [fetchWeatherData,historyData]);


    return {
        weatherData,
        historyData,
        error,
        isLoading,
        fetchByCity,
        fetchByLocation,
        fetchHistoryWeather,
    };
};