import axiosInstance from "../config/API";
const API_ENDPOINT = "/product.php";

// Fetch all users
export const fetchSettingApi = async () => {
  const payload = {
    action: "listSetting",
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("fetch setting :", response.data.body.setting);
  return response.data.body.setting;
};

// Update a user by ID
export const updateSettingApi = async (settingData) => {
  const payload = {
    action: "updateSetting",
    id: settingData.id,
    sorcha_cooly: settingData.sorcha_cooly,
    giant_cooly: settingData.giant_cooly,
    thiri_sorcha_cooly: settingData.thiri_sorcha_cooly,
    thiri_giant_cooly: settingData.thiri_giant_cooly,
  };
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  console.log("update response", response.data);
  return response.data.head.id; // Backend returns updated id
};
