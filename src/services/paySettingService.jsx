import axiosInstance from "../config/API";
const API_ENDPOINT = "/product.php";

// Fetch all pay settings
export const fetchPaySettingApi = async () => {
  const payload = {
    action: "listPaySetting",
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("fetch pay setting:", response.data.body.paySetting);
  return response.data.body.paySetting; // Returns array of settings
};

// Update pay setting by ID
export const updatePaySettingApi = async (settingData) => {
  const payload = {
    action: "updatePaySetting",
    id: settingData.id,
    pay_setting_cooly_one: settingData.pay_setting_cooly_one,
    pay_setting_cooly_two: settingData.pay_setting_cooly_two,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("update response:", response.data);
  if (response.data.head.code !== 200) {
    throw new Error(response.data.head.msg);
  }
  return {
    id: response.data.body.id,
    pay_setting_cooly_one: settingData.pay_setting_cooly_one,
    pay_setting_cooly_two: settingData.pay_setting_cooly_two,
  }; // Return updated data
};
