import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  FormControl,
  Table,
} from "react-bootstrap";
import { FaTimes, FaPlus } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getParties, addOrUpdateSale } from "../../../services/saleService";
import Select from "react-select";
import PartyModal from "../Parties/PartyModal";
import { useDispatch, useSelector } from 'react-redux';
import { fetchParties } from "../../../slice/saleSlice";

import {
  TextInputform,
  TextArea,
  DropDown,
  Calender,
} from "../../../components/Forms";

// STATIC OPTIONS
const units = ["NONE", "KG", "Litre", "Piece"];
const priceUnitTypes = ["Without Tax", "With Tax"];
const initialRows = [
  {
    id: 1,
    item: "",
    qty: "",
    unit: "NONE",
    priceUnitType: "Without Tax",
    price: "",
    discountPercent: "",
    discountAmount: "0.00",
    taxPercent: "",
    taxAmount: "0.00",
    amount: "0.00",
  },
];

const taxOptionsFormatted = [
  { value: "", label: "Select" },
  { value: 0, label: "0%" },
  { value: 5, label: "5%" },
  { value: 12, label: "12%" },
  { value: 18, label: "18%" },
  { value: 28, label: "28%" },
];
const unitsOptions = units.map((u) => ({ value: u, label: u }));
const priceUnitTypesOptions = priceUnitTypes.map((pt) => ({ value: pt, label: pt }));
const defaultCustomers = [{ value: "", label: "Select Party" }];
const stateOfSupplyOptions = [
  { value: "", label: "Select" },
  { value: "AndraPradesh", label: "AndraPradesh" },
  { value: "Kerala", label: "Kerala" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Maharastra", label: "Maharastra" },
  { value: "Delhi", label: "Delhi" },
  { value: "Mumbai", label: "Mumbai" },
  { value: "punjab", label: "punjab" },
  { value: "bihar", label: "bihar" },
];

const DashboardSale = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const saleToEdit = location.state?.sale || location.state?.saleData || null;
  const isViewMode = location.state?.isViewMode || location.state?.readOnly || false;

  // STATES
  const [credit, setCredit] = useState(true);
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("2025-11-10");
  const [stateOfSupply, setStateOfSupply] = useState("");
  const [rows, setRows] = useState(initialRows);
  const [roundOff, setRoundOff] = useState(0);
  const [isRoundOffEnabled, setIsRoundOffEnabled] = useState(false);
  const [customers, setCustomers] = useState(defaultCustomers);
  const [allParties, setAllParties] = useState([]);
  const [showPartyModal, setShowPartyModal] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [isEditMode, setIsEditMode] = useState(!!saleToEdit && !isViewMode);

  const dispatch = useDispatch();
  const partyStatus = useSelector(state => state.parties?.status || "idle");

  // FETCH PARTIES FROM API
  const fetchAndSetParties = useCallback(async () => {
    try {
      const parties = await getParties();
      setAllParties(parties);

      const customerOptions = parties.map(p => ({
        value: p.id,
        label: p.name,
      }));

      setCustomers([
        { value: "", label: "Select Party" },
        { value: "add_party", label: "+ Add Party" },
        ...customerOptions,
      ]);
    } catch (err) {
      console.error("Failed to fetch parties:", err);
      setCustomers(defaultCustomers);
    }
  }, []);

  useEffect(() => { fetchAndSetParties(); }, [fetchAndSetParties]);
  useEffect(() => { if (partyStatus === "idle") dispatch(fetchParties()); }, [partyStatus, dispatch]);

  // PREFILL FIELDS IF EDIT / VIEW
  useEffect(() => {
    if (!saleToEdit) return;

    setCustomer(saleToEdit.parties_id || "");
    setInvoiceNumber(saleToEdit.invoice_no || "");
    setInvoiceDate(saleToEdit.invoice_date || "2025-11-10");
    setBillingAddress(saleToEdit.billing_address || "");
    setShippingAddress(saleToEdit.shipping_address || "");
    setStateOfSupply(saleToEdit.state_of_supply || "");
    setPhone(saleToEdit.phone || "");
    setPaymentType(saleToEdit.payment_type || "");

    const roundOffValue = Number(saleToEdit.round_off) || 0;
    setRoundOff(roundOffValue);
    setIsRoundOffEnabled(roundOffValue !== 0);

    if (saleToEdit.products) {
      try {
        const itemsArray = JSON.parse(saleToEdit.products);
        if (Array.isArray(itemsArray) && itemsArray.length > 0) {
          const rowsWithId = itemsArray.map((item, index) => ({
            id: index + 1,
            item: String(item.item || ""),
            qty: String(item.qty || ""),
            unit: String(item.unit || "NONE"),
            priceUnitType: String(item.priceUnitType || "Without Tax"),
            price: String(item.price || ""),
            discountPercent: String(item.discountPercent || ""),
            discountAmount: String(item.discountAmount || ""),
            taxPercent: Number(item.taxPercent) || 0,   // ← THIS IS KEY: Store as NUMBER
        taxAmount: String(item.taxAmount || "0.00"),
            amount: String(item.amount || ""),
          }));
          setRows(rowsWithId);
        } else setRows(initialRows);
      } catch (err) {
        console.error("Failed to parse products JSON:", err);
        setRows(initialRows);
      }
    }
  }, [saleToEdit]);

  // PARTY SELECT
  const handlePartySelect = (selectedOption) => {
    if (!selectedOption) return setCustomer("");
    if (selectedOption.value === "add_party") return setShowPartyModal(true);

    const selectedParty = allParties.find(p => p.id === selectedOption.value);
    setCustomer(selectedOption.value);
    setPhone(selectedParty?.phone || "");
    setBillingAddress(selectedParty?.billing_address || "");
    setShippingAddress(selectedParty?.shipping_address || "");
    setStateOfSupply(selectedParty?.state_of_supply || "");
  };

  const closePartyModel = (added = false) => { setShowPartyModal(false); if (added) fetchAndSetParties(); };
  const toggleCredit = () => setCredit(!credit);

  // ADD / DELETE ROWS
  const deleteRow = (id) => setRows(rows.filter(r => r.id !== id));
  const addRow = () => {
    const newId = rows.length ? rows[rows.length - 1].id + 1 : 1;
    setRows([...rows, { ...initialRows[0], id: newId }]);
  };


const onRowChange = (id, field, value) => {
  setRows((prevRows) =>
    prevRows.map((row) => {
      if (row.id !== id) return row;

      // --- START: Universal Value Extraction ---
      let actualValue = value;
      
      // 1. Handle react-select/DropDown object: Extract the numerical/string value if it's an object
      if (value && typeof value === "object" && value.value !== undefined) {
        actualValue = value.value;
      } 
      // 2. Handle standard HTML event object from TextInputform: Extract the target value
      else if (value && typeof value === "object" && value.target?.value !== undefined) {
        actualValue = value.target.value;
      }
      
      const updatedRow = { ...row, [field]: actualValue };
      // --- END: Universal Value Extraction ---

      // --- START: Tax Percent Retrieval ---
      let taxPercentValue = updatedRow.taxPercent;
      
      // If taxPercent is coming in as an object (e.g., from prefill/edit) and we're not editing the field
      if (field !== "taxPercent" && typeof taxPercentValue === "object" && taxPercentValue?.value !== undefined) {
        taxPercentValue = taxPercentValue.value;
      }
      
      // Ensure taxPercent is always a number for calculation
      const taxPercent = Number(taxPercentValue) || 0;
      // --- END: Tax Percent Retrieval ---

      // Parse other values
      const qty = Number(updatedRow.qty) || 0;
      const price = Number(updatedRow.price) || 0;
      const discountPercent = Number(updatedRow.discountPercent) || 0;
      
      // The priceUnitType should now be a string, not an object/event
      const priceUnitType = String(updatedRow.priceUnitType || "Without Tax"); 
      
      // Step 1: Basic total
      let basicTotal = qty * price;

      // Step 2: Discount
      const discountAmount = (basicTotal * discountPercent) / 100;
      let taxableAmount = basicTotal - discountAmount;

      let taxAmount = 0;
      let finalAmount = taxableAmount; // Start with taxable amount

      // Step 3: Tax Calculation
      if (priceUnitType === "Without Tax") {
        // Price is exclusive → Add tax on top
        taxAmount = (taxableAmount * taxPercent) / 100;
        finalAmount = taxableAmount + taxAmount;
      } else {
        // "With Tax" → Price is inclusive → Calculate tax backwards
        const totalWithTax = taxableAmount;
        // Formula: Tax Amount = Total With Tax * (Tax Rate / (100 + Tax Rate))
        taxAmount = (totalWithTax * taxPercent) / (100 + taxPercent); 
        finalAmount = totalWithTax; // Final amount is the totalWithTax (which is taxableAmount)
        // Recalculate the true taxable amount if needed: taxableAmount = totalWithTax - taxAmount;
      }

      return {
        ...updatedRow,
        // *** FIX 1: Save the numerical taxPercent back to the state ***
        taxPercent: taxPercent, 
        discountAmount: discountAmount.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        amount: finalAmount.toFixed(2),
      };
    })
  );
};

  // TOTALS
  const totalQty = rows.reduce((a, r) => a + (Number(r.qty) || 0), 0);
  const totalDiscount = rows.reduce((a, r) => a + (Number(r.discountAmount) || 0), 0);
  const totalTax = rows.reduce((a, r) => a + (Number(r.taxAmount) || 0), 0);
  const totalAmountRaw = rows.reduce((a, r) => a + (Number(r.amount) || 0), 0);
  const finalRound = isRoundOffEnabled ? Number(roundOff) : 0;
  const totalAmount = totalAmountRaw + finalRound;

  // SAVE SALE
  const handleSave = async () => {
    if (!customer) return alert("Please select or add a customer.");
    if (!invoiceNumber) return alert("Please enter a unique Invoice Number.");

 // ... in handleSave
const productsArray = rows.map((r) => ({
    item: r.item,
    qty: r.qty,
    unit: r.unit,
    price: r.price,
    // FIX 2: priceUnitType is now guaranteed to be a string from onRowChange
    priceUnitType: r.priceUnitType, 
    discountPercent: r.discountPercent,
    discountAmount: r.discountAmount,
    // FIX 3: taxPercent is now guaranteed to be a number from onRowChange
    taxPercent: Number(r.taxPercent || 0), 
    taxAmount: r.taxAmount,
    amount: r.amount,
  }));
// ...s
    const saleData = {
      invoice_no: invoiceNumber,
      parties_id: customer,
      name: allParties.find(p => p.id === customer)?.name || "",
      phone,
      billing_address: billingAddress,
      shipping_address: shippingAddress,
      invoice_date: invoiceDate,
      state_of_supply: stateOfSupply,
      products: JSON.stringify(productsArray),
      round_off: finalRound,
      total: totalAmount.toFixed(2),
      payment_type: paymentType,
    };
    console.log("saledata",saleData);
    if (isEditMode) saleData.edit_sales_id = saleToEdit.sale_id;

    try {
      const result = await addOrUpdateSale(saleData);
      if (result?.head?.code === 200) {
        alert(`Sale ${isEditMode ? "updated" : "saved"} successfully!`);
        navigate("/sale");
      } else alert("Failed to save sale.");
    } catch (err) {
      console.error("Error:", err);
      alert("Network error occurred while saving sale.");
    }
  };

  return (
    <div id="main" style={{ backgroundColor: "#DEE2E6", minHeight: "100vh" }}>
      <Container fluid className="dashboard-sale-container">
        {/* HEADER */}
        <Row className="sale-header align-items-center mt-5">
          <Col xs="auto" className="d-flex align-items-center">
            <h5 className="mb-0 me-2" style={{ fontWeight: "bold" }}>
              {isViewMode ? "View Sale" : isEditMode ? "Edit Sale" : "Sale"}
            </h5>
            {!isViewMode && (
              <>
                <div className="d-flex align-items-center" onClick={toggleCredit} style={{ cursor: "pointer" }}>
                  <input type="checkbox" checked={credit} onChange={toggleCredit} />
                </div>
                <span onClick={toggleCredit} style={{ cursor: "pointer", marginLeft: "5px" }}>Credit</span>
                <span onClick={() => setCredit(false)} style={{ cursor: "pointer", marginLeft: "15px" }}>Cash</span>
              </>
            )}
          </Col>
          <Col xs="auto" className="ms-auto">
            <Button variant="light" onClick={() => navigate("/sale")}><FaTimes /></Button>
          </Col>
        </Row>

        {/* CUSTOMER INFO */}
        <Row className="mb-3">
          <Col md={9}>
            <Row className="mb-3">
              <Col md={6}>
                <label>Customer Name</label>
                <div className="d-flex gap-2">
                  <Select
                    options={customers}
                    value={customers.find(o => o.value === customer) || null}
                    onChange={isViewMode ? undefined : handlePartySelect}
                    placeholder="Select Customer"
                    isClearable
                    isDisabled={isViewMode}
                  />
                  {!isViewMode && <Button onClick={() => setShowPartyModal(true)}><FaPlus /></Button>}
                </div>
              </Col>
              <Col md={6}>
                <TextInputform
                  formLabel="Phone Number"
                  formtype="tel"
                  value={phone}
                  onChange={isViewMode ? undefined : (e) => setPhone(e.target.value)}
                  readOnly={isViewMode}
                />
              </Col>
            </Row>
            {credit && (
              <Row className="mb-3">
                <Col md={6}>
                  <TextArea textlabel="Billing Address" value={billingAddress} onChange={isViewMode ? undefined : (e) => setBillingAddress(e.target.value)} readOnly={isViewMode} />
                </Col>
                <Col md={6}>
                  <TextArea textlabel="Shipping Address" value={shippingAddress} onChange={isViewMode ? undefined : (e) => setShippingAddress(e.target.value)} readOnly={isViewMode} />
                </Col>
              </Row>
            )}
          </Col>
          <Col md={3} style={{ zIndex: 100 }}>
            <TextInputform formLabel="Invoice Number" value={invoiceNumber} onChange={isViewMode ? undefined : (e) => setInvoiceNumber(e.target.value)} readOnly={isViewMode} />
            <Calender calenderlabel="Invoice Date" initialDate={invoiceDate} setLabel={isViewMode ? undefined : setInvoiceDate} />
            <DropDown textlabel="State of supply" value={stateOfSupply} onChange={isViewMode ? undefined : setStateOfSupply} options={stateOfSupplyOptions} disabled={isViewMode} />
          </Col>
        </Row>

        {/* ITEMS TABLE */}
        <Row className="item-table-row mt-4">
          <Col style={{ overflow: 'visible', zIndex: 10 }}>
            <Table bordered hover size="sm" responsive>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Price/Unit</th>
                  <th>Price Unit Type</th>
                  <th>Discount</th>
                  <th>Tax</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id}>
                    <td><TextInputform value={row.item} onChange={isViewMode ? undefined : e => onRowChange(row.id, "item", e.target.value)} readOnly={isViewMode} /></td>
                    <td><TextInputform formtype="number" value={row.qty} onChange={isViewMode ? undefined : e => onRowChange(row.id, "qty", e.target.value)} readOnly={isViewMode} /></td>
                    <td><DropDown value={row.unit} onChange={isViewMode ? undefined : v => onRowChange(row.id, "unit", v)} options={unitsOptions} disabled={isViewMode} /></td>
                    <td><TextInputform formtype="number" value={row.price} onChange={isViewMode ? undefined : e => onRowChange(row.id, "price", e.target.value)} readOnly={isViewMode} /></td>
                    <td><DropDown value={row.priceUnitType} onChange={isViewMode ? undefined : v => onRowChange(row.id, "priceUnitType", v)} options={priceUnitTypesOptions} disabled={isViewMode} /></td>
                    <td>
                      <InputGroup size="sm">
                        <FormControl type="number" placeholder="%" value={row.discountPercent} onChange={isViewMode ? undefined : e => onRowChange(row.id, "discountPercent", e.target.value)} readOnly={isViewMode}/>
                        <FormControl value={row.discountAmount} readOnly />
                      </InputGroup>
                    </td>
                    
                    <td>
                      {/* FINAL FIX: Uses Select for visibility, correct value logic for enablement, and menuPortal for no clipping */}
                      <Select
                          // The key to enabling options: Match the state value to a full option object
                          value={
                            taxOptionsFormatted.find(opt => 
                              // Convert both sides to string for a reliable match ("" to "", 0 to "0", 5 to "5")
                              String(opt.value) === String(row.taxPercent)
                            ) || taxOptionsFormatted[0]
                          }
                          onChange={(v) => onRowChange(row.id, "taxPercent", v)}
                          options={taxOptionsFormatted}
                          isDisabled={isViewMode}
                          // Renders the menu outside the table to prevent clipping
                          menuPortalTarget={document.body} 
                          styles={{
                              control: (provided) => ({ ...provided, minHeight: '30px' }),
                              valueContainer: (provided) => ({ ...provided, padding: '0 8px' }),
                              input: (provided) => ({ ...provided, margin: '0px' }),
                              indicatorsContainer: (provided) => ({ ...provided, height: '30px' }),
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensures it appears on top
                          }}
                      />
 
                      <TextInputform readOnly value={row.taxAmount || "0.00"} />
                    </td>


                    <td><TextInputform readOnly value={row.amount} /></td>
                    <td>
                      {!isViewMode && <Button variant="danger" size="sm" onClick={() => deleteRow(row.id)}><FaTimes /></Button>}
                    </td>
                  </tr>
                ))}
                {!isViewMode && (
                  <tr>
                    <td colSpan="9">
                      <Button size="sm" onClick={addRow}><FaPlus /> ADD ROW</Button>
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan="2">TOTAL</td>
                  <td>{totalQty}</td>
                  <td colSpan="2"></td>
                  <td>{totalDiscount.toFixed(2)}</td>
                  <td>{totalTax.toFixed(2)}</td>
                  <td>{totalAmountRaw.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* PAYMENT + TOTAL */}
        <Row className="additional-actions mt-3 align-items-center">
          <Col xs={3}>
            <Form.Label>Payment Type</Form.Label>
            <Form.Select value={paymentType} onChange={isViewMode ? undefined : (e) => setPaymentType(e.target.value)} disabled={isViewMode}>
              <option value="Phone Pay">Phone Pay</option>
              <option value="Cash">Cash</option>
              <option value="G-pay">G-pay</option>
            </Form.Select>
          </Col>
         


          <Col className="d-flex justify-content-end align-items-center gap-2">
            <input type="checkbox" checked={isRoundOffEnabled} onChange={isViewMode ? undefined : (e) => setIsRoundOffEnabled(e.target.checked)} disabled={isViewMode} />
            <Form.Label>Round Off</Form.Label>
            <TextInputform formtype="number" value={roundOff} readOnly={!isRoundOffEnabled || isViewMode} onChange={isViewMode ? undefined : (e) => setRoundOff(e.target.value)} />
            <strong>Total</strong>
            <TextInputform readOnly value={totalAmount.toFixed(2)} />
          </Col>
        </Row>

        {/* SAVE BUTTON */}
        {!isViewMode && (
          <Row className="actions-row mt-4">
            <Col className="text-end">
              <Button variant="outline-primary" onClick={handleSave}>
                {isEditMode ? "Update Sale" : "Save"}
              </Button>
            </Col>
          </Row>
        )}
      </Container>

      <PartyModal show={showPartyModal} handleClose={closePartyModel} />
    </div>
  );
};

export default DashboardSale;
