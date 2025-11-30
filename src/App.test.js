import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SyncPad landing headline', () => {
    render(<App />);
    const heading = screen.getByText(/SyncPad Studio/i);
    expect(heading).toBeInTheDocument();
});
