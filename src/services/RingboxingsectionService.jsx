import axiosInstance from "../config/API";

const API_ENDPOINT = "/ring_boxing.php";

// Fetch all ring boxing records
export const fetchringboxingApi = async () => {
  const payload = { action: "listRingBoxing" };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("fetch ringboxing:", response.data.body.ringBoxing);
  return response.data.body.ringBoxing; // Array of records
};

// Add a new ring boxing record
export const addringboxingApi = async (ringboxingData) => {
  const payload = {
    action: "addRingBoxing",
    entry_date: ringboxingData.entry_date,
    staff_id: ringboxingData.staff_id,
    products: ringboxingData.products, // Stringify the products array
    total: ringboxingData.total,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("add ringboxing:", response.data);
  return response.data.head.ringBoxing; // Returns updated list
};

// Update a ring boxing record by ID
export const updateringboxingApi = async (ringboxingData) => {
  const payload = {
    action: "updateRingBoxing",
    id: ringboxingData.id,
    entry_date: ringboxingData.entry_date,
    staff_id: ringboxingData.staff_id,
    products: ringboxingData.products, // Stringify the products array
    total: ringboxingData.total,
  };
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  console.log("update ringboxing:", response.data.head);
  return response.data.head.id; // Returns updated record
};

// Delete a ring boxing record by ID
export const deleteringboxingApi = async (id) => {
  const payload = { action: "deleteRingBoxing", id };
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  console.log("delete ringboxing:", response.data);
  return id; // Returns deleted ID
};
