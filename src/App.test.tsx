import React from 'react';
import { render, screen } from '@testing-library/react';
import CryptApp from './CryptApp';

test('renders learn react link', () => {
  render(<CryptApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
