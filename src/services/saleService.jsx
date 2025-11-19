// services/saleService.js
import axiosInstance from "../config/API";
const API_ENDPOINT = "/sales.php";

// Search Sales by name (also used for fetching all when searchText is empty)
export const searchSalesApi = async (searchText) => {
  const payload = {
    search_text: searchText,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const data = response.data;
  if (data.head && data.head.code !== 200) {
    throw new Error(data.head.msg || "Failed to search sales");
  }
  return data.body.sales;
};

// Create a new Sale
export const createSaleApi = async (saleData) => {
  const payload = {
    ...saleData,
    // Ensure no edit_sales_id for creation
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const data = response.data;
  if (data.head && data.head.code !== 200) {
    throw new Error(data.head.msg || "Failed to create sale");
  }
  console.log("Create sale response:", data);
  return data;
};

// Update a Sale by ID
export const updateSaleApi = async (saleData) => {
  const payload = {
    ...saleData,
    edit_sales_id: saleData.edit_sales_id, // Ensure edit_sales_id is included
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const data = response.data;
  if (data.head && data.head.code !== 200) {
    throw new Error(data.head.msg || "Failed to update sale");
  }
  console.log("Update sale response:", data);
  return data;
};

// Delete a Sale by ID
export const deleteSaleApi = async (saleId) => {
  const payload = {
    delete_sales_id: saleId,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const data = response.data;
  if (data.head && data.head.code !== 200) {
    throw new Error(data.head.msg || "Failed to delete sale");
  }
  return data;
};

// Fetch Parties (for customer selection in creation)
export const fetchPartiesApi = async (searchText = "") => {
  const payload = {
    search_text: searchText,
  };
  const response = await axiosInstance.post(
    `${API_ENDPOINT.replace("sales.php", "parties.php")}`,
    payload
  );
  const data = response.data;
  if (data.head && data.head.code !== 200) {
    throw new Error(data.head.msg || "Failed to fetch parties");
  }
  return data.body.parties;
};
