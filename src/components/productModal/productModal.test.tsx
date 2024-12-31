import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductModal from "./productModal";
import { CartProvider } from "../../context/cartContext/cartContext";
import { mockProduct } from "../../utils/testUtils";
// Mock FontAwesome
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span>icon</span>,
}));

// Mock useCart
const mockAddToCart = jest.fn();
jest.mock("../../context/cartContext/cartContext", () => ({
  useCart: () => ({
    addToCart: mockAddToCart,
  }),
  CartProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));



describe("ProductModal Component", () => {
  const mockOnClose = jest.fn();
  const mockOnToggleWishlist = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderProductModal = (product = mockProduct) => {
    return render(
      <CartProvider>
        <ProductModal
          product={product}
          onClose={mockOnClose}
          onToggleWishlist={mockOnToggleWishlist}
        />
      </CartProvider>
    );
  };

  test("renders nothing when product is null", () => {
    render(
      <CartProvider>
        <ProductModal
          product={null}
          onClose={mockOnClose}
          onToggleWishlist={mockOnToggleWishlist}
        />
      </CartProvider>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("renders product information correctly", () => {
    renderProductModal();

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
  });

  test("renders product image with correct attributes", () => {
    renderProductModal();

    const image = screen.getByRole("img", { name: mockProduct.title });
    expect(image).toHaveAttribute("src", mockProduct.image);
    expect(image).toHaveAttribute("alt", mockProduct.title);
  });

  test("calls onClose when clicking close button", () => {
    renderProductModal();

    const closeButton = screen.getByRole("button", { name: /close modal/i });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when clicking overlay", () => {
    renderProductModal();
  
    const overlay = screen.getByRole('button', { name: 'Close modal' });
    fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("calls addToCart when clicking Add to Cart button", () => {
    renderProductModal();

    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });
    fireEvent.click(addToCartButton);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  test("handles missing product information gracefully", () => {
    const incompleteProduct = {
      ...mockProduct,
      description: "",
      category: "",
    };

    renderProductModal(incompleteProduct);

    expect(screen.getByText(incompleteProduct.title)).toBeInTheDocument();
    expect(screen.getByText(`$${incompleteProduct.price}`)).toBeInTheDocument();
  });

  test("modal has proper structure", () => {
    renderProductModal();

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      mockProduct.title
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
  });

  test("modal is accessible", () => {
    renderProductModal();

    expect(
      screen.getByRole("button", { name: /close modal/i })
    ).toHaveAttribute("aria-label");
    expect(screen.getByRole("img")).toHaveAttribute("alt");
  });

  test("price is formatted correctly", () => {
    const productWithDecimalPrice = {
      ...mockProduct,
      price: 99.99,
    };

    renderProductModal(productWithDecimalPrice);
    expect(screen.getByText("$99.99")).toBeInTheDocument();
  });

  test("handles long product descriptions", () => {
    const productWithLongDescription = {
      ...mockProduct,
      description: "A".repeat(300),
    };

    renderProductModal(productWithLongDescription);
    expect(screen.getByText("A".repeat(300))).toBeInTheDocument();
  });

  test("handles long product titles", () => {
    const longTitle = "Very Long Product Title ".repeat(5).trim();
    const productWithLongTitle = {
      ...mockProduct,
      title: longTitle,
    };

    renderProductModal(productWithLongTitle);

    const titleElement = screen.getByRole("heading", { level: 2 });
    expect(titleElement).toHaveTextContent(longTitle);
  });
});
