import axiosInstance from "../config/API";
const API_ENDPOINT = "/parties.php";
const checkApiResponse = (data, defaultMsg) => {
  if (data.head && data.head.code !== 200) {
    throw new Error(data.head.msg || defaultMsg);
  }
};

// Fetch all parties
export const getParties = async (searchText = "") => {
  const payload = {
    search_text: searchText,
  };

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const data = response.data;
  console.log("fetch list", data);
  return data.body.parties;

  checkApiResponse(data, "Failed to fetch parties");
  return data.body.parties;
};

// Add a new party
export const addParty = async (partyData) => {
  const payload = {
    ...partyData,
  };

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const data = response.data;
  checkApiResponse(data, "Failed to add party");
  return data || [partyData];
};

// Update an existing party
export const updateParty = async (partyData) => {
  const payload = {
    ...partyData,
    edit_parties_id: partyData.id || partyData.parties_id, // Ensure correct ID key for edit
  };

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const data = response.data;

  checkApiResponse(data, "Failed to update party");
  console.log("response", data);
  window.location.reload();
  return partyData;
};

// Delete a party
export const deleteParty = async (parties_id) => {
  const payload = {
    delete_parties_id: parties_id,
  };

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const data = response.data;

  checkApiResponse(data, "Failed to delete party");
  console.log("Delete API response:", data);
  return parties_id;
};
