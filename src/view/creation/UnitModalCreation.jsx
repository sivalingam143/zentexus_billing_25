// src/pages/creation/UnitModalCreation.jsx  (or wherever AddUnit is)
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { createUnit, updateUnit } from "../../slice/UnitSlice";

function AddUnit({ show, onHide, onSaveSuccess, unitToEdit }) {
  const dispatch = useDispatch();

  const [unitName, setUnitName] = useState("");
  const [shortName, setShortName] = useState("");
  const [loading, setLoading] = useState(false);

  // When editing, populate fields
  useEffect(() => {
    if (unitToEdit) {
      setUnitName(unitToEdit.unit_name || "");
      setShortName(unitToEdit.short_name || "");
    } else {
      setUnitName("");
      setShortName("");
    }
  }, [unitToEdit, show]);

  const handleSave = async (andNew = false) => {
    if (!unitName.trim()) {
      alert("Unit Name is required");
      return;
    }

    setLoading(true);

    const unitData = {
      unit_name: unitName.trim(),
      short_name: shortName.trim(),
    };

    if (unitToEdit) {
      // Update mode
      unitData.unit_id = unitToEdit.unit_id;
      await dispatch(updateUnit(unitData));
    } else {
      // Create mode
      await dispatch(createUnit(unitData));
    }

    setLoading(false);

    if (!andNew) {
      onHide();
    } else {
      setUnitName("");
      setShortName("");
    }

    // Refresh list
    if (onSaveSuccess) onSaveSuccess();
  };

  const handleClose = () => {
    setUnitName("");
    setShortName("");
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="addunit-top-modal"
      centered={false}
    >
      <Modal.Body>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
          <h5 className="fw-bold m-0">
            {unitToEdit ? "Edit Unit" : "New Unit"}
          </h5>
          <Button variant="light" className="text-dark fs-3 p-0" onClick={handleClose}>
            ×
          </Button>
        </div>

        {/* Form */}
        <Form>
          <Row className="mb-3">
            <Col md={7}>
              <Form.Label className="text-primary">Unit Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                className="bg-white"
                placeholder="e.g., Kilogram"
                disabled={loading}
              />
            </Col>
            <Col md={3}>
              <Form.Label className="text-primary">Short Name</Form.Label>
              <Form.Control
                type="text"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="e.g., kg"
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
            disabled={loading || !unitName.trim()}
          >
            {loading ? <Spinner size="sm" /> : "Save & New"}
          </Button>
          <Button
            className="add-unit-btn px-4 py-2"
            variant="primary"
            onClick={() => handleSave(false)}
            disabled={loading || !unitName.trim()}
          >
            {loading ? <Spinner size="sm" /> : (unitToEdit ? "Update" : "Save")}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddUnit;