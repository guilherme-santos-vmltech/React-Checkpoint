import { renderHook, act } from "@testing-library/react";
import { useProducts } from "./useProducts";
import { productApi } from "../../utils/api";
import { storageService } from "../../utils/storage";

// Mock the dependencies
jest.mock("../../utils/api");
jest.mock("../../utils/storage");

describe("useProducts", () => {
  const mockProducts = [{ id: 1, name: "Product 1", isWishlisted: false }];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("should fetch products and set initial state", async () => {
    // Mock API response
    (productApi.getAllProducts as jest.Mock).mockResolvedValue(mockProducts);
    (storageService.getWishlistedProducts as jest.Mock).mockReturnValue([]);

    const { result } = renderHook(() => useProducts(0));

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    // Wait for the async operation to complete
    await act(async () => {
      // Wait for all promises to resolve
      await Promise.resolve();
    });

    // Check final state
    expect(result.current.loading).toBe(false);
    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBe(null);
  });

  test("should handle API errors", async () => {
    const errorMessage = "Failed to fetch products";
    (productApi.getAllProducts as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );
    (storageService.getWishlistedProducts as jest.Mock).mockReturnValue([]);

    const { result } = renderHook(() => useProducts(0));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.products).toEqual([]);
  });

  test("should toggle wishlist status", async () => {
    (productApi.getAllProducts as jest.Mock).mockResolvedValue(mockProducts);
    (storageService.getWishlistedProducts as jest.Mock).mockReturnValue([]);

    const { result } = renderHook(() => useProducts(0));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const mockEvent = {
      stopPropagation: jest.fn(),
    } as unknown as React.MouseEvent;

    // Toggle wishlist for product 1
    act(() => {
      result.current.toggleWishlist(mockEvent, 1);
    });

    // Check if the product's wishlist status was toggled
    expect(result.current.products[0].isWishlisted).toBe(true);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(storageService.saveWishlistedProducts).toHaveBeenCalled();
  });

  test("should update products when wishlistUpdate changes", async () => {
    (productApi.getAllProducts as jest.Mock).mockResolvedValue(mockProducts);
    (storageService.getWishlistedProducts as jest.Mock).mockReturnValue([]);

    const { rerender } = renderHook(
      ({ wishlistUpdate }) => useProducts(wishlistUpdate),
      { initialProps: { wishlistUpdate: 0 } }
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Trigger a re-render with new wishlistUpdate value
    rerender({ wishlistUpdate: 1 });

    expect(productApi.getAllProducts).toHaveBeenCalledTimes(2);
  });
});
