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
