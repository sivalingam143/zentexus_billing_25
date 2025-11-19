
// import React from "react";
// import { Modal, Button, Form, Row, Col } from "react-bootstrap";
// import "./items.css";

// function AddUnit({ show, onHide }) {
// //   const [unitName, setUnitName] = useState("");
// //   const [shortName, setShortName] = useState("");

// //   const handleSave = () => {
// //     if (!unitName.trim() || !shortName.trim()) return;
// //     console.log("Saved:", { unitName, shortName });
// //     setUnitName("");
// //     setShortName("");
// //     onHide();
// //   };

// //   const handleSaveNew = () => {
// //     if (!unitName.trim() || !shortName.trim()) return;
// //     console.log("Saved & New:", { unitName, shortName });
// //     setUnitName("");
// //     setShortName("");
// //   };

//   return (
//     <Modal
//       show={show}
//       onHide={onHide}
//       style={{
//         backgroundColor: "grey",
//       }}
//       // 👈 unique backdrop
//       dialogClassName="addunit-top-modal"
//       centered={false}
//     >
//       <Modal.Body>
//         {/* Header */}
//         <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 ">
//           <h5 className="fw-bold m-0">New Unit</h5>
//           <Button
//             variant="light"
//             className="text-dark fs-3 p-0"
//             onClick={onHide}
//           >
//             ×
//           </Button>
//         </div>

//         {/* Form */}
//         <Form>
//           <Row className="mb-3 ">
//             <Col md={7}>
//               <Form.Label className="text-primary">Unit Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 // value={unitName}
//                 // onChange={(e) => setUnitName(e.target.value)}
//                 className="bg-white"
//               />
//             </Col>
//             <Col md={3}>
//               <Form.Label className="text-primary">Short Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 // value={shortName}
//                 // onChange={(e) => setShortName(e.target.value)}
//                 placeholder="ShortName"
//                 className="bg-white"
//               />
//             </Col>
//           </Row>
//         </Form>

//         {/* Footer */}
//         <div className="d-flex justify-content-end gap-2 mt-3">
//           <Button className="add-unit-btn px-4 py-2" >
//             Save & New
//           </Button>
//           <Button className=" add-unit-btn px-4 py-2" >
//             Save
//           </Button>
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// }

// export default AddUnit;







import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
// import "./items.css";

// IMPORTANT: Define the actual API URL here as per your PHP file location
const API_URL = "http://localhost/zentexus_billing_api/unit.php"; 

function AddUnit({ show, onHide, onSaveSuccess }) {
  const [unitName, setUnitName] = useState("");
  const [shortName, setShortName] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null); 
  const [responseVariant, setResponseVariant] = useState(null); 

  // Function to reset state and close the modal
  const handleClose = () => {
    setUnitName("");
    setShortName("");
    setLoading(false);
    setResponseMessage(null);
    setResponseVariant(null);
    onHide();
  };

  /**
   * Handles form submission for 'Save' or 'Save & New'.
   * @param {boolean} isSaveAndNew - True if 'Save & New' button was clicked.
   */
  const handleSave = async (isSaveAndNew) => {
    // 1. Client-side validation
    const trimmedUnitName = unitName.trim();
    const trimmedShortName = shortName.trim();
    if (!trimmedUnitName || !trimmedShortName) {
      setResponseVariant('danger');
      setResponseMessage("Unit Name and Short Name are required.");
      return;
    }

    setLoading(true);
    setResponseMessage(null); // Clear previous messages

    try {
      // 2. Prepare data as JSON (matching the PHP backend's json_decode expectation)
      const unitData = { 
        unit_name: trimmedUnitName, 
        short_name: trimmedShortName 
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(unitData), // Send as JSON string
      });

      const result = await response.json();
      
      // 3. Handle API response
      if (result.head.code === 200) {
        setResponseVariant('success');
        setResponseMessage(result.head.msg);
        
        // Notify parent to refetch units
        if (onSaveSuccess) {
            onSaveSuccess();
        }

        if (isSaveAndNew) {
          // Keep modal open, clear form for new entry
          setUnitName("");
          setShortName("");
        } else {
          // Close modal on 'Save'
          handleClose();
        }
      } else {
        setResponseVariant('danger');
        setResponseMessage(result.head.msg || "Failed to save unit.");
      }
    } catch (error) {
      console.error("Error saving unit:", error);
      setResponseVariant('danger');
      setResponseMessage("Network error: Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose} 
      style={{
        backgroundColor: "grey",
      }}
      dialogClassName="addunit-top-modal"
      centered={false}
    >
      <Modal.Body>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 ">
          <h5 className="fw-bold m-0">New Unit</h5>
          <Button
            variant="light"
            className="text-dark fs-3 p-0"
            onClick={handleClose}
          >
            ×
          </Button>
        </div>

        {/* Response Message Alert */}
        {responseMessage && (
            <Alert variant={responseVariant} onClose={() => setResponseMessage(null)} dismissible>
                {responseMessage}
            </Alert>
        )}

        {/* Form */}
        <Form onSubmit={(e) => e.preventDefault()}>
          <Row className="mb-3 ">
            <Col md={7}>
              <Form.Label className="text-primary">Unit Name</Form.Label>
              <Form.Control
                type="text"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                className="bg-white"
                disabled={loading}
              />
            </Col>
            <Col md={3}>
              <Form.Label className="text-primary">Short Name</Form.Label>
              <Form.Control
                type="text"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="ShortName"
                className="bg-white"
                disabled={loading}
              />
            </Col>
          </Row>
        </Form>

        {/* Footer */}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button 
            className="add-unit-btn px-4 py-2" 
            onClick={() => handleSave(true)}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save & New'}
          </Button>
          <Button 
            className=" add-unit-btn px-4 py-2" 
            onClick={() => handleSave(false)} 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddUnit;

