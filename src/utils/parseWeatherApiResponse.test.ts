import { parseWeatherApiResponse } from './parseWeatherApiResponse';
import type { PromiseResult } from './parseWeatherApiResponse';

describe('parseWeatherApiResponse', () => {
    const mockApiResponse = {
        city: { name: 'Moscow' },
        list: [
            {
                dt_txt: '2024-01-15 12:00:00',
                weather: [{ description: 'clear sky', icon: '01d' }],
                main: { temp: 25, temp_min: 18, pressure: 1013, humidity: 65 },
                wind: { speed: 5 }
            }
        ]
    };

    it('возвращает success:false при неудачном результате', () => {
        const result: PromiseResult = {
            success: false,
            error: new Error('API Error'),
            data: null
        };

        const parsed = parseWeatherApiResponse(result);
        expect(parsed).toEqual({ success: false });
    });

    it('возвращает success:false при отсутствии данных', () => {
        const result: PromiseResult = {
            success: true,
            error: null,
            data: null
        };

        const parsed = parseWeatherApiResponse(result);
        expect(parsed).toEqual({ success: false });
    });

    it('парсит валидный ответ API', () => {
        const result: PromiseResult = {
            success: true,
            error: null,
            data: mockApiResponse
        };

        const parsed = parseWeatherApiResponse(result);
        
        expect(parsed.success).toBe(true);
        expect(parsed.city).toBe('Moscow');
        expect(parsed.list).toHaveLength(1);
        expect(parsed.list?.[0].dt).toBe('2024-01-15 12:00:00');
        expect(parsed.list?.[0].temp).toBe(25);
    });
});