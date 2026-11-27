import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5001/api/v1' : '/api/v1');

// In-Memory Client Cache & In-Flight Promise Registry for Zero Duplicate Requests
const memoryCache = new Map();
const inFlightRequests = new Map();

// Default Cache TTLs (milliseconds)
const DEFAULT_CACHE_TTL = 1000 * 60 * 3; // 3 minutes
const LONG_CACHE_TTL = 1000 * 60 * 10; // 10 minutes (for cities, discovery)

// Helper to generate a unique cache key from URL & Params
const getCacheKey = (url, params = {}) => {
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {});
  return `${cleanUrl}?${JSON.stringify(sortedParams)}`;
};

// Check if a URL is eligible for client caching (read-only discovery, listings, cities)
const isCacheableUrl = (url) => {
  if (!url) return false;
  return (
    url.includes('/discovery') ||
    url.includes('/tickets/cities') ||
    url.includes('/cities/search') ||
    url.includes('/movies/upcoming') ||
    url.includes('/movies/search')
  );
};

// Versioned storage prefix to guarantee immediate invalidation of any legacy/corrupted cache
const CACHE_PREFIX = 'zenkai_v5_cache_';

// Automatically flush legacy caches on startup
try {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const k = sessionStorage.key(i);
      if (k && (k.startsWith('zenkai_cache_') || k.startsWith('zenkai_v2_') || k.startsWith('zenkai_v3_') || k.startsWith('zenkai_v4_'))) {
        sessionStorage.removeItem(k);
      }
    }
  }
} catch {
  // Ignore in non-browser or sandbox environments
}

// Read from Memory or SessionStorage
export const getCachedData = (key) => {
  // 1. Try Memory first
  const mem = memoryCache.get(key);
  if (mem) {
    if (Date.now() < mem.expiresAt) {
      return mem.data;
    }
    memoryCache.delete(key);
  }

  // 2. Try SessionStorage
  try {
    const stored = sessionStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() < parsed.expiresAt) {
        // Rehydrate memory cache
        memoryCache.set(key, parsed);
        return parsed.data;
      }
      sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
    }
  } catch (err) {
    // Ignore sessionStorage quota or parse issues
  }
  return null;
};

// Save to Memory & SessionStorage
export const setCachedData = (key, data, ttl = DEFAULT_CACHE_TTL) => {
  const cacheEntry = {
    data,
    timestamp: Date.now(),
    expiresAt: Date.now() + ttl,
  };

  memoryCache.set(key, cacheEntry);

  try {
    sessionStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheEntry));
  } catch (err) {
    // SessionStorage full or unavailable
  }
};

// Clear cache entries matching a prefix or all
export const clearClientCache = (prefix = '') => {
  for (const key of memoryCache.keys()) {
    if (!prefix || key.includes(prefix)) {
      memoryCache.delete(key);
    }
  }

  try {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const storageKey = sessionStorage.key(i);
      if (storageKey?.startsWith(CACHE_PREFIX) || storageKey?.startsWith('zenkai_')) {
        if (!prefix || storageKey.includes(prefix)) {
          sessionStorage.removeItem(storageKey);
        }
      }
    }
  } catch (err) {
    // Ignore
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach token & check cache
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('zenkai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach custom timestamp to prevent browser hanging on cancelled requests
    config.metadata = { startTime: Date.now() };
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 & cache storage
api.interceptors.response.use(
  (response) => {
    // If successful GET request on cacheable endpoint, store in client cache
    const config = response.config;
    if (config.method === 'get' && config.cache !== false && isCacheableUrl(config.url)) {
      const key = getCacheKey(config.url, config.params);
      const ttl = config.url.includes('/discovery') || config.url.includes('/cities') ? LONG_CACHE_TTL : DEFAULT_CACHE_TTL;
      setCachedData(key, response.data, ttl);
    }

    // If mutation request (POST, PUT, DELETE), automatically invalidate related caches
    if (config.method !== 'get') {
      if (config.url?.includes('/movies')) clearClientCache('movies');
      if (config.url?.includes('/music')) clearClientCache('music');
      if (config.url?.includes('/reviews')) clearClientCache('reviews');
    }

    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem('zenkai_token')) {
        localStorage.removeItem('zenkai_token');
        localStorage.removeItem('zenkai_user');
      }
    }
    return Promise.reject(error);
  }
);

// Wrapper around api.get with Request Deduplication & Stale-While-Revalidate
const originalGet = api.get.bind(api);

api.get = (url, config = {}) => {
  const cacheKey = getCacheKey(url, config.params);

  // 1. Check if caching is allowed and data is available
  if (config.cache !== false && isCacheableUrl(url)) {
    const cached = getCachedData(cacheKey);
    if (cached) {
      // If cached data is available, return immediately in a resolved promise!
      return Promise.resolve({
        data: cached,
        status: 200,
        statusText: 'OK (Client Cache)',
        headers: {},
        config,
        cached: true,
      });
    }
  }

  // 2. Request Deduplication: If identical request is already running, reuse the promise
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  // 3. Dispatch fresh request and register in inFlightRequests
  const promise = originalGet(url, config)
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });

  inFlightRequests.set(cacheKey, promise);
  return promise;
};

export default api;
