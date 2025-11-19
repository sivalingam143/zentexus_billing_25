import axios from "axios";
const API_URL = "http://localhost/zentexus_billing_api";
//const API_URL = "http://localhost/zentexus_billing_api/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  mode: "no-cors",
});

export default axiosInstance;
