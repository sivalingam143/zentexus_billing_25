import axiosInstance from "../config/API";
const API_ENDPOINT = "/report.php";

// Fetch all users
export const fetchReportApi = async () => {
  const payload = {
    action: "listStocks",
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("fetch report :", response.data.body);
  return response.data.body;
};
