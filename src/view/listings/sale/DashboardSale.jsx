import React, { useState } from "react";
import {Container, Row, Col, Form, Button, InputGroup,Table,} from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const initialRows = [
  {id: 1,item: "", qty: "", unit: "NONE",priceUnitType: "Without Tax",price: "",discountPercent: "",discountAmount: "",
    taxPercent: "",taxAmount: "", amount: "",
  },
];

const units = ["NONE", "KG", "Litre", "Piece"]; // example units
const priceUnitTypes = ["Without Tax", "With Tax"];
const taxOptions = ["Select", "5%", "12%", "18%", "28%"];

const DashboardSale = () => {
  // State variables for top form section
  const [credit, setCredit] = useState(true);
  const [customer, setCustomer] = useState("");
  const [billingName, setBillingName] = useState("");
  const [phone, setPhone] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const navigate = useNavigate();

  // State variables for main form table and others
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("2025-11-10");
  const [stateOfSupply, setStateOfSupply] = useState("");
  const [rows, setRows] = useState(initialRows);
  const [roundOff, setRoundOff] = useState(0);

  // Toggle Credit/Cash
  const toggleCredit = () => setCredit(!credit);

  // Handle row value change, calculates amounts dynamically
  const onRowChange = (id, field, value) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };

        const qtyNum = Number(updatedRow.qty) || 0;
        const priceNum = Number(updatedRow.price) || 0;
        const discountPercentNum = Number(updatedRow.discountPercent) || 0;
        const discountAmountNum = Number(updatedRow.discountAmount) || 0;
        const taxPercentNum =
          Number(
            updatedRow.taxPercent ? updatedRow.taxPercent.replace("%", "") : 0
          ) || 0;

        // Calculate discount amount from percent if not directly set
        let discAmt = discountAmountNum;
        if (discountPercentNum && !discountAmountNum) {
          discAmt = ((priceNum * qtyNum) * discountPercentNum) / 100;}
        

        // Calculate tax amount based on taxable amount after discount
        const taxableAmount = priceNum * qtyNum - discAmt;
        const taxAmt = (taxableAmount * taxPercentNum) / 100;

        // Calculate final amount
        const amount = taxableAmount + taxAmt;

        updatedRow.discountAmount = discAmt.toFixed(2);
        updatedRow.taxAmount = taxAmt.toFixed(2);
        updatedRow.amount = amount.toFixed(2);

        return updatedRow;
      }
      return row;
    });
    setRows(updatedRows);
  };

  // Add new row to the items table
  const addRow = () => {
    const newId = rows.length ? rows[rows.length - 1].id + 1 : 1;
    const newRow = {id: newId,item: "",qty: "",unit: "NONE",priceUnitType: "Without Tax", price: "",discountPercent: "",
       discountAmount: "",taxPercent: "", taxAmount: "", amount: "",};setRows([...rows, newRow]);
  };

  // Calculate totals for qty, discount, tax, and amount
  const totalQty = rows.reduce((acc, row) => acc + (Number(row.qty) || 0), 0);
  const totalDiscount = rows.reduce(
    (acc, row) => acc + (Number(row.discountAmount) || 0),
    0);
  const totalTax = rows.reduce((acc, row) => acc + (Number(row.taxAmount) || 0), 0);
  const totalAmountRaw = rows.reduce(
    (acc, row) => acc + (Number(row.amount) || 0),
    0);
  const totalAmount = totalAmountRaw + Number(roundOff || 0);

  return (
    <div id="main">
      
      <Container fluid className="dashboard-sale-container">
        
        {/* Header with Sale and Credit/Cash toggle */}
        <Row className="sale-header align-items-center mt-5">
          <Col xs="auto" className="d-flex align-items-center">
  <h5 className="mb-0 me-2" style={{ fontWeight: 'bold' }}>Sale</h5>

  <span
    className="me-2"
    onClick={() => setCredit(true)}
    style={{ 
      cursor: "pointer", 
      color: credit ? "blue" : "black", 
      fontWeight: credit? "bold" : "normal",
      userSelect: 'none'
    }}
  >
    Credit
  </span>

  <Form.Check
    type="switch"
    id="credit-switch"
    checked={credit}
    onChange={() => setCredit(prev => !prev)}
    // className="mx-2"
    style={{ cursor: "pointer" }}
  />

  <span
    // className="ms-2"
    onClick={() => setCredit(false)}
    style={{ 
      cursor: "pointer", 
      color: !credit ? "blue" : "black",
      fontWeight: !credit ? "bold" : "normal",
      userSelect: 'none'
    }}
  >
    Cash
  </span>
</Col>

          <Col xs="auto" className="ms-auto">
        <Button
           variant="light"
           onClick={() => navigate("/sale")}
           style={{
           border: "1px solid #ccc",
           borderRadius: "50%",
           padding: "4px 8px",
         }}><FaTimes /></Button>
     </Col>
      
    
 
      </Row>

        {/* Top form: Customer, Billing Name, Phone No. */}
        <Row className="mb-3 align-items-center">
          <Col xs={2}>
            <Form.Group controlId="customerSelect">
              <Form.Label>
                Name<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Select
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}>
              
                
                <option value="Customer 1">Customer</option>
              
              </Form.Select>
            </Form.Group>
          </Col>
          {/* <Col xs={2}>
            <Form.Group controlId="billingName">
              <Form.Label>Billing Name (Optional)</Form.Label>
              <Form.Control
                type="text"
                value={billingName}
                onChange={(e) => setBillingName(e.target.value)}
                placeholder="Billing Name (Optional)"/>
              </Form.Group> 
          </Col> */}
          <Col xs={2}>
            <Form.Group controlId="phoneInput">
              <Form.Label>Phone No.</Form.Label>
              <Form.Control
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone No."/>
              </Form.Group>
          </Col>
          <Col xs={2}>
          
            

            <Form.Group controlId="invoiceNumber">
              <Form.Label>Invoice Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Invoice Number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}/>
            </Form.Group>
          </Col>
          <Col xs={2}>
            <Form.Group controlId="invoiceDate" className="invoice-date-group">
              <Form.Label>Invoice Date</Form.Label>
              <Form.Control
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}/>  
            </Form.Group>
          </Col>
          
        </Row>

        {/* Addresses: Billing Address, Shipping Address */}
        {!credit && (
        <Row className="mb-4">
          <Col xs={3}>
            <Form.Group controlId="billingAddress">
              <Form.Label>Billing Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                placeholder="Billing Address"/>
              
            </Form.Group>
          </Col>
          <Col xs={3}>
            <Form.Group controlId="shippingAddress">
              <Form.Label>Shipping Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Shipping Address"/>
            </Form.Group>
          </Col>
          <Col xs={2}>
            <Form.Group controlId="stateOfSupply" className="state-supply-group">
              <Form.Label>State of supply</Form.Label>
              <Form.Select
                value={stateOfSupply}
                onChange={(e) => setStateOfSupply(e.target.value)}
                className="state-select">
                <option value="">Select</option>
                <option value="AndraPradesh">AndraPradesh</option>
                <option value="Kerala">Kerala</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharastra">Maharastra</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Munbai</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
        </Row>
        )}
        {/* Invoice info on a single row */}
        {/* <Row className="customer-info-row mb-4"> */}
          
        {/* </Row> */}

        {/* Items table */}
        <Row className="items-table-row mb-8">
          <Col>
            <Table bordered hover size="sm" className="items-table">
              <thead>
                <tr>
                  <th style={{ width: "30px" }}>#</th>
                  <th>ITEM</th>
                  <th>QTY</th>
                  <th>UNIT</th>
                  <th>PRICE/UNIT</th>
                  <th>DISCOUNT</th>
                  <th>TAX</th>
                  <th>AMOUNT</th>
                  <th style={{ width: "30px" }}></th>
                </tr>
                <tr className="price-unit-header">
                  <th colSpan={4}></th>
                  <th>
                    <Form.Select
                      onChange={(e) => {
                        // If needed: handle price/unit type for all rows here
                      }}
                      size="sm"
                    >
                      {priceUnitTypes.map((pt) => (
                        <option key={pt}>{pt}</option>
                      ))}
                    </Form.Select>
                  </th>
                  <th colSpan={4}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <Form.Control
                        type="text"
                        value={row.item}
                        onChange={(e) => onRowChange(row.id, "item", e.target.value)}
                        placeholder=""
                        size="sm"
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min={0}
                        value={row.qty}
                        onChange={(e) => onRowChange(row.id, "qty", e.target.value)}
                        size="sm"
                      />
                    </td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={row.unit}
                        onChange={(e) => onRowChange(row.id, "unit", e.target.value)}
                      >
                        {units.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min={0}
                        value={row.price}
                        onChange={(e) => onRowChange(row.id, "price", e.target.value)}
                        size="sm"
                      />
                    </td>
                    <td className="discount-cell">
                      <InputGroup size="sm">
                        <Form.Control
                          type="number"
                          min={0}
                          max={100}
                          value={row.discountPercent}
                          placeholder="%"
                          onChange={(e) =>
                            onRowChange(row.id, "discountPercent", e.target.value)
                          }
                          className="discount-input-percent"
                        />
                        <Form.Control
                          type="number"
                          min={0}
                          value={row.discountAmount}
                          placeholder="Amount"
                          onChange={(e) =>
                            onRowChange(row.id, "discountAmount", e.target.value)
                          }
                          className="discount-input-amount"
                        />
                      </InputGroup>
                    </td>
                    <td className="tax-cell">
                      <InputGroup size="sm">
                        <Form.Select
                          size="sm"
                          value={row.taxPercent}
                          onChange={(e) => onRowChange(row.id, "taxPercent", e.target.value)}
                        >
                          {taxOptions.map((option) => (
                            <option
                              key={option}
                              value={option === "Select" ? "" : option}
                            >
                              {option}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control
                          type="number"
                          min={0}
                          value={row.taxAmount}
                          readOnly
                          className="tax-amount"
                        />
                      </InputGroup>
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min={0}
                        value={row.amount}
                        readOnly
                        size="sm"
                        className="amount-cell"
                      />
                    </td>
                    <td>
                      {/* Optional Remove Row Button can be added here */}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={9} className="text-start">
                    <Button size="sm" onClick={addRow} className="add-row-btn">
                      ADD ROW
                    </Button>
                  </td>
                </tr>
                <tr className="total-row">
                  <td colSpan={2} className="total-label">
                    TOTAL
                  </td>
                  <td>{totalQty}</td>
                  <td></td>
                  <td></td>
                  <td>{totalDiscount.toFixed(2)}</td>
                  <td>{totalTax.toFixed(2)}</td>
                  <td>{totalAmount.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* Additional buttons and fields below */}
        <Row className="additional-actions mt-3 align-items-center">
          <Col xs="auto">
            <Button variant="light" className="btn-add-description" disabled>
              + ADD DESCRIPTION
            </Button>
          </Col>
          <Col xs="auto">
            <Button variant="light" className="btn-add-image" disabled>
              + ADD IMAGE
            </Button>
          </Col>

          <Col xs="auto" className="ms-auto d-flex align-items-center gap-2">
            <Form.Check
              type="checkbox"
              id="roundOffCheck"
              label="Round Off"
              checked={roundOff !== 0}
              onChange={(e) => setRoundOff(e.target.checked ? 0 : 0)}
              className="roundoff-checkbox"
            />
            <Form.Control
              type="number"
              min={0}
              value={roundOff}
              onChange={(e) => setRoundOff(Number(e.target.value))}
              className="roundoff-input"
            />
            <div className="total-label">Total</div>
            <Form.Control
              readOnly
              value={totalAmount.toFixed(2)}
              className="total-amount-input"
            />
          </Col>
        </Row>

        {/* Bottom action buttons */}
        <Row className="actions-row mt-4">
          <Col>
            <Button variant="outline-primary" className="btn-share">
              Share <span className="dropdown-arrow">&#x25BE;</span>
            </Button>
          </Col>
          <Col className="text-end">
            <Button variant="primary" className="btn-save">
              Save
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardSale;