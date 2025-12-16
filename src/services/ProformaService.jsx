import axiosInstance from "../config/API";

const API_ENDPOINT = "/proforma.php";

export const searchProformaApi = async (searchText = "") => {
  const payload = { search_text: searchText };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to search proforma");
  }

  return data.body.proforma || [];
};

export const createProformaApi = async (ProformaData) => {
  const payload = { ...ProformaData };
  delete payload.edit_Proforma_id;

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to create proforma");
  }

  return data;
};

export const updateProformaApi = async (ProformaData) => {
  const payload = { ...ProformaData, edit_Proforma_id: ProformaData.edit_Proforma_id };

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to update proforma");
  }

  return data;
};

export const deleteProformaApi = async (ProformaId) => {
  const payload = { delete_Proforma_id: ProformaId };

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to delete Proforma");
  }

  return data;
};

export const fetchPartiesApi = async (searchText = "") => {
  const payload = { search_text: searchText };
  const partiesEndpoint = API_ENDPOINT.replace("Proforma.php", "parties.php");

  const response = await axiosInstance.post(partiesEndpoint, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to fetch parties");
  }

  return data.body.parties || [];
};
