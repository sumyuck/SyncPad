import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SyncPad landing headline', () => {
    render(<App />);
    const heading = screen.getByText(/code together/i);
    expect(heading).toBeInTheDocument();
});
