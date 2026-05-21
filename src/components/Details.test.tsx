import { render, screen } from '@testing-library/react';
import Details from './Details';
import type { WeatherItem } from '../types/weather';

describe('Details', () => {
    const mockWeatherData: WeatherItem = {
        dt: '2024-01-01 12:00:00',
        temp: 25,
        pressure: 1013,
        humidity: 65,
        speed: 5,
        description: 'Ясно',
        icon: '01d'
    };

    it('отображает все детали погоды', () => {
        render(<Details data={mockWeatherData} />);
        
        expect(screen.getByText('Температура')).toBeDefined();
        expect(screen.getByText('25 °C')).toBeDefined();
        
        expect(screen.getByText('Давление')).toBeDefined();
        expect(screen.getByText('1013 гПа')).toBeDefined();
        
        expect(screen.getByText('Влажность')).toBeDefined();
        expect(screen.getByText('65 %')).toBeDefined();
        
        expect(screen.getByText('Ветер')).toBeDefined();
        expect(screen.getByText('5 м/с')).toBeDefined();
    });

    it('отображает 4 элемента деталей', () => {
        const { container } = render(<Details data={mockWeatherData} />);
        const detailItems = container.querySelectorAll('.detail-item');
        
        expect(detailItems.length).toBe(4);
    });
});