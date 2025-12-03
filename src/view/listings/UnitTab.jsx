// src/pages/tabs/UnitsTab.jsx
import React, { useEffect, useCallback } from "react";
import { Button, Table, Col, Card, Spinner, DropdownButton, Dropdown } from "react-bootstrap";
import { FaSearch, FaEllipsisV, FaFileExcel } from "react-icons/fa";
import AddUnit from "../creation/UnitModalCreation";
import AddConvo from "../listings/UnitConversion";
import "../../App.css";

import { useDispatch, useSelector } from "react-redux";
import { fetchUnits, deleteUnit } from "../../slice/UnitSlice";

export default function UnitsTab() {
  const dispatch = useDispatch();

  const { units, status } = useSelector((state) => state.unit);

  const [showUnitModal, setShowUnitModal] = React.useState(false);
  const [showConvoModal, setShowConvoModal] = React.useState(false);
  const [selectedUnit, setSelectedUnit] = React.useState(null);

  const fetchAllUnits = useCallback(() => {
    dispatch(fetchUnits());
  }, [dispatch]);

  useEffect(() => {
    fetchAllUnits();
  }, [fetchAllUnits]);

  const unitsList = Array.isArray(units) 
  ? [...units].sort((a, b) => a.unit_name.localeCompare(b.unit_name))
  : [];

  const unitRows = unitsList.map((unit) => (
    <tr key={unit.unit_id || unit.id}>
      <td>{unit.unit_name}</td>
      <td>{unit.short_name || "-"}</td>
      <td className="text-center">
        <DropdownButton
          title={<FaEllipsisV />}
          variant="light"
          size="sm"
          align="end"
          className="p-0 border-0 bg-transparent"
        >
          <Dropdown.Item
            onClick={() => {
              setSelectedUnit(unit);
              setShowUnitModal(true);
            }}
          >
            View / Edit
          </Dropdown.Item>
          <Dropdown.Item
            className="text-danger"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this unit?")) {
                dispatch(deleteUnit(unit.unit_id || unit.id));
              }
            }}
          >
            Delete
          </Dropdown.Item>
        </DropdownButton>
      </td>
    </tr>
  ));

  return (
    <>
      <Col md={3} className="d-flex flex-column p-3">
        <Card className="h-100">
          <Card.Body className="d-flex flex-column p-0">
            <div className="p-3 d-flex justify-content-between align-items-center">
              <FaSearch />
              <Button
                variant="warning"
                className="text-white fw-bold px-3"
                onClick={() => setShowUnitModal(true)}
              >
                + Add Unit
              </Button>
            </div>
            <Table responsive bordered hover size="sm" className="mb-0 text-start">
              <thead>
                <tr>
                  <th>FULL NAME</th>
                  <th>SHORT NAME</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {status === "loading" ? (
                  <tr>
                    <td colSpan={3} className="text-center">
                      <Spinner animation="border" size="sm" /> Loading...
                    </td>
                  </tr>
                ) : unitRows.length > 0 ? (
                  unitRows
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-muted">
                      No Units Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>

      {/* Right Side - Main Content */}
      <Col md={9} className="p-3 d-flex flex-column position-relative">
        {/* Top-right "Add Conversion" Button - Exactly like your image */}
        <div className="position-absolute top-0 end-0 mt-3 me-3 px-4  " style={{ zIndex: 10 }}>
          <Button
            variant="primary"
            className="fw-semibold text-white bg-primary mt-4 px-2 py-2"
            style={{ borderRadius: "6px", fontSize: "14px" }}
            onClick={() => setShowConvoModal(true)}
          >
            Add Conversion
          </Button>
        </div>

        {/* Optional header card (you can remove if not needed) */}
        {unitsList.length > 0 && (
          <Card className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3 mt-0">
                <h6 className="fw-bold">{unitsList[0].unit_name.toUpperCase()}</h6>
                {/* Intentionally empty - button moved to top-right */}
              </div>
            </Card.Body>
          </Card>
        )}

        <Card className="flex-grow-1 d-flex flex-column">
          <Card.Body className="d-flex flex-column h-100 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">TRANSACTIONS</h5>
              <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                <div style={{ position: "relative", width: "200px" }}>
                  <FaSearch style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "gray" }} />
                  <input type="text" className="form-control form-control-sm" style={{ paddingLeft: "30px" }} placeholder="Search..." />
                </div>
                <Button variant="light"><FaFileExcel size={20} color="#217346" /></Button>
              </div>
            </div>
            <div className="flex-grow-1 d-flex justify-content-center align-items-center text-muted">
              <span>No Rows to Show</span>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Modals */}
      <AddUnit
        show={showUnitModal}
        onHide={() => {
          setShowUnitModal(false);
          setSelectedUnit(null);
        }}
        onSaveSuccess={fetchAllUnits}
        unitToEdit={selectedUnit}
      />

      {/* Add Conversion Modal - Opens from top-right button */}
      <AddConvo show={showConvoModal} onHide={() => setShowConvoModal(false)} />
    </>
  );
}