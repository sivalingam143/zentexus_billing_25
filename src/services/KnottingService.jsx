import axiosInstance from "../config/API";
const API_ENDPOINT = "/knotting_payroll.php";

// Fetch all knotting
export const fetchknottingApi = async () => {
  const payload = {
    action: "listknotting",
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("fetch listKnotting :", response.data.body.knottingPayroll);
  return response.data.body.knottingPayroll;
};

// Add a new knotting
export const addknottingApi = async (knottingData) => {
  const payload = {
    action: "addKnottingPayroll",
    entry_date: knottingData.entry_date,
    staff_id: knottingData.staff_id,
    products: knottingData.products,
    total: knottingData.total,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("add addknotting :", response.data);
  return response.data.head.knottingPayroll;
};

// Update a knotting by ID
export const updateknottingApi = async (knottingData) => {
  const payload = {
    action: "updateKnottingPayroll",
    id: knottingData.id,
    entry_date: knottingData.entry_date,
    staff_id: knottingData.staff_id,
    products: knottingData.products,
    total: knottingData.total,
  };
  console.log(payload, "pay");
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  console.log("update response", response.data.head);
  return response.data.head.id; // Corrected response structure
};

// Delete a user by ID
export const deleteknottingApi = async (id) => {
  const payload = {
    action: "deleteKnottingPayroll",
    id: id,
  };
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  console.log(response);
  return id; // Return the user ID for successful deletion
};
