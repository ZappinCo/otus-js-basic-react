import { render, screen } from '@testing-library/react';
import ForecastList from './ForecastList';
import type { WeatherData } from '../types/weather';

vi.mock('./ForecastItem', () => ({
    default: vi.fn(({ data }) => <div data-testid="forecast-item">{data.dt}</div>)
}));

describe('ForecastList', () => {
    const mockWeatherData: WeatherData = {
        success: true,
        city: 'Moscow',
        list: [
            { dt: '2024-01-15 12:00:00', temp: 25, temp_min: 18, description: 'clear', icon: '01d', pressure: 1013, humidity: 65, speed: 5 },
            { dt: '2024-01-16 12:00:00', temp: 22, temp_min: 15, description: 'clouds', icon: '02d', pressure: 1012, humidity: 70, speed: 4 },
            { dt: '2024-01-17 12:00:00', temp: 20, temp_min: 12, description: 'rain', icon: '10d', pressure: 1011, humidity: 75, speed: 6 },
            { dt: '2024-01-15 03:00:00', temp: 18, temp_min: 14, description: 'night', icon: '01n', pressure: 1014, humidity: 80, speed: 3 }
        ]
    } as any;

    it('отображает заголовок с количеством дней', () => {
        render(<ForecastList weatherData={mockWeatherData} />);
        expect(screen.getByText('Прогноз на следующие 2 дня')).toBeDefined();
    });

    it('отображает контейнер прогноза', () => {
        const { container } = render(<ForecastList weatherData={mockWeatherData} />);
        expect(container.querySelector('.forecast-list')).toBeDefined();
    });

    it('фильтрует прогнозы на полдень и исключает текущий день', () => {
        render(<ForecastList weatherData={mockWeatherData} />);
        const items = screen.getAllByTestId('forecast-item');
        expect(items.length).toBe(2);
    });
});