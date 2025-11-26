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
export const deleteProductApi = async (item_code) => {
  const payload = { delete_item_code: item_code };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to delete product");
  }
  return data;
};