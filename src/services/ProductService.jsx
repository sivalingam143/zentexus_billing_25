import axiosInstance from "../config/API";
const API_ENDPOINT = "/product.php";

// Fetch all users
export const fetchProductApi = async (searchText = "") => {
  const payload = {
    action: "listProduct",
    search_text: searchText,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("fetch product :", response.data.body.products);
  return response.data.body.products;
};

// Add a new user
export const addProductApi = async (productData) => {
  console.log("Product Data Sent:", productData);
  const payload = {
    action: "createProduct",
    product_name: productData.product_name,
    Knitting_wage: productData.Knitting_wage,
    deluxe_Knitting_wage: productData.deluxe_Knitting_wage,

    packing_cooly: productData.packing_cooly,
    unit_cooly: productData.unit_cooly,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("add product response:", response.data);
  return response.data.products; // Return the newly created product
};

// Update a user by ID
export const updateProductApi = async (productData) => {
  const payload = {
    action: "updateProductInfo",
    edit_Product_id: productData.id,
    product_name: productData.product_name,
    Knitting_wage: productData.Knitting_wage,
    deluxe_Knitting_wage: productData.deluxe_Knitting_wage,
    packing_cooly: productData.packing_cooly,
    unit_cooly: productData.unit_cooly,
  };
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  console.log("update response", response.data);
  return response.data.id; // Corrected response structure
};

// Delete a user by ID
export const deleteProductApi = async (id) => {
  const payload = {
    action: "deleteProduct",
    delete_Product_id: id,
  };
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  return id; // Return the user ID for successful deletion
};
