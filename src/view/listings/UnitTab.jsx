// src/pages/tabs/UnitsTab.jsx
import React, { useEffect, useCallback } from "react";
import { Button, Table, Col, Card, Spinner, DropdownButton, Dropdown } from "react-bootstrap";
import { FaSearch, FaEllipsisV, FaFileExcel } from "react-icons/fa";
import AddUnit from "../creation/UnitModalCreation";
import AddConvo from "../listings/UnitConversion";
import {toast} from "react-toastify";
import "../../App.css";

import { useDispatch, useSelector } from "react-redux";
import { fetchUnits, deleteUnit } from "../../slice/UnitSlice";

export default function UnitsTab() {
  const dispatch = useDispatch();
// REMOVED: const [conversions, setConversions] = React.useState([]); 
  const { units, status } = useSelector((state) => state.unit);
  const [selectedBaseUnitName, setSelectedBaseUnitName] = React.useState(null); // Renamed to clearly indicate it's the name
  const [showUnitModal, setShowUnitModal] = React.useState(false);
  const [showConvoModal, setShowConvoModal] = React.useState(false);
  const [selectedUnit, setSelectedUnit] = React.useState(null);

// REMOVED: Load from localStorage when page opens
// REMOVED: useEffect(() => { ... }, []);

// REMOVED: Save to localStorage whenever conversions update
// REMOVED: useEffect(() => { ... }, [conversions]);

  const fetchAllUnits = useCallback(() => {
    dispatch(fetchUnits());
  }, [dispatch]);

  useEffect(() => {
    fetchAllUnits();
  }, [fetchAllUnits]);

  const unitsList = Array.isArray(units) 
  ? [...units].sort((a, b) => a.unit_name.localeCompare(b.unit_name))
  : [];

  // Helper to find the currently selected unit object
  const selectedUnitObject = unitsList.find(u => u.unit_name === selectedBaseUnitName);

 const getConversionsForSelectedUnit = () => {
  if (!selectedUnitObject?.conversion) return [];

  let list = selectedUnitObject.conversion;
  try {
    if (typeof list === "string") list = JSON.parse(list);
  } catch (e) {
    list = list ? [list] : []; // fallback if not valid JSON
  }

  if (!Array.isArray(list)) list = [list];
  return list.map(text => ({ displayText: text }));
};

  const unitRows = unitsList.map((unit) => (
    // Updated onClick to use the unit's name
    <tr key={unit.unit_id || unit.id} onClick={() => setSelectedBaseUnitName(unit.unit_name)}>
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
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUnit(unit);
            setShowUnitModal(true);
          }}
        >
          View / Edit
        </Dropdown.Item>
        <Dropdown.Item
          className="text-danger"
          onClick={(e) => {
            e.stopPropagation();

            // Unit deletion check needs to be updated. Since the conversion is now a single string on the unit record, 
            // the check should be: if the unit has a non-empty conversion string, it cannot be deleted.
            // NOTE: The backend only checks if the unit is deleted/exists. The *mapping* check must happen here.
            
            // Check if the current unit has a conversion string. If it's not empty, it's considered "mapped"
            const isMapped = !!unit.conversion && unit.conversion.trim().length > 0;

            if (isMapped) {
              toast.error("Mapped unit cannot be deleted (Conversion must be cleared first)");
              return;
            }

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
       {/* Header showing selected unit */}
{selectedBaseUnitName ? (
  <Card className="mb-3">
    <Card.Body>
      <h6 className="fw-bold text-primary">{selectedBaseUnitName.toUpperCase()}</h6>
    </Card.Body>
  </Card>
) : unitsList.length > 0 ? (
  <Card className="mb-3">
    <Card.Body>
      <h6 className="fw-bold text-muted">Select a unit to view conversions</h6>
    </Card.Body>
  </Card>
) : null}

        <Card className="flex-grow-1 d-flex flex-column">
          <Card.Body className="d-flex flex-column h-100 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">UNITS</h5>
              <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                <div style={{ position: "relative", width: "200px" }}>
                  <FaSearch style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "gray" }} />
                  <input type="text" className="form-control form-control-sm" style={{ paddingLeft: "30px" }} placeholder="Search..." />
                </div>
                <Button variant="light"><FaFileExcel size={20} color="#217346" /></Button>
              </div>
            </div>
                {/* Filtered Conversions - Only show for selected unit */}
            {selectedBaseUnitName ? (
              getConversionsForSelectedUnit().length > 0 ? (
                getConversionsForSelectedUnit().map((c, i) => (
                  <div key={i} className="border-bottom py-3 px-1">
                    <div className="text-muted small">CONVERSION</div>
                    <div className="mt-2 fw-medium">{c.displayText}</div>
                  </div>
                ))
              ) : (
                <div className="flex-grow-1 d-flex justify-content-center align-items-center text-muted">
                  No conversion added yet
                </div>
              )
            ) : (
              <div className="flex-grow-1 d-flex justify-content-center align-items-center text-muted">
                Select a unit to view conversions
              </div>
            )}
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
        units={unitsList}
      />
      <AddConvo
        show={showConvoModal}
        onHide={() => setShowConvoModal(false)}
        units={unitsList}
        // REMOVED: onSave prop is no longer needed/used, as saving happens via Redux dispatch inside UnitConversion.jsx
        // onSave={(data) => {
        //   setConversions(prev => [...prev, data]);
        // }}
      />
    </>
  );
}