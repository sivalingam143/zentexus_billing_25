import React, { useState, useEffect } from "react";
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
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  fetchParties,
  createSale,
  updateSale,
  searchSales,
} from "../../slice/saleSlice";
import {
  TextInputform,
  TextArea,
  DropDown,
  Calender,
  CheckBox,
} from "../../components/Forms";
import NotifyData from "../../components/NotifyData";

// Static options
const UNITS = ["NONE", "KG", "Litre", "Piece"];
const PRICE_UNIT_TYPES = ["Without Tax", "With Tax"];
const TAX_OPTIONS = [
  { value: "", label: "Select" },
  { value: 0, label: "0%" },
  { value: 5, label: "5%" },
  { value: 12, label: "12%" },
  { value: 18, label: "18%" },
  { value: 28, label: "28%" },
];
const STATE_OF_SUPPLY_OPTIONS = [
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
const PAYMENT_OPTIONS = [
  { value: "", label: "Select Payment Type" },
  { value: "Phone Pay", label: "Phone Pay" },
  { value: "Cash", label: "Cash" },
  { value: "G-pay", label: "G-pay" },
];

const INITIAL_ROW = {
  id: 1,
  item: "",
  qty: "",
  unit: "NONE",
  priceUnitType: "Without Tax",
  price: "",
  discountPercent: "",
  discountAmount: "0.00",
  taxPercent: 0,
  taxAmount: "0.00",
  amount: "0.00",
};

const SaleCreation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { parties, partiesStatus, sales } = useSelector((state) => state.sale);

  const isEditMode = location.pathname.startsWith("/sale/edit");
  const isViewMode = location.pathname.startsWith("/sale/view");
  const isCreateMode = location.pathname === "/sale/create";
  const isDisabled = isViewMode;

  const [formData, setFormData] = useState({
    parties_id: "",
    name: "",
    phone: "",
    billing_address: "",
    shipping_address: "",
    invoice_no: "",
    invoice_date: new Date().toISOString().split("T")[0],
    state_of_supply: "",
    payment_type: "",
    rows: [INITIAL_ROW],
    rount_off: 0,
    round_off_amount: "0",
    total: "0.00",
  });
  const [credit, setCredit] = useState(true);
  const [customers, setCustomers] = useState([
    { value: "", label: "Select Party" },
  ]);
  const [isManualRoundOff, setIsManualRoundOff] = useState(false);

  const saleToEdit = id ? sales.find((s) => s.sale_id == id) : null;

  // Fetch parties on mount
  useEffect(() => {
    if (partiesStatus === "idle") {
      dispatch(fetchParties());
    }
  }, [partiesStatus, dispatch]);

  // Fetch sales for edit/view
  useEffect(() => {
    if ((isEditMode || isViewMode) && sales.length === 0) {
      dispatch(searchSales(""));
    }
  }, [isEditMode, isViewMode, sales.length, dispatch]);

  // Update customers options
  useEffect(() => {
    const customerOptions = parties.map((p) => ({
      value: p.id,
      label: p.name,
    }));
    setCustomers([
      { value: "", label: "Select Party" },
      { value: "add_party", label: "+ Add Party" },
      ...customerOptions,
    ]);
  }, [parties]);

  // Prefill form for edit/view
  useEffect(() => {
    if (!saleToEdit) return;

    const itemsArray = JSON.parse(saleToEdit.products || "[]");
    const rows =
      Array.isArray(itemsArray) && itemsArray.length > 0
        ? itemsArray.map((item, index) => ({
            id: index + 1,
            item: String(item.item || ""),
            qty: String(item.qty || ""),
            unit: String(item.unit || "NONE"),
            priceUnitType: String(item.priceUnitType || "Without Tax"),
            price: String(item.price || ""),
            discountPercent: String(item.discountPercent || ""),
            discountAmount: String(item.discountAmount || "0.00"),
            taxPercent: Number(item.taxPercent || 0),
            taxAmount: String(item.taxAmount || "0.00"),
            amount: String(item.amount || "0.00"),
          }))
        : [INITIAL_ROW];

    const totalAmountRaw = rows.reduce((a, r) => a + Number(r.amount || 0), 0);
    const rount_off = Number(saleToEdit.rount_off || 0) === 1 ? 1 : 0;
    const round_off_amount = String(saleToEdit.round_off_amount || "0");
    const finalRound = rount_off ? Number(round_off_amount) : 0;
    const total = (totalAmountRaw + finalRound).toFixed(2);

    // Determine if manual round off
    let manual = false;
    if (rount_off === 1) {
      const autoRound = calculateAutoRoundOff(totalAmountRaw);
      manual = Math.abs(Number(round_off_amount) - Number(autoRound)) > 0.01;
    }
    setIsManualRoundOff(manual);

    setFormData({
      parties_id: saleToEdit.parties_id || "",
      name: saleToEdit.name || "",
      phone: saleToEdit.phone || "",
      billing_address: saleToEdit.billing_address || "",
      shipping_address: saleToEdit.shipping_address || "",
      invoice_no: saleToEdit.invoice_no || "",
      invoice_date:
        saleToEdit.invoice_date || new Date().toISOString().split("T")[0],
      state_of_supply: saleToEdit.state_of_supply || "",
      payment_type: saleToEdit.payment_type || "",
      rows,
      rount_off,
      round_off_amount,
      total,
    });
  }, [saleToEdit]);

  // Computed totals
  const totalQty = formData.rows.reduce((a, r) => a + (Number(r.qty) || 0), 0);
  const totalDiscount = formData.rows.reduce(
    (a, r) => a + (Number(r.discountAmount) || 0),
    0
  );
  const totalTax = formData.rows.reduce(
    (a, r) => a + (Number(r.taxAmount) || 0),
    0
  );
  const totalAmountRaw = formData.rows.reduce(
    (a, r) => a + (Number(r.amount) || 0),
    0
  );

  const calculateAutoRoundOff = (amount) =>
    (Math.round(amount) - amount).toFixed(2);

  // Handlers
  const handlePartySelect = (selectedOption) => {
    if (!selectedOption) {
      setFormData((prev) => ({
        ...prev,
        parties_id: "",
        name: "",
        phone: "",
        billing_address: "",
        shipping_address: "",
        state_of_supply: "",
      }));
      return;
    }

    if (selectedOption.value === "add_party") return;

    const selectedParty = parties.find((p) => p.id === selectedOption.value);
    setFormData((prev) => ({
      ...prev,
      parties_id: selectedOption.value,
      name: selectedParty?.name || "",
      phone: selectedParty?.phone || "",
      billing_address: selectedParty?.billing_address || "",
      shipping_address: selectedParty?.shipping_address || "",
      state_of_supply: selectedParty?.state_of_supply || "",
    }));
  };

  const toggleCredit = () => setCredit(!credit);

  const deleteRow = (id) => {
    const newRows = formData.rows.filter((r) => r.id !== id);
    const newTotalAmountRaw = newRows.reduce(
      (a, r) => a + Number(r.amount || 0),
      0
    );
    let finalRound =
      formData.rount_off === 1 ? Number(formData.round_off_amount) : 0;

    if (formData.rount_off === 1 && !isManualRoundOff) {
      const autoRound = calculateAutoRoundOff(newTotalAmountRaw);
      finalRound = Number(autoRound);
      setFormData((prev) => ({ ...prev, round_off_amount: autoRound }));
    }

    const newTotal = (newTotalAmountRaw + finalRound).toFixed(2);
    setFormData((prev) => ({ ...prev, rows: newRows, total: newTotal }));
  };

  const addRow = () => {
    const newId = formData.rows.length
      ? Math.max(...formData.rows.map((r) => r.id)) + 1
      : 1;
    const newRows = [...formData.rows, { ...INITIAL_ROW, id: newId }];
    const newTotalAmountRaw = newRows.reduce(
      (a, r) => a + Number(r.amount || 0),
      0
    );
    let finalRound =
      formData.rount_off === 1 ? Number(formData.round_off_amount) : 0;

    if (formData.rount_off === 1 && !isManualRoundOff) {
      const autoRound = calculateAutoRoundOff(newTotalAmountRaw);
      finalRound = Number(autoRound);
      setFormData((prev) => ({ ...prev, round_off_amount: autoRound }));
    }

    const newTotal = (newTotalAmountRaw + finalRound).toFixed(2);
    setFormData((prev) => ({ ...prev, rows: newRows, total: newTotal }));
  };

  const onRowChange = (id, field, value) => {
    let actualValue = value;
    if (value?.value !== undefined) {
      actualValue = value.value;
    } else if (value?.target?.value !== undefined) {
      actualValue = value.target.value;
    }

    const newRows = formData.rows.map((row) => {
      if (row.id !== id) return row;

      const updatedRow = { ...row, [field]: actualValue };
      const taxPercent = Number(updatedRow.taxPercent || 0);
      const qty = Number(updatedRow.qty) || 0;
      const price = Number(updatedRow.price) || 0;
      const discountPercent = Number(updatedRow.discountPercent) || 0;
      const priceUnitType = String(updatedRow.priceUnitType || "Without Tax");

      let basicTotal = qty * price;
      const discountAmount = (basicTotal * discountPercent) / 100;
      let taxableAmount = basicTotal - discountAmount;
      let taxAmount = 0;
      let finalAmount = taxableAmount;

      if (priceUnitType === "Without Tax") {
        taxAmount = (taxableAmount * taxPercent) / 100;
        finalAmount = taxableAmount + taxAmount;
      } else {
        const totalWithTax = taxableAmount;
        taxAmount = (totalWithTax * taxPercent) / (100 + taxPercent);
        finalAmount = totalWithTax;
      }

      return {
        ...updatedRow,
        taxPercent,
        discountAmount: discountAmount.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        amount: finalAmount.toFixed(2),
      };
    });

    const newTotalAmountRaw = newRows.reduce(
      (a, r) => a + Number(r.amount || 0),
      0
    );
    let finalRound = 0;
    let newRoundOffAmount = formData.round_off_amount;

    if (formData.rount_off === 1) {
      if (!isManualRoundOff) {
        newRoundOffAmount = calculateAutoRoundOff(newTotalAmountRaw);
      }
      finalRound = Number(newRoundOffAmount);
    }

    const newTotal = (newTotalAmountRaw + finalRound).toFixed(2);
    setFormData((prev) => ({
      ...prev,
      rows: newRows,
      round_off_amount: newRoundOffAmount,
      total: newTotal,
    }));
  };

  const handleRoundOffChange = (e) => {
    const val = e.target.value || "0";
    setIsManualRoundOff(true);
    const newTotalAmountRaw = formData.rows.reduce(
      (a, r) => a + Number(r.amount || 0),
      0
    );
    const finalRound = formData.rount_off === 1 ? Number(val) : 0;
    const newTotal = (newTotalAmountRaw + finalRound).toFixed(2);
    setFormData((prev) => ({
      ...prev,
      round_off_amount: val,
      total: newTotal,
    }));
  };

  const handleRoundOffToggle = (e) => {
    const checked = e.target.checked ? 1 : 0;
    const newTotalAmountRaw = formData.rows.reduce(
      (a, r) => a + Number(r.amount || 0),
      0
    );
    let roundOffAmt = "0";
    let finalRound = 0;

    if (checked === 1) {
      setIsManualRoundOff(false);
      roundOffAmt = calculateAutoRoundOff(newTotalAmountRaw);
      finalRound = Number(roundOffAmt);
    } else {
      setIsManualRoundOff(false);
    }

    const newTotal = (newTotalAmountRaw + finalRound).toFixed(2);
    setFormData((prev) => ({
      ...prev,
      rount_off: checked,
      round_off_amount: roundOffAmt,
      total: newTotal,
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.parties_id) {
      alert("Please select or add a customer.");
      return;
    }
    if (!formData.invoice_no) {
      alert("Please enter a unique Invoice Number.");
      return;
    }

    try {
      const submitData = {
        ...formData,
        products: JSON.stringify(formData.rows.map(({ id, ...rest }) => rest)),
        rount_off: formData.rount_off,
        round_off_amount: formData.round_off_amount || "0",
      };

      if (isEditMode) {
        submitData.edit_sales_id = id;
        await dispatch(updateSale(submitData)).unwrap();
        NotifyData("Sale Updated Successfully", "success");
      } else {
        await dispatch(createSale(submitData)).unwrap();
        NotifyData("Sale Created Successfully", "success");
      }

      navigate("/Sale");
    } catch (error) {
      console.error("Save error:", error);
      NotifyData(
        isEditMode ? "Sale Update Failed" : "Sale Creation Failed",
        "error"
      );
    }
  };

  const handleBack = () => navigate("/Sale");

  const title = isViewMode
    ? "View Sale"
    : isEditMode
    ? "Edit Sale"
    : "Create Sale";
  const unitOptions = UNITS.map((u) => ({ value: u, label: u }));
  const priceUnitTypeOptions = PRICE_UNIT_TYPES.map((pt) => ({
    value: pt,
    label: pt,
  }));

  return (
    <div id="main">
      <Container fluid className="py-5">
        <Row className="py-3">
          <Col>
            <Row className="mb-3">
              <Col md={9}>
                <Row className="mb-3">
                  <Col md={6}>
                    <label>Customer Name</label>
                    <div className="d-flex gap-2">
                      <Select
                        options={customers}
                        value={
                          customers.find(
                            (o) => o.value === formData.parties_id
                          ) || null
                        }
                        onChange={isDisabled ? undefined : handlePartySelect}
                        placeholder="Select Customer"
                        isClearable
                        isDisabled={isDisabled}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <TextInputform
                      formLabel="Phone Number"
                      formtype="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      readOnly={isDisabled}
                    />
                  </Col>
                </Row>
                {credit && (
                  <Row className="mb-3">
                    <Col md={6}>
                      <TextArea
                        textlabel="Billing Address"
                        value={formData.billing_address}
                        onChange={(e) =>
                          handleInputChange("billing_address", e.target.value)
                        }
                        readOnly={isDisabled}
                      />
                    </Col>
                    <Col md={6}>
                      <TextArea
                        textlabel="Shipping Address"
                        value={formData.shipping_address}
                        onChange={(e) =>
                          handleInputChange("shipping_address", e.target.value)
                        }
                        readOnly={isDisabled}
                      />
                    </Col>
                  </Row>
                )}
              </Col>
              <Col md={3} style={{ zIndex: 100 }}>
                <TextInputform
                  formLabel="Invoice Number"
                  value={formData.invoice_no}
                  onChange={(e) =>
                    handleInputChange("invoice_no", e.target.value)
                  }
                  readOnly={isDisabled}
                />
                <Calender
                  calenderlabel="Invoice Date"
                  initialDate={formData.invoice_date}
                  setLabel={
                    isDisabled
                      ? undefined
                      : (date) => handleInputChange("invoice_date", date)
                  }
                />
                <DropDown
                  textlabel="State of supply"
                  value={formData.state_of_supply}
                  onChange={(e) =>
                    handleInputChange("state_of_supply", e.target.value)
                  }
                  options={STATE_OF_SUPPLY_OPTIONS}
                  disabled={isDisabled}
                />
              </Col>
            </Row>

            {!isViewMode && (
              <div className="mb-3">
                <label className="me-2">Credit</label>
                <input
                  type="checkbox"
                  checked={credit}
                  onChange={toggleCredit}
                />
              </div>
            )}

            <Row className="item-table-row mt-4">
              <Col>
                <Table bordered>
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
                    {formData.rows.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <TextInputform
                            value={row.item}
                            onChange={(e) =>
                              onRowChange(row.id, "item", e.target.value)
                            }
                            readOnly={isDisabled}
                          />
                        </td>
                        <td>
                          <TextInputform
                            formtype="number"
                            value={row.qty}
                            onChange={(e) =>
                              onRowChange(row.id, "qty", e.target.value)
                            }
                            readOnly={isDisabled}
                          />
                        </td>
                        <td>
                          <DropDown
                            value={row.unit}
                            onChange={(v) => onRowChange(row.id, "unit", v)}
                            options={unitOptions}
                            disabled={isDisabled}
                          />
                        </td>
                        <td>
                          <TextInputform
                            formtype="number"
                            value={row.price}
                            onChange={(e) =>
                              onRowChange(row.id, "price", e.target.value)
                            }
                            readOnly={isDisabled}
                          />
                        </td>
                        <td>
                          <DropDown
                            value={row.priceUnitType}
                            onChange={(v) =>
                              onRowChange(row.id, "priceUnitType", v)
                            }
                            options={priceUnitTypeOptions}
                            disabled={isDisabled}
                          />
                        </td>
                        <td>
                          <InputGroup size="sm">
                            <FormControl
                              type="number"
                              placeholder="%"
                              value={row.discountPercent}
                              onChange={(e) =>
                                onRowChange(
                                  row.id,
                                  "discountPercent",
                                  e.target.value
                                )
                              }
                              readOnly={isDisabled}
                            />
                            <FormControl value={row.discountAmount} readOnly />
                          </InputGroup>
                        </td>
                        <td>
                          <Select
                            value={
                              TAX_OPTIONS.find(
                                (opt) =>
                                  String(opt.value) === String(row.taxPercent)
                              ) || TAX_OPTIONS[0]
                            }
                            onChange={(v) =>
                              onRowChange(row.id, "taxPercent", v)
                            }
                            options={TAX_OPTIONS}
                            isDisabled={isDisabled}
                            menuPortalTarget={document.body}
                          />
                          <TextInputform
                            readOnly
                            value={row.taxAmount || "0.00"}
                          />
                        </td>
                        <td>
                          <TextInputform readOnly value={row.amount} />
                        </td>
                        <td>
                          {!isViewMode && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => deleteRow(row.id)}
                            >
                              <FaTimes />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {!isViewMode && (
                      <tr>
                        <td colSpan="9">
                          <Button size="sm" onClick={addRow}>
                            <FaPlus /> ADD ROW
                          </Button>
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

            <Row className="additional-actions mt-3 align-items-center">
              <Col xs={3}>
                <DropDown
                  textlabel="Payment Type"
                  value={formData.payment_type}
                  onChange={(e) =>
                    handleInputChange("payment_type", e.target.value)
                  }
                  options={PAYMENT_OPTIONS}
                  disabled={isDisabled}
                />
              </Col>
              <Col className="d-flex justify-content-end align-items-center gap-2">
                <CheckBox
                  OnChange={handleRoundOffToggle}
                  boxLabel="Round Off"
                  type="checkbox"
                  checked={formData.rount_off === 1}
                  disabled={isDisabled}
                />
                <TextInputform
                  formtype="number"
                  value={formData.round_off_amount}
                  onChange={handleRoundOffChange}
                  readOnly={formData.rount_off !== 1 || isDisabled}
                />
                <strong>Total</strong>
                <TextInputform readOnly value={formData.total} />
              </Col>
            </Row>

            {!isViewMode && (
              <Row className="py-3">
                <Col className="d-flex justify-content-between align-items-end">
                  <Button variant="secondary" onClick={handleBack} size="lg">
                    Back
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={handleSave}
                    size="lg"
                  >
                    {isEditMode ? "Update Sale" : "Save Sale"}
                  </Button>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SaleCreation;
