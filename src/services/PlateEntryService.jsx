import axiosInstance from "../config/API";
const API_ENDPOINT = "/plate_entry.php";

// Fetch all plateentry
export const fetchPlateEntryApi = async () => {
  const payload = {
    action: "listplateentry"
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("fetch plateentry :", response.data.body.plateentry);
  return response.data.body.plateentry;
};

// Add a new plateentry
export const addPlateEntryApi = async (plateentryData) => {
  const payload = {
    action: "addPlateEntery",
    entry_date: plateentryData.entry_date,
    entry_count: plateentryData.entry_count
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("add plateentry :", response.data);
  return response.data.head.plateentry;
};

// Update a plateentry by ID
export const updatePlateEntryApi = async (plateentryData) => {
  const payload = {
    action: "updatePlateEntry",
    id: plateentryData.id,
    entry_date: plateentryData.entry_date,
    entry_count: plateentryData.entry_count
  };
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  console.log("update response", response.data.head);
  return response.data.head.id; // Corrected response structure
};

// Delete a user by ID
export const deletePlateEntryApi = async (id) => {
  const payload = {
    action: "deletePlateEntry",
    id: id,
  };
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  return id; // Return the user ID for successful deletion
};
