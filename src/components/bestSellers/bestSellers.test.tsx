import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BestSellers from "./bestSellers";
import { WishlistProvider } from "../../context/wishlistContext/wishlistContext";

// Mock the ProductCard component
jest.mock("../../components/productCard/productCard.tsx", () => {
  return function MockProductCard({
    product,
    onProductClick,
    onToggleWishlist,
  }) {
    return (
      <div data-testid="product-card">
        <h3>{product.title}</h3>
        <button onClick={() => onProductClick(product)}>View Product</button>
        <button onClick={(e) => onToggleWishlist(e, product.id)}>
          Toggle Wishlist
        </button>
      </div>
    );
  };
});

// Mock the ProductModal component
jest.mock("../../components/productModal/productModal.tsx", () => {
  return function MockProductModal({ product, onClose }) {
    if (!product) return null;
    return (
      <div data-testid="product-modal">
        <h2>{product.title}</h2>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

// Mock the LoadingDots component
jest.mock("../../components/loadingDots/loadingDots.tsx", () => {
  return function MockLoadingDots() {
    return <div data-testid="loading-dots">Loading...</div>;
  };
});

const mockProducts = [
  {
    id: 1,
    title: "Product 1",
    price: 99.99,
    description: "Description 1",
    image: "image1.jpg",
    category: "category1",
    isWishlisted: false,
  },
  {
    id: 2,
    title: "Product 2",
    price: 149.99,
    description: "Description 2",
    image: "image2.jpg",
    category: "category2",
    isWishlisted: true,
  },
  {
    id: 3,
    title: "Product 3",
    price: 199.99,
    description: "Description 3",
    image: "image3.jpg",
    category: "category3",
    isWishlisted: false,
  },
];

// Mock fetch
global.fetch = jest.fn();

describe("BestSellers Component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {})
    );

    render(
      <WishlistProvider>
        <BestSellers />
      </WishlistProvider>
    );

    expect(screen.getByTestId("loading-dots")).toBeInTheDocument();
  });

  test("renders error state when fetch fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch")
    );

    render(
      <WishlistProvider>
        <BestSellers />
      </WishlistProvider>
    );

    const errorMessage = await screen.findByText(
      "Failed to load best sellers."
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("renders products successfully", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    });

    render(
      <WishlistProvider>
        <BestSellers />
      </WishlistProvider>
    );

    const productCards = await screen.findAllByTestId("product-card");
    expect(productCards).toHaveLength(3);
  });

  test("opens product modal when clicking on a product", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    });

    render(
      <WishlistProvider>
        <BestSellers />
      </WishlistProvider>
    );

    const viewButtons = await screen.findAllByText("View Product");
    fireEvent.click(viewButtons[0]);
    expect(screen.getByTestId("product-modal")).toBeInTheDocument();
  });

  test("toggles wishlist status", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    });

    render(
      <WishlistProvider>
        <BestSellers />
      </WishlistProvider>
    );

    const wishlistButtons = await screen.findAllByText("Toggle Wishlist");
    fireEvent.click(wishlistButtons[0]);

    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    expect(storedProducts[0].isWishlisted).toBe(true);
  });

  test("handles localStorage data correctly", async () => {
    localStorage.setItem("products", JSON.stringify(mockProducts));

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    });

    render(
      <WishlistProvider>
        <BestSellers />
      </WishlistProvider>
    );

    await screen.findAllByTestId("product-card");
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    expect(storedProducts).toHaveLength(3);
    expect(storedProducts[1].isWishlisted).toBe(true);
  });

  test("handles HTTP error responses", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(
      <WishlistProvider>
        <BestSellers />
      </WishlistProvider>
    );

    const errorMessage = await screen.findByText(
      "Failed to load best sellers."
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("updates products when wishlist is modified", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    });

    render(
      <WishlistProvider>
        <BestSellers />
      </WishlistProvider>
    );

    const wishlistButtons = await screen.findAllByText("Toggle Wishlist");
    fireEvent.click(wishlistButtons[0]);

    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    expect(storedProducts[0].isWishlisted).toBe(true);
  });

  test("displays correct product information", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    });

    render(
      <WishlistProvider>
        <BestSellers />
      </WishlistProvider>
    );

    const productTitle = await screen.findByText("Product 1");
    expect(productTitle).toBeInTheDocument();

    const productCards = await screen.findAllByTestId("product-card");
    expect(productCards).toHaveLength(3);
  });

  test("closes product modal", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    });

    render(
      <WishlistProvider>
        <BestSellers />
      </WishlistProvider>
    );

    const viewButtons = await screen.findAllByText("View Product");
    fireEvent.click(viewButtons[0]);

    const modal = await screen.findByTestId("product-modal");
    expect(modal).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("product-modal")).not.toBeInTheDocument();
  });
});
