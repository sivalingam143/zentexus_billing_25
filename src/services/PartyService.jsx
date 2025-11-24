// services/PartyService.js
import axiosInstance from "../config/API";

const PARTIES_ENDPOINT = "/parties.php";

const checkResponse = (data, defaultMsg = "Operation failed") => {
  if (!data?.head || data.head.code !== 200) {
    throw new Error(data?.head?.msg || defaultMsg);
  }
};

// Search Parties + Sales together
export const searchAll = async (searchText = "") => {
  const payload = { search_text: searchText.trim() };

  const { data } = await axiosInstance.post(PARTIES_ENDPOINT, payload);
  checkResponse(data, "Search failed");

  // PHP returns: { body: { parties: [...], sales: [...] } }
  return {
    parties: data.body?.parties || [],
    sales: data.body?.sales || [],
  };
};

// Create new party
export const addParty = async (partyData) => {
  const payload = {
    ...partyData,
    transactionType: partyData.transactionType || "receive", // default
  };

  const { data } = await axiosInstance.post(PARTIES_ENDPOINT, payload);
  checkResponse(data, "Failed to create party");
  return data; // success message in head.msg
};

// Update party
export const updateParty = async (partyData) => {
  const payload = {
    ...partyData,
    edit_parties_id: partyData.parties_id, // Required by PHP
  };

  const { data } = await axiosInstance.post(PARTIES_ENDPOINT, payload);
  checkResponse(data, "Failed to update party");

  return partyData; // return updated object for UI
};

// Delete party (soft delete)
export const deleteParty = async (parties_id) => {
  const payload = { delete_parties_id: parties_id };

  const { data } = await axiosInstance.post(PARTIES_ENDPOINT, payload);
  checkResponse(data, "Failed to delete party");

  return parties_id;
};