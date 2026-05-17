import { render, screen } from '@testing-library/react';
import TodayForecast from './TodayForecast';
import type { WeatherData } from '../types/weather';

vi.mock('../utils/formatDate.js', () => ({
    formatDate: vi.fn((date) => `Форматированная дата: ${date}`)
}));

vi.mock('./TodayItem', () => ({
    default: vi.fn(({ item }) => <div data-testid="today-item">{item.temp}°C</div>)
}));

describe('TodayForecast', () => {
    const mockWeatherData: WeatherData = {
        success: true,
        city: 'Moscow',
        list: [
            {
                dt: '2024-01-15 03:00:00',
                temp: 18,
                temp_min: 15,
                description: 'night',
                icon: '01n',
                pressure: 1013,
                humidity: 80,
                speed: 3
            },
            {
                dt: '2024-01-15 12:00:00',
                temp: 25,
                temp_min: 18,
                description: 'clear',
                icon: '01d',
                pressure: 1013,
                humidity: 65,
                speed: 5
            },
            {
                dt: '2024-01-15 18:00:00',
                temp: 22,
                temp_min: 18,
                description: 'clouds',
                icon: '02d',
                pressure: 1012,
                humidity: 70,
                speed: 4
            }
        ]
    } as any;

    it('отображает заголовок с датой', () => {
        render(<TodayForecast weatherData={mockWeatherData} />);
        expect(screen.getByText(/Сегодня,/)).toBeDefined();
        expect(screen.getByText(/Форматированная дата:/)).toBeDefined();
    });

    it('фильтрует только прогнозы на сегодня', () => {
        render(<TodayForecast weatherData={mockWeatherData} />);
        const items = screen.getAllByTestId('today-item');
        expect(items.length).toBe(3);
    });

    it('отображает правильные температуры', () => {
        render(<TodayForecast weatherData={mockWeatherData} />);
        
        expect(screen.getByText('18°C')).toBeDefined();
        expect(screen.getByText('25°C')).toBeDefined();
        expect(screen.getByText('22°C')).toBeDefined();
    });
});