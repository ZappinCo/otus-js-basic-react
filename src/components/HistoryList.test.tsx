import { render, screen } from '@testing-library/react';
import HistoryList from './HistoryList';

vi.mock('./HistoryItem', () => ({
    default: vi.fn(() => <div>History Item</div>)
}));

describe('HistoryList', () => {
    const mockData = [
        { city: 'Moscow' },
        { city: 'London' },
        { city: 'Paris' }
    ] as any;

    it('рендерит заголовок', () => {
        render(<HistoryList weatherData={mockData} />);
        expect(screen.getByText('История поиска')).toBeDefined();
    });

    it('рендерит список', () => {
        const { container } = render(<HistoryList weatherData={mockData} />);
        expect(container.querySelector('.history-cities-list')).toBeDefined();
    });
});