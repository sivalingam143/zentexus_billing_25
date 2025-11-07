import axiosInstance from "../config/API";

const API_ENDPOINT = "/explosive_payroll.php";

// Fetch all explosive payroll records
export const fetchExplosivePayrollApi = async () => {
  const payload = {
    action: "list_explosive_payroll",
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("fetch explosive payroll:", response.data.body.explosive_payroll);
  return response.data.body.explosive_payroll; // Returns array of payroll records
};

// Add a new explosive payroll record
export const addExplosivePayrollApi = async (payrollData) => {
  const payload = {
    action: "addexplosivepayroll",
    entry_date: payrollData.entry_date,
    staff_id: payrollData.staff_id,
    products: payrollData.products, // Expected as an array/object, will be JSON-encoded in backend
    total: payrollData.total,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("add explosive payroll:", response.data);
  return response.data.head.explosivePayroll; // Returns the updated list of payroll records
};

// Update an explosive payroll record by ID
export const updateExplosivePayrollApi = async (payrollData) => {
  const payload = {
    action: "update_explosive_payroll",
    id: payrollData.id,
    staff_id: payrollData.staff_id,
    products: payrollData.products, // Expected as an array/object
    total: payrollData.total,
  };
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  console.log("update explosive payroll:", response.data.head);
  return response.data.head.id; // Returns the updated record ID
};

// Delete an explosive payroll record by ID
export const deleteExplosivePayrollApi = async (id) => {
  const payload = {
    action: "delete_explosive_ayroll", // Note: Typo in backend ("ayroll" instead of "payroll")
    id: id,
  };
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  console.log("delete explosive payroll:", response.data);
  return id; // Returns the deleted ID on success
};
