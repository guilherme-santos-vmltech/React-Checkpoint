import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductCard from "./productCard";
import { CartProvider } from "../../context/cartContext/cartContext";
import { mockProduct } from "../../utils/testUtils";

// Mock FontAwesome
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span>icon</span>,
}));

// Mock functions
const mockOnProductClick = jest.fn();
const mockOnToggleWishlist = jest.fn();
const mockAddToCart = jest.fn();

// Mock useCart hook
jest.mock("../../context/cartContext/cartContext", () => ({
  useCart: () => ({
    addToCart: mockAddToCart,
  }),
  CartProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("ProductCard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderProductCard = (customProps = {}) => {
    const defaultProps = {
      product: mockProduct,
      index: 0,
      onProductClick: mockOnProductClick,
      onToggleWishlist: mockOnToggleWishlist,
      wishlistUpdate: 0,
    };

    return render(
      <CartProvider>
        <ProductCard {...defaultProps} {...customProps} />
      </CartProvider>
    );
  };

  test("renders product information correctly", () => {
    renderProductCard();

    expect(screen.getByRole("heading")).toHaveTextContent(mockProduct.title);
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockProduct.description.slice(0, 100)}...`)
    ).toBeInTheDocument();
  });

  test("renders product image with correct attributes", () => {
    renderProductCard();

    const image = screen.getByRole("img", { name: mockProduct.title });
    expect(image).toHaveAttribute("src", mockProduct.image);
    expect(image).toHaveAttribute("loading", "eager");
    expect(image).toHaveAttribute("width", "300");
    expect(image).toHaveAttribute("height", "300");
  });

  test("uses lazy loading for non-first products", () => {
    renderProductCard({ index: 1 });

    const image = screen.getByRole("img", { name: mockProduct.title });
    expect(image).toHaveAttribute("loading", "lazy");
  });

  test("calls onProductClick when clicking the product card", () => {
    renderProductCard();

    const productCard = screen.getByRole("button", {
      name: `View details for ${mockProduct.title}`,
    });
    fireEvent.click(productCard);
    expect(mockOnProductClick).toHaveBeenCalledWith(mockProduct);
  });

  test("calls onToggleWishlist when clicking the wishlist button", () => {
    renderProductCard();

    const wishlistButton = screen.getByRole("button", {
      name: /Add to wishlist/i,
    });
    fireEvent.click(wishlistButton);
    expect(mockOnToggleWishlist).toHaveBeenCalledWith(
      expect.any(Object),
      mockProduct.id
    );
  });

  test("displays correct wishlist button text based on isWishlisted", () => {
    renderProductCard({
      product: { ...mockProduct, isWishlisted: true },
    });

    expect(
      screen.getByRole("button", { name: /Remove from wishlist/i })
    ).toBeInTheDocument();
  });

  test("calls addToCart when clicking Add to Cart button", () => {
    renderProductCard();

    const addToCartButton = screen.getByRole("button", {
      name: `Add ${mockProduct.title} to cart`,
    });
    fireEvent.click(addToCartButton);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  test("prevents event propagation when clicking Add to Cart", () => {
    renderProductCard();

    const addToCartButton = screen.getByRole("button", {
      name: `Add ${mockProduct.title} to cart`,
    });
    fireEvent.click(addToCartButton);
    expect(mockOnProductClick).not.toHaveBeenCalled();
  });

  test("truncates long product descriptions", () => {
    const longDescription = "A".repeat(150);
    renderProductCard({
      product: { ...mockProduct, description: longDescription },
    });

    expect(
      screen.getByText(`${longDescription.slice(0, 100)}...`)
    ).toBeInTheDocument();
  });

  test("renders with accessibility attributes", () => {
    renderProductCard();

    const wishlistButton = screen.getByRole("button", {
      name: /Add to wishlist/i,
    });
    const addToCartButton = screen.getByRole("button", {
      name: `Add ${mockProduct.title} to cart`,
    });

    expect(wishlistButton).toHaveAttribute("aria-label");
    expect(addToCartButton).toHaveAttribute("aria-label");
  });

  test("handles missing product information gracefully", () => {
    const incompleteProduct = {
      ...mockProduct,
      description: "",
      category: "",
    };

    renderProductCard({ product: incompleteProduct });

    expect(screen.getByRole("heading")).toHaveTextContent(
      incompleteProduct.title
    );
    expect(screen.getByText(`$${incompleteProduct.price}`)).toBeInTheDocument();
  });

  test("applies correct CSS classes", () => {
    renderProductCard();

    const image = screen.getByRole("img", { name: mockProduct.title });
    const title = screen.getByRole("heading", { level: 2 });
    const addToCartButton = screen.getByRole("button", {
      name: `Add ${mockProduct.title} to cart`,
    });

    expect(image).toHaveClass("productImage");
    expect(title).toHaveClass("productTitle");
    expect(addToCartButton).toHaveClass("addToCartButton");
  });
});
