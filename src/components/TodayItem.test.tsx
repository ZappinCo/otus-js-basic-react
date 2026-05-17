import { render, screen } from '@testing-library/react';
import TodayItem from './TodayItem';
import type { WeatherItem } from '../types/weather';

vi.mock('../utils/translateWeatherDesc', () => ({
    translateWeatherDesc: vi.fn((desc) => `Перевод: ${desc}`)
}));

describe('TodayItem', () => {
    const mockItem: WeatherItem = {
        dt: '2024-01-15 12:30:00',
        temp: 25,
        temp_min: 18,
        description: 'clear sky',
        icon: '01d',
        pressure: 1013,
        humidity: 65,
        speed: 5
    };

    it('отображает время', () => {
        render(<TodayItem item={mockItem} />);
        expect(screen.getByText('12:30')).toBeDefined();
    });

    it('отображает положительную температуру с плюсом', () => {
        render(<TodayItem item={mockItem} />);
        expect(screen.getByText('+25°')).toBeDefined();
    });

    it('отображает отрицательную температуру без плюса', () => {
        const coldItem = { ...mockItem, temp: -10 };
        render(<TodayItem item={coldItem} />);
        expect(screen.getByText('-10°')).toBeDefined();
    });

    it('отображает иконку погоды', () => {
        render(<TodayItem item={mockItem} />);
        const img = document.querySelector('img');
        expect(img).toBeDefined();
        expect(img?.src).toContain('openweathermap.org/img/wn/01d.png');
        expect(img?.alt).toBe('clear sky');
    });

    it('отображает описание погоды', () => {
        render(<TodayItem item={mockItem} />);
        expect(screen.getByText('Перевод: clear sky')).toBeDefined();
    });
});