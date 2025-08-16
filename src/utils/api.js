// src/utils/api.js
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_KEY;
export const IMG_BASE = "https://image.tmdb.org/t/p/";

export const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: API_KEY,
    language: "ar",
  },
  timeout: 10000,
});

// كاش بسيط في الذاكرة
const cache = new Map();
api.interceptors.request.use((config) => {
  const key = config.baseURL + config.url + JSON.stringify(config.params || {});
  if (cache.has(key)) {
    // ضع العلامة ليستعمل الرد المخزن
    config.metadata = { cacheKey: key, fromCache: true };
    config.adapter = async () => {
      return {
        data: cache.get(key),
        status: 200,
        statusText: "OK (cache)",
        headers: {},
        config,
        request: {},
      };
    };
  } else {
    config.metadata = { cacheKey: key, fromCache: false };
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const key = response.config.metadata?.cacheKey;
    if (key && !response.config.metadata?.fromCache) {
      cache.set(key, response.data);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

// Helpers
export const endpoints = {
  popular: ({ page }) => ({ url: "/movie/popular", params: { page } }),
  search: ({ query, page }) => ({
    url: "/search/movie",
    params: { query, page, include_adult: false },
  }),
  details: (id) => ({ url: `/movie/${id}` }),
  suggest: (q) => ({ url: "/search/movie", params: { query: q, page: 1 } }),
};
