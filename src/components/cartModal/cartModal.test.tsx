import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CartProvider, useCart } from '../../context/cartContext/cartContext';
import CartModal from './cartModal';
import { Product } from '../../types/product';

// Mock the useCart hook
jest.mock('../../context/cartContext/cartContext', () => ({
useCart: jest.fn(),
CartProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockProduct: Product = {
id: 1,
title: 'Test Product',
price: 10,
description: 'Test description',
category: 'Test category',
image: 'test-image.jpg',
isWishlisted: false,
};

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
<CartProvider>{children}</CartProvider>
);

describe('CartModal', () => {
beforeEach(() => {
  // Default mock implementation
  (useCart as jest.Mock).mockReturnValue({
    cartItems: [],
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
    getCartTotal: jest.fn(() => 0),
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders without crashing', () => {
  render(
    <Wrapper>
      <CartModal isOpen={false} onClose={() => {}} />
    </Wrapper>
  );
});

test('renders nothing when isOpen is false', () => {
  render(
    <Wrapper>
      <CartModal isOpen={false} onClose={() => {}} />
    </Wrapper>
  );
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('renders cart modal when isOpen is true', () => {
  render(
    <Wrapper>
      <CartModal isOpen={true} onClose={() => {}} />
    </Wrapper>
  );
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

test('renders "Your cart is empty" when cart is empty', () => {
  render(
    <Wrapper>
      <CartModal isOpen={true} onClose={() => {}} />
    </Wrapper>
  );
  expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
});

test('renders cart items when cart is not empty', () => {
  (useCart as jest.Mock).mockReturnValue({
    cartItems: [{ ...mockProduct, quantity: 2 }],
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
    getCartTotal: jest.fn(() => 20),
  });

  render(
    <Wrapper>
      <CartModal isOpen={true} onClose={() => {}} />
    </Wrapper>
  );

  expect(screen.getByText('Test Product')).toBeInTheDocument();
  expect(screen.getByText('$10')).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument();
});

test('calls onClose when clicking the close button', () => {
  const onCloseMock = jest.fn();
  render(
    <Wrapper>
      <CartModal isOpen={true} onClose={onCloseMock} />
    </Wrapper>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Close cart' }));
  expect(onCloseMock).toHaveBeenCalledTimes(1);
});

test('calls removeFromCart when clicking the remove button', () => {
  const mockRemoveFromCart = jest.fn();
  (useCart as jest.Mock).mockReturnValue({
    cartItems: [{ ...mockProduct, quantity: 1 }],
    addToCart: jest.fn(),
    removeFromCart: mockRemoveFromCart,
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
    getCartTotal: jest.fn(() => 10),
  });

  render(
    <Wrapper>
      <CartModal isOpen={true} onClose={() => {}} />
    </Wrapper>
  );

  fireEvent.click(screen.getByRole('button', { name: /Remove .* from cart/i }));
  expect(mockRemoveFromCart).toHaveBeenCalledWith(mockProduct.id);
});

test('updates quantity correctly', () => {
  const mockUpdateQuantity = jest.fn();
  (useCart as jest.Mock).mockReturnValue({
    cartItems: [{ ...mockProduct, quantity: 1 }],
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    updateQuantity: mockUpdateQuantity,
    clearCart: jest.fn(),
    getCartTotal: jest.fn(() => 10),
  });

  render(
    <Wrapper>
      <CartModal isOpen={true} onClose={() => {}} />
    </Wrapper>
  );

  fireEvent.click(screen.getByRole('button', { name: 'Increase quantity' }));
  expect(mockUpdateQuantity).toHaveBeenCalledWith(mockProduct.id, 2);

  fireEvent.click(screen.getByRole('button', { name: 'Decrease quantity' }));
  expect(mockUpdateQuantity).toHaveBeenCalledWith(mockProduct.id, 0);
});

test('clears the cart', () => {
  const mockClearCart = jest.fn();
  (useCart as jest.Mock).mockReturnValue({
    cartItems: [{ ...mockProduct, quantity: 1 }],
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: mockClearCart,
    getCartTotal: jest.fn(() => 10),
  });

  render(
    <Wrapper>
      <CartModal isOpen={true} onClose={() => {}} />
    </Wrapper>
  );

  fireEvent.click(screen.getByRole('button', { name: 'Clear all items from cart' }));
  expect(mockClearCart).toHaveBeenCalled();
});

test('displays the correct total price', () => {
  (useCart as jest.Mock).mockReturnValue({
    cartItems: [{ ...mockProduct, quantity: 2 }],
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
    getCartTotal: jest.fn(() => 20),
  });

  render(
    <Wrapper>
      <CartModal isOpen={true} onClose={() => {}} />
    </Wrapper>
  );

  expect(screen.getByText('$20.00')).toBeInTheDocument();
});
});