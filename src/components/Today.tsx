import TodayForecast from "./TodayForecast";
import Details from "./Details";
import ForecastList from "./ForecastList";
import LoadingButton from "./LoadingButton";
import HistoryList from "./HistoryList";

import { useWeather } from "../hooks/useWeather";
import { useLocation } from "../hooks/useLocation";
import { useStorage } from "../hooks/useStorage";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useInput } from "../hooks/useInput";

export default function Today() {
    const {
        city: savedCity,
        searchHistory,
        saveCity,
    } = useStorage();

    const {
        weatherData,
        historyData,
        error: weatherError,
        isLoading: isLoadingWeather,
        fetchByCity,
        fetchByLocation,
        fetchHistoryWeather
    } = useWeather();

    const {
        location,
        isLoading: isLoadingLocation,
        getUserLocation
    } = useLocation();

    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const isFetchingRef = useRef(false);
    const lastFetchedCityRef = useRef<string>("");
    const isUpdatingFromWeatherRef = useRef(false);

    const {
        value,
        setValue,
        debouncedValue,
        onChange
    } = useInput("");

    const error = useMemo(() => {
        return weatherError?.message || location?.error?.message || null;
    }, [weatherError, location?.error]);

    useEffect(() => {
        if (savedCity && isInitialLoad && !isFetchingRef.current) {
            console.log("Loading saved city:", savedCity);
            isFetchingRef.current = true;
            setValue(savedCity);
            fetchByCity(savedCity).finally(() => {
                isFetchingRef.current = false;
            });
            setIsInitialLoad(false);
        }
    }, [savedCity, isInitialLoad, fetchByCity, setValue]);

    useEffect(() => {
        if (!debouncedValue || !debouncedValue.trim()) {
            return;
        }

        if (lastFetchedCityRef.current === debouncedValue) {
            return;
        }

        console.log("Searching for:", debouncedValue);
        lastFetchedCityRef.current = debouncedValue;
        
        fetchByCity(debouncedValue);
    }, [debouncedValue, fetchByCity]);

    useEffect(() => {
        if (searchHistory && searchHistory.length > 0) {
            fetchHistoryWeather(searchHistory);
        }
    }, [searchHistory, fetchHistoryWeather]);

    useEffect(() => {
        if (!location) return;
        
        const loadData = async () => {
            if (!location.error) {
                if (location.lat && location.lon) {
                    await fetchByLocation(location.lat, location.lon);
                } else if (location.city) {
                    await fetchByCity(location.city);
                }
            }
        };
        loadData();
    }, [location, fetchByLocation, fetchByCity]);

    useEffect(() => {
        if (weatherData?.city && !weatherError && weatherData.city !== savedCity && !isUpdatingFromWeatherRef.current) {
            console.log("Saving city to storage:", weatherData.city);
            isUpdatingFromWeatherRef.current = true;
            saveCity(weatherData.city);
            setValue(weatherData.city);
            setTimeout(() => {
                isUpdatingFromWeatherRef.current = false;
            }, 100);
        }
    }, [weatherData, saveCity, savedCity, weatherError, setValue]);

    const handleGetLocation = useCallback(async () => {
        setIsInitialLoad(false);
        await getUserLocation();
    }, [getUserLocation]);

    return (
        <div className="weather-card">
            <div className="city-header">
                <input 
                    type="text" 
                    className="city-input" 
                    placeholder="Введите город..." 
                    onChange={onChange} 
                    value={value} 
                />
                <LoadingButton 
                    isLoading={isLoadingLocation} 
                    buttonText="📍" 
                    loadingText="⏳" 
                    onClick={handleGetLocation}
                />
            </div>
            
            {isLoadingWeather && <div>Загрузка...</div>}
            {error && <div className="error-message">{`Ошибка: ${error}`}</div>}
            
            {!error && !isLoadingWeather && !isLoadingLocation && weatherData && (
                <>
                    <TodayForecast weatherData={weatherData} />
                    {weatherData?.list?.[0] && <Details data={weatherData.list[0]} />}
                    <ForecastList weatherData={weatherData} />
                    {historyData && historyData.length > 0 && (
                        <HistoryList weatherData={historyData} />
                    )}
                </>
            )}
        </div>
    );
}