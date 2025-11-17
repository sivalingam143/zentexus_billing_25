
 
// import React, { useState } from "react";
// import { Modal, Button, Form, Row, Col, Nav } from "react-bootstrap";
// import StateSelect from "./States";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { useDispatch } from "react-redux";
// import { addNewParty,fetchParties } from "../../../slice/partySlice"/
// import { addNewParty, fetchParties, updateExistingParty, deleteExistingParty } from "../../../slice/partySlice"


// function PartyModal({ show, handleClose, isEdit, partyToEdit }) {
//   const dispatch = useDispatch(); 
//   const [activeTab, setActiveTab] = useState("gst");
//    const [partyName, setPartyName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//    const [amount, setAmount] = useState("");
//   const [date, setDate] = useState(new Date());
//   const [limitType, setLimitType] = useState("no"); // "no" or "custom"
//   const [creditLimit, setCreditLimit] = useState("");
//   const [isEditingAddress, setIsEditingAddress] = useState(false);
// const [shippingaddress, setShippingAddress] = useState("");
// const [billingaddress, setBillingAddress] = useState(""); // missing
// const [gstin, setGstin] = useState("");


// const handleSave = async () => { // <-- Make it async
//   const newParty = {
//     name: partyName,
//     gstin,
//     phone,
//     email,
//     billingaddress,
//     shippingaddress,
//     amount: parseFloat(amount) || 0,
//     creditLimit: parseFloat(creditLimit) || 0,
//     limitType,
    
//   };

//   try {
//     // Await the dispatch. We use .unwrap() to handle success/failure.
//     await dispatch(addNewParty(newParty)).unwrap();
//     dispatch(fetchParties()); 
//     handleClose(); 
//     setPartyName("");
//   setGstin("");
//   setPhone("");
//   setEmail("");
//   setBillingAddress("");
//   setShippingAddress("");
//   setAmount("");
//   setCreditLimit("");
//   setLimitType("no");
//   // setDate(new Date());
//   setActiveTab("gst");
    
//   } catch (error) {
//     console.error("Failed to save party: ", error);
    
//   }
// };

import React, { useState, useEffect } from "react"; // 🌟 ADDED useEffect
import { Modal, Button, Form, Row, Col, Nav } from "react-bootstrap";
import StateSelect from "./States";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
// 🌟 UPDATED: Import new thunks
import { addNewParty, fetchParties, updateExistingParty, deleteExistingParty } from "../../../slice/partySlice" 


