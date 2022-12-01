import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders connect wallet button', () => {
  render(<App />);
  const walletButton = screen.getByText(/Connect Wallet/i);
  expect(walletButton).toBeInTheDocument();
});