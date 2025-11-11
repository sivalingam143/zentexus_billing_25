import React, { useState } from "react";
import {Container, Row, Col,Form,Button,InputGroup,Table, Dropdown,} from "react-bootstrap";
const initialRows = [
  {id: 1,item: "",qty: "",unit: "NONE",priceUnitType: "Without Tax",price: "",discountPercent: "",discountAmount: "",
    taxPercent: "",
    taxAmount: "",
    amount: "",
  },
  {
    id: 2,item: "", qty: "",unit: "NONE",priceUnitType: "Without Tax",price: "",discountPercent: "",
    discountAmount: "",taxPercent: "", taxAmount: "",amount: "",
  },
];

const units = ["NONE", "KG", "Litre", "Piece"]; // example units
const priceUnitTypes = ["Without Tax", "With Tax"];
const taxOptions = ["Select", "5%", "12%", "18%", "28%"];

const DashboardPurchase= () => {
  const [credit, setCredit] = useState(true);
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("2025-11-10");
  const [stateOfSupply, setStateOfSupply] = useState("");
  const [rows, setRows] = useState(initialRows);
  const [roundOff, setRoundOff] = useState(0);

  // Handle toggling Credit/Cash
  const toggleCredit = () => setCredit(!credit);

  // Handle row value change
  const onRowChange = (id, field, value) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };

        // Recalculate amounts if qty and price present
        const qtyNum = Number(updatedRow.qty) || 0;
        const priceNum = Number(updatedRow.price) || 0;
        const discountPercentNum = Number(updatedRow.discountPercent) || 0;
        const discountAmountNum = Number(updatedRow.discountAmount) || 0;
        const taxPercentNum = Number(
          updatedRow.taxPercent ? updatedRow.taxPercent.replace("%", "") : 0
        ) || 0;

        // Calculate discount amount if % given
        let discAmt = discountAmountNum;
        if (discountPercentNum && !discountAmountNum) {
          discAmt = ((priceNum * qtyNum) * discountPercentNum) / 100;
        }

        // Calculate tax amount
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

  // Add new row
  const addRow = () => {
    const newId = rows.length ? rows[rows.length - 1].id + 1 : 1;
    const newRow = {id: newId, item: "",qty: "", unit: "NONE",priceUnitType: "Without Tax",price: "",discountPercent: "",
    discountAmount: "",taxPercent: "",taxAmount: "",amount: "",};
    setRows([...rows, newRow]);
  };

  // Calculate totals across rows
  const totalQty = rows.reduce((acc, row) => acc + (Number(row.qty) || 0), 0);
  const totalDiscount = rows.reduce((acc, row) => acc + (Number(row.discountAmount) || 0), 0);
  const totalTax = rows.reduce((acc, row) => acc + (Number(row.taxAmount) || 0), 0);
  const totalAmountRaw = rows.reduce((acc, row) => acc + (Number(row.amount) || 0), 0);
  const totalAmount = totalAmountRaw + Number(roundOff || 0);

  return (
   <div id = "main">
     <Container fluid className="dashboard-sale-container">
      <Row className="sale-header align-items-center mb-5">
        <Col xs="auto">
          <h5 className="sale-title">
            Sale{" "}
            <span
              className={`credit-toggle ${credit ? "active" : ""}`}
              onClick={toggleCredit}>Credit</span>{" "}
            <Form.Check
              type="switch"
              id="credit-switch"
              checked={credit}
              onChange={toggleCredit}
              className="mx-2"/>
            <span className={`cash-label ${!credit ? "active" : ""}`}>Cash</span>
          </h5>
        </Col>
      </Row>

      <Row className="customer-info-row mb-4">
        <Col xs={4}>
          <Form.Group controlId="customerSelect">
            <Form.Label>Customer
             <span className="required-star">*</span>
            </Form.Label>
            <Form.Select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="customer-select">
            
              <option value="">Search by Name/Phone </option>
              <option value="Customer 1">Customer 1</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={3}>
          <Form.Group controlId="phoneInput">
            <Form.Label>Phone No.</Form.Label>
            <Form.Control
              type="text"
              placeholder="Phone No."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="phone-input"/>
            
          </Form.Group>
        </Col>
        <Col xs={5}>
          <Form.Group controlId="invoiceNumber">
            <Form.Label>Invoice Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Invoice Number."
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="invoice-number"/>
            
          </Form.Group>
          <Form.Group controlId="invoiceDate" className="invoice-date-group">
            <Form.Label>Invoice Date</Form.Label>
            <Form.Control
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="invoice-date"/>
            
          </Form.Group>
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

      {/* Items table */}
      <Row className="items-table-row">
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
                      // If needed to handle price/unit type for all rows, add logic here
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
                          <option key={option} value={option === "Select" ? "" : option}>
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
                    {/* Optional Remove Row Button or leave blank */}
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

export default DashboardPurchase;