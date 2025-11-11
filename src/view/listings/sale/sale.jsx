import React, { useState } from "react";
import {Container,Row,Col,Button,Dropdown, InputGroup,FormControl,Table,} from "react-bootstrap";
import {FaFilter, FaSearch, FaChartBar,FaPrint,FaFileExcel,FaEllipsisV,FaReply,} from "react-icons/fa"
import "./sale.css";
import { useNavigate } from "react-router-dom";





const Sale = () => {
  const navigate = useNavigate();
  const [invoiceType, setInvoiceType] = useState("Sale Invoices");
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [selectedFirm, setSelectedFirm] = useState("All Firms");
  
  

  return (
    <div id="main">
      <Container fluid className="container-main">
        {/* Top bar */}
        <Row className="top-bar align-items-center mb-4">
          <Col>
            <div className="enter-business">
              <span className="dot">• </span> Enter Business Name
            </div>
          </Col>
          <Col className="d-flex justify-content-end align-items-center gap-2">
            <Button size="sm" className="btn-sale">+ Add Sale</Button>
            <Button size="sm" className="btn-add-purchase">+ Add Purchase</Button>
            <Button size="sm" className="btn-circle"> + </Button>
            <Button size="sm" className="btn-ellipsis">
            <FaEllipsisV />
          </Button>
          </Col>
        </Row>

        {/* Sale invoices heading */}
        <Row className="sale-invoice-header align-items-center mb-3">
          <Col className="d-flex align-items-center gap-1">
            <h5 className="m-0">{invoiceType}</h5>
            {/* ▼ Dropdown icon only */}
            <Dropdown>
              <Dropdown.Toggle
                as="span"
                className="arrow-dropdown"
                id="invoice-dropdown"
              >
                ▼</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setInvoiceType("Sale Invoices")}>Sale Invoices</Dropdown.Item>
                <Dropdown.Item onClick={() => setInvoiceType("Estimate/Quotation")}> Estimate/Quotation</Dropdown.Item>
                <Dropdown.Item onClick={() => setInvoiceType("Proforma Invoice")}>Proforma Invoice</Dropdown.Item>
                <Dropdown.Item onClick={() => setInvoiceType("Payment-in")}>Payment-in</Dropdown.Item>
                <Dropdown.Item onClick={() => setInvoiceType("Sale Order")}>Sale Order</Dropdown.Item>
                <Dropdown.Item onClick={() => setInvoiceType("Delivery Challan")}>Delivery Challan</Dropdown.Item>
                <Dropdown.Item onClick={() => setInvoiceType("Sale return")}>Sale Return</Dropdown.Item>
                <Dropdown.Item onClick={() => setInvoiceType("Purchase Bill")}>Purchase Bill
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>

          <Col className="d-flex justify-content-end gap-2">
         <Button size="sm" className="btn-add-sale" onClick={() => navigate("/dashboardsale")} >+ Add Sale</Button>
         <Button size="sm" className="btn-add-purchase" onClick={() => navigate("/dashboardpurchase")}>+Add Purchase</Button>
        <Button size="sm" className="btn-settings">&#9881;</Button>
          </Col>

        </Row>

        {/* Filters */}
        <Row className="filters align-items-center mb-3">
          <Col xs="auto" className="d-flex align-items-center gap-2">
          {/* Dropdown for time period */}
          <Dropdown>
            <Dropdown.Toggle as="span" className="arrow-dropdown d-flex align-items-center gap-1">
              <span className="text-period">{selectedPeriod}</span> ▼
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSelectedPeriod("Today")}>Today</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedPeriod("This Week")}>This Week</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedPeriod("This Month")}>This Month</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedPeriod("This Year")}>This Year</Dropdown.Item>
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
        <Dropdown.Toggle as="span" className="custom-dropdown">
          {selectedFirm} <span className="dropdown-arrow">▼</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setSelectedFirm("All Firms")}>All Firms</Dropdown.Item>
          <Dropdown.Item onClick={() => setSelectedFirm("My Company")}> My Company</Dropdown.Item>
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
            <Button
              variant="link"
              size="sm"
              title="Search"
              className="icon-btn"
            ><FaSearch /></Button>
            <Button
              variant="link"
              size="sm"
              title="Analytics"
              className="icon-btn"
            ><FaChartBar /></Button>
            <Button
              variant="link"
              size="sm"
              title="Export XLS"
              className="icon-btn export-icon"
            ><FaFileExcel /></Button>
            <Button variant="link" size="sm" title="Print" className="icon-btn"><FaPrint /></Button>
          </Col>
        </Row>

        {/* Transactions table */}
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
                  <th>
                    Date <FaFilter className="filter-icon" />
                  </th>
                  <th>
                    Invoice no <FaFilter className="filter-icon" />
                  </th>
                  <th>
                    Party Name <FaFilter className="filter-icon" />
                  </th>
                  <th>
                    Transaction <FaFilter className="filter-icon" />
                  </th>
                  <th>
                    Payment Type <FaFilter className="filter-icon" />
                  </th>
                  <th>
                    Amount <FaFilter className="filter-icon" />
                  </th>
                  <th>
                    Balance <FaFilter className="filter-icon" />
                  </th>
                  <th className="actions-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>06/11/2025</td>
                  <td>1</td>
                  <td>sathya</td>
                  <td>Lite Sale</td>
                  <td>Cash</td>
                  <td>₹ 1,000</td>
                  <td>₹ 0</td>
                  <td className="d-flex gap-2 actions-cell">
                    <Button
                      variant="link"
                      size="sm"
                      title="Print"
                      className="icon-btn"
                    ><FaPrint /></Button>
                    <Button
                      variant="link"
                      size="sm"
                      title="Share"
                      className="icon-btn"
                    ><FaReply /></Button>
                    <Dropdown align="end" drop="down">
                      <Dropdown.Toggle
                        variant="link"
                        size="sm"
                        className="icon-btn dropdown-toggle"
                      ><FaEllipsisV />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>View</Dropdown.Item>
                        <Dropdown.Item>Edit</Dropdown.Item>
                        <Dropdown.Item>Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Sale;




