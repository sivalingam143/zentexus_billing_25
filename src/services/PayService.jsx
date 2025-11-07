import axiosInstance from "../config/API";
const API_ENDPOINT = "/pay.php";

// Fetch all Pay entries
export const fetchPayApi = async () => {
  const payload = {
    action: "listpay",
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  return response.data.body.pay; // Returns array of pay entries with products decoded
};

// Add new Pay entry
export const addPayApi = async (PayData) => {
  const payload = {
    action: "addPay",
    staff_name: PayData.staff_name,
    entry_date: PayData.entry_date,
    ring_count: PayData.ring_count,
    products: PayData.products, // Expecting an array of product objects
    total: PayData.total,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("add Pay:", response.data);
  return response.data.head.pay ? response.data.head.pay[0] : null; // Return the new entry
};

// Update Pay entry by ID
export const updatePayApi = async (PayData) => {
  const payload = {
    action: "updatePay",
    id: PayData.id,
    staff_name: PayData.staff_name,
    entry_date: PayData.entry_date,
    ring_count: PayData.ring_count,
    products: PayData.products, // Expecting an array of product objects
    total: PayData.total,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("update Pay:", response.data);
  return { ...PayData, id: response.data.head.id }; // Return updated data with ID
};

// Delete Pay entry by ID
export const deletePayApi = async (id) => {
  const payload = {
    action: "deletePay",
    id: id,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  return id; // Return the deleted entry's ID
};
