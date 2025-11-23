// services/PartyService.js

import axiosInstance from "../config/API";

const PARTIES_ENDPOINT = "/parties.php";
const SALES_ENDPOINT = "/sales.php";

const checkApiResponse = (data, defaultMsg) => {
  if (data.head && data.head.code !== 200) {
    throw new Error(data.head.msg || defaultMsg);
  }
};

export const hitSalesApi = async (searchText) => {
  const payload = {
    search_text: searchText || "",
  };

  try {
    // This is the direct hit to sales.php the user requested.
    await axiosInstance.post(SALES_ENDPOINT, payload);
  } catch (error) {
    // Ignore errors for this non-critical side effect request
    console.warn("Sales hit failed (network trace):", error);
  }
};

export const getParties = async (searchText = "") => {
  const payload = {
    search_text: searchText || "",
    t: Date.now()
  };

  const response = await axiosInstance.post(PARTIES_ENDPOINT, payload);
  const data = response.data;

  checkApiResponse(data, "Failed to fetch parties");

  // THIS IS THE KEY: parties.php ALREADY ADDED transactions via cURL
  // SO JUST RETURN IT — DO NOT TOUCH OR MAP AGAIN!
  return data.body?.parties || [];
};


// Remove hitSalesApi if not needed — it's useless now

export const addParty = async (partyData) => {
  const payload = { ...partyData };
  const response = await axiosInstance.post(PARTIES_ENDPOINT, payload);
  const data = response.data;
  checkApiResponse(data, "Failed to add party");
  return data;
};

export const updateParty = async (partyData) => {
  const payload = {
    ...partyData,
    edit_parties_id: partyData.id || partyData.parties_id,
  };
  const response = await axiosInstance.post(PARTIES_ENDPOINT, payload);
  const data = response.data;
  checkApiResponse(data, "Failed to update party");
  return partyData;
};

export const deleteParty = async (parties_id) => {
  const payload = { delete_parties_id: parties_id };
  const response = await axiosInstance.post(PARTIES_ENDPOINT, payload);
  const data = response.data;
  checkApiResponse(data, "Failed to delete party");
  return parties_id;
};