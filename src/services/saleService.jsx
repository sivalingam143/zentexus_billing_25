import axios from "axios";

const API_BASE_URL = "http://localhost/zentexus_billing_api";

// ⭐️ FIX 1: Pass the searchText parameter
export const getParties = async (searchText = "") => {
  try {
    // ⭐️ FIX 2: Send the required search_text payload
    const response = await axios.post(`${API_BASE_URL}/parties.php`, {
        search_text: searchText,
    });
    
    // ⭐️ FIX 3: Parse the complex PHP response structure
    // The structure is: { head: { ... }, body: { parties: [ ... ] } }
    if (response.data && response.data.head.code === 200 && response.data.body && response.data.body.parties) {
    // Return the actual array of parties to Redux/DashboardSale
    return response.data.body.parties; 
}
    
    // If the response is malformed or not successful, return an empty array
    return [];

  } catch (error) {
    console.error("Error fetching parties:", error);
    // Return empty array on network failure
    return []; 
  }
   
  
};

// ----------------- NEW: Update Invoice -----------------
export const addOrUpdateSale = async (salesData) => {
  try {
    // ⭐️ FIX: Use the API_BASE_URL constant for consistency
    const resp = await axios.post(`${API_BASE_URL}/sales.php`, salesData);
    
    // Return the full response from PHP (e.g., { head: { code: 200, msg: "..." } })
    return resp.data;
  } catch(e) {
    console.error("Error saving sale:", salesData);
    // Return a structured error object if the network request fails
    return { head: { code: 500, msg: "Network error occurred. Could not reach API." } };
  }
  
  };

// export const getSales = async () => {
//   try {
//     const res = await fetch("http://localhost/your-api/sales.php"); // adjust API URL
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching sales:", error);
//     return [];
//   }
// };
// Fetch all sales
// saleService.jsx

// ----------------- NEW: Fetch all Sales -----------------
export const getSales = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/sales.php`, {
            // ⭐️ Send the new flag to trigger the sales listing logic in PHP
            list_sales: true, 
        });

        // ⭐️ FIX: Check for the 'sales' key in the response body
        if (response.data && response.data.head.code === 200 && response.data.body && response.data.body.sales) {
            return response.data.body.sales;
        }

        // Return empty array if not successful or no sales found
        return []; 

    } catch (error) {
        console.error("Error fetching sales list:", error);
        return [];
    }
};


// ----------------- NEW: Delete Sale -----------------
export const deleteSale = async (saleId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/sales.php`, {
            // Key must match the PHP check
            delete_sales_id: saleId, 
        });
        
        // Returns PHP response (e.g., { head: { code: 200, msg: "..." } })
        return response.data; 

    } catch (error) {
        console.error("Error deleting sale:", error);
        // Return a structured error object on network failure
        return { head: { code: 500, msg: "Network error occurred. Could not reach API." } };
    }
};


