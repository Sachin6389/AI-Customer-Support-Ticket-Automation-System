const redisKeys = {
  product: (productId) => `product:${productId}`,

  products: () => `products:all`,

  categoryProducts: (category) =>
    `products:category:${category.toLowerCase()}`,
};

export default redisKeys;