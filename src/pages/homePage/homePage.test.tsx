import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as React from 'react';
import Home from './homePage.tsx';

// Mock the BestSellers component
jest.mock('../../components/bestSellers/bestSellers', () => {
return function MockBestSellers(): React.JSX.Element {
  return (
    <section aria-label="Best Sellers">
      Best Sellers Mock
    </section>
  );
};
});

describe('Home', () => {
const renderHome = () => {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
};

test('renders main title', () => {
  renderHome();
  
  const title = screen.getByRole('heading', { 
    name: 'Catch the Best Deals Before They Swim Away!' 
  });
  expect(title).toBeInTheDocument();
});

test('renders description text', () => {
  renderHome();
  
  const description = screen.getByText(/dive into our products right now/i);
  expect(description).toBeInTheDocument();
});

test('renders products link', () => {
  renderHome();
  
  const link = screen.getByRole('link', { name: /our products/i });
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute('href', '/products');
});

test('renders BestSellers section', () => {
  renderHome();
  
  const bestSellers = screen.getByRole('region', { 
    name: /best sellers/i 
  });
  expect(bestSellers).toBeInTheDocument();
});
});