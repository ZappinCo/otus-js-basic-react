import { render, screen } from '@testing-library/react';
import HistoryItem from './HistoryItem';
import type { WeatherData } from '../types/weather';

vi.mock('../utils/translateWeatherDesc', () => ({
    translateWeatherDesc: vi.fn((desc) => `Перевод: ${desc}`)
}));

describe('HistoryItem', () => {
    const mockWeatherData: WeatherData = {
        success: true,
        city: 'Moscow',
        list: [
            {
                dt: '2024-01-15 12:00:00',
                temp: 25,
                temp_min: 18,
                description: 'clear sky',
                icon: '01d',
                pressure: 1013,
                humidity: 65,
                speed: 5
            }
        ]
    } as any;

    it('отображает название города', () => {
        render(<HistoryItem weatherData={mockWeatherData} />);
        expect(screen.getByText('Moscow')).toBeDefined();
    });

    it('отображает температуру с плюсом для положительных значений', () => {
        render(<HistoryItem weatherData={mockWeatherData} />);
        expect(screen.getByText('+25° / +18°')).toBeDefined();
    });

    it('отображает температуру с минусом для отрицательных значений', () => {
        const coldData = {
            ...mockWeatherData,
            list: [{ ...mockWeatherData.list[0], temp: -10, temp_min: -15 }]
        };
        render(<HistoryItem weatherData={coldData} />);
        expect(screen.getByText('-10° / -15°')).toBeDefined();
    });

    it('отображает иконку погоды', () => {
        render(<HistoryItem weatherData={mockWeatherData} />);
        const img = document.querySelector('img');
        expect(img).toBeDefined();
        expect(img?.src).toContain('openweathermap.org/img/wn/01d.png');
    });

    it('отображает описание погоды', () => {
        render(<HistoryItem weatherData={mockWeatherData} />);
        expect(screen.getByText('Перевод: clear sky')).toBeDefined();
    });
});