// AddConvo.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux"; // Import useDispatch
import { saveUnitConversion } from "../../slice/UnitSlice"; // Import the new thunk

// Units prop now needs the full unit object to get unit_id
function AddConvo({ show, onHide, units = [], onSave }) { 
  const dispatch = useDispatch();
  const [baseUnitName, setBaseUnitName] = useState("None");
  const [secondaryUnitName, setSecondaryUnitName] = useState("None");
  const [rate, setRate] = useState("");
  const [showBaseDropdown, setShowBaseDropdown] = useState(false);
  const [showSecondaryDropdown, setShowSecondaryDropdown] = useState(false);
  
  // State for the full unit objects to get the unit_id
  const [selectedBaseUnit, setSelectedBaseUnit] = useState(null); 
  const [selectedSecondaryUnit, setSelectedSecondaryUnit] = useState(null); 

  useEffect(() => {
    if (show) {
      setBaseUnitName("None");
      setSecondaryUnitName("None");
      setRate("");
      setSelectedBaseUnit(null);
      setSelectedSecondaryUnit(null);
    }
  }, [show]);

  // Helper to find unit object by name
  const findUnitByName = (name) => units.find(u => u.unit_name === name);

  // Helper to extract short code
  const getShortCode = (name) => {
    if (!name || name === "None") return "";
    const unit = findUnitByName(name);
    return unit ? (unit.short_name || unit.unit_name.split(" ")[0].toUpperCase()) : name.split(" ")[0].toUpperCase();
  };

  const resetForm = () => {
    setBaseUnitName("None");
    setSecondaryUnitName("None");
    setRate("");
    setSelectedBaseUnit(null);
    setSelectedSecondaryUnit(null);
  };

  // NEW: Function to construct the conversion text string for the DB
  const generateConversionText = (baseUnit, secondaryUnit, rate, units) => {
    const base = units.find(u => u.unit_name === baseUnit);
    const secondary = units.find(u => u.unit_name === secondaryUnit);

    const baseShort = base?.short_name || base?.unit_name;
    const secondaryShort = secondary?.short_name || secondary?.unit_name;
    
    if (secondaryUnit === "None") {
      return baseShort;
    }
    
    // Format: "1 [Base Short Name] = [Rate] [Secondary Short Name]"
    return `1 ${baseShort} = ${rate} ${secondaryShort}`;
  }

  const handleSave = async (andNew = false) => {
    // Validation
    if (baseUnitName === "None") {
      toast.error("Please select Base Unit");
      return;
    }
    if (baseUnitName === secondaryUnitName && secondaryUnitName !== "None") {
      toast.error("Base Unit and Secondary Unit cannot be the same!");
      return;
    }
    if (secondaryUnitName !== "None" && (!rate || Number(rate) <= 0)) {
      toast.error("Please enter a valid rate");
      return;
    }
    
    const baseUnitObject = selectedBaseUnit;
    
    if (!baseUnitObject) {
      toast.error("Could not find Base Unit ID for saving.");
      return;
    }

    // 1. Generate the conversion string
    const conversion_text = generateConversionText(baseUnitName, secondaryUnitName, rate, units);
    
    // 2. Dispatch the thunk to save to the DB
    try {
      await dispatch(
        saveUnitConversion({
          unit_id: baseUnitObject.unit_id || baseUnitObject.id,
          conversion_text,
        })
      ).unwrap(); 
      
      toast.success("Conversion saved successfully!");
      
      // onSave is no longer needed since we dispatch to Redux
      // onSave({ baseUnit: baseUnitName, secondaryUnit: secondaryUnitName, rate: Number(rate), displayText: conversion_text }); 
      
      if (andNew) {
        resetForm();
      } else {
        onHide();
      }
    } catch (error) {
      toast.error(`Error saving conversion: ${error}`);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="convo">
      {/* Header */}
      <Modal.Header
        className="text-muted border-0 d-flex justify-content-between align-items-center p-3 mb-4"
        style={{ backgroundColor: "rgba(139, 174, 227, 1)" }}
      >
        <Modal.Title className="fw-bold m-0">Add Conversation</Modal.Title>
        <Button
          variant="light"
          className="fs-4 p-0 bg-transparent border-0"
          onClick={onHide}
        >
          ×
        </Button>
      </Modal.Header>

      {/* Body */}
      <Modal.Body>
        <Form>
          <Row className="align-items-center mb-4">
            {/* Base Unit Dropdown */}
            <Col>
              <div className="position-relative">
                <div
                  className="form-control d-flex justify-content-between align-items-center pe-2"
                  style={{ cursor: "pointer", height: 48 }}
                  onClick={() => setShowBaseDropdown(!showBaseDropdown)}
                >
                  <span className={baseUnitName === "None" ? "text-muted" : ""}>
                    {baseUnitName === "None" ? "Base Unit" : baseUnitName}
                  </span>
                  <FaChevronDown />
                </div>
                {showBaseDropdown && (
                  <div
                    className="position-absolute w-100 bg-white border shadow rounded mt-1"
                    style={{ zIndex: 9999, maxHeight: 200, overflow: "auto" }}
                  >
                    {units.map((u) => (
                      <div
                        key={u.unit_id || u.id}
                        className="px-3 py-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setBaseUnitName(u.unit_name);
                          setSelectedBaseUnit(u); // Set the full unit object
                          setShowBaseDropdown(false);
                        }}
                      >
                        {u.unit_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Col>

            <Col xs="auto" className="text-center fw-bold">
              =
            </Col>

            {/* Rate Input */}
            <Col>
              <Form.Control
                type="number"
                placeholder="Rate"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                min="0.01"
                step="0.01"
              />
            </Col>

            {/* Secondary Unit Dropdown */}
            <Col>
              <div className="position-relative">
                <div
                  className="form-control d-flex justify-content-between align-items-center pe-2"
                  style={{ cursor: "pointer", height: 48 }}
                  onClick={() => setShowSecondaryDropdown(!showSecondaryDropdown)}
                >
                  <span className={secondaryUnitName === "None" ? "text-muted" : ""}>
                    {secondaryUnitName === "None" ? "Secondary Unit" : secondaryUnitName}
                  </span>
                  <FaChevronDown />
                </div>
                {showSecondaryDropdown && (
                  <div
                    className="position-absolute w-100 bg-white border shadow rounded mt-1"
                    style={{ zIndex: 9999, maxHeight: 200, overflow: "auto" }}
                  >
                    <div
                      className="px-3 py-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSecondaryUnitName("None");
                        setSelectedSecondaryUnit(null);
                        setShowSecondaryDropdown(false);
                      }}
                    >
                      None
                    </div>
                    {units.map((u) => (
                      <div
                        key={u.unit_id || u.id}
                        className="px-3 py-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSecondaryUnitName(u.unit_name);
                          setSelectedSecondaryUnit(u); // Set the full unit object
                          setShowSecondaryDropdown(false);
                        }}
                      >
                        {u.unit_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      {/* Footer */}
      <Modal.Footer>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button
            className="add-unit-btn px-4 py-2"
            onClick={() => handleSave(true)}
          >
            Save & New
          </Button>
          <Button className="add-unit-btn px-4 py-2" onClick={() => handleSave(false)}>
            Save
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default AddConvo;