import axios from "axios";

const BASE_URL = "http://localhost/zentexus_billing_api"; // WAMP backend folder



// Fetch all parties
// ADD searchText parameter and send it in the POST request body
export const getParties = async (searchText = "") => {
  try {
    const response = await axios.post(`${BASE_URL}/parties.php`, {
      search_text: searchText, // <-- FIX: Send the required parameter
    });
    return response.data; // should be an array of parties
  } catch (error) {
    console.error("Error fetching parties:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch parties");
  }
};

// Add new party
export const addParty = async (party) => {
  try {
    const response = await axios.post(`${BASE_URL}/parties.php`, party, {
      headers: { "Content-Type": "application/json" },
    });
    // return the actual party object with the ID returned by PHP
    return { ...party, id: response.data.id || Date.now() };
  } catch (error) {
    console.error("Error adding party:", error);
    throw new Error(error.response?.data?.message || "Failed to add party");
  }
};

// Update existing party
export const updateParty = async (party) => {
  try {
    const response = await axios.post(`${BASE_URL}/parties.php`, {
      ...party, // Contains all party data
      edit_parties_id: party.parties_id, // PHP expects this specific key for editing
    });
    console.log("Update party response:", response);

    console.log("Update response:", response.data);
    if (response.data.head.code !== 200) {
      throw new Error(response.data.head.msg || "server to update party");
    }

    // Return the updated party object
    return party;
  } catch (error) {
    console.error("Error updating party:", error);
    throw new Error(error.response?.data?.head?.msg || "Failed to update party");
  }
};

// Delete party
export const deleteParty = async (parties_id) => {
  try {
    const response = await axios.post(`${BASE_URL}/parties.php`, {
      delete_parties_id: parties_id, // PHP expects this specific key for deletion
    });
     console.log("Update party response:", response);

    if (response.data.head.code !== 200) {
      throw new Error(response.data.head.msg || "Failed to delete party");
    }

    // Return the ID of the deleted party for Redux to remove it from the state
    return parties_id;
  } catch (error) {
    console.error("Error deleting party:", error);
    throw new Error(error.response?.data?.head?.msg || "Failed to delete party");
  }
};