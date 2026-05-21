import { render, screen } from '@testing-library/react';
import ForecastItem from './ForecastItem';
import type { WeatherItem } from '../types/weather';

vi.mock('../utils/formatDate', () => ({
    formatDate: vi.fn((date) => `Форматированная дата: ${date}`)
}));

vi.mock('../utils/translateWeatherDesc', () => ({
    translateWeatherDesc: vi.fn((desc) => `Перевод: ${desc}`)
}));

describe('ForecastItem', () => {
    const mockData: WeatherItem = {
        dt: '2024-01-15 12:00:00',
        temp: 25,
        temp_min: 18,
        description: 'clear sky',
        icon: '01d',
        pressure: 1013,
        humidity: 65,
        speed: 5
    };

    it('отображает день недели', () => {
        render(<ForecastItem data={mockData} />);
        expect(screen.getByText(/Форматированная дата:/)).toBeDefined();
    });

    it('отображает иконку погоды', () => {
        render(<ForecastItem data={mockData} />);
        const img = document.querySelector('img');
        expect(img).toBeDefined();
        expect(img?.src).toContain('openweathermap.org/img/wn/01d.png');
    });

    it('отображает температуру с плюсом для положительных значений', () => {
        render(<ForecastItem data={mockData} />);
        expect(screen.getByText('+25° / +18°')).toBeDefined();
    });

    it('отображает температуру с минусом для отрицательных значений', () => {
        const coldData = { ...mockData, temp: -10, temp_min: -15 };
        render(<ForecastItem data={coldData} />);
        expect(screen.getByText('-10° / -15°')).toBeDefined();
    });

    it('отображает описание погоды', () => {
        render(<ForecastItem data={mockData} />);
        expect(screen.getByText('Перевод: clear sky')).toBeDefined();
    });
});