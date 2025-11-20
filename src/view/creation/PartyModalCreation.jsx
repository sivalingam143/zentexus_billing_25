import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Nav } from "react-bootstrap";
import StateSelect from "../listings/States";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function PartyModal({
  show,
  handleClose,
  isEdit,
  formData,
  setFormData,
  handleSubmit,
  handleSaveAndNew,
  handleDelete,
}) {
  const [activeTab, setActiveTab] = useState("gst");
  const gstTypes = [
    { id: "1", name: "Regular" },
    { id: "2", name: "Composition" },
    { id: "3", name: "Consumer" },
    { id: "4", name: "Unregistered" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGstTypeChange = (e) => {
    const newId = e.target.value;
    const selectedGst = gstTypes.find((type) => String(type.id) === newId);

    setFormData((prev) => ({
      ...prev,
      gstin_type_id: newId, // Use API key
      gstin_type_name: selectedGst ? selectedGst.name : "", // Use API key
    }));
  };

  const handleAdditionalFieldChange = (id, key, value) => {
    setFormData((prev) => ({
      ...prev,
      additionalFields: (prev.additionalFields || []).map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      ),
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleLimitTypeToggle = (type) => {
    setFormData((prev) => ({
      ...prev,
      limitType: type,
      creditlimit: type === "no" ? "" : prev.creditlimit,
    }));
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Edit Party" : "Add Party"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="mb-3">
          <Col>
            <Form.Control
              type="text"
              placeholder="Party Name *"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="GSTIN"
              name="gstin"
              value={formData.gstin || ""}
              onChange={handleInputChange}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Phone Number"
              name="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
            />
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
                  value={formData.gstin_type_id || ""} // Bind to formData
                  onChange={handleGstTypeChange}
                >
                  <option value="">Select GST Type</option>
                  {gstTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" style={{ overflow: "visible" }}>
                <Form.Label>Select State</Form.Label>
                <Form.Select
                  name="state_of_supply" // Use name for generic handler
                  value={formData.state_of_supply || ""}
                  onChange={handleInputChange}
                >
                  {/* Assuming StateSelect component renders <option>s */}
                  <StateSelect />
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email ID</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email ID"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Billing Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Billing Address"
                  name="billing_address"
                  value={formData.billing_address || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Label>Shipping Address</Form.Label>
              <div>
                {formData.isEditingAddress ? (
                  <div>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter address"
                      name="shipping_address"
                      value={formData.shipping_address || ""}
                      onChange={handleInputChange}
                      autoFocus
                    />
                    <div className="text-end mt-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            isEditingAddress: false,
                          }))
                        }
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
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isEditingAddress: true,
                      }))
                    }
                  >
                    {formData.shipping_address
                      ? formData.shipping_address
                      : "+ Add Address"}
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
                <Form.Control
                  type="number"
                  placeholder="Opening Balance"
                  name="amount"
                  value={formData.amount || ""}
                  onChange={handleInputChange}
                />
                <Form.Check
                  inline
                  type="radio"
                  name="transactionType"
                  value="pay"
                  label="To Pay"
                  checked={formData.transactionType === "pay"}
                  onChange={handleInputChange}
                />
                <Form.Check
                  inline
                  type="radio"
                  name="transactionType"
                  value="receive"
                  label="To Receive"
                  checked={formData.transactionType === "receive"}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <DatePicker
                  selected={
                    formData.date instanceof Date ? formData.date : new Date()
                  }
                  onChange={handleDateChange}
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="As of Date"
                />
              </Form.Group>
            </Col>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <div
                    className="d-flex position-relative mt-2"
                    style={{
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
                          formData.limitType === "no"
                            ? "translateX(0%)"
                            : "translateX(calc(100% + 24px))",
                      }}
                    ></div>

                    <Button
                      variant="transparent"
                      className={`flex-grow-1 ${
                        formData.limitType === "no"
                          ? "text-white"
                          : "text-primary"
                      }`}
                      onClick={() => handleLimitTypeToggle("no")}
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
                        formData.limitType === "custom"
                          ? "text-white"
                          : "text-primary"
                      }`}
                      onClick={() => handleLimitTypeToggle("custom")}
                      style={{
                        zIndex: 1,
                        borderRadius: "50px",
                        width: "130px",
                      }}
                    >
                      Custom Limit
                    </Button>
                  </div>

                  {formData.limitType === "custom" && (
                    <Form.Control
                      type="number"
                      placeholder="Enter Credit Limit"
                      name="creditlimit"
                      value={formData.creditlimit || ""}
                      onChange={handleInputChange}
                      className="mt-3"
                    />
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Row>
        )}

        {activeTab === "additional" && (
          <Row>
            <Col md={6}>
              {(formData.additionalFields || []).map((field) => (
                <Form.Group
                  key={field.id}
                  className="mb-3 d-flex align-items-center"
                >
                  <div
                    className="d-flex align-items-center"
                    style={{ width: field.isChecked ? "50%" : "100%" }}
                  >
                    <Form.Check
                      type="checkbox"
                      className="me-2"
                      checked={field.isChecked}
                      onChange={(e) =>
                        handleAdditionalFieldChange(
                          field.id,
                          "isChecked",
                          e.target.checked
                        )
                      }
                    />
                    <Form.Control
                      type="text"
                      value={field.name}
                      placeholder={`Field Name (${field.id})`}
                      onChange={(e) =>
                        handleAdditionalFieldChange(
                          field.id,
                          "name",
                          e.target.value
                        )
                      }
                      className="flex-grow-1"
                    />
                  </div>
                  {field.isChecked && (
                    <div className="ms-3" style={{ width: "50%" }}>
                      <Form.Control
                        type="text"
                        placeholder={`Enter value for ${field.name}...`}
                        value={field.value}
                        onChange={(e) =>
                          handleAdditionalFieldChange(
                            field.id,
                            "value",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                </Form.Group>
              ))}

              <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Check type="checkbox" className="me-2" disabled={true} />
                <DatePicker
                  selected={
                    formData.date instanceof Date ? formData.date : new Date()
                  }
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select Date"
                  disabled={true}
                />
              </Form.Group>
            </Col>
          </Row>
        )}
      </Modal.Body>

      <Modal.Footer>
        {isEdit ? (
          <>
            <Button
              variant="danger"
              className="px-4 py-2"
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Button
              variant="primary bg-primary"
              className="text-white px-4 py-2"
              onClick={handleSubmit}
            >
              Update
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline-primary" onClick={handleSaveAndNew}>
              Save & New
            </Button>
            <Button
              variant="primary bg-primary"
              className="text-white px-4 py-2"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default PartyModal;
