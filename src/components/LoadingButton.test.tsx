import { render, screen } from '@testing-library/react';
import LoadingButton from './LoadingButton';

describe('LoadingButton', () => {
    it('рендерит текст кнопки', () => {
        render(<LoadingButton buttonText="Кнопка" />);
        expect(screen.getByText('Кнопка')).toBeDefined();
    });

    it('рендерит текст загрузки', () => {
        render(<LoadingButton isLoading={true} loadingText="Загрузка" />);
        expect(screen.getByText('Загрузка')).toBeDefined();
    });
});