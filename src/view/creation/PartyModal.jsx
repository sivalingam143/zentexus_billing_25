
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
  const [selectedState, setSelectedState] = useState("");
  // console.log("Selected State ID:", selectedState); // Debugging line
  const [gstType, setGstType] = useState(""); 
const [gstTypeName, setGstTypeName] = useState("");
const [transactionType, setTransactionType] = useState("pay");

const [additionalFields, setAdditionalFields] = useState([
    { id: 1, name: "Additional Field 1", isChecked: false, value: "" },
    { id: 2, name: "Additional Field 2", isChecked: false, value: "" },
    { id: 3, name: "Additional Field 3", isChecked: false, value: "" },
  ]);
  
  // 🌟 NEW HANDLER: To toggle the checkbox and manage the input value
  const handleAdditionalFieldChange = (id, key, value) => {
    setAdditionalFields(prevFields => 
      prevFields.map(field => 
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };
  

const gstTypes = [
  { id: '1', name: "Regular" },
  { id: '2', name: "Composition" },
  { id: '3', name: "Consumer" },
  { id: '4', name: "Unregistered" },
];
const handleGstTypeChange = (e) => {
    const newId = e.target.value;
    setGstType(newId); // Save the ID
    
    // Look up the name based on the ID
    const selectedGst = gstTypes.find(type => String(type.id) === newId);
    if (selectedGst) {
        setGstTypeName(selectedGst.name); // Save the Name
    } else {
        setGstTypeName("");
    }
};


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
    setSelectedState("");
    setAdditionalFields([
        { id: 1, name: "Additional Field 1", isChecked: false, value: "" },
        { id: 2, name: "Additional Field 2", isChecked: false, value: "" },
        { id: 3, name: "Additional Field 3", isChecked: false, value: "" },
    ]);
  }

// This ensures ALL checked fields with a value are included
  // const getAdditionalFieldsPayload = () => {
  //   const activeFields = additionalFields
  //     .filter(field => field.isChecked && field.value && field.name)
  //     .map(field => ({
  //       name: field.name,
  //       value: field.value // Collect the name and value
  //     }));
      
  //   return JSON.stringify(activeFields);
  // };

const getAdditionalFieldsPayload = () => {
    const activeFields = additionalFields
      .filter(field => field.isChecked && field.value && field.name)
      .map(field => ({
        id: field.id, // <--- ADD THIS LINE to allow persistence
        name: field.name,
        value: field.value 
      }));
      
    return JSON.stringify(activeFields);
  };



  // 🌟 NEW EFFECT: Populate fields for editing
// 🌟 START OF UPDATE 1: Correct useEffect for data loading 🌟
useEffect(() => {
  if (isEdit && partyToEdit) {
    // Set basic fields
    setPartyName(partyToEdit.name || "");
    setGstin(partyToEdit.gstin || "");
    setPhone(partyToEdit.phone || "");
    setEmail(partyToEdit.email || "");

    // FIX: Use snake_case keys from the PHP/DB response
    setBillingAddress(partyToEdit.billing_address || "");
    setShippingAddress(partyToEdit.shipping_address || "");
    setSelectedState(partyToEdit.state_of_supply || ""); // FIX: Use state_of_supply

    // Set financial fields
    setAmount(partyToEdit.amount || "");
    setCreditLimit(partyToEdit.creditlimit || "");
    
    // Set GST Type (assuming it's id and name in the response)
    setGstType(partyToEdit.gstin_type_id || "");
    setGstTypeName(partyToEdit.gstin_type_name || "");
    
    // Set limit type based on the credit limit value
    setLimitType(parseFloat(partyToEdit.creditlimit) > 0 ? "custom" : "no");
    
    // Additional Fields (Parsing logic)
// In PartyModal.jsx inside the useEffect hook:

try {
  if (partyToEdit.additional_field) {
    const parsedFields = JSON.parse(partyToEdit.additional_field);

    
   
 setAdditionalFields(prevFields => {
      const newFields = [...prevFields];
      parsedFields.forEach(pField => {
        // FIX: Find the matching field by ID (pField.id is now available)
        const index = newFields.findIndex(f => f.id === pField.id);

        if (index !== -1) {
          // FIX: Update the found field, setting both the custom NAME and VALUE
          newFields[index] = {
            ...newFields[index],
            isChecked: true, 
            name: pField.name, // <--- CRITICAL FIX: Restore the custom name
            value: pField.value
          };
        } 
      });
      return newFields; 
    });
  }
} catch (e) {
  console.error("Error parsing additional fields:", e);
}

  } else {
    resetFields();
  }
}, [isEdit, partyToEdit])
   
  
  
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
    const additionalFieldsPayload = getAdditionalFieldsPayload();
      const newParty = {
        name: partyName,
        gstin,

        phone,
        gstin_type_id: gstType,        
        gstin_type_name: gstTypeName,
        email,
      state_of_supply: selectedState,
        billing_address :billingaddress,
        shipping_address: shippingaddress,
        amount: parseFloat(amount) || 0,
        creditlimit: parseFloat(creditLimit) || 0,
        limitType,
        additional_field: additionalFieldsPayload,
      };

      try {
        await dispatch(addNewParty(newParty)).unwrap();
        // Always re-fetch the list to update the main Parties page
        dispatch(fetchParties()); 
        return true; // Success
      } catch (error) {
        console.error("Failed to save party: ", error);
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

  

const handleUpdate = async () => {
    if (!partyToEdit || !partyToEdit.parties_id) {
        console.error("Cannot update: Party ID is missing.");
        return;
    }

    const additionalFieldsPayload = getAdditionalFieldsPayload();

    const updatedParty = {
        // Correct field name
        parties_id: partyToEdit.parties_id,

        // Basic fields
        name: partyName,
        gstin,
        phone,

        // Correct snake_case field names
        gstin_type_id: gstType,
        gstin_type_name: gstTypeName,

        email,

        // Correct field names for state
        // state_supply_id: selectedState, 
        state_of_supply: selectedState,

        billing_address: billingaddress,
        shipping_address: shippingaddress,

        amount: parseFloat(amount) || 0,
        creditlimit: parseFloat(creditLimit) || 0,

        // Correct backend field name
        additional_field: additionalFieldsPayload,
    };

    try {
        await dispatch(updateExistingParty(updatedParty)).unwrap(); 
        handleClose();
        dispatch(fetchParties());
    } catch (error) {
        console.error("Failed to update party:", error.message || error);
        handleClose();
    }
};


  // 🌟 NEW FUNCTION: handleDelete
  const handleDelete = async () => {
    const idToDelete = partyToEdit.parties_id;
    if (!idToDelete) {
        console.error("Delete failed: Missing Party ID in state.");
        return; // Stop the operation
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
    <Form.Select 
        value={gstType} // Bind to the ID
        onChange={handleGstTypeChange} // Use the new handler
    >
        <option value="">Select GST Type</option>
        {gstTypes.map((type) => (
            <option key={type.id} value={type.id}>
                {type.name}
            </option>
        ))}
    </Form.Select>
</Form.Group>
              {/* <Form.Group className="mb-3">
                <Form.Label>GST Type</Form.Label>
                <Form.Select >
                  <option>Unregistered/Consumer</option>
                  <option>Registered-Business/Regular</option>
                  <option>Registered-Business/Composition</option>
                </Form.Select>
              </Form.Group>  */}

              <Form.Group className="mb-3" style={{ overflow: "visible" }}>
                <Form.Label>Select State</Form.Label>
                <Form.Select value={selectedState} // 🌟 BIND THE VALUE FOR EDITING
                    onChange={(e) => setSelectedState(e.target.value)}>
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
                {/* <Form.Control type="number" placeholder="Ope
                ning Balance" />
                 */}
                 <Form.Control 
                  type="number" 
                  placeholder="Opening Balance" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
           <Form.Check
    inline
    type="radio"
    name="transactionType"              // SAME NAME
    value="pay"
    label="To Pay"
    checked={transactionType === "pay"} // SELECTS
    onChange={() => setTransactionType("pay")} // TOGGLE
  />
       <Form.Check
    inline
    type="radio"
    name="transactionType"              // SAME NAME
    value="receive"
    label="To Receive"
    checked={transactionType === "receive"}
    onChange={() => setTransactionType("receive")}
  />

      
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

    

{/* Dynamic fields based on additionalFields state */}
             {activeTab === "additional" && (
          <Row>
            <Col md={6}>
{/* Dynamic fields based on additionalFields state */}
             {additionalFields.map(field => (
                <Form.Group key={field.id} className="mb-3 d-flex align-items-center">
                    
                    {/* Checkbox and Name/Label Input (50% width) */}
                    <div className="d-flex align-items-center" style={{ width: field.isChecked ? '50%' : '100%' }}>
                        <Form.Check 
                            type="checkbox" 
                            className="me-2" 
                            checked={field.isChecked}
                            onChange={(e) => handleAdditionalFieldChange(field.id, 'isChecked', e.target.checked)}
                        />
                       <Form.Control 
                            type="text" 
                            value={field.name} // <--- CRITICAL FIX: Bind the input value to the state
                            placeholder={`Field Name (${field.id})`}
                            
                            onChange={(e) => handleAdditionalFieldChange(field.id, 'name', e.target.value)}
                            className="flex-grow-1"
                        />
                    </div>
                  
                    {/* Conditional Rendering: Show value input next to the name input */}
                    {field.isChecked && (
                      <div className="ms-3" style={{ width: '50%' }}>
                        <Form.Control 
                            type="text" 
                            // 🌟 Use the current field name in the value placeholder
                            placeholder={`Enter value for ${field.name}...`}
                            value={field.value}
                            onChange={(e) => handleAdditionalFieldChange(field.id, 'value', e.target.value)}
                        />
                      </div>
                    )}
                </Form.Group>
              ))}

              {/* Static Date Picker field remains */}
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
