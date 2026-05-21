import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Today from './Today';

vi.mock('../hooks/useWeather', () => ({
  useWeather: vi.fn(),
}));

vi.mock('../hooks/useLocation', () => ({
  useLocation: vi.fn(),
}));

vi.mock('../hooks/useStorage', () => ({
  useStorage: vi.fn(),
}));

vi.mock('../hooks/useInput', () => ({
  useInput: vi.fn(),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

import { useWeather } from '../hooks/useWeather';
import { useLocation } from '../hooks/useLocation';
import { useStorage } from '../hooks/useStorage';
import { useInput } from '../hooks/useInput';
import { useParams, useNavigate } from 'react-router';

describe('Today', () => {
  const mockNavigate = vi.fn();
  const mockFetchByCity = vi.fn();
  const mockFetchHistoryWeather = vi.fn();
  const mockSaveCity = vi.fn();
  const mockGetUserLocation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useParams as any).mockReturnValue({ city: 'Moscow' });
    
    (useNavigate as any).mockReturnValue(mockNavigate);
    
    (useWeather as any).mockReturnValue({
      weatherData: null,
      historyData: [],
      error: null,
      isLoading: false,
      fetchByCity: mockFetchByCity,
      fetchByLocation: vi.fn(),
      fetchHistoryWeather: mockFetchHistoryWeather,
    });
    
    (useLocation as any).mockReturnValue({
      location: null,
      isLoading: false,
      getUserLocation: mockGetUserLocation,
    });
    
    (useStorage as any).mockReturnValue({
      searchHistory: [],
      saveCity: mockSaveCity,
    });
    
    (useInput as any).mockReturnValue({
      value: 'Moscow',
      setValue: vi.fn(),
      debouncedValue: 'Moscow',
      onChange: vi.fn(),
    });
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <Today />
      </MemoryRouter>
    );
  };

  it('должен рендерить инпут для ввода города', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Введите город...');
    expect(input).toBeDefined();
  });

  it('должен отображать кнопки геолокации и информации', () => {
    renderComponent();
    expect(screen.getByText('📍')).toBeDefined();
    expect(screen.getByText('ℹ️')).toBeDefined();
  });

  it('должен показывать загрузку при isLoadingWeather', () => {
    (useWeather as any).mockReturnValue({
      ...useWeather(),
      isLoading: true,
    });
    renderComponent();
    expect(screen.getByText('Загрузка...')).toBeDefined();
  });

  it('должен показывать ошибку', () => {
    (useWeather as any).mockReturnValue({
      ...useWeather(),
      error: { message: 'Город не найден' },
    });
    renderComponent();
    expect(screen.getByText('Ошибка: Город не найден')).toBeDefined();
  });
});