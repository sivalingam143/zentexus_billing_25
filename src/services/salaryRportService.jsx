import axiosInstance from "../config/API";
const API_ENDPOINT = "/report.php";

// Fetch all users
export const fetchSalaryReportApi = async (data) => {
  const payload = {
    action: "listCoolieReport",
    from_date : data.from_date,
    to_date : data.to_date
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("fetch coolie report :", response.data.body);
  return response.data.body;
};
