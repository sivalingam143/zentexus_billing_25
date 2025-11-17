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
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getParties,addOrUpdateSale } from "../../../services/saleService"; 
import Select from "react-select";
import PartyModal from "../Parties/PartyModal";
import { useDispatch, useSelector } from 'react-redux';
import { fetchParties, saveSale } from "../../../slice/saleSlice";


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
const priceUnitTypesOptions = priceUnitTypes.map((pt) => ({ value: pt, label: pt }));
const taxOptionsFormatted = taxOptions.map((option) => ({
  value: option === "Select" ? "" : option,
  label: option,
}));

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
  const [paymentType,setPaymentType]=useState("");
 const [customerName, setCustomerName] = useState("");
 const [editingSaleId, setEditingSaleId] = useState(null);
 const [editingSaleData, setEditingSaleData] = useState({});

  const navigate = useNavigate();

  // Fetch parties from backend
  const fetchAndSetParties = useCallback(async () => {
    try {
      const parties = await getParties();
      setAllParties(parties);

      const customerOptions = parties.map(p => ({ value: p.id, label: p.name }));
      const optionsWithAdd = [
        { value: "", label: "Select Party" },
        { value: "add_party", label: "+ Add Party" },
        ...customerOptions,
      ];
      setCustomers(optionsWithAdd);
    } catch (error) {
      console.error("Failed to fetch parties:", error);
      setCustomers(defaultCustomers);
    }
  }, []);

  useEffect(() => { fetchAndSetParties(); }, [fetchAndSetParties]);

  // Handle party selection
  const handlePartySelect = (selectedOption) => {
    if (!selectedOption) {
      setCustomer("");
      // ...
      return;
    }

    if (selectedOption.value === "add_party") {
      setShowPartyModal(true);
      return;
    }

    const selectedParty = allParties.find(p => p.id === selectedOption.value);   
    setCustomer(selectedOption.value); // Set the customer state with the selected ID/value
    setPhone(selectedParty?.phone || "");
    setBillingAddress(selectedParty?.billing_address || "");
    setShippingAddress(selectedParty?.shipping_address || "");
    setStateOfSupply(selectedParty?.state_of_supply || "");
  };

   ////for sale and invoices
  const dispatch = useDispatch();
  const partyStatus = useSelector(state => state.party.status);
  useEffect(() => {
  if (partyStatus === 'idle') {
    dispatch(fetchParties());
  }
}, [partyStatus, dispatch]);

  const closePartyModel = (partyAdded = false) => {
    setShowPartyModal(false);
    if (partyAdded) fetchAndSetParties();
  };

  const toggleCredit = () => setCredit(!credit);

  const deleteRow = (id) => setRows(rows.filter(r => r.id !== id));
  const addRow = () => {
    const newId = rows.length ? rows[rows.length - 1].id + 1 : 1;
    setRows([...rows, { ...initialRows[0], id: newId }]);
  };

  const onRowChange = (id, field, value) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };

        const qtyNum = Number(updatedRow.qty) || 0;
        const priceNum = Number(updatedRow.price) || 0;
        const discountPercentNum = Number(updatedRow.discountPercent) || 0;
        let discountAmountNum = Number(updatedRow.discountAmount) || 0;
        const taxPercentNum = Number((updatedRow.taxPercent || "0").replace("%", "").replace("Select", "0")) || 0;

        // Calculate discount if percent is provided
        if (discountPercentNum && !discountAmountNum) {
          discountAmountNum = (priceNum * qtyNum * discountPercentNum) / 100;
        }

        const taxableAmount = priceNum * qtyNum - discountAmountNum;
        const taxAmt = (taxableAmount * taxPercentNum) / 100;
        const amount = taxableAmount + taxAmt;

        updatedRow.discountAmount = discountAmountNum.toFixed(2);
        updatedRow.taxAmount = taxAmt.toFixed(2);
        updatedRow.amount = amount.toFixed(2);

        return updatedRow;
      }
      return row;
    });

    setRows(updatedRows);
  };

  const totalQty = rows.reduce((a, r) => a + (Number(r.qty) || 0), 0);
  const totalDiscount = rows.reduce((a, r) => a + (Number(r.discountAmount) || 0), 0);
  const totalTax = rows.reduce((a, r) => a + (Number(r.taxAmount) || 0), 0);
  const totalAmountRaw = rows.reduce((a, r) => a + (Number(r.amount) || 0), 0);
  const finalRoundOff = isRoundOffEnabled ? Number(roundOff) : 0;
  const totalAmount = totalAmountRaw + finalRoundOff;

  

    // DashboardSale.jsx (Inside handleSave function)

