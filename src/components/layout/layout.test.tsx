import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from './layout';

// Mock the Navbar component
jest.mock('../navbar/navbar.tsx', () => {
return function MockNavbar() {
  return <nav aria-label="Main navigation">Mock Navbar</nav>;
};
});

describe('Layout Component', () => {
test('renders without crashing', () => {
  render(
    <Layout>
      <div>Test Content</div>
    </Layout>
  );
});

test('renders navbar component', () => {
  render(
    <Layout>
      <div>Test Content</div>
    </Layout>
  );
  
  expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
});

test('renders children content', () => {
  render(
    <Layout>
      <h1>Test Content</h1>
    </Layout>
  );
  
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  expect(screen.getByText('Test Content')).toBeInTheDocument();
});

test('applies correct CSS classes', () => {
  render(
    <Layout>
      <div>Test Content</div>
    </Layout>
  );
  
  const main = screen.getByRole('main');
  expect(main).toHaveClass('mainContent');
});

test('maintains proper structure', () => {
  render(
    <Layout>
      <div>Test Content</div>
    </Layout>
  );
  
  const main = screen.getByRole('main');
  const nav = screen.getByRole('navigation');
  
  expect(main).toBeInTheDocument();
  expect(nav).toBeInTheDocument();
});

test('renders multiple children correctly', () => {
  render(
    <Layout>
      <header>Header Content</header>
      <section>Section Content</section>
      <footer>Footer Content</footer>
    </Layout>
  );

  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByText('Section Content')).toBeInTheDocument();
  expect(screen.getByRole('contentinfo')).toBeInTheDocument();
});

test('preserves child content and structure', () => {
  render(
    <Layout>
      <article>
        <h2>Article Title</h2>
        <p>Article content</p>
      </article>
    </Layout>
  );

  const article = screen.getByRole('article');
  expect(article).toBeInTheDocument();
  
  const heading = screen.getByRole('heading', { level: 2 });
  expect(heading).toHaveTextContent('Article Title');
  
  expect(screen.getByText('Article content')).toBeInTheDocument();
});

test('contains main content within main element', () => {
  render(
    <Layout>
      <p>Main content</p>
    </Layout>
  );

  const main = screen.getByRole('main');
  expect(within(main).getByText('Main content')).toBeInTheDocument();
});

test('renders content in correct order', () => {
  render(
    <Layout>
      <p>Test content</p>
    </Layout>
  );

  const nav = screen.getByRole('navigation');
  const main = screen.getByRole('main');
  const content = screen.getByText('Test content');

  expect(nav).toBeInTheDocument();
  expect(main).toBeInTheDocument();
  expect(content).toBeInTheDocument();
});
});