import { useState, useCallback } from 'react';

export const useStorage = () => {
    const storageKey = 'weather_app_react';

    const getInitialData = () => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                return {
                    city: data.city || '',
                    searchHistory: data.searchHistory || []
                };
            }
        } catch (error) {
            console.error('Failed to load:', error);
        }
        return { city: '', searchHistory: [] };
    };

    const initialData = getInitialData();

    const [city, setCity] = useState<string>(initialData.city);
    const [searchHistory, setSearchHistory] = useState<string[]>(initialData.searchHistory);


    const saveToStorage = useCallback((newCity: string, newHistory: string[]) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify({
                city: newCity,
                searchHistory: newHistory
            }));
        } catch (error) {
            console.error('Failed to save:', error);
        }
    }, []);


    const saveCity = useCallback((cityName: string) => {
        const normalized = cityName.trim();
        if (!normalized) return;

        setCity(normalized);
        setSearchHistory(prev => {
            const newHistory = [normalized, ...prev.filter(h => h !== normalized)].slice(0, 10);
            saveToStorage(normalized, newHistory);
            return newHistory;
        });
    }, [saveToStorage]);


    return {
        city,
        searchHistory,
        saveCity
    };
};