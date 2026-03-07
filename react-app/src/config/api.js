const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

export const ORDERS_API_URL = trimTrailingSlash(
  import.meta.env.VITE_ORDERS_URL || "/api/orders",
);

export const PRODUCTS_API_URL = trimTrailingSlash(
  import.meta.env.VITE_PRODUCTS_URL || "/api/products",
);
