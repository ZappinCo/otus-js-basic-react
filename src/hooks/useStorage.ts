import { useState, useCallback, useEffect } from 'react';

export const useStorage = () => {
    const storageKey = 'weather_app_react';
    const [city, setCity] = useState<string>('');
    const [searchHistory, setSearchHistory] = useState<string[]>([]);


    useEffect(() => {
        const loadData = async () => {
            try {
                const saved = localStorage.getItem(storageKey);
                if (saved) {
                    const data = JSON.parse(saved);
                    setCity(data.city || '');
                    setSearchHistory(data.searchHistory || []);
                }
            } catch (error) {
                console.error('Failed to load:', error);
            }
        }
        loadData();
    }, []);


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