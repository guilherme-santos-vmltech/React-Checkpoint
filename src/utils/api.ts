import { Product } from "../types/product";

const BASE_URL = "https://fakestoreapi.com";

interface ApiError extends Error {
  status?: number;
  statusText?: string;
}

export class ProductApiError extends Error implements ApiError {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = "ProductApiError";
  }
}

export const productApi = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${BASE_URL}/products`);

      if (!response.ok) {
        throw new ProductApiError(
          "Failed to fetch products",
          response.status,
          response.statusText
        );
      }

      const data = await response.json();

      // Validate response data
      if (!Array.isArray(data)) {
        throw new ProductApiError("Invalid response format");
      }

      return data as Product[];
    } catch (error) {
      if (error instanceof ProductApiError) {
        throw error;
      }
      // Handle fetch errors (network issues, etc.)
      throw new ProductApiError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  },
};
