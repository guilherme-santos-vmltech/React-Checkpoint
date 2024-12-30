import React from 'react';
import { render, screen, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { WishlistProvider, useWishlist } from './wishlistContext';

describe('WishlistContext', () => {
test('provides initial wishlist update value of 0', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <WishlistProvider>{children}</WishlistProvider>
  );

  const { result } = renderHook(() => useWishlist(), { wrapper });
  expect(result.current.wishlistUpdate).toBe(0);
});

test('throws error when used outside of WishlistProvider', () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
  expect(() => {
    renderHook(() => useWishlist());
  }).toThrow('useWishlist must be used within a WishlistProvider');

  consoleSpy.mockRestore();
});

test('increments wishlist update value when triggered', async () => {
  const user = userEvent.setup();
  const TestComponent = () => {
    const { wishlistUpdate, triggerWishlistUpdate } = useWishlist();
    return (
      <div>
        <span>Count: {wishlistUpdate}</span>
        <button onClick={triggerWishlistUpdate}>Update</button>
      </div>
    );
  };

  render(
    <WishlistProvider>
      <TestComponent />
    </WishlistProvider>
  );

  const button = screen.getByRole('button');
  await user.click(button);
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});

test('multiple triggers increment the update value correctly', async () => {
  const user = userEvent.setup();
  const TestComponent = () => {
    const { wishlistUpdate, triggerWishlistUpdate } = useWishlist();
    return (
      <div>
        <span>Count: {wishlistUpdate}</span>
        <button onClick={triggerWishlistUpdate}>Update</button>
      </div>
    );
  };

  render(
    <WishlistProvider>
      <TestComponent />
    </WishlistProvider>
  );

  const button = screen.getByRole('button');
  await user.click(button);
  await user.click(button);
  await user.click(button);
  
  expect(screen.getByText('Count: 3')).toBeInTheDocument();
});

test('provides context to nested components', () => {
  const TestComponent = () => {
    const { wishlistUpdate } = useWishlist();
    return <div>Wishlist Update: {wishlistUpdate}</div>;
  };

  render(
    <WishlistProvider>
      <TestComponent />
    </WishlistProvider>
  );

  expect(screen.getByText('Wishlist Update: 0')).toBeInTheDocument();
});

test('updates are reflected in nested components', async () => {
  const user = userEvent.setup();
  const TestComponent = () => {
    const { wishlistUpdate, triggerWishlistUpdate } = useWishlist();
    return (
      <div>
        <span>Wishlist Update: {wishlistUpdate}</span>
        <button onClick={triggerWishlistUpdate}>Update Wishlist</button>
      </div>
    );
  };

  render(
    <WishlistProvider>
      <TestComponent />
    </WishlistProvider>
  );

  expect(screen.getByText('Wishlist Update: 0')).toBeInTheDocument();
  await user.click(screen.getByRole('button'));
  expect(screen.getByText('Wishlist Update: 1')).toBeInTheDocument();
});

test('multiple providers maintain separate states', async () => {
  const user = userEvent.setup();
  const TestComponent = () => {
    const { wishlistUpdate, triggerWishlistUpdate } = useWishlist();
    return (
      <div>
        <span>Wishlist Update: {wishlistUpdate}</span>
        <button onClick={triggerWishlistUpdate}>Update Wishlist</button>
      </div>
    );
  };

  render(
    <div>
      <WishlistProvider>
        <TestComponent />
      </WishlistProvider>
      <WishlistProvider>
        <TestComponent />
      </WishlistProvider>
    </div>
  );

  const buttons = screen.getAllByRole('button');
  await user.click(buttons[0]);

  const updates = screen.getAllByText(/Wishlist Update: \d/);
  expect(updates[0]).toHaveTextContent('Wishlist Update: 1');
  expect(updates[1]).toHaveTextContent('Wishlist Update: 0');
});

test('maintains functionality after rerender', async () => {
  const user = userEvent.setup();
  const TestComponent = () => {
    const { wishlistUpdate, triggerWishlistUpdate } = useWishlist();
    return (
      <div>
        <span>Count: {wishlistUpdate}</span>
        <button onClick={triggerWishlistUpdate}>Update</button>
      </div>
    );
  };

  const { rerender } = render(
    <WishlistProvider>
      <TestComponent />
    </WishlistProvider>
  );

  await user.click(screen.getByRole('button'));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();

  rerender(
    <WishlistProvider>
      <TestComponent />
    </WishlistProvider>
  );

  await user.click(screen.getByRole('button'));
  expect(screen.getByText('Count: 2')).toBeInTheDocument();
});
});