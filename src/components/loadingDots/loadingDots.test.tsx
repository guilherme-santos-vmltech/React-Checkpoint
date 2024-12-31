import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingDots from './loadingDots';

describe('LoadingDots Component', () => {
test('renders loading text', () => {
  render(<LoadingDots />);
  expect(screen.getByText('Loading')).toBeInTheDocument();
});

test('renders with correct accessibility role', () => {
  render(<LoadingDots />);
  expect(screen.getByRole('status')).toBeInTheDocument();
});
});