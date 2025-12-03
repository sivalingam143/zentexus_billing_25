// src/components/modals/SelectUnitModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Form, Alert } from "react-bootstrap";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";


const SelectUnitModal = ({ show, onHide, units = [], unitMapping, onSaveMapping }) => {
  const [baseUnit, setBaseUnit] = useState("None");
  const [secondaryUnit, setSecondaryUnit] = useState("None");
  const [conversion, setConversion] = useState("1"); // ← Only this added
  const [showBase, setShowBase] = useState(false);
  const [showSec, setShowSec] = useState(false);
  const [error, setError] = useState("");

  // ── In SelectUnitModal.jsx ──
// Add this useEffect (put it with the other useEffect blocks)

useEffect(() => {
  if (show && unitMapping) {
    // Pre-fill modal when editing existing mapping
    setBaseUnit(unitMapping.baseUnit || "None");
    setSecondaryUnit(unitMapping.secondaryUnit || "None");
    setConversion(unitMapping.conversion?.toString() || "1");
  }
}, [show, unitMapping]);

// ── ALSO UPDATE getShortCode in SelectUnitModal.jsx (very important) ──
const getShortCode = (name) => {
  if (!name) return "";
  const match = name.match(/\(([^)]+)\)/);
  if (match) return match[1];
  // Fallback: take first word or full uppercase
  const firstWord = name.split(" ")[0];
  return firstWord.toUpperCase();
};
const save = () => {
  if (baseUnit === "None") {
    toast.error("Please select Base Unit");
    return;
  }
  if (baseUnit === secondaryUnit && secondaryUnit !== "None") {
    toast.error("Base Unit and Secondary Unit cannot be the same!");
    return;
  }
  if (secondaryUnit !== "None" && (!conversion || Number(conversion) <= 0)) {
    toast.error("Please enter a valid conversion rate");
    return;
  }

  const mapping = {
    baseUnit: baseUnit === "None" ? "" : baseUnit,
    secondaryUnit: secondaryUnit === "None" ? null : secondaryUnit,
    conversion: secondaryUnit !== "None" ? Number(conversion) : null,
    shortText: secondaryUnit !== "None"
      ? `1 ${getShortCode(baseUnit)} = ${conversion} ${getShortCode(secondaryUnit)}`
      : getShortCode(baseUnit)
  };

  onSaveMapping(mapping);   // This calls AddItem's handler
  toast.success("Unit saved successfully!");
  onHide();
};

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" style={{ zIndex: 1060 }}>
      <Modal.Header closeButton>
        <Modal.Title>Select Unit</Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-3" style={{ backgroundColor: "#f8f9fa" }}>
        {error && <Alert variant="danger" className="py-2 small text-center">{error}</Alert>}

        <Row className="g-3">
          {/* BASE UNIT */}
          <Col md={6}>
            <label className="form-label text-danger small fw-bold">BASE UNIT</label>
            <div className="position-relative">
              <div
                className="form-control d-flex justify-content-between align-items-center pe-2"
                style={{ backgroundColor: "#fff3cd", cursor: "pointer", height: 42 }}
                onClick={() => setShowBase(!showBase)}
              >
                <span className={baseUnit === "None" ? "text-muted" : ""}>
                  {baseUnit === "None" ? "None" : baseUnit}
                </span>
                <FaChevronDown />
              </div>
              {showBase && (
                <div className="position-absolute w-100 bg-white border shadow rounded mt-1" style={{ zIndex: 9999, maxHeight: 200, overflow: "auto" }}>
                  <div className="px-3 py-2" style={{ cursor: "pointer" }} onClick={() => { setBaseUnit("None"); setShowBase(false); }}>None</div>
                  {units.map(u => (
                    <div key={u.unit_id} className="px-3 py-2" style={{ cursor: "pointer" }} onClick={() => { setBaseUnit(u.unit_name); setShowBase(false); }}>
                      {u.unit_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>

          {/* SECONDARY UNIT */}
          <Col md={6}>
            <label className="form-label small fw-bold">SECONDARY UNIT</label>
            <div className="position-relative">
              <div
                className="form-control d-flex justify-content-between align-items-center pe-2"
                style={{ cursor: "pointer", height: 42 }}
                onClick={() => setShowSec(!showSec)}
              >
                <span className={secondaryUnit === "None" ? "text-muted" : ""}>
                  {secondaryUnit === "None" ? "None" : secondaryUnit}
                </span>
                <FaChevronDown />
              </div>
              {showSec && (
                <div className="position-absolute w-100 bg-white border shadow rounded mt-1" style={{ zIndex: 9999, maxHeight: 200, overflow: "auto" }}>
                  <div className="px-3 py-2" style={{ cursor: "pointer" }} onClick={() => { setSecondaryUnit("None"); setShowSec(false); }}>None</div>
                  {units.map(u => (
                    <div key={u.unit_id} className="px-3 py-2" style={{ cursor: "pointer" }} onClick={() => { setSecondaryUnit(u.unit_name); setShowSec(false); }}>
                      {u.unit_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* ← ONLY THIS BLOCK ADDED → Conversion Input */}
        {secondaryUnit !== "None" && baseUnit !== secondaryUnit && (
          <Row className="mt-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-bold">Conversion Rate</Form.Label>
                <div className="d-flex align-items-center gap-2">
                  <span>1 {baseUnit === "None" ? "Base" : baseUnit} =</span>
                  <Form.Control
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={conversion}
                    onChange={(e) => setConversion(e.target.value)}
                    style={{ width: "100px" }}
                  />
                  <span>{secondaryUnit}</span>
                </div>
              </Form.Group>
            </Col>
          </Row>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="light" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={save}>SAVE</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SelectUnitModal;