import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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

// Mock data
const mockProducts = [
  {
    id: 1,
    title: "Test Product 1",
    price: 99.99,
    description: "Test description 1",
    image: "test-image-1.jpg",
    category: "test category",
    isWishlisted: true,
  },
  {
    id: 2,
    title: "Test Product 2",
    price: 149.99,
    description: "Test description 2",
    image: "test-image-2.jpg",
    category: "test category",
    isWishlisted: true,
  },
];

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

  it("renders nothing when closed", () => {
    render(
      <Wrapper>
        <WishlistModal isOpen={false} onClose={() => {}} />
      </Wrapper>
    );

    expect(screen.queryByText("My Wishlist")).not.toBeInTheDocument();
  });

  it("renders wishlist when open", () => {
    render(
      <Wrapper>
        <WishlistModal isOpen={true} onClose={() => {}} />
      </Wrapper>
    );

    expect(screen.getByText("My Wishlist")).toBeInTheDocument();
    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
  });

  it("shows empty state when no wishlisted items", () => {
    localStorage.setItem("products", JSON.stringify([]));

    render(
      <Wrapper>
        <WishlistModal isOpen={true} onClose={() => {}} />
      </Wrapper>
    );

    expect(screen.getByText("Your wishlist is empty")).toBeInTheDocument();
  });

  it("calls onClose when clicking close button", () => {
    const onClose = jest.fn();

    render(
      <Wrapper>
        <WishlistModal isOpen={true} onClose={onClose} />
      </Wrapper>
    );

    const closeButton = screen.getByRole('button', { name: 'Close wishlist' });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it("removes item from wishlist", () => {
    render(
      <Wrapper>
        <WishlistModal isOpen={true} onClose={() => {}} />
      </Wrapper>
    );

    const removeButton = screen.getAllByRole("button", {
      name: "Remove from wishlist",
    })[0];
    fireEvent.click(removeButton);

    const products = JSON.parse(localStorage.getItem("products") || "[]");
    expect(products[0].isWishlisted).toBe(false);
  });

  it("adds item to cart", () => {
    render(
      <Wrapper>
        <WishlistModal isOpen={true} onClose={() => {}} />
      </Wrapper>
    );

    const addToCartButton = screen.getAllByRole("button", {
      name: /add .* to cart/i,
    })[0];
    expect(addToCartButton).toBeInTheDocument();
    fireEvent.click(addToCartButton);
  });

  it("displays correct number of products", () => {
    render(
      <Wrapper>
        <WishlistModal isOpen={true} onClose={() => {}} />
      </Wrapper>
    );

    const productTitles = screen.getAllByRole("heading", { level: 3 });
    expect(productTitles).toHaveLength(2);
  });

  it("displays correct product information", () => {
    render(
      <Wrapper>
        <WishlistModal isOpen={true} onClose={() => {}} />
      </Wrapper>
    );

    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByAltText("Test Product 1")).toHaveAttribute(
      "src",
      "test-image-1.jpg"
    );
  });

  it("handles localStorage errors", () => {
    // Mock console.error before the test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock localStorage.getItem
    const mockGetItem = jest.spyOn(Storage.prototype, 'getItem');
    mockGetItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    
    // Clear any existing localStorage data
    localStorage.clear();
    
    render(
      <Wrapper>
        <WishlistModal isOpen={true} onClose={() => {}} />
      </Wrapper>
    );
    
    // Verify empty state is shown
    expect(screen.getByText('Your wishlist is empty')).toBeInTheDocument();
    
    // Clean up
    consoleSpy.mockRestore();
    mockGetItem.mockRestore();
    });

  it("maintains wishlist state after adding to cart", () => {
    render(
      <Wrapper>
        <WishlistModal isOpen={true} onClose={() => {}} />
      </Wrapper>
    );

    const addToCartButton = screen.getAllByRole("button", {
      name: /add .* to cart/i,
    })[0];
    fireEvent.click(addToCartButton);

    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
  });
});