// 🌟 UPDATED: Accept partyToEdit prop
function PartyModal({ show, handleClose, isEdit, partyToEdit }) {
  const dispatch = useDispatch(); 
  const [activeTab, setActiveTab] = useState("gst");
  const [partyName, setPartyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [limitType, setLimitType] = useState("no"); // "no" or "custom"
  const [creditLimit, setCreditLimit] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [shippingaddress, setShippingAddress] = useState("");
  const [billingaddress, setBillingAddress] = useState("");
  const [gstin, setGstin] = useState("");


  // 🌟 NEW HELPER: Reset all fields
  const resetFields = () => {
    setPartyName("");
    setGstin("");
    setPhone("");
    setEmail("");
    setBillingAddress("");
    setShippingAddress("");
    setAmount("");
    setCreditLimit("");
    setLimitType("no");
    setDate(new Date()); 
    setActiveTab("gst");
  }


  // 🌟 NEW EFFECT: Populate fields for editing
  useEffect(() => {
    if (isEdit && partyToEdit) {
      // Set state based on the partyToEdit object (using lowercase keys for consistency)
      setPartyName(partyToEdit.name || "");
      setGstin(partyToEdit.gstin || "");
      setPhone(partyToEdit.phone || "");
      setEmail(partyToEdit.email || "");
      setBillingAddress(partyToEdit.billingaddress || ""); 
      setShippingAddress(partyToEdit.shippingaddress || "");
      setAmount(partyToEdit.amount || ""); 
      setCreditLimit(partyToEdit.creditlimit || "");
      setLimitType(partyToEdit.limittype || "no");
    } else {
      // Reset fields when opening for 'Add' or when closing edit mode
      resetFields();
    }
  }, [isEdit, partyToEdit]); 
  
  
  // // UPDATED handleSave to use resetFields
  // const handleSave = async () => { 
  //   const newParty = {
  //     name: partyName,
  //     gstin,
  //     phone,
  //     email,
  //     billingaddress,
  //     shippingaddress,
  //     amount: parseFloat(amount) || 0,
  //     creditlimit: parseFloat(creditLimit) || 0,
  //     limitType,
  //   };

  //   try {
  //     await dispatch(addNewParty(newParty)).unwrap();
  //     dispatch(fetchParties()); 
  //     handleClose(); 
  //     resetFields(); // Use the helper
      
  //   } catch (error) {
  //     console.error("Failed to save party: ", error);
  //   }
  // };

  const savePartyLogic = async () => {
      const newParty = {
        name: partyName,
        gstin,
        phone,
        email,
        billingaddress,
        shippingaddress,
        amount: parseFloat(amount) || 0,
        creditlimit: parseFloat(creditLimit) || 0,
        limitType,
      };

      try {
        await dispatch(addNewParty(newParty)).unwrap();
        // Always re-fetch the list to update the main Parties page
        dispatch(fetchParties()); 
        return true; // Success
      } catch (error) {
        console.error("Failed to save party: ", error)
        return false; // Failure
      }
  }

  // UPDATED: handleSave closes the modal after saving
  const handleSave = async () => { 
    const success = await savePartyLogic();
    if (success) {
        handleClose(); // Close the modal
        resetFields(); 
    }
  };

  const handleSaveAndNew = async () => {
    const success = await savePartyLogic();
    if (success) {
        // Do NOT call handleClose() here, just reset fields for the next entry
        resetFields(); 
    }
  };

  // 🌟 NEW FUNCTION: handleUpdate
  const handleUpdate = async () => {
    if (!partyToEdit || !partyToEdit.parties_id) {
      console.error("Cannot update: Party ID is missing.");
      return;
    }

    const updatedParty = {
      // CRUCIAL: Include the unique ID required for update
      parties_id: partyToEdit.parties_id, 
      // Current form values (lowercase keys for PHP)
      name: partyName,
      gstin,
      phone,
      email,
      billingaddress,
      shippingaddress,
      amount: parseFloat(amount) || 0,
      creditlimit: parseFloat(creditLimit) || 0,
      limitType,
    };

    try {
      // Dispatch the new update thunk
      await dispatch(updateExistingParty(updatedParty)).unwrap(); 
      handleClose(); 
      resetFields(); 
      
      dispatch(fetchParties());
      
    } catch (error) {
      console.error("Failed to update party: ", error);
    }
  };

  // 🌟 NEW FUNCTION: handleDelete
  const handleDelete = async () => {
    if (!partyToEdit || !partyToEdit.parties_id) {
      console.error("Cannot delete: Party ID is missing.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${partyToEdit.name}?`)) {
      return;
    }

    try {
      // Dispatch the new delete thunk
      await dispatch(deleteExistingParty(partyToEdit.parties_id)).unwrap(); 
      handleClose(); 
      resetFields(); 
      dispatch(fetchParties());
      
    } catch (error) {
      console.error("Failed to delete party: ", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Edit Party" : "Add Party"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Top fields */}
        <Row className="mb-3">
          <Col>
            <Form.Control type="text" placeholder="Party Name *" value={partyName}
      onChange={(e) => setPartyName(e.target.value)} />
          </Col>
          <Col>
            <Form.Control type="text" placeholder="GSTIN"  value={gstin}
      onChange={(e) => setGstin(e.target.value)}/>
          </Col>
          <Col>
            <Form.Control type="text" placeholder="Phone Number" value={phone}
      onChange={(e) => setPhone(e.target.value)} />
          </Col>
        </Row>

        {/* Tabs */}
        <Nav
          variant="tabs"
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key)}
          className="mb-3"
        >
          <Nav.Item>
            <Nav.Link eventKey="gst">GST & Address</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="credit">Credit & Balance</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="additional">Additional Fields</Nav.Link>
          </Nav.Item>
        </Nav>

        {/* GST TAB */}
        {activeTab === "gst" && (
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>GST Type</Form.Label>
                <Form.Select>
                  <option>Unregistered/Consumer</option>
                  <option>Registered-Business/Regular</option>
                  <option>Registered-Business/Composition</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" style={{ overflow: "visible" }}>
                <Form.Label>Select State</Form.Label>
                <Form.Select>
                  <StateSelect />
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email ID</Form.Label>
                <Form.Control type="email" placeholder="Email ID" value={email} // <-- ADD THIS
                  onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Billing Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Billing Address"
                  value={billingaddress}
  onChange={(e) => setBillingAddress(e.target.value)}
                />
              </Form.Group>
            </Col>

           

<Col md={4}>
  <Form.Label>Shipping Address</Form.Label>
  <div>
    {isEditingAddress ? (
      <div>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter address"
          value={shippingaddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          autoFocus
        />
        <div className="text-end mt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsEditingAddress(false)}
            style={{ backgroundColor: "#4a93dcff", border: "none" }}
          >
            Save
          </Button>
        </div>
      </div>
    ) : (
      <Button
        variant="link"
        className="p-0 text-primary"
        onClick={() => setIsEditingAddress(true)}
      >
        {shippingaddress ? shippingaddress : "+ Add Address"}
      </Button>
    )}
  </div>
</Col>

          </Row>
        )}

        {/* CREDIT TAB */}
        {activeTab === "credit" && (
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Control type="number" placeholder="Opening Balance" />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="As of Date"
                />
              </Form.Group>
            </Col>

            
              <Form.Group className="mb-3">
                {/* Toggle between No Limit and Custom Limit */}
                <div
                  className="d-flex position-relative mt-2"
                  style={{
                    marginLeft:"0",
                    width: "290px",
                    borderRadius: "50px",
                    padding: "2px",
                    justifyContent: "space-between",
                    backgroundColor: "#e9f3ff",
                  }}
                >
                  <div
                    className="position-absolute bg-primary"
                    style={{
                      width: "130px",
                      height: "85%",
                      borderRadius: "50px",
                      transition: "transform 0.3s",
                      transform:
                        limitType === "no"
                          ? "translateX(0%)"
                          : "translateX(calc(100% + 24px))",
                    }}
                  ></div>

                  <Button
                    variant="transparent"
                    className={`flex-grow-1 ${
                      limitType === "no" ? "text-white" : "text-primary"
                    }`}
                    onClick={() => setLimitType("no")}
                    style={{
                      zIndex: 1,
                      borderRadius: "50px",
                      width: "130px",
                    }}
                  >
                    No Limit
                  </Button>

                  <div
                    className="px-1"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#0d6efd",
                      fontSize: "1.2rem",
                      zIndex: 1,
                    }}
                  >
                    ⇄
                  </div>

                  <Button
                    variant="transparent"
                    className={`flex-grow-1 ${
                      limitType === "custom" ? "text-white" : "text-primary"
                    }`}
                    onClick={() => setLimitType("custom")}
                    style={{
                      zIndex: 1,
                      borderRadius: "50px",
                      width: "130px",
                    }}
                  >
                    Custom Limit
                  </Button>
                </div>

                {limitType === "custom" && (
                  <Form.Control
                    type="number"
                    placeholder="Enter Credit Limit"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    className="mt-3"
                  />
                )}
              </Form.Group>
            
          </Row>
        )}

        {/* ADDITIONAL TAB */}
        {activeTab === "additional" && (
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Check type="checkbox" className="me-2" />
                <Form.Control type="text" placeholder="Additional Field 1" />
              </Form.Group>

              <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Check type="checkbox" className="me-2" />
                <Form.Control type="text" placeholder="Additional Field 2" />
              </Form.Group>

              <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Check type="checkbox" className="me-2" />
                <Form.Control type="text" placeholder="Additional Field 3" />
              </Form.Group>

              <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Check type="checkbox" className="me-2" />
                

                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select Date"
                />
              </Form.Group>
            </Col>
          </Row>
        )}
      </Modal.Body>

      {/* Footer */}
      <Modal.Footer>
        {isEdit ? (
          <>
            <Button variant="danger" className="px-4 py-2" onClick={handleDelete}>
              Delete
            </Button>
            <Button
              variant="primary bg-primary"
              className="text-white px-4 py-2"
              onClick={handleUpdate}
            >
              Update
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline-primary" onClick={handleSaveAndNew}>Save & New</Button>
            <Button variant="primary bg-primary" className="text-white px-4 py-2" onClick={handleSave} >
              Save
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default PartyModal;
