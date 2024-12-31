import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductsPage from './productsPage.tsx';
import { useWishlist } from '../../context/wishlistContext/wishlistContext';
import { useProducts } from '../../hooks/useProducts/useProducts';

jest.mock('../../context/wishlistContext/wishlistContext');
jest.mock('../../hooks/useProducts/useProducts');
jest.mock('../../components/loadingDots/loadingDots', () => {
return function LoadingDots() {
  return <div>Loading...</div>;
};
});
jest.mock('../../components/productCard/productCard', () => {
return function ProductCard({ product, onProductClick, onToggleWishlist }: any) {
  return (
    <div onClick={() => onProductClick(product)}>
      <span>{product.name}</span>
      <button onClick={(e) => onToggleWishlist(e, product.id)}>
        Toggle Wishlist
      </button>
    </div>
  );
};
});
jest.mock('../../components/productModal/productModal', () => {
return function ProductModal({ product, onClose, onToggleWishlist }: any) {
  if (!product) return null;
  return (
    <div>
      <span>Modal: {product.name}</span>
      <button onClick={() => onClose()}>Close</button>
      <button onClick={(e) => onToggleWishlist(e, product.id)}>
        Toggle Wishlist
      </button>
    </div>
  );
};
});

describe('ProductsPage', () => {
const mockProducts = [
  { id: 1, name: 'Product 1', isWishlisted: false },
  { id: 2, name: 'Product 2', isWishlisted: true },
];

const mockToggleWishlist = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useWishlist as jest.Mock).mockReturnValue({ wishlistUpdate: 0 });
});

test('renders loading state', () => {
  (useProducts as jest.Mock).mockReturnValue({
    products: [],
    loading: true,
    error: null,
    toggleWishlist: mockToggleWishlist,
  });

  render(<ProductsPage />);
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

test('renders error state', () => {
  const errorMessage = 'Error loading products';
  (useProducts as jest.Mock).mockReturnValue({
    products: [],
    loading: false,
    error: errorMessage,
    toggleWishlist: mockToggleWishlist,
  });

  render(<ProductsPage />);
  
  expect(screen.getByText(errorMessage)).toBeInTheDocument();
});

test('renders products grid', () => {
  (useProducts as jest.Mock).mockReturnValue({
    products: mockProducts,
    loading: false,
    error: null,
    toggleWishlist: mockToggleWishlist,
  });

  render(<ProductsPage />);
  
  expect(screen.getByText('Product 1')).toBeInTheDocument();
  expect(screen.getByText('Product 2')).toBeInTheDocument();
});

test('opens product modal on product click', async () => {
  (useProducts as jest.Mock).mockReturnValue({
    products: mockProducts,
    loading: false,
    error: null,
    toggleWishlist: mockToggleWishlist,
  });

  render(<ProductsPage />);
  
  // Click on a product
  await userEvent.click(screen.getByText('Product 1'));
  
  // Check if modal is shown
  expect(screen.getByText('Modal: Product 1')).toBeInTheDocument();
});

test('closes product modal', async () => {
  (useProducts as jest.Mock).mockReturnValue({
    products: mockProducts,
    loading: false,
    error: null,
    toggleWishlist: mockToggleWishlist,
  });

  render(<ProductsPage />);
  
  // Open modal
  await userEvent.click(screen.getByText('Product 1'));
  
  // Close modal
  await userEvent.click(screen.getByText('Close'));
  
  // Check if modal is closed
  expect(screen.queryByText('Modal: Product 1')).not.toBeInTheDocument();
});

test('toggles wishlist', async () => {
  (useProducts as jest.Mock).mockReturnValue({
    products: mockProducts,
    loading: false,
    error: null,
    toggleWishlist: mockToggleWishlist,
  });

  render(<ProductsPage />);
  
  // Click wishlist toggle button
  await userEvent.click(screen.getAllByText('Toggle Wishlist')[0]);
  
  expect(mockToggleWishlist).toHaveBeenCalled();
});
});