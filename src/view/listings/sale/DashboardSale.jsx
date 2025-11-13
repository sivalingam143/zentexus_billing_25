import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  Table,
} from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  TextInputform,
  TextArea,
  DropDown,
  Calender,
} from "../../../components/Forms";
const units = ["NONE", "KG", "Litre", "Piece"];
const priceUnitTypes = ["Without Tax", "With Tax"];
const taxOptions = ["Select", "5%", "12%", "18%", "28%"];
const initialRows = [
  {
    id: 1,
    item: "",
    qty: "",
    unit: "NONE",
    priceUnitType: "Without Tax",
    price: "",
    discountPercent: "",
    discountAmount: "",
    taxPercent: "",
    taxAmount: "",
    amount: "",
  },
];
const unitsOptions = units.map((unit) => ({ value: unit, label: unit }));
const priceUnitTypesOptions = priceUnitTypes.map((pt) => ({
  value: pt,
  label: pt,
}));
const taxOptionsFormatted = taxOptions.map((option) => ({
  value: option === "Select" ? "" : option,
  label: option,
}));
const customerOptions = [{ value: "Customer 1", label: "Customer" }];
const stateOfSupplyOptions = [
  { value: "", label: "Select" },
  { value: "AndraPradesh", label: "AndraPradesh" },
  { value: "Kerala", label: "Kerala" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Maharastra", label: "Maharastra" },
  { value: "Delhi", label: "Delhi" },
  { value: "Mumbai", label: "Mumbai" },
];
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
          discAmt = (priceNum * qtyNum * discountPercentNum) / 100;
        }
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
    const newRow = {
      id: newId,
      item: "",
      qty: "",
      unit: "NONE",
      priceUnitType: "Without Tax",
      price: "",
      discountPercent: "",
      discountAmount: "",
      taxPercent: "",
      taxAmount: "",
      amount: "",
    };
    setRows([...rows, newRow]);
  };
  // Calculate totals for qty, discount, tax, and amount
  const totalQty = rows.reduce((acc, row) => acc + (Number(row.qty) || 0), 0);
  const totalDiscount = rows.reduce(
    (acc, row) => acc + (Number(row.discountAmount) || 0),
    0
  );
  const totalTax = rows.reduce(
    (acc, row) => acc + (Number(row.taxAmount) || 0),
    0
  );
  const totalAmountRaw = rows.reduce(
    (acc, row) => acc + (Number(row.amount) || 0),
    0
  );
  const totalAmount = totalAmountRaw + Number(roundOff || 0);
  return (
    <div id="main">
      <Container fluid className="dashboard-sale-container">
        {/* Header with Sale and Credit/Cash toggle */}
        <Row className="sale-header align-items-center mt-5">
          <Col xs="auto" className="d-flex align-items-center">
            <h5 className="mb-0 me-2" style={{ fontWeight: "bold" }}>
              Sale
            </h5>
            <span
              className="me-2"
              onClick={() => setCredit(true)}
              style={{
                cursor: "pointer",
                color: credit ? "black" : "blue",
                fontWeight: credit ? "normal" : "bold",
                userSelect: "none",
              }}
            >
              Credit
            </span>
            <Form.Check
              type="switch"
              id="credit-switch"
              checked={credit}
              onChange={() => setCredit((prev) => !prev)}
              // className="mx-2"
              style={{ cursor: "pointer" }}
            />
            <span
              // className="ms-2"
              onClick={() => setCredit(false)}
              style={{
                cursor: "pointer",
                color: !credit ? "black" : "blue",
                fontWeight: !credit ? "normal" : "bold",
                userSelect: "none",
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
              }}
            >
              <FaTimes />
            </Button>
          </Col>
        </Row>
        {/* Top form: Divided into left (customer info) and right (invoice info) */}
        <Row className="mb-3">
          {/* Left side: Name, Phone, Billing Address, Shipping Address */}
          <Col xs={12} md={6}>
            <Row className="mb-3">
              <Col xs={6} lg={6}>
                <DropDown
                  textlabel={
                    <span>
                      Name<span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  placeholder="Select Customer"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  name="customer"
                  options={customerOptions}
                />
              </Col>
              <Col xs={6} lg={6}>
                <TextInputform
                  formLabel="Phone No."
                  formtype="text"
                  PlaceHolder="Phone No."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="phone-input" // Optional class for styling
                  style={{ maxWidth: "200px" }} // Inline style if needed
                />
              </Col>
            </Row>
            {credit && (
              <Row className="mb-3">
                <Col xs={6} lg={6}>
                  <TextArea
                    textlabel="Billing Address"
                    PlaceHolder="Billing Address"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    Row={3}
                  />
                </Col>
                <Col xs={6} lg={6}>
                  <TextArea
                    textlabel="Shipping Address"
                    PlaceHolder="Shipping Address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    Row={3}
                  />
                </Col>
              </Row>
            )}
          </Col>
          {/* Right side: Invoice Number, Invoice Date, State of Supply - floated end */}
          <Col xs={12} md={6} lg={3} className=" ms-auto">
            <TextInputform
              formLabel="Invoice Number"
              formtype="text"
              PlaceHolder="Invoice Number"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="invoice-number-input px-3"
            />
            <Calender
              calenderlabel="Invoice Date"
              initialDate={invoiceDate}
              setLabel={setInvoiceDate}
              className="px-3"
            />
            <DropDown
              textlabel="State of supply"
              placeholder="Select"
              value={stateOfSupply}
              onChange={(e) => setStateOfSupply(e.target.value)}
              name="stateOfSupply"
              options={stateOfSupplyOptions}
              className="state-select px-3"
            />
          </Col>
        </Row>
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
                    <DropDown
                      placeholder="Select Price Unit Type"
                      onChange={(e) => {
                        // If needed: handle price/unit type for all rows here
                      }}
                      options={priceUnitTypesOptions}
                      className="price-unit-dropdown" // Optional class for table header styling
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          minHeight: "auto",
                          fontSize: "0.875rem",
                        }),
                      }} // Compact styling for table
                    />
                  </th>
                  <th colSpan={4}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <TextInputform
                        formtype="text"
                        value={row.item}
                        onChange={(e) =>
                          onRowChange(row.id, "item", e.target.value)
                        }
                        PlaceHolder=""
                        className="item-input-table" // Optional class for table styling
                        // No formLabel for table cell
                      />
                    </td>
                    <td>
                      <TextInputform
                        formtype="number"
                        min={0}
                        value={row.qty}
                        onChange={(e) =>
                          onRowChange(row.id, "qty", e.target.value)
                        }
                        PlaceHolder=""
                        className="qty-input-table" // Optional class
                      />
                    </td>
                    <td>
                      <DropDown
                        value={row.unit}
                        onChange={(e) =>
                          onRowChange(row.id, "unit", e.target.value)
                        }
                        name={`unit-${row.id}`}
                        options={unitsOptions}
                        placeholder="Select Unit"
                        className="unit-dropdown-table" // Optional class
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            minHeight: "auto",
                            fontSize: "0.875rem",
                          }),
                        }} // Compact for table
                      />
                    </td>
                    <td>
                      <TextInputform
                        formtype="number"
                        min={0}
                        value={row.price}
                        onChange={(e) =>
                          onRowChange(row.id, "price", e.target.value)
                        }
                        PlaceHolder=""
                        className="price-input-table" // Optional class
                      />
                    </td>
                    <td className="discount-cell">
                      <TextInputform
                        formtype="number"
                        min={0}
                        max={100}
                        value={row.discountPercent}
                        PlaceHolder="%"
                        onChange={(e) =>
                          onRowChange(row.id, "discountPercent", e.target.value)
                        }
                        className="discount-input-percent-table" // Adjusted
                        // No label
                      />
                      <TextInputform
                        formtype="number"
                        min={0}
                        value={row.discountAmount}
                        PlaceHolder="Amount"
                        onChange={(e) =>
                          onRowChange(row.id, "discountAmount", e.target.value)
                        }
                        className="discount-input-amount-table" // Adjusted
                        // No label
                      />
                    </td>
                    <td className="tax-cell">
                      <DropDown
                        value={row.taxPercent}
                        onChange={(e) =>
                          onRowChange(row.id, "taxPercent", e.target.value)
                        }
                        name={`tax-${row.id}`}
                        options={taxOptionsFormatted}
                        placeholder="Select Tax"
                        className="tax-select-table" // Optional class
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            minHeight: "auto",
                            fontSize: "0.875rem",
                          }),
                        }}
                      />
                      <TextInputform
                        formtype="number"
                        min={0}
                        value={row.taxAmount}
                        readOnly
                        PlaceHolder=""
                        className="tax-amount-table" // Adjusted
                        // No label
                      />
                    </td>
                    <td>
                      <TextInputform
                        formtype="number"
                        min={0}
                        value={row.amount}
                        readOnly
                        PlaceHolder=""
                        className="amount-cell-table" // Adjusted
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
            <TextInputform
              formtype="number"
              min={0}
              value={roundOff}
              onChange={(e) => setRoundOff(Number(e.target.value))}
              PlaceHolder=""
              className="roundoff-input-table" // Adjusted
              // No label
            />
            <div className="total-label">Total</div>
            <TextInputform
              formtype="number"
              readOnly
              value={totalAmount.toFixed(2)}
              PlaceHolder=""
              className="total-amount-input-table" // Adjusted
              // No label
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