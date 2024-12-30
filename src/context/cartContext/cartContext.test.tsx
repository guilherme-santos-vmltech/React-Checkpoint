import React from 'react';
import { render, screen, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CartProvider, useCart } from './cartContext';
import { Product } from '../../types/product';

const mockProduct: Product = {
id: 1,
title: 'Test Product',
price: 10,
description: 'Test Description',
category: 'Test Category',
image: 'test.jpg',
isWishlisted: false,
};

const mockProduct2: Product = {
id: 2,
title: 'Test Product 2',
price: 20,
description: 'Test Description 2',
category: 'Test Category',
image: 'test2.jpg',
isWishlisted: false,
};

describe('CartContext', () => {
test('throws error when used outside of CartProvider', () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
  expect(() => {
    renderHook(() => useCart());
  }).toThrow('useCart must be used within a CartProvider');

  consoleSpy.mockRestore();
});

test('provides initial empty cart', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  const { result } = renderHook(() => useCart(), { wrapper });
  expect(result.current.cartItems).toHaveLength(0);
  expect(result.current.getCartTotal()).toBe(0);
});

test('adds item to cart', async () => {
  const user = userEvent.setup();
  const TestComponent = () => {
    const { cartItems, addToCart } = useCart();
    return (
      <div>
        <button onClick={() => addToCart(mockProduct)}>Add to Cart</button>
        <span>Items: {cartItems.length}</span>
      </div>
    );
  };

  render(
    <CartProvider>
      <TestComponent />
    </CartProvider>
  );

  await user.click(screen.getByRole('button'));
  expect(screen.getByText('Items: 1')).toBeInTheDocument();
});

test('increases quantity for existing item', async () => {
  const user = userEvent.setup();
  const TestComponent = () => {
    const { cartItems, addToCart } = useCart();
    return (
      <div>
        <button onClick={() => addToCart(mockProduct)}>Add to Cart</button>
        <span>Quantity: {cartItems[0]?.quantity || 0}</span>
      </div>
    );
  };

  render(
    <CartProvider>
      <TestComponent />
    </CartProvider>
  );

  await user.click(screen.getByRole('button'));
  await user.click(screen.getByRole('button'));
  expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
});

test('removes item from cart', async () => {
  const user = userEvent.setup();
  const TestComponent = () => {
    const { cartItems, addToCart, removeFromCart } = useCart();
    return (
      <div>
        <button onClick={() => addToCart(mockProduct)}>Add to Cart</button>
        <button onClick={() => removeFromCart(mockProduct.id)}>Remove from Cart</button>
        <span>Items: {cartItems.length}</span>
      </div>
    );
  };

  render(
    <CartProvider>
      <TestComponent />
    </CartProvider>
  );

  await user.click(screen.getByText('Add to Cart'));
  expect(screen.getByText('Items: 1')).toBeInTheDocument();
  
  await user.click(screen.getByText('Remove from Cart'));
  expect(screen.getByText('Items: 0')).toBeInTheDocument();
});

test('updates item quantity', async () => {
  const user = userEvent.setup();
  const TestComponent = () => {
    const { cartItems, addToCart, updateQuantity } = useCart();
    return (
      <div>
        <button onClick={() => addToCart(mockProduct)}>Add to Cart</button>
        <button onClick={() => updateQuantity(mockProduct.id, 5)}>Update Quantity</button>
        <span>Quantity: {cartItems[0]?.quantity || 0}</span>
      </div>
    );
  };

  render(
    <CartProvider>
      <TestComponent />
    </CartProvider>
  );

  await user.click(screen.getByText('Add to Cart'));
  await user.click(screen.getByText('Update Quantity'));
  expect(screen.getByText('Quantity: 5')).toBeInTheDocument();
});

test('removes item when quantity is set to 0', async () => {
  const user = userEvent.setup();
  const TestComponent = () => {
    const { cartItems, addToCart, updateQuantity } = useCart();
    return (
      <div>
        <button onClick={() => addToCart(mockProduct)}>Add to Cart</button>
        <button onClick={() => updateQuantity(mockProduct.id, 0)}>Update Quantity</button>
        <span>Items: {cartItems.length}</span>
      </div>
    );
  };

  render(
    <CartProvider>
      <TestComponent />
    </CartProvider>
  );

  await user.click(screen.getByText('Add to Cart'));
  expect(screen.getByText('Items: 1')).toBeInTheDocument();
  
  await user.click(screen.getByText('Update Quantity'));
  expect(screen.getByText('Items: 0')).toBeInTheDocument();
});

test('clears cart', async () => {
  const user = userEvent.setup();
  const TestComponent = () => {
    const { cartItems, addToCart, clearCart } = useCart();
    return (
      <div>
        <button onClick={() => addToCart(mockProduct)}>Add to Cart</button>
        <button onClick={clearCart}>Clear Cart</button>
        <span>Items: {cartItems.length}</span>
      </div>
    );
  };

  render(
    <CartProvider>
      <TestComponent />
    </CartProvider>
  );

  await user.click(screen.getByText('Add to Cart'));
  expect(screen.getByText('Items: 1')).toBeInTheDocument();
  
  await user.click(screen.getByText('Clear Cart'));
  expect(screen.getByText('Items: 0')).toBeInTheDocument();
});

test('calculates cart total correctly', async () => {
  const user = userEvent.setup();
  const TestComponent = () => {
    const { getCartTotal, addToCart } = useCart();
    return (
      <div>
        <button onClick={() => addToCart(mockProduct)}>Add Product 1</button>
        <button onClick={() => addToCart(mockProduct2)}>Add Product 2</button>
        <span>Total: ${getCartTotal()}</span>
      </div>
    );
  };

  render(
    <CartProvider>
      <TestComponent />
    </CartProvider>
  );

  await user.click(screen.getByText('Add Product 1'));
  await user.click(screen.getByText('Add Product 2'));
  expect(screen.getByText('Total: $30')).toBeInTheDocument();
});

test('maintains separate carts for different providers', async () => {
  const user = userEvent.setup();
  const TestComponent = () => {
    const { cartItems, addToCart } = useCart();
    return (
      <div>
        <button onClick={() => addToCart(mockProduct)}>Add to Cart</button>
        <span>Items: {cartItems.length}</span>
      </div>
    );
  };

  render(
    <div>
      <CartProvider>
        <TestComponent />
      </CartProvider>
      <CartProvider>
        <TestComponent />
      </CartProvider>
    </div>
  );

  const buttons = screen.getAllByText('Add to Cart');
  await user.click(buttons[0]);

  const itemCounts = screen.getAllByText(/Items: \d/);
  expect(itemCounts[0]).toHaveTextContent('Items: 1');
  expect(itemCounts[1]).toHaveTextContent('Items: 0');
});
});

