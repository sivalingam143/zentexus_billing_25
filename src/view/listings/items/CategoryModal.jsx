// // AddCategoryModal.jsx
// import React from "react";
// import { Modal, Button, Form } from "react-bootstrap";

// function AddCate({ show, onHide }) {
// //   const [categoryName, setCategoryName] = useState("");

// //   const handleCreate = () => {
// //     if (categoryName.trim() === "") return;
// //     console.log("Category created:", categoryName);
// //     setCategoryName("");
// //     onHide();
// //   };

//   return (
//     <Modal show={show} onHide={onHide} centered backdrop="static" dialogClassName="category" >
     
// <Modal.Header className="border-0 d-flex justify-content-between align-items-center p-3">
//   <Modal.Title className="fw-bold m-0">Add Category</Modal.Title>
//   <Button variant="light" className="text-dark fs-3 p-0 m-3" onClick={onHide}>
//     ×
//   </Button>
// </Modal.Header>
//       <Modal.Body>
//         <Form.Group>
//           <Form.Label className="text-muted">Enter Category Name</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="e.g. Groceries"
//             className="bg-white "
//             // value={categoryName}
//             // onChange={(e) => setCategoryName(e.target.value)}
//           />
//         </Form.Group>
//       </Modal.Body>

//       <Modal.Footer className="border-0 align-items-center justify-content-center p-4 ">
//         <Button
//           variant="danger"
//         //   onClick={handleCreate}
//           style={{ borderRadius: "20px" ,alignItems:"center",width:"80%",padding:"10px"}}
//         >
//           Create
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }

// export default AddCate;






// AddCate.jsx - Add state, handleSave, and API call

// import React, { useState } from "react";
// import { Modal, Button, Form } from "react-bootstrap";
// import axios from 'axios'; // Ensure axios is installed/imported
// // ⚠️ IMPORTANT: Base URL must match your ItemService.jsx BASE_URL
// const BASE_URL = 'http://localhost/zentexus_billing_api'; 

// // Accept onSaveSuccess prop to refetch the list in Items.jsx
// function AddCate({ show, onHide, onSaveSuccess }) {
//   const [categoryName, setCategoryName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSave = async () => {
//     setError(null);
//     const trimmedName = categoryName.trim();

//     if (!trimmedName) {
//       setError("Category Name is required.");
//       return;
//     }
    
//     setLoading(true);

//     try {
//       const payload = { category_name: trimmedName };
      
//       // Make POST request to the new PHP endpoint
//       const response = await axios.post(`${BASE_URL}/category.php`, payload);
      
//       if (response.data.head.code !== 200) {
//         throw new Error(response.data.head.msg || "Failed to save category.");
//       }
      
//       // Success! Clear state and trigger a list refresh
//       setCategoryName("");
//       onSaveSuccess && onSaveSuccess(); 
//       onHide();

//     } catch (err) {
//       // Display the error message from the PHP backend
//       const errMsg = err.response?.data?.head?.msg || err.message;
//       setError(errMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide} centered backdrop="static" dialogClassName="category">
//       <Modal.Header className="border-0 d-flex justify-content-between align-items-center p-3">
//         <Modal.Title className="fw-bold m-0">Add Category</Modal.Title>
//         <Button variant="light" className="text-dark fs-3 p-0 m-3" onClick={onHide}>
//           ×
//         </Button>
//       </Modal.Header>
//       <Modal.Body>
//         <Form.Group>
//           <Form.Label className="text-muted">Enter Category Name</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="e.g. Groceries"
//             className="bg-white"
//             value={categoryName}
//             onChange={(e) => setCategoryName(e.target.value)}
//             disabled={loading}
//           />
//           {error && <p className="text-danger mt-2">{error}</p>}
//         </Form.Group>
//       </Modal.Body>

//       <Modal.Footer className="border-0 align-items-center justify-content-center p-4">
//         <Button 
//           variant="primary" 
//           onClick={handleSave} 
//           disabled={loading}
//         >
//           {loading ? 'Saving...' : 'Save'}
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }

// export default AddCate;






// AddCategoryModal.jsx
import React, { useState } from "react"; 
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { createCategory } from '../../../services/ItemService'; // <-- NEW: Import service

// Accept onSaveSuccess prop to notify parent component on successful save
function AddCate({ show, onHide, onSaveSuccess }) { 
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async (saveAndNew) => {
    if (categoryName.trim() === "") {
        setError("Category Name cannot be empty.");
        return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await createCategory({ category_name: categoryName });
      
      if (onSaveSuccess) {
        onSaveSuccess(); // Refetch categories in parent
      }
      
      if (saveAndNew) {
        setCategoryName("");
        setError(null);
      } else {
        onHide(); // Close modal
      }

    } catch (err) {
      const errMsg = err.message;
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" dialogClassName="category">
     
      <Modal.Header className="border-0 d-flex justify-content-between align-items-center p-3">
        <Modal.Title className="fw-bold m-0">Add Category</Modal.Title>
        <Button variant="light" className="text-dark fs-3 p-0 m-3" onClick={onHide} disabled={loading}>
          ×
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label className="text-muted">Enter Category Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. Groceries"
            className="bg-white"
            value={categoryName}
            onChange={(e) => {
                setCategoryName(e.target.value);
                setError(null);
            }}
            disabled={loading}
          />
          {error && <p className="text-danger mt-2">{error}</p>}
        </Form.Group>
      </Modal.Body>

      <Modal.Footer className="border-0 align-items-center justify-content-center p-4">
        
        <Button 
            variant="danger" 
            onClick={() => handleCreate(false)} // Save
            style={{ borderRadius: "20px" ,alignItems:"center",width:"80%",padding:"10px"}}
            disabled={loading || !categoryName.trim()}
        >
            {loading ? <Spinner animation="border" size="sm" /> : 'create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddCate;