const NodeCache = require('node-cache');

// Create a cache instance with a default TTL of 10 minutes (600 seconds)
const cache = new NodeCache({ stdTTL: 600 });

// Cache keys
const CACHE_KEYS = {
  HOME_PAGE: 'home_page',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  DURATIONS: 'durations'
};

// Function to get data from cache
const getFromCache = (key) => {
  return cache.get(key);
};

// Function to set data in cache
const setInCache = (key, data, ttl = 600) => {
  return cache.set(key, data, ttl);
};

// Function to delete data from cache
const deleteFromCache = (key) => {
  return cache.del(key);
};

// Function to clear all cache
const clearAllCache = () => {
  return cache.flushAll();
};

// Function to invalidate specific cache keys
const invalidateCache = (keys) => {
  if (Array.isArray(keys)) {
    keys.forEach(key => cache.del(key));
  } else {
    cache.del(keys);
  }
};

// Function to invalidate all product-related cache
const invalidateProductCache = () => {
  cache.del(CACHE_KEYS.HOME_PAGE);
  cache.del(CACHE_KEYS.PRODUCTS);
};

// Function to invalidate all category-related cache
const invalidateCategoryCache = () => {
  cache.del(CACHE_KEYS.HOME_PAGE);
  cache.del(CACHE_KEYS.CATEGORIES);
};

// Function to invalidate all duration-related cache
const invalidateDurationCache = () => {
  cache.del(CACHE_KEYS.HOME_PAGE);
  cache.del(CACHE_KEYS.DURATIONS);
};

module.exports = {
  cache,
  CACHE_KEYS,
  getFromCache,
  setInCache,
  deleteFromCache,
  clearAllCache,
  invalidateCache,
  invalidateProductCache,
  invalidateCategoryCache,
  invalidateDurationCache
}; 