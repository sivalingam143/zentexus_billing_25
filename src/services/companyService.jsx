import axiosInstance from "../config/API";
const API_ENDPOINT = "/company_payroll.php";

// Fetch all company payroll entries
export const fetchCompanyApi = async () => {
  try {
    const payload = { action: "listCompanyPayroll" };
    const response = await axiosInstance.post(API_ENDPOINT, payload);

    console.log("fetch company:", response.data.body.company_payroll);
    return response.data.body.company_payroll;
  } catch (error) {
    console.error("Error fetching company payroll:", error);
    return [];
  }
};

// Add a new company payroll entry
export const addCompanyApi = async (companyData) => {
  try {
    const payload = {
      action: "addCompanyPayroll",
      date: companyData.date,
      data: companyData.data,
    };

    const response = await axiosInstance.post(API_ENDPOINT, payload);
    console.log("add company:", response.data);

    return response.data.body.company_payroll;
  } catch (error) {
    console.error("Error adding company payroll:", error);
    return null;
  }
};

// Update a company payroll entry by ID
export const updateCompanyApi = async (companyData) => {
  try {
    const payload = {
      action: "updateCompanyPayroll",
      id: companyData.id,
      date: companyData.date,
      data: companyData.data,
    };

    const response = await axiosInstance.post(API_ENDPOINT, payload);
    console.log("update response:", response.data);

    return response.data.body.company_payroll;
  } catch (error) {
    console.error("Error updating company payroll:", error);
    return null;
  }
};

// Delete a company payroll entry by ID
export const deleteCompanyApi = async (id) => {
  try {
    const payload = { action: "deleteCompanyPayroll", id };
    const response = await axiosInstance.post(API_ENDPOINT, payload);
    console.log("delete response:", response.data);

    return id;
  } catch (error) {
    console.error("Error deleting company payroll:", error);
    return null;
  }
};
