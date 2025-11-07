import axiosInstance from "../config/API";
const API_ENDPOINT = "/report.php";

// Fetch Company Payroll Report
export const fetchCompanyPayrollReportApi = async (data) => {
  const payload = {
    action: "listCompanyPayrollReport",
    from_date: data.from_date,
    to_date: data.to_date,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("Company Payroll Report:", response.data.body);
  return response.data.body;
};
