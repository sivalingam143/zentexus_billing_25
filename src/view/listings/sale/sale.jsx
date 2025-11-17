import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Dropdown,
  InputGroup,
  FormControl,
  Table,
  Form,
} from "react-bootstrap";

import {
  FaFilter,
  FaSearch,
  FaChartBar,
  FaPrint,
  FaFileExcel,
  FaEllipsisV,
  FaReply,
} from "react-icons/fa";

import "./sale.css";
import { useNavigate } from "react-router-dom";
import { getParties } from "../../../services/saleService";
import { getSales } from "../../../services/saleService";
// sale.jsx (Around line 10, wherever you import service functions)
import { deleteSale } from "../../../services/saleService"; // ⭐️ Import deleteSale



const Sale = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [invoiceType, setInvoiceType] = useState("Sale Invoices");
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [selectedFirm, setSelectedFirm] = useState("All Firms");
  const [editingSale, setEditingSale] = useState(null); // sale object being edited
const [showEditModal, setShowEditModal] = useState(false);
const [addingSale, setAddingSale] = useState(false);
const [addOrUpdateSale, setAddOrUpdateSale] = useState(null);

  

  const [salesList, setSalesList] = useState([]);

  // Fetch sales from API (using getParties for now — replace when sales API ready)
  useEffect(() => {
    const fetchSales = async () => {
      const data = await getSales(""); // returns array
      setSalesList(data);
    };

    fetchSales();
  }, []);
  //////delete sale
  const handleDelete = async (saleId) => {
  if (!window.confirm("Are you sure you want to delete this sale?")) return;
  console.log("Deleting sale with ID:", saleId);
  try {
    const response = await fetch("http://localhost/zentexus_billing_api/sales.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delete_sales_id: saleId }),
    });
    console.log("Delete response received");
    const data = await response.json();
    console.log("Delete response:", data);

    if (data.head.code === 200) {
      setSalesList((prev) => prev.filter((sale) => sale.sale_id !== saleId));
      alert(data.head.msg);
    } else {
      alert(data.head.msg);
    }
  } catch (error) {
    console.error("Delete error:", error);
    alert("Something went wrong while deleting the sale.");
  }
};
const handleEdit = (sale) => {
  setEditingSale(sale);
  setShowEditModal(true);
};


  return (
    <div id="main" style={{ backgroundColor: "#DEE2E6", minHeight: "100vh" }}>
      <Container className="mt-5">
        <Row>
          <Col xl={12}>
            {/* Business Name Row */}
            <div className="mb-2 d-flex align-items-center">
              <span
                style={{
                  color: "red",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                }}
              >
                •
              </span>

              {isEditing ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginLeft: "8px",
                  }}
                >
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter Business Name"
                    autoFocus
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      padding: "5px 10px",
                      fontSize: "1rem",
                      width: "250px",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setIsEditing(false);
                    }}
                  />

                  <Button
                    variant="info"
                    onClick={() => {
                      console.log("Saved business:", businessName);
                      setIsEditing(false);
                    }}
                    style={{
                      borderRadius: "6px",
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <span
                  className="ms-2 text-muted"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsEditing(true)}
                >
                  {businessName || "Enter Business Name"}
                </span>
              )}

              <div className="ms-auto d-flex align-items-center gap-2">
                <Button
                  variant="danger"
                  style={{
                    fontWeight: 600,
                    borderRadius: "20px",
                    minWidth: "110px",
                  }}
                  onClick={() => navigate("/dashboardsale")}
                >
                  +Add Sale
                </Button>

                <Button
                  variant="success"
                  style={{
                    fontWeight: 600,
                    borderRadius: "20px",
                    minWidth: "110px",
                  }}
                  onClick={() => navigate("/dashboardpurchase")}
                >
                  +Add Purchase
                </Button>

                <Button
                  variant="info"
                  style={{
                    fontWeight: 600,
                    borderRadius: "20px",
                    minWidth: "110px",
                    color: "white",
                  }}
                >
                  +Add More
                </Button>

                <Button
                  variant="light"
                  style={{
                    borderRadius: "50%",
                    padding: "0 10px",
                    minWidth: "20px",
                  }}
                >
                  :
                </Button>
              </div>
            </div>

            {/* Sale invoices heading */}
            <Row className="sale-invoice-header align-items-center mb-3">
              <Col className="d-flex align-items-center gap-1">
                <h5 className="m-0">{invoiceType}</h5>

                <Dropdown>
                  <Dropdown.Toggle
                    as="span"
                    className="arrow-dropdown"
                    style={{ cursor: "pointer" }}
                  >
                    ▼
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item>Sale Invoices</Dropdown.Item>
                    <Dropdown.Item>Estimate/Quotation</Dropdown.Item>
                    <Dropdown.Item>Proforma Invoice</Dropdown.Item>
                    <Dropdown.Item>Payment-in</Dropdown.Item>
                    <Dropdown.Item>Sale Order</Dropdown.Item>
                    <Dropdown.Item>Delivery Challan</Dropdown.Item>
                    <Dropdown.Item>Sale Return</Dropdown.Item>
                    <Dropdown.Item>Purchase Bill</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>

            {/* Filters */}
            <Row className="filters align-items-center mb-3">
              <Col xs="auto" className="d-flex align-items-center gap-2">
                <Dropdown>
                  <Dropdown.Toggle
                    as="span"
                    className="arrow-dropdown d-flex align-items-center gap-1"
                    style={{ cursor: "pointer" }}
                  >
                    <span className="text-period">{selectedPeriod}</span> ▼
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item>Today</Dropdown.Item>
                    <Dropdown.Item>This Week</Dropdown.Item>
                    <Dropdown.Item>This Month</Dropdown.Item>
                    <Dropdown.Item>This Year</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>

              <Col xs="auto">
                <InputGroup size="sm" className="date-range">
                  <FormControl type="date" defaultValue="2025-11-01" />
                  <InputGroup.Text>To</InputGroup.Text>
                  <FormControl type="date" defaultValue="2025-11-30" />
                </InputGroup>
              </Col>

              <Col xs="auto" className="firm-dropdown">
                <Dropdown>
                  <Dropdown.Toggle
                    as="span"
                    className="custom-dropdown"
                    style={{ cursor: "pointer" }}
                  >
                    {selectedFirm} <span className="dropdown-arrow">▼</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item>All Firms</Dropdown.Item>
                    <Dropdown.Item>My Company</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>

            {/* Sales amount card */}
            <Row className="mb-4 sale-amount-card">
              <Col>
                <div className="amount-card">
                  <div className="card-title">Total Sales Amount</div>
                  <div className="total-amount">₹ 1,000</div>
                  <div className="growth-label">
                    100% ↑
                    <div className="growth-subtext">vs last month</div>
                  </div>

                  <div className="received-balance">
                    Received: <b>₹ 1,000 </b> | Balance: <b>₹ 0</b>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Transactions section */}
            <Row className="transactions-header align-items-center mb-2">
              <Col>
                <div className="transactions-title">Transactions</div>
              </Col>

              <Col className="d-flex justify-content-end gap-2">
                <Button size="sm" className="icon-btn">
                  <FaSearch />
                </Button>

                <Button size="sm" className="icon-btn">
                  <FaChartBar />
                </Button>

                <Button size="sm" className="icon-btn">
                  <FaFileExcel />
                </Button>

                <Button size="sm" className="icon-btn">
                  <FaPrint />
                </Button>
              </Col>
            </Row>

            {/* Table */}
            <Row>
              <Col>
                <Table
                  responsive
                  bordered
                  hover
                  size="sm"
                  className="transactions-table"
                >
                  <thead>
                    <tr>
                      <th>Date <FaFilter className="filter-icon" /></th>
                      <th>Invoice No <FaFilter className="filter-icon" /></th>
                      <th>Party Name <FaFilter className="filter-icon" /></th>
                      <th>Transaction <FaFilter className="filter-icon" /></th>
                      <th>Payment Type <FaFilter className="filter-icon" /></th>
                      <th>Amount <FaFilter className="filter-icon" /></th>
                      <th>Balance <FaFilter className="filter-icon" /></th>
                      <th>Status <FaFilter className="filter-icon" /></th>
                      <th>Actions <FaFilter className="filter-icon" /></th>
                    </tr>
                  </thead>

                  {/* ---- FIXED TBODY ---- */}
                  <tbody>
                    {salesList.map((sale) => (
                      <tr key={sale.sale_id}>
                        <td>{sale.invoice_date || "-"}</td>
                        <td>{sale.invoice_no || "-"}</td>
                        <td>{sale.name || "-"}</td>

                        <td>Sale Invoice</td>
                        <td>{sale.payment_type || "Cash"}</td>

                        <td>₹ {parseFloat(sale.total || 0).toFixed(2)}</td>

                        <td>₹ 0</td>

                        {/* STATUS */}
                        <td>
                          <Form.Select size="sm" defaultValue="Paid">
                            <option>Paid</option>
                            <option>Unpaid</option>
                          </Form.Select>
                        </td>

                        {/* ACTIONS */}
                        <td className="d-flex gap-2 align-items-center">

                          <Button
                            size="sm"
                            style={{
                              background: "transparent",
                              border: "none",
                              padding: 0,
                            }}
                          >
                            <FaPrint />
                          </Button>

                          <Button
                            size="sm"
                            style={{
                              background: "transparent",
                              border: "none",
                              padding: 0,
                            }}
                          >
                            <FaReply />
                          </Button>

                          <Dropdown align="end">
                            <Dropdown.Toggle
                              size="sm"
                              className="p-0"
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                              }}
                            >
                              <FaEllipsisV />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item>View</Dropdown.Item>
                              <Dropdown.Item onClick={() => handleEdit(sale)}>Edit</Dropdown.Item>

                              {/* <Dropdown.Item>Edit</Dropdown.Item> */}
                              {/* <Dropdown.Item>Delete</Dropdown.Item> */}
                              <Dropdown.Item onClick={() => handleDelete(sale.sale_id)}>Delete</Dropdown.Item>

                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </Table>
                {showEditModal && editingSale && (
  <div className="edit-modal">
    <div className="modal-content p-3">
      <h5>Edit Sale - {editingSale.invoice_no}</h5>
      <Form>
        <Form.Group className="mb-2">
          <Form.Label>Party Name</Form.Label>
          <Form.Control
            type="text"
            value={editingSale.name}
            onChange={(e) =>
              setEditingSale({ ...editingSale, name: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Invoice No</Form.Label>
          <Form.Control
            type="text"
            value={editingSale.invoice_no}
            onChange={(e) =>
              setEditingSale({ ...editingSale, invoice_no: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Total</Form.Label>
          <Form.Control
            type="number"
            value={editingSale.total}
            onChange={(e) =>
              setEditingSale({ ...editingSale, total: e.target.value })
            }
          />
        </Form.Group>

        <div className="d-flex justify-content-end gap-2 mt-2">
          <Button
            variant="secondary"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              const res = await addOrUpdateSale({
                edit_sales_id: editingSale.sale_id,
                name: editingSale.name,
                invoice_no: editingSale.invoice_no,
                total: editingSale.total,
                parties_id: editingSale.parties_id,
                // add other fields as needed
              });
              if (res.head.code === 200) {
                alert(res.head.msg);
                setSalesList((prev) =>
                  prev.map((s) =>
                    s.sale_id === editingSale.sale_id ? editingSale : s
                  )
                );
                setShowEditModal(false);
              } else {
                alert(res.head.msg);
              }
            }}
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  </div>
)}

              </Col>
            </Row>

          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Sale;
