// src/services/unitService.js
import axiosInstance from "../config/API";

const API_ENDPOINT = "/unit.php";

export const fetchUnitsApi = async (searchText = "") => {
  const payload = { search_text: searchText };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to fetch units");
  }

  return data.body?.units || [];
};

export const createUnitApi = async (unitData) => {
  const payload = {
    unit_name: unitData.unit_name,
    short_name: unitData.short_name || "",
  };

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to create unit");
  }

  return data;
};

export const updateUnitApi = async (unitData) => {
  const payload = {
    edit_unit_id: unitData.unit_id,
    unit_name: unitData.unit_name,
    short_name: unitData.short_name || "",
  };

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to update unit");
  }

  return data;
};

export const deleteUnitApi = async (unit_id) => {
  const payload = { delete_unit_id: unit_id };

  const response = await axiosInstance.post(API_ENDPOINT, payload);
  const { data } = response;

  if (data.head?.code !== 200) {
    throw new Error(data.head?.msg || "Failed to delete unit");
  }

  return data;
};