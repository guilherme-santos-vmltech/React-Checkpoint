import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Navbar from "./navbar";
import { CartProvider } from "../../context/cartContext/cartContext";
import { Product } from "../../types/product";
import { mockProduct } from "../../utils/testUtils";

// Define the CartItem type
interface CartItem extends Product {
  quantity: number;
}

// Define the CartContextType
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

// Mock the FontAwesome component
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span>icon</span>,
}));

// Mock the modal components
jest.mock("../wishlistModal/wishlist", () => {
  return function MockWishlistModal({
    isOpen,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) {
    if (!isOpen) return null;
    return (
      <div role="dialog" aria-label="Wishlist">
        Mock Wishlist Modal
      </div>
    );
  };
});

jest.mock("../cartModal/cartModal", () => {
  return function MockCartModal({
    isOpen,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) {
    if (!isOpen) return null;
    return (
      <div role="dialog" aria-label="Shopping Cart">
        Mock Cart Modal
      </div>
    );
  };
});

// Mock product data

const mockCartItems: CartItem[] = [
  {
    ...mockProduct,
    quantity: 2,
  },
];

// Create properly typed mock functions
const mockAddToCart = jest.fn<void, [Product]>();
const mockRemoveFromCart = jest.fn<void, [number]>();
const mockUpdateQuantity = jest.fn<void, [number, number]>();
const mockClearCart = jest.fn<void, []>();
const mockGetCartTotal = jest.fn<number, []>();

// Create a properly typed mock useCart
const createMockCartContext = (
  cartItems: CartItem[] = []
): CartContextType => ({
  cartItems,
  addToCart: mockAddToCart,
  removeFromCart: mockRemoveFromCart,
  updateQuantity: mockUpdateQuantity,
  clearCart: mockClearCart,
  getCartTotal: mockGetCartTotal,
});

// Mock the useCart hook with proper typing
const mockUseCart = jest.fn<CartContextType, []>(() =>
  createMockCartContext([])
);

jest.mock("../../context/cartContext/cartContext", () => ({
  useCart: () => mockUseCart(),
  CartProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCart.mockImplementation(() => createMockCartContext([]));
  });

  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <CartProvider>
          <Navbar />
        </CartProvider>
      </BrowserRouter>
    );
  };

  test("renders navigation elements", () => {
    renderNavbar();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  test("renders navigation links", () => {
    renderNavbar();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  test("renders logo", () => {
    renderNavbar();
    const logo = screen.getByRole("img", { name: "Company Logo" });
    expect(logo).toBeInTheDocument();
  });

  test("renders shopping action buttons", () => {
    renderNavbar();
    expect(
      screen.getByRole("button", { name: /open wishlist/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /open cart/i })
    ).toBeInTheDocument();
  });

  test("displays cart items count", () => {
    mockUseCart.mockImplementation(() => createMockCartContext(mockCartItems));
    renderNavbar();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("opens wishlist modal when clicking wishlist button", () => {
    renderNavbar();
    const wishlistButton = screen.getByRole("button", {
      name: /open wishlist/i,
    });
    fireEvent.click(wishlistButton);
    expect(
      screen.getByRole("dialog", { name: "Wishlist" })
    ).toBeInTheDocument();
  });

  test("opens cart modal when clicking cart button", () => {
    renderNavbar();
    const cartButton = screen.getByRole("button", { name: /open cart/i });
    fireEvent.click(cartButton);
    expect(
      screen.getByRole("dialog", { name: "Shopping Cart" })
    ).toBeInTheDocument();
  });

  test("updates aria-expanded attribute for wishlist", () => {
    renderNavbar();
    const wishlistButton = screen.getByRole("button", {
      name: /open wishlist/i,
    });

    expect(wishlistButton).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(wishlistButton);
    expect(wishlistButton).toHaveAttribute("aria-expanded", "true");
  });

  test("updates aria-expanded attribute for cart", () => {
    renderNavbar();
    const cartButton = screen.getByRole("button", { name: /open cart/i });

    expect(cartButton).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(cartButton);
    expect(cartButton).toHaveAttribute("aria-expanded", "true");
  });

  test("shows cart badge only when items exist", () => {
    // First render with empty cart
    const { rerender } = renderNavbar();
    expect(screen.queryByText("0")).not.toBeInTheDocument();

    // Update cart items
    mockUseCart.mockImplementation(() => createMockCartContext(mockCartItems));

    rerender(
      <BrowserRouter>
        <CartProvider>
          <Navbar />
        </CartProvider>
      </BrowserRouter>
    );

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("closes modals when clicking close button", () => {
    renderNavbar();

    // Open and close wishlist modal
    const wishlistButton = screen.getByRole("button", {
      name: /open wishlist/i,
    });
    fireEvent.click(wishlistButton);
    expect(
      screen.getByRole("dialog", { name: "Wishlist" })
    ).toBeInTheDocument();

    // Open and close cart modal
    const cartButton = screen.getByRole("button", { name: /open cart/i });
    fireEvent.click(cartButton);
    expect(
      screen.getByRole("dialog", { name: "Shopping Cart" })
    ).toBeInTheDocument();
  });

  test("displays correct cart items total", () => {
    mockUseCart.mockImplementation(() => ({
      ...createMockCartContext(mockCartItems),
      getCartTotal: () => 20,
    }));

    renderNavbar();
    const cartButton = screen.getByRole("button", {
      name: /open cart with 2 items/i,
    });
    expect(cartButton).toBeInTheDocument();
  });

  test("handles empty cart state correctly", () => {
    renderNavbar();
    const cartButton = screen.getByRole("button", {
      name: /open cart with 0 items/i,
    });
    expect(cartButton).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
