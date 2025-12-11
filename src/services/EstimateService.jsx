// import axiosInstance from "../config/API";

// const API_ENDPOINT = "/estimates.php";

// export const searchEstimatesApi = async (searchText = "") => {
//   const payload = { search_text: searchText };
//   const response = await axiosInstance.post(API_ENDPOINT, payload);
//   const { data } = response;

//   if (data.head?.code !== 200) {
//     throw new Error(data.head?.msg || "Failed to search estimate");
//   }

//   return data.body.estimates || [];
// };

// export const createEstimateApi = async (estimateData) => {
//   const payload = { ...estimateData };
//   delete payload.edit_estimate_id;

//   const response = await axiosInstance.post(API_ENDPOINT, payload);
//   const { data } = response;

//   if (data.head?.code !== 200) {
//     throw new Error(data.head?.msg || "Failed to create estimate");
//   }

//   return data;
// };

// export const updateEstimateApi = async (estimateData) => {
//   const payload = { ...estimateData, edit_estimates_id: estimateData.edit_estimates_id };

//   const response = await axiosInstance.post(API_ENDPOINT, payload);
//   const { data } = response;

//   if (data.head?.code !== 200) {
//     throw new Error(data.head?.msg || "Failed to update estimate");
//   }

//   return data;
// };

// export const deleteEstimateApi = async (estimateId) => {
//   const payload = { delete_estimates_id: estimateId };

//   const response = await axiosInstance.post(API_ENDPOINT, payload);
//   const { data } = response;

//   if (data.head?.code !== 200) {
//     throw new Error(data.head?.msg || "Failed to delete estimate");
//   }

//   return data;
// };

// export const fetchPartiesApi = async (searchText = "") => {
//   const payload = { search_text: searchText };
//   const partiesEndpoint = API_ENDPOINT.replace("estimate.php", "parties.php");

//   const response = await axiosInstance.post(partiesEndpoint, payload);
//   const { data } = response;

//   if (data.head?.code !== 200) {
//     throw new Error(data.head?.msg || "Failed to fetch parties");
//   }

//   return data.body.parties || [];
// };


import axiosInstance from "../config/API";

const API_ENDPOINT = "/estimates.php";  // CHANGED: from /estimate.php to /estimates.php

export const searchEstimatesApi = async (searchText = "") => {
  const payload = { search_text: searchText };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to search estimate");
  }

  return data.body.estimates || [];  // CHANGED: from estimate to estimates
};

export const createEstimateApi = async (estimateData) => {
  const payload = { ...estimateData };
  
  // Make sure we're not sending edit_id for create
  delete payload.edit_estimates_id;

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to create estimate");
  }

  return data;
};

export const updateEstimateApi = async (estimateData) => {
  const payload = { 
    ...estimateData, 
    edit_estimates_id: estimateData.edit_estimates_id 
  };

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to update estimate");
  }

  return data;
};

export const deleteEstimateApi = async (estimateId) => {
  const payload = { delete_estimates_id: estimateId };

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to delete estimate");
  }

  return data;
};

export const fetchPartiesApi = async (searchText = "") => {
  const payload = { search_text: searchText };
  const response = await axiosInstance.post("/parties.php", payload);  // Direct endpoint
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to fetch parties");
  }

  return data.body.parties || [];
};
