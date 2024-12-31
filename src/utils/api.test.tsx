import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { productApi } from './api.ts';
import { mockProducts } from './testUtils.tsx';

// Setup MSW server
const server = setupServer(
rest.get('https://fakestoreapi.com/products', (req, res, ctx) => {
  return res(ctx.json(mockProducts));
})
);

describe('productApi', () => {
// Enable API mocking before tests
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done
afterAll(() => server.close());

describe('getAllProducts', () => {
  it('should fetch products successfully', async () => {
    const products = await productApi.getAllProducts();
    expect(products).toEqual(mockProducts);
  });

  it('should throw error when API call fails', async () => {
    // Override the default handler to simulate an error
    server.use(
      rest.get('https://fakestoreapi.com/products', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    await expect(productApi.getAllProducts()).rejects.toThrow('Failed to fetch products');
  });

  it('should handle network errors', async () => {
    // Simulate network failure
    server.use(
      rest.get('https://fakestoreapi.com/products', (req, res) => {
        return res.networkError('Failed to connect');
      })
    );

    await expect(productApi.getAllProducts()).rejects.toThrow();
  });
});
});