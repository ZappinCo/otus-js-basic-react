import { render, screen } from '@testing-library/react';
import DetailItem from './DetailItem';

describe('DetailItem', () => {
    it('отображает label и value', () => {
        render(<DetailItem label="Температура" value="25°C" />);

        expect(screen.getByText('Температура')).toBeDefined();
        expect(screen.getByText('25°C')).toBeDefined();
    });

    it('отображает разные значения', () => {
        render(<DetailItem label="Влажность" value="65%" />);

        expect(screen.getByText('Влажность')).toBeDefined();
        expect(screen.getByText('65%')).toBeDefined();
    });
});