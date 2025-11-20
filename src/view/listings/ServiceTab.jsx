// src/listings/ServiceTab.jsx
import React, { useState } from "react";
import { Button, Table, Col, Card } from "react-bootstrap";
import { FaSearch, FaFileExcel } from "react-icons/fa";
import AddItem from "../creation/ItemModalCreation";

export default function ServiceTab() {
  const [showAddItem, setShowAddItem] = useState(false);

  return (
    <>
      <Col md={3} className="d-flex flex-column p-3">
        <Card className="h-100">
          <Card.Body className="d-flex flex-column p-0">
            <div className="p-3 d-flex justify-content-between align-items-center">
              <FaSearch />
              <Button variant="warning" className="text-white fw-bold px-3" onClick={() => setShowAddItem(true)}>
                + Add Service
              </Button>
            </div>
            <Table responsive bordered hover size="sm" className="mb-0 text-start">
              <thead><tr><th>ITEM</th></tr></thead>
              <tbody><tr><td>serviceee</td></tr></tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>

      <Col md={9} className="p-3 d-flex flex-column">
        <Card className="mb-3">
          <Card.Body>
            <h6 className="fw-bold mb-1">SAMPLE SERVICE</h6>
            <div className="small">Sale Price: <span className="text-success">₹ 0.00</span></div>
          </Card.Body>
        </Card>

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
            <Table responsive bordered hover size="sm" className="pro-table text-center mt-3">
              <thead>
                <tr>
                  <th>TYPE</th><th>INVOICE</th><th>NAME</th><th>DATE</th><th>PRICE</th><th>STATUS</th>
                </tr>
              </thead>
              <tbody></tbody>
            </Table>
            <div className="flex-grow-1 d-flex justify-content-center align-items-center">
              <span className="text-muted">No Rows to Show</span>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <AddItem show={showAddItem} onHide={() => setShowAddItem(false)} activeTab="SERVICE" />
    </>
  );
}