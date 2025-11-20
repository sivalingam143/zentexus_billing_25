// src/services/CategoryService.js
import axiosInstance from "../config/API"; // same as your other services

const API_ENDPOINT = "/category.php";

export const fetchCategoriesApi = async (searchText = "") => {
  const payload = { search_text: searchText };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to fetch categories");
  }

  return data.body?.categories || [];
};

export const createCategoryApi = async (categoryData) => {
  const payload = {
    category_name: categoryData.category_name,
  };

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to create category");
  }

  return data;
};

export const updateCategoryApi = async (categoryData) => {
  const payload = {
    edit_category_id: categoryData.category_id,
    category_name: categoryData.category_name,
  };

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to update category");
  }

  return data;
};

export const deleteCategoryApi = async (category_id) => {
  const payload = { delete_category_id: category_id };

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to delete category");
  }

  return data;
};