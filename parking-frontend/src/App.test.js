// App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

// Optional: Mock axios if needed for child components like Login
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(() => Promise.resolve({ data: { token: 'test-token' } })),
    get: jest.fn(() => Promise.resolve({ data: { user: { isAdmin: false } } })),
  },
}));

test('renders login page when no token is present', () => {
  // Clear any existing token in localStorage
  localStorage.removeItem('token');

  render(<App />);

  // This assumes the Login component contains the text "Login to ParkMate"
  const loginTitle = screen.getByRole('heading', { name: /login to parkmate/i });
  expect(loginTitle).toBeInTheDocument();
});
