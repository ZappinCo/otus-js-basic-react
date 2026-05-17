import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Today from './Today';

const mockFetchByCity = vi.fn().mockResolvedValue(undefined);
const mockFetchByLocation = vi.fn().mockResolvedValue(undefined);
const mockFetchHistoryWeather = vi.fn().mockResolvedValue(undefined);
const mockGetUserLocation = vi.fn().mockResolvedValue(undefined);
const mockSaveCity = vi.fn();
const mockSetValue = vi.fn();
const mockOnChange = vi.fn();

vi.mock('../hooks/useWeather', () => ({
    useWeather: vi.fn()
}));

vi.mock('../hooks/useLocation', () => ({
    useLocation: vi.fn()
}));

vi.mock('../hooks/useStorage', () => ({
    useStorage: vi.fn()
}));

vi.mock('../hooks/useInput', () => ({
    useInput: vi.fn()
}));

vi.mock('./TodayForecast', () => ({
    default: vi.fn(() => <div data-testid="today-forecast">Today Forecast Mock</div>)
}));

vi.mock('./Details', () => ({
    default: vi.fn(() => <div data-testid="details">Details Mock</div>)
}));

vi.mock('./ForecastList', () => ({
    default: vi.fn(() => <div data-testid="forecast-list">Forecast List Mock</div>)
}));

vi.mock('./HistoryList', () => ({
    default: vi.fn(() => <div data-testid="history-list">History List Mock</div>)
}));

vi.mock('./LoadingButton', () => ({
    default: vi.fn(({ onClick, isLoading, buttonText, loadingText }) => (
        <button 
            onClick={onClick} 
            disabled={isLoading}
            data-testid="location-button"
        >
            {isLoading ? loadingText : buttonText}
        </button>
    ))
}));

import { useWeather } from '../hooks/useWeather';
import { useLocation } from '../hooks/useLocation';
import { useStorage } from '../hooks/useStorage';
import { useInput } from '../hooks/useInput';

describe('Today', () => {
    const mockWeatherData = {
        city: 'Moscow',
        list: [
            { dt: '2024-01-15 12:00:00', temp: 25 }
        ]
    };

    const mockHistoryData = [
        { city: 'Moscow', list: [] },
        { city: 'London', list: [] }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        
        mockFetchByCity.mockResolvedValue(undefined);
        mockFetchByLocation.mockResolvedValue(undefined);
        mockFetchHistoryWeather.mockResolvedValue(undefined);
        mockGetUserLocation.mockResolvedValue(undefined);
        
        (useStorage as any).mockReturnValue({
            city: 'Moscow',
            searchHistory: ['Moscow', 'London'],
            saveCity: mockSaveCity
        });

        (useWeather as any).mockReturnValue({
            weatherData: mockWeatherData,
            historyData: mockHistoryData,
            error: null,
            isLoading: false,
            fetchByCity: mockFetchByCity,
            fetchByLocation: mockFetchByLocation,
            fetchHistoryWeather: mockFetchHistoryWeather
        });

        (useLocation as any).mockReturnValue({
            location: null,
            isLoading: false,
            getUserLocation: mockGetUserLocation
        });

        (useInput as any).mockReturnValue({
            value: '',
            setValue: mockSetValue,
            debouncedValue: '',
            onChange: mockOnChange
        });
    });

    describe('рендеринг', () => {
        it('рендерится без ошибок', () => {
            render(<Today />);
            expect(screen.getByPlaceholderText('Введите город...')).toBeDefined();
            expect(screen.getByTestId('location-button')).toBeDefined();
        });

        it('отображает кнопку геолокации', () => {
            render(<Today />);
            expect(screen.getByText('📍')).toBeDefined();
        });

        it('отображает заглушку загрузки', () => {
            (useWeather as any).mockReturnValue({
                ...useWeather(),
                isLoading: true
            });

            render(<Today />);
            expect(screen.getByText('Загрузка...')).toBeDefined();
        });

        it('отображает данные погоды', () => {
            render(<Today />);
            
            expect(screen.getByTestId('today-forecast')).toBeDefined();
            expect(screen.getByTestId('details')).toBeDefined();
            expect(screen.getByTestId('forecast-list')).toBeDefined();
        });

        it('не отображает историю если она пуста', () => {
            (useWeather as any).mockReturnValue({
                ...useWeather(),
                historyData: []
            });

            render(<Today />);
            expect(screen.queryByTestId('history-list')).toBeNull();
        });
    });

    describe('отображение ошибок', () => {
        it('отображает ошибку погоды', () => {
            (useWeather as any).mockReturnValue({
                ...useWeather(),
                error: { message: 'Город не найден' }
            });

            render(<Today />);
            expect(screen.getByText('Ошибка: Город не найден')).toBeDefined();
        });

        it('отображает ошибку геолокации', () => {
            (useLocation as any).mockReturnValue({
                location: { error: { message: 'Доступ запрещен' } },
                isLoading: false,
                getUserLocation: mockGetUserLocation
            });

            render(<Today />);
            expect(screen.getByText('Ошибка: Доступ запрещен')).toBeDefined();
        });
    });

    describe('взаимодействие с поиском', () => {
        it('вызывает fetchByCity при вводе текста', async () => {
            (useInput as any).mockReturnValue({
                value: 'Moscow',
                setValue: mockSetValue,
                debouncedValue: 'Moscow',
                onChange: mockOnChange
            });

            render(<Today />);
            
            await waitFor(() => {
                expect(mockFetchByCity).toHaveBeenCalledWith('Moscow');
            });
        });
    });

    describe('геолокация', () => {
        it('вызывает getUserLocation при клике на кнопку', async () => {
            render(<Today />);
            
            const button = screen.getByTestId('location-button');
            await userEvent.click(button);
            
            expect(mockGetUserLocation).toHaveBeenCalled();
        });
    });

    describe('загрузка сохраненного города', () => {
        it('загружает сохраненный город при монтировании', async () => {
            (useStorage as any).mockReturnValue({
                city: 'London',
                searchHistory: [],
                saveCity: mockSaveCity
            });

            render(<Today />);
            
            await waitFor(() => {
                expect(mockFetchByCity).toHaveBeenCalledWith('London');
            });
        });
    });
});