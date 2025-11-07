import axiosInstance from "../config/API";
const API_ENDPOINT = "/staff.php";

// Fetch all users
export const fetchStaffApi = async () => {
  const payload = {
    action: "listStaff",
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("fetch staff :", response.data.body.staff);
  return response.data.body.staff;
};

// Add a new user
export const addStaffApi = async (staffData) => {
  const payload = {
    action: "addStaff",
    Name: staffData.Name,
    Mobile_Number: staffData.MobileNumber,
    Place: staffData.Place,
    Staff_Type: staffData.StaffType,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("add staff :", response.data);
  return response.data.head.staff;
};

// Update a user by ID
export const updateStaffApi = async (staffData) => {
  const payload = {
    action: "updateStaff",
    staff_id: staffData.id,
    Name: staffData.Name,
    Mobile_Number: staffData.MobileNumber,
    Place: staffData.Place,
    Staff_Type: staffData.StaffType,
  };
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  console.log("update response", response.data);
  return response.data.head.id; // Corrected response structure
};

// Delete a user by ID
export const deleteStaffApi = async (id) => {
  const payload = {
    action: "deleteStaff",
    delete_staff_id: id,
  };
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  return id; // Return the user ID for successful deletion
};
