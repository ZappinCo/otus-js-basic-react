import TodayForecast from "./TodayForecast";
import Details from "./Details";
import ForecastList from "./ForecastList";
import LoadingButton from "./LoadingButton";
import HistoryList from "./HistoryList";

import { useWeather } from "../hooks/useWeather";
import { useLocation } from "../hooks/useLocation";
import { useStorage } from "../hooks/useStorage";

import { useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { useInput } from "../hooks/useInput";

export default function Today() {
    const { city } = useParams();
    const navigate = useNavigate();

    const {
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

    const lastFetchedCityRef = useRef<string>("");
    const isUpdatingFromLocation= useRef(false);

    const {
        value,
        setValue,
        debouncedValue,
        onChange
    } = useInput("");

    useEffect(() => {
        if (city) {
            setValue(city);
            fetchByCity(city);
        }
    }, [city,fetchByCity,setValue]);

    const error = useMemo(() => {
        return weatherError?.message || location?.error?.message || null;
    }, [weatherError, location?.error]);

    useEffect(() => {
        if (!debouncedValue || !debouncedValue.trim()) {
            return;
        }

        if (lastFetchedCityRef.current === debouncedValue) {
            return;
        }

        navigate(`/${debouncedValue}`, { replace: true });
    }, [debouncedValue,navigate]);

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
                isUpdatingFromLocation.current = true;
            }
        };
        loadData();
    }, [location, fetchByLocation, fetchByCity]);

    useEffect(() => {
        if (weatherData?.city && !weatherError) {
            saveCity(weatherData.city);
            if(isUpdatingFromLocation.current)
            {
                setValue(weatherData.city);
                isUpdatingFromLocation.current = false;
            }
        }
    }, [weatherData, weatherError,isUpdatingFromLocation,saveCity,setValue]);

    const handleGetLocation = useCallback(async () => {
        await getUserLocation();
    }, [getUserLocation]);

     const handleAbout = useCallback(() => {
        navigate(`/about`, { replace: true });
    }, [navigate]);

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
                 <LoadingButton
                    isLoading={false}
                    buttonText="ℹ️"
                    loadingText="⏳"
                    onClick={handleAbout}
                />
            </div>

            {isLoadingWeather && <div>Загрузка...</div>}
            {error && <div className="error-message">{`Ошибка: ${error}`}</div>}

            <div className="content-wrapper">

                {!error && !isLoadingWeather && !isLoadingLocation && weatherData && (
                    <div className="main-content">
                        <TodayForecast weatherData={weatherData} />
                        {weatherData?.list?.[0] && <Details data={weatherData.list[0]} />}
                        <ForecastList weatherData={weatherData} />
                    </div>
                )}

                {historyData && historyData.length > 0 && (
                    <HistoryList weatherData={historyData} />
                )}
            </div>
        </div>
    );
}