const handleSave = async () => {
  if (!customer) { alert("Please select or add a customer."); return; }

  if (!invoiceNumber) { 
        alert("Please enter a unique Invoice Number."); 
        return; 
    }
  const productsArray = rows.map(r => ({
    item: r.item,
    qty: Number(r.qty) || 0,
    unit: r.unit,
    price: Number(r.price) || 0,
    discountPercent: Number(r.discountPercent) || 0,
    discountAmount: Number(r.discountAmount) || 0,
    taxPercent: Number(r.taxPercent?.replace("%","") || 0),
    taxAmount: Number(r.taxAmount) || 0,
    amount: Number(r.amount) || 0,
  })).filter(r => r.qty > 0 || r.item);

  
  const saleData = {
    invoice_no: invoiceNumber, 
    parties_id: customer, // Changed from 'customer'
    name: allParties.find(p => p.id === customer)?.name || "New Customer", 
    phone,
    billing_address: billingAddress, 
    shipping_address: shippingAddress,
    invoice_date: invoiceDate, 
    state_of_supply: stateOfSupply, 
    products: JSON.stringify(productsArray), 
    rount_off: finalRoundOff.toFixed(2), 
    round_off_amount: finalRoundOff.toFixed(2), 
    total: totalAmount.toFixed(2), 
  };
   console.log("Prepared sale data for API:", saleData);
    try {
      const result = await addOrUpdateSale(saleData); 
      if (result && result.head && result.head.code === 200) {
        console.log("Sale saved successfully. API Response:", result);
        alert("Sale saved successfully!");
        navigate("/sale");
      } else {
        const errorMsg = result?.head?.msg || "An unknown error occurred.";
        console.error("Failed to save sale. API Response:", result);
      }
    } catch (error) {
      console.error("Failed to save sale (Network/Uncaught Error):", error);
      alert("Failed to save sale due to a network or unexpected error.");
    }
  };
 
  return (
    <div id="main" style={{ backgroundColor: "#DEE2E6", minHeight: "100vh" }}>
      <Container fluid className="dashboard-sale-container">
        {/* HEADER */}
        <Row className="sale-header align-items-center mt-5">
          <Col xs="auto" className="d-flex align-items-center">
            <h5 className="mb-0 me-2" style={{ fontWeight: "bold" }}>Sale</h5>
            <div className="d-flex align-items-center" onClick={toggleCredit} style={{ cursor: "pointer" }}>
              <input type="checkbox" checked={credit} onChange={toggleCredit} style={{ width: "18px", height: "18px" }} />
            </div>
            <span onClick={toggleCredit} style={{ cursor: "pointer", color: credit ? "black" : "blue", fontWeight: credit ? "bold" : "normal", userSelect: "none", marginLeft: "5px" }}>Credit</span>
            <span onClick={() => setCredit(false)} style={{ cursor: "pointer", color: !credit ? "black" : "blue", fontWeight: !credit ? "normal" : "bold", userSelect: "none", marginLeft: "15px" }}>Cash</span>
          </Col>
          <Col xs="auto" className="ms-auto">
            <Button variant="light" onClick={() => navigate("/sale")} style={{ border: "1px solid #ccc", borderRadius: "50%", padding: "4px 8px" }}><FaTimes /></Button>
          </Col>
        </Row>

        {/* CUSTOMER INFO */}
        <Row className="mb-3">
          <Col md={9}>
            <Row className="mb-3">
              <Col md={6}>
                <label>Customer Name</label>
                <div className="d-flex align-items-center gap-2">
                  <Select
                    options={customers}
                    value={customers.find(o => o.value === customer) || null}
                    onChange={handlePartySelect}
                    placeholder="Select Customer"
                    isClearable
                  />
                  <Button variant="outline-primary" onClick={() => setShowPartyModal(true)}><FaPlus /></Button>
                </div>
              </Col>
              <Col md={6}>
                <TextInputform
                  formLabel="Phone Number"
                  formtype="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  readOnly={!!customer}
                />
              </Col>
            </Row>

            {credit && (
              <Row className="mb-3">
                <Col xs={6} lg={6}>
                  <TextArea textlabel="Billing Address" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} Row={3} readOnly={!!customer} />
                </Col>
                <Col xs={6} lg={6}>
                  <TextArea textlabel="Shipping Address" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} Row={3} readOnly={!!customer} />
                </Col>
              </Row>
            )}
          </Col>
          <Col xs={12} md={6} lg={3} className="ms-auto">
            <TextInputform formLabel="Invoice Number" formtype="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
            <Calender calenderlabel="Invoice Date" initialDate={invoiceDate} setLabel={setInvoiceDate} />
            <DropDown textlabel="State of supply" placeholder="Select" value={stateOfSupply} onChange={(value) => setStateOfSupply(value)} options={stateOfSupplyOptions} />
          </Col>
        </Row>

        {/* ITEMS TABLE */}
        <Row className="item-table-row mt-4">
          <Col xs={12}>
            <Table striped bordered hover size="sm" responsive>
              <thead>
                <tr>
                  <th>Item</th><th>Qty</th><th>Unit</th><th>Price/Unit</th><th>Price Unit Type</th>
                  <th>Discount</th><th>Tax</th><th>Amount</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id}>
                    <td><TextInputform formtype="text" value={row.item} onChange={e => onRowChange(row.id, "item", e.target.value)} /></td>
                    <td><TextInputform formtype="number" min={0} value={row.qty} onChange={e => onRowChange(row.id, "qty", e.target.value)} /></td>
                    <td><DropDown value={row.unit} onChange={e => onRowChange(row.id, "unit", e.target.value)} options={unitsOptions} placeholder="Unit" /></td>
                    <td><TextInputform formtype="number" min={0} value={row.price} onChange={e => onRowChange(row.id, "price", e.target.value)} /></td>
                    <td><DropDown value={row.priceUnitType} onChange={e => onRowChange(row.id, "priceUnitType", e.target.value)} options={priceUnitTypesOptions} placeholder="Price Unit Type" /></td>
                    <td>
                      <InputGroup size="sm">
                        <FormControl type="number" min={0} placeholder="%" value={row.discountPercent} onChange={e => onRowChange(row.id, "discountPercent", e.target.value)} />
                        <FormControl type="number" min={0} placeholder="Amount" value={row.discountAmount} readOnly />
                      </InputGroup>
                    </td>
                    <td>
                      <DropDown value={row.taxPercent} onChange={e => onRowChange(row.id, "taxPercent", e.target.value)} options={taxOptionsFormatted} placeholder="Tax" />
                      <TextInputform formtype="number" min={0} value={row.taxAmount} readOnly />
                    </td>
                    <td><TextInputform formtype="number" min={0} value={row.amount} readOnly /></td>
                    <td><Button variant="danger" size="sm" onClick={() => deleteRow(row.id)}><FaTimes /></Button></td>
                  </tr>
                ))}
                <tr><td colSpan={9}><Button size="sm" onClick={addRow}><FaPlus /> ADD ROW</Button></td></tr>
                <tr>
                  <td colSpan={2}>TOTAL</td>
                  <td>{totalQty}</td>
                  <td colSpan={2}></td>
                  <td>{totalDiscount.toFixed(2)}</td>
                  <td>{totalTax.toFixed(2)}</td>
                  <td>{totalAmountRaw.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* ROUND OFF + TOTAL */}
        <Row className="additional-actions mt-3 align-items-center">
          <div style={{ display: "flex", flexDirection: "column" }}>
      <Form.Label className="mb-1">Payment Type</Form.Label>
      <Form.Select
        value={paymentType}
        onChange={(e) => setPaymentType(e.target.value)}
        style={{ width: "160px",marginLeft:"10px" }}
      >
        <option value="">Phone pay</option>
        <option value="Cash">Cash</option>
        <option value="Online">G-pay</option>
      </Form.Select>
    </div>
          <Col xs="auto" className="ms-auto d-flex align-items-center gap-2">
            <input type="checkbox" checked={isRoundOffEnabled} onChange={e => setIsRoundOffEnabled(e.target.checked)} style={{ width: "18px", height: "18px" }} />
            <Form.Label className="mb-0">Round Off</Form.Label>
            <TextInputform formtype="number" value={roundOff} onChange={e => setRoundOff(Number(e.target.value))} readOnly={!isRoundOffEnabled} style={{ width: "100px" }} />
            <div style={{ fontWeight: "bold" }}>Total</div>
            <TextInputform formtype="number" readOnly value={totalAmount.toFixed(2)} style={{ width: "150px" }} />
            
          </Col>
        </Row>

        {/* SAVE BUTTON */}
        <Row className="actions-row mt-4">
          <Col className="text-end">
            <Button variant="outline-primary" onClick={handleSave}>Save</Button>
          </Col>
        </Row>
      </Container>

      {/* Party Modal */}
      <PartyModal show={showPartyModal} handleClose={closePartyModel} />
    </div>
  );
};

export default DashboardSale;
