import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { mockProducts } from "../../utils/testUtils.tsx";
import "@testing-library/jest-dom";
import { jest } from "@jest/globals";
import WishlistModal from "./wishlist";
import { WishlistProvider } from "../../context/wishlistContext/wishlistContext.tsx";
import { CartProvider } from "../../context/cartContext/cartContext.tsx";

// Mock the localStorage
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key],
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});



// Mock the cart context
const mockTriggerWishlistUpdate = jest.fn();
const mockAddToCart = jest.fn();

jest.mock("../../context/cartContext/cartContext", () => ({
  useCart: () => ({
    addToCart: mockAddToCart,
    cartItems: [],
  }),
  CartProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock("../../context/wishlistContext/wishlistContext", () => ({
  useWishlist: () => ({
    triggerWishlistUpdate: mockTriggerWishlistUpdate,
  }),
  WishlistProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Wrapper component for providing context
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CartProvider>
    <WishlistProvider>{children}</WishlistProvider>
  </CartProvider>
);


describe("WishlistModal", () => {
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("products", JSON.stringify(mockProducts));
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders nothing when closed", () => {
  render(
    <Wrapper>
      <WishlistModal isOpen={false} onClose={() => {}} />
    </Wrapper>
  );

  expect(screen.queryByText("My Wishlist")).not.toBeInTheDocument();
});

test("renders wishlist when open", () => {
  render(
    <Wrapper>
      <WishlistModal isOpen={true} onClose={() => {}} />
    </Wrapper>
  );

  expect(screen.getByText("My Wishlist")).toBeInTheDocument();
  expect(screen.getByText("Product 1")).toBeInTheDocument();
  expect(screen.getByText("$99.99")).toBeInTheDocument();
});

test("shows empty state when no wishlisted items", () => {
  localStorage.setItem("products", JSON.stringify([]));

  render(
    <Wrapper>
      <WishlistModal isOpen={true} onClose={() => {}} />
    </Wrapper>
  );

  expect(screen.getByText("Your wishlist is empty")).toBeInTheDocument();
});

test("calls onClose when clicking close button", async () => {
  const user = userEvent.setup();
  const onClose = jest.fn();

  render(
    <Wrapper>
      <WishlistModal isOpen={true} onClose={onClose} />
    </Wrapper>
  );

  const closeButton = screen.getByRole('button', { name: 'Close wishlist' });
  await user.click(closeButton);
  expect(onClose).toHaveBeenCalled();
});

test("removes item from wishlist", async () => {
  const user = userEvent.setup();
  render(
    <Wrapper>
      <WishlistModal isOpen={true} onClose={() => {}} />
    </Wrapper>
  );

  const removeButton = screen.getAllByRole("button", {
    name: "Remove from wishlist",
  })[0];
  await user.click(removeButton);

  const products = JSON.parse(localStorage.getItem("products") || "[]");
  expect(products[0].isWishlisted).toBe(false);
});

test("adds item to cart", async () => {
  const user = userEvent.setup();
  render(
    <Wrapper>
      <WishlistModal isOpen={true} onClose={() => {}} />
    </Wrapper>
  );

  const addToCartButton = screen.getAllByRole("button", {
    name: /add .* to cart/i,
  })[0];
  expect(addToCartButton).toBeInTheDocument();
  await user.click(addToCartButton);
  expect(mockAddToCart).toHaveBeenCalled();
});

test("displays correct number of products", () => {
  render(
    <Wrapper>
      <WishlistModal isOpen={true} onClose={() => {}} />
    </Wrapper>
  );

  const productTitles = screen.getAllByRole("heading", { level: 3 });
  expect(productTitles).toHaveLength(3);
});

test("displays correct product information", () => {
  render(
    <Wrapper>
      <WishlistModal isOpen={true} onClose={() => {}} />
    </Wrapper>
  );

  expect(screen.getByText("Product 1")).toBeInTheDocument();
  expect(screen.getByText("$99.99")).toBeInTheDocument();
  expect(screen.getByAltText("Product 1")).toHaveAttribute(
    "src",
    "test-image-1.jpg"
  );
});

test("handles localStorage errors", () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
  const mockGetItem = jest.spyOn(Storage.prototype, 'getItem');
  mockGetItem.mockImplementation(() => {
    throw new Error('localStorage error');
  });
  
  localStorage.clear();
  
  render(
    <Wrapper>
      <WishlistModal isOpen={true} onClose={() => {}} />
    </Wrapper>
  );
  
  expect(screen.getByText('Your wishlist is empty')).toBeInTheDocument();
  
  consoleSpy.mockRestore();
  mockGetItem.mockRestore();
});

test("maintains wishlist state after adding to cart", async () => {
  const user = userEvent.setup();
  render(
    <Wrapper>
      <WishlistModal isOpen={true} onClose={() => {}} />
    </Wrapper>
  );

  const addToCartButton = screen.getAllByRole("button", {
    name: /add .* to cart/i,
  })[0];
  await user.click(addToCartButton);

  expect(screen.getByText("Product 1")).toBeInTheDocument();
});
});