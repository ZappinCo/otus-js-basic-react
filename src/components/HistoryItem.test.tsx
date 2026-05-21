import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import HistoryItem from './HistoryItem';
import type { WeatherData } from '../types/weather';

// Правильный мок - возвращаем только useNavigate
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual, // Сохраняем все остальные экспорты (BrowserRouter, MemoryRouter и т.д.)
    useNavigate: () => mockNavigate,
  };
});

const mockNavigate = vi.fn();

// Мокаем translateWeatherDesc
vi.mock('../utils/translateWeatherDesc', () => ({
  translateWeatherDesc: (desc: string) => `Перевод: ${desc}`,
}));

describe('HistoryItem', () => {
  const mockWeatherData: WeatherData = {
    city: 'Moscow',
    list: [
      {
        temp: 25,
        temp_min: 18,
        icon: '01d',
        description: 'clear sky',
      },
    ],
  } as WeatherData;

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <HistoryItem weatherData={mockWeatherData} />
      </MemoryRouter>
    );
  };

  it('должен отображать название города', () => {
    renderComponent();
    expect(screen.getByText('Moscow')).toBeDefined();
  });

  it('должен отображать температуру', () => {
    renderComponent();
    expect(screen.getByText('+25° / +18°')).toBeDefined();
  });

  it('должен отображать иконку', () => {
    renderComponent();
    const img = screen.getByAltText('clear sky');
    expect(img).toBeDefined();
    expect(img.getAttribute('src')).toBe('https://openweathermap.org/img/wn/01d.png');
  });

  it('должен отображать описание погоды', () => {
    renderComponent();
    expect(screen.getByText('Перевод: clear sky')).toBeDefined();
  });

  it('должен навигировать на страницу города при клике', () => {
    renderComponent();
    const card = screen.getByText('Moscow').closest('.history-city-card');
    fireEvent.click(card!);
    expect(mockNavigate).toHaveBeenCalledWith('/Moscow', { replace: true });
  });

  it('не должен рендерить ничего если нет list', () => {
    const emptyData = { city: 'Moscow' } as WeatherData;
    const { container } = render(
      <MemoryRouter>
        <HistoryItem weatherData={emptyData} />
      </MemoryRouter>
    );
    expect(container.innerHTML).toBe('');
  });
});