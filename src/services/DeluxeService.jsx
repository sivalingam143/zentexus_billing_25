import axiosInstance from "../config/API";
const API_ENDPOINT = "/deluxe.php";

// Fetch all deluxe
export const fetchdeluxeApi = async () => {
  const payload = {
    action: "listdeluxe",
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("fetch listdeluxe :", response.data.body.deluxePayroll);
  return response.data.body.deluxePayroll;
};

// Add a new deluxe
export const adddeluxeApi = async (deluxeData) => {
  const payload = {
    action: "adddeluxePayroll",
    entry_date: deluxeData.entry_date,
    staff_id: deluxeData.staff_id,
    products: deluxeData.products,
    total: deluxeData.total,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("add adddeluxe :", response.data);
  return response.data.head.deluxePayroll;
};

// Update a deluxe by ID
export const updatedeluxeApi = async (deluxeData) => {
  const payload = {
    action: "updatedeluxePayroll",
    id: deluxeData.id,
    staff_id: deluxeData.staff_id,
    products: deluxeData.products,
    total: deluxeData.total,
  };
  console.log(payload, "pay");
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  console.log("update response", response.data.head);
  return response.data.head.id; // Corrected response structure
};

// Delete a user by ID
export const deletedeluxeApi = async (id) => {
  const payload = {
    action: "deletedeluxePayroll",
    id: id,
  };
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  console.log(response);
  return id; // Return the user ID for successful deletion
};
