import axiosInstance from "../config/API";

const API_ENDPOINT = "/sales.php";

export const searchSalesApi = async (searchText = "") => {
  const payload = { search_text: searchText };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to search sales");
  }

  return data.body.sales || [];
};

export const createSaleApi = async (saleData) => {
  const payload = { ...saleData };
  delete payload.edit_sales_id;

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to create sale");
  }

  return data;
};

export const updateSaleApi = async (saleData) => {
  const payload = { ...saleData, edit_sales_id: saleData.edit_sales_id };

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to update sale");
  }

  return data;
};

export const deleteSaleApi = async (saleId) => {
  const payload = { delete_sales_id: saleId };

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to delete sale");
  }

  return data;
};

export const fetchPartiesApi = async (searchText = "") => {
  const payload = { search_text: searchText };
  const partiesEndpoint = API_ENDPOINT.replace("sales.php", "parties.php");

  const response = await axiosInstance.post(partiesEndpoint, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to fetch parties");
  }

  return data.body.parties || [];
};
