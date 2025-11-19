// // src/services/ItemService.js 

// import axios from 'axios';

// // ⚠️ IMPORTANT: Update this URL to your actual backend API location
// const BASE_URL = 'http://localhost/zentexus_billing_api'; 
// const UNIT_URL = `${BASE_URL}/unit.php`; // Define the specific unit endpoint


// /**
//  * Sends a POST request to add a new item (product or service) to the backend.
//  * * @param {object} itemData - The item data payload from the frontend.
//  * @returns {object} The response data, including the new item's ID.
//  */
// export const addItem = async (itemData) => {
//   try {
//     const response = await axios.post(UNIT_URL, itemData); // Note: Original was /unit.php
    
//     // Check for success code from PHP response structure
//     if (response.data.head.code !== 200) {
//       throw new Error(response.data.head.msg || "Server failed to add item.");
//     }
    
//     // Return the response data (which should contain the new item's ID)
//     return { ...itemData, id: response.data.id }; 
    
//   } catch (error) {
//     console.error("Error adding item:", error.response?.data || error.message);
//     // Throw a specific error message to be caught by the Redux thunk
//     throw new Error(error.response?.data?.head?.msg || "Failed to connect to the item service.");
//   }
// };

// /**
//  * Sends a GET request to fetch all available units.
//  * @returns {Array} An array of unit objects ({unit_name, short_name, ...}).
//  */
// export const fetchUnits = async () => {
//     try {
//         const response = await axios.get(UNIT_URL);

//         if (response.data.head.code !== 200) {
//             // Even if no units are found, the PHP returns 200 with default units
//             // This is for a real server error
//             throw new Error(response.data.head.msg || "Server failed to fetch units.");
//         }

//         // The PHP file returns the list under response.data.body.units
//         return response.data.body.units || [];

//     } catch (error) {
//         console.error("Error fetching units:", error.response?.data || error.message);
//         throw new Error(error.response?.data?.head?.msg || "Failed to connect to the unit service.");
//     }
// };

// // 💡 The AddUnit component will use 'fetch' directly for simplicity and to
// // follow the existing pattern in the provided AddUnit.jsx.
// // But using these service functions is the recommended pattern.





// src/services/ItemService.js 

import axios from 'axios';

// ⚠️ IMPORTANT: Update this URL to your actual backend API location
const BASE_URL = 'http://localhost/zentexus_billing_api'; 
const UNIT_URL = `${BASE_URL}/unit.php`;
const CATEGORY_URL = `${BASE_URL}/category.php`; // <-- NEW: Category Endpoint

/**
 * Sends a POST request to add a new item (product or service) to the backend.
 * * @param {object} itemData - The item data payload from the frontend.
 * @returns {object} The response data, including the new item's ID.
 */
export const addItem = async (itemData) => {
  try {
    // Note: Original was /unit.php, if this is for adding items, the URL should be /items.php or similar
    // Assuming for now it remains UNIT_URL based on the previous file content structure.
    const response = await axios.post(UNIT_URL, itemData); 
    
    // Check for success code from PHP response structure
    if (response.data.head.code !== 200) {
      throw new Error(response.data.head.msg || "Server failed to add item.");
    }
    
    // Return the response data (which should contain the new item's ID)
    return { ...itemData, id: response.data.id }; 
    
  } catch (error) {
    console.error("Error adding item:", error.response?.data || error.message);
    // Throw a specific error message to be caught by the Redux thunk
    throw new Error(error.response?.data?.head?.msg || "Failed to connect to the item service.");
  }
};


/**
 * Sends a GET request to fetch all available units.
 * @returns {Array} An array of unit objects ({unit_name, short_name, ...}).
 */
    // export const fetchUnits = async () => {
    //     try {
    //         const response = await axios.post(UNIT_URL);
    // console.log("response",response);
    //         if (response.data.head.code !== 200) {
    //             throw new Error(response.data.head.msg || "Server failed to fetch units.");
    //         }

    //         // The PHP file returns the list under response.data.body.units
    //         return response.data.body.units || [];

    //     } catch (error) {
    //         console.error("Error fetching units:", error.response?.data || error.message);
    //         throw new Error(error.response?.data?.head?.msg || "Failed to connect to the unit service.");
    //     }
    // };
export const fetchUnits = async (searchText = "") => {
  try {
    const response = await axios.post(`${BASE_URL}/unit.php`, {
      search_text: searchText, // <-- FIX: Send the required parameter
    });
    console.log("response56656",response)
   return response.data.body.units || [];// should be an array of parties
  } catch (error) {
    console.error("Error fetching parties:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch parties");
  }
};
/**
 * Sends a POST request to create a new category.
 * @param {object} categoryData - The category data payload ({category_name}).
 * @returns {object} The response data, including the new category's ID.
 */
export const createCategory = async (categoryData) => {
    try {
        const response = await axios.post(CATEGORY_URL, categoryData);
        
        if (response.data.head.code !== 200) {
            throw new Error(response.data.head.msg || "Server failed to create category.");
        }
        
        return { ...categoryData, ...response.data.body }; 
        
    } catch (error) {
        console.error("Error creating category:", error.response?.data || error.message);
        throw new Error(error.response?.data?.head?.msg || "Failed to connect to the category service.");
    }
};
export const fetchCategories = async (searchText = "") => {
  try {
    const response = await axios.post(`${BASE_URL}/category.php`, {
      search_text: searchText, // <-- FIX: Send the required parameter
    });
    console.log("response56656",response)
   return response.data.body.categories || [];// should be an array of parties
  } catch (error) {
    console.error("Error fetching parties:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch parties");
  }
};

// export const fetchCategories = async () => { 
//     try {
//         // Keeps the existing axios.post(CATEGORY_URL) call for fetching the list.
//         // It sends an empty body, which the updated PHP script is now designed to handle.
//         const response = await axios.post(CATEGORY_URL); 
//         console.log("response",response);

//         if (response.data.head.code !== 200) {
//             throw new Error(response.data.head.msg || "Server failed to fetch categories.");
//         }

//         // Expects 'categories' key from the updated PHP response.
//         return response.data.body.categories || []; 

//     } catch (error) {
//         console.error("Error fetching categories:", error.response?.data || error.message);
//         throw new Error(error.response?.data?.head?.msg || "Failed to connect to the category service.");
//     }
// };

/**
 * Sends a GET request to fetch all available categories.
 * @returns {Array} An array of category objects ({category_name, id, category_id}).
 */
// export const fetchCategories = async () => { 
//     try {
//         const response = await axios.post(CATEGORY_URL);
// console.log("response",response);
//         if (response.data.head.code !== 200) {
//             throw new Error(response.data.head.msg || "Server failed to fetch categories.");
//         }

//         return response.data.body.categories || [];

//     } catch (error) {
//         console.error("Error fetching categories:", error.response?.data || error.message);
//         throw new Error(error.response?.data?.head?.msg || "Failed to connect to the category service.");
//     }
// };