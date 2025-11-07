import axiosInstance from "../config/API";
const API_ENDPOINT = "/packing_payroll.php";

// Fetch all packing
export const fetchpackingApi = async () => {
  const payload = {
    action: "listpacking_payroll",
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("fetch listpacking :", response.data.body.packingPayroll);
  return response.data.body.packingPayroll;
};

// Add a new packing
export const addpackingApi = async (packingData) => {
  const payload = {
    action: "addPackingPayroll",
    entry_date: packingData.entry_date,
    staff_id: packingData.staff_id,
    products: packingData.products,
    total: packingData.total,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("add addpacking :", response.data);
  return response.data.head.packingPayroll;
};

// Update a plateentry by ID
export const updatepackingApi = async (packingData) => {
  const payload = {
    action: "updatePackingPayroll",
    id: packingData.id,
    entry_date: packingData.entry_date,
    staff_id: packingData.staff_id,
    products: packingData.products,
    total: packingData.total,
  };
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  console.log("update response", response.data.head);
  return response.data.head.id; // Corrected response structure
};

// Delete a user by ID
export const deletepackingApi = async (id) => {
  const payload = {
    action: "deletePackingPayroll",
    id: id,
  };
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  return id; // Return the user ID for successful deletion
};
