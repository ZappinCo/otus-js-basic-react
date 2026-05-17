import { useState, useCallback, useRef } from 'react';
import { HttpService } from '../services/httpService';
import type { Location } from '../types/location';

export const useLocation = () => {

    const httpServiceRef = useRef<HttpService>(new HttpService());
    const [location, setLocation] = useState<Location>();
    const [isLoading, setIsLoading] = useState(false);


    const getCityByIp = useCallback(async () => {
        setIsLoading(true);
        try {
            const url = 'https://ip-api.com/json/?fields=status,city';
            const data = await httpServiceRef.current?.get(url);
            const tempLocation: Location = { error: null };

            if (data.status === 'success' && data.city) {
                tempLocation.city = data.city;
            } else {
                tempLocation.error = new Error('Не удалось определить город по IP');
            }
            setLocation(tempLocation);
        } catch (error) {
            console.warn('Ошибка определения города по IP:', error);
            if (error instanceof Error)
                setLocation({ error: error });
        } finally {
            setIsLoading(false);
        }
    }, [])

    const getUserLocation = useCallback(async () => {
        if (!navigator.geolocation) {
            setLocation({ error: new Error('Геолокация не поддерживается вашим браузером') });
            await getCityByIp();
            return;
        }
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                    error: null
                });
            },
            (error) => {
                console.warn('Geolocation error:', error);

                let errorMessage = 'Не удалось определить ваше местоположение';
                if (error.code === 1) {
                    errorMessage = 'Пользователь запретил доступ к геолокации';
                } else if (error.code === 2) {
                    errorMessage = 'Информация о местоположении недоступна';
                } else if (error.code === 3) {
                    errorMessage = 'Время получения геолокации истекло';
                }

                setLocation({ error: new Error(errorMessage) });
                getCityByIp();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
        setIsLoading(false);
    }, [getCityByIp])


    return {
        location,
        isLoading,
        getUserLocation
    };

}