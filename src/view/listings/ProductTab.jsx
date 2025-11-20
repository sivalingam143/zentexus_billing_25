// src/pages/tabs/ProductTab.jsx   (or src/listings/ProductTab.jsx)
import React, { useState } from "react";
import { Button, Table, Col, Card } from "react-bootstrap";
import { FaSearch, FaFileExcel } from "react-icons/fa";   // ← Fixed import
import AdjustItem from "../creation/AdjustItemCreation";
import AddItem from "../creation/ItemModalCreation";


export default function ProductTab() {
  const [showAdjustItem, setShowAdjustItem] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);

  return (
    <>
      {/* Left Panel */}
      <Col md={3} className="d-flex flex-column p-3">
        <Card className="h-100">
          <Card.Body className="d-flex flex-column p-0">
            <div className="p-3 d-flex justify-content-between align-items-center">
              <FaSearch />
              <Button variant="warning" className="text-white fw-bold px-3" onClick={() => setShowAddItem(true)}>
                + Add Item
              </Button>
            </div>

            <Table responsive bordered hover size="sm" className="mb-0 text-start">
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th>QUANTITY</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>sampleee</td>
                  <td>0</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>

      {/* Right Panel */}
      <Col md={9} className="p-3 d-flex flex-column" style={{ height: "100%" }}>
        {/* Detail Card – ADJUST ITEM button is here */}
        <Card className="mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="fw-bold mb-1">SAMPLEEE</h6>
                <div className="small mb-1">
                  SALE PRICE: <span className="text-success">₹ 0.00</span> (excl)
                </div>
                <div className="small mb-1">
                  PURCHASE PRICE: <span className="text-success">₹ 0.00</span> (excl)
                </div>
              </div>

              <div className="text-end">
                <Button
                  variant="primary"
                  className="mb-2 fw-semibold text-white px-4 py-2"
                  style={{ borderRadius: "6px" }}
                  onClick={() => setShowAdjustItem(true)}
                >
                  ADJUST ITEM
                </Button>
                <div className="small fw-normal">
                  <span className="text-danger">Warning</span> STOCK QUANTITY:{" "}
                  <span className="text-danger">0</span>
                </div>
                <div className="small fw-normal">
                  STOCK VALUE: <span className="text-success">₹ 0.00</span>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Transactions Card */}
        <Card className="flex-grow-1 d-flex flex-column">
          <Card.Body className="d-flex flex-column h-100 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">TRANSACTIONS</h5>
              <div className="d-flex align-items-center gap-2">
                <div style={{ position: "relative", width: "200px" }}>
                  <FaSearch
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "gray",
                    }}
                  />
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{ paddingLeft: "30px" }}
                    placeholder="Search..."
                  />
                </div>
                {/* Fixed Excel button */}
                <Button variant="light">
                  <FaFileExcel size={20} color="#217346" />
                </Button>
              </div>
            </div>

            <Table responsive bordered hover size="sm" className="pro-table text-center mt-3">
              <thead>
                <tr>
                  <th>TYPE</th>
                  <th>INVOICE</th>
                  <th>NAME</th>
                  <th>DATE</th>
                  <th>QUANTITY</th>
                  <th>PRICE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody />
            </Table>

            <div className="flex-grow-1 d-flex justify-content-center align-items-center">
              <span className="text-muted">No Rows to Show</span>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Modals */}
      <AdjustItem show={showAdjustItem} onHide={() => setShowAdjustItem(false)} itemName="SAMPLEEE" />
      <AddItem show={showAddItem} onHide={() => setShowAddItem(false)} activeTab="PRODUCT" />
    </>
  );
}