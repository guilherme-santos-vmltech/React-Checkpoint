import { Product } from "../types/product";

export const mockProducts = [
    {
      id: 1,
      title: "Product 1",
      price: 99.99,
      description: "Test description 1",
      image: "test-image-1.jpg",
      category: "test category",
      isWishlisted: true,
    },
    {
      id: 2,
      title: "Product 2",
      price: 149.99,
      description: "Test description 2",
      image: "test-image-2.jpg",
      category: "test category",
      isWishlisted: true,
    },
    {
      id: 3,
      title: "Product 3",
      price: 300,
      description: "Test description 3",
      image: "test-image-3.jpg",
      category: "test category",
      isWishlisted: true,
    },
  ];

export const mockProduct: Product = {
  id: 1,
  title: "Test Product",
  price: 10,
  description: "Test description",
  category: "Test category",
  image: "test-image.jpg",
  isWishlisted: false,
};
