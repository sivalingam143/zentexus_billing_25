// src/components/modals/SelectUnitModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Alert } from "react-bootstrap";
import { FaChevronDown } from "react-icons/fa";

const SelectUnitModal = ({ show, onHide, units = [], onBaseUnitChange, onSave }) => {
  const [baseUnit, setBaseUnit] = useState("None");
  const [secondaryUnit, setSecondaryUnit] = useState("None");
  const [showBase, setShowBase] = useState(false);
  const [showSec, setShowSec] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      setBaseUnit("None");
      setSecondaryUnit("None");
      setError("");
    }
  }, [show]);

  const save = () => {
    if (baseUnit !== "None" && baseUnit === secondaryUnit) {
      setError("Base Unit and Secondary Unit cannot be the same!");
      return;
    }
    onBaseUnitChange(baseUnit === "None" ? "" : baseUnit);
    onSave?.();
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
      </Modal.Body>

      <Modal.Footer>
        <Button variant="light" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={save}>SAVE</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SelectUnitModal;