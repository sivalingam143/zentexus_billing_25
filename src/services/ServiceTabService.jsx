// src/services/serviceTabService.js
import axiosInstance from "../config/API";

const API_ENDPOINT = "/service.php";

export const fetchServicesApi = async (searchText = "") => {
  const payload = { search_text: searchText };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to fetch services");
  }
  return data.body?.services || [];
};

export const createServiceApi = async (serviceData) => {
  const response = await axiosInstance.post(API_ENDPOINT, serviceData);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to create service");
  }

  // Return full service row if PHP returns body.service
  return data.body?.service || data.body;
};


export const updateServiceApi = async (serviceData) => {
  const response = await axiosInstance.post(API_ENDPOINT, serviceData);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to update service");
  }
  return data;
};

export const deleteServiceApi = async (service_code) => {
  const payload = { delete_service_id: service_code };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to delete service");
  }
  return data;
};