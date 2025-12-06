// src/services/ProductService.js
import axiosInstance from "../config/API";

const API_ENDPOINT = "/products.php";

// FETCH ALL PRODUCTS (with search)
export const fetchProductsApi = async (searchText = "") => {
  const payload = { search_text: searchText };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to fetch products");
  }

  return data.body?.products || [];
};

// CREATE PRODUCT
export const createProductApi = async (productData) => {
  const response = await axiosInstance.post(API_ENDPOINT, productData); // ← FIXED: was "payload"
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to create product");
  }
  return data;
};

// UPDATE PRODUCT
export const updateProductApi = async (productData) => {
  const response = await axiosInstance.post(API_ENDPOINT, productData); // ← FIXED: was "payload"
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to update product");
  }
  return data;
};

// DELETE PRODUCT
export const deleteProductApi = async (product_id) => {
  const payload = { delete_product_id: product_id };  // ← THIS MATCHES PHP
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to delete product");
  }
  return data;
};


// BULK STATUS UPDATE
export const bulkUpdateProductStatusApi = async ({ product_ids, status_code, status_name }) => {
  const payload = {
    bulk_status_update: true,
    product_ids,
    status_code,
    status_name,
  };

  const response = await axiosInstance.post("/products.php", payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Bulk update failed");
  }
  return data;
};


// src/services/ProductService.js

export const bulkAssignProductCodeApi = async ({ product_ids }) => {
  const payload = {
    bulk_assign_code: true,
    product_ids,
  };

  const response = await axiosInstance.post("/products.php", payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to assign codes");
  }
  return data;
};


export const bulkAssignUnitsApi = async ({ product_ids, unit_value,unit_id }) => {
  const payload = {
    bulk_assign_units: true,
    product_ids,
    unit_value,
    unit_id // this is JSON string
  };

  const response = await axiosInstance.post("/products.php", payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to assign units");
  }
  return data;
};

// ... (existing service imports and functions)

// NEW: BULK UPDATE ITEMS (Category, Tax, Discount, Code)
export const bulkUpdateItemsApi = async (payload) => {
  // payload should include: product_ids, category_id, tax_type, tax_rate, discount_type, discount_value, product_code
  const finalPayload = {
    bulk_update_items: true, // Backend identifier
    ...payload,
  };

  const response = await axiosInstance.post(API_ENDPOINT, finalPayload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Bulk item update failed");
  }
  return data;
};