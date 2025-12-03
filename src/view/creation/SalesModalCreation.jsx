import React, { useState, useEffect,useRef } from "react";
import {Container,Row,Col,Form,Button,InputGroup,FormControl,Table,} from "react-bootstrap";
import { FaTimes, FaPlus } from "react-icons/fa";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {fetchParties,createSale,updateSale,searchSales,} from "../../slice/saleSlice";
import {TextInputform,TextArea,DropDown,Calender,CheckBox,} from "../../components/Forms";
import NotifyData from "../../components/NotifyData";
import Modal from "react-bootstrap/Modal";
import { Color } from "antd/es/color-picker";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { fetchCategories } from "../../slice/CategorySlice"; // correct path
import { fetchProducts } from "../../slice/ProductSlice";
// Static options
const UNITS = ["NONE", "KG", "Litre", "Piece","meters"];
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
  { value: "check", label: "Check" },
  { value: "Cash", label: "Cash" }
  
];
const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const INITIAL_ROW = {
  id: generateUniqueId(),
  product_id: "",        
  product_name: "",
  category: "",
  Description: "",
  hsn_code:"",
  qty: "",
  unit: "NONE",
  priceUnitType: "Without Tax",
  price: "",
  discountPercent: "",
  discountAmount: "0.00",
  taxPercent: 0,
  taxAmount: "0.00",
  amount: "0.00"
  
};
console.log("INITIAL_ROW",INITIAL_ROW)

const SaleCreation = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { id } = useParams();
const location = useLocation();
const [selectedPartyOption, setSelectedPartyOption] = useState(null);
const { parties, partiesStatus, sales } = useSelector((state) => state.sale);
const isEditMode = location.pathname.startsWith("/sale/edit");
const isViewMode = location.pathname.startsWith("/sale/view");
const isCreateMode = location.pathname === "/sale/create";
const isDisabled = isViewMode;
const [imagePreview, setImagePreview] = useState("");        // To show preview
const [imageFileName, setImageFileName] = useState("");      // To show filename
const [attachedDocs, setAttachedDocs] = useState([]); // [{name, data, previewUrl}]
const { categories = [], status: categoryStatus = "idle" } = useSelector((state) => state.category);
const { products, status: productStatus } = useSelector(state => state.product);

const [showProductTable, setShowProductTable] = useState(false);

console.log("products value",products);
console.log("categories",categories)
// const fileInputRef = useRef(null);
const [hasUserUploadedImage, setHasUserUploadedImage] = useState(false);//for edit image
const [showImageModal, setShowImageModal] = useState(false);
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
    description: "",
    add_image:"",
    rows: [INITIAL_ROW],
    rount_off: 0,
    round_off_amount: "0",
    total: "0.00",
    received_amount: " ",
    visibleColumns: {
    category: false,
    description: false,
    hsn_code: false,
    
  },
  });
  const handleReceivedAmountChange = (e) => {
  const value = e.target.value;
  setFormData(prev => ({
    ...prev,
    received_amount: value || " "
  }));
};
  console.log(formData)
  const [credit, setCredit] = useState(true);
  const [customers, setCustomers] = useState([ { value: "", label: "Select Party" },]);
  const [isManualRoundOff, setIsManualRoundOff] = useState(false);
  const saleToEdit = id ? sales.find((s) => s.sale_id == id) : null;
  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Check file size (optional - max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }
    setImageFileName(file.name);
    setHasUserUploadedImage(true); // ← Mark that user uploaded new image
  const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImagePreview(base64String);
      setFormData(prev => ({
        ...prev,
        add_image: base64String  // This is what gets saved in DB
      }));
    };
    reader.readAsDataURL(file);
  }
};
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

   const loadCategories = () => {
      dispatch(fetchCategories());
    };
  
    useEffect(() => {
      loadCategories();
    }, [dispatch]);

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
useEffect(() => {
  if (isCreateMode) {
    setImagePreview("");
    setImageFileName("");
    setAttachedDocs([]);
    setHasUserUploadedImage(false);
  }
}, [isCreateMode]);

///fetch items
const categoryOptions = [
  { value: "", label: "Select Category" },
  ...categories.map(cat => ({
    value: cat.category_name || cat.name,  // adjust based on your API response
    label: cat.category_name || cat.name
  }))
];
// Fetch products when component mounts
useEffect(() => {
  if (productStatus === "idle") {
    dispatch(fetchProducts(""));
  }
}, [productStatus, dispatch]);

const productOptions = React.useMemo(() => {
  return products.map(p => {
    let salePrice = "0";
    try {
      const sp = JSON.parse(p.sale_price || "{}");
      salePrice = sp.price || "0";
    } catch (e) {}

    return {
      value: p.product_name,
      label: `${p.product_name} - ₹${salePrice}`,
      product_id: p.product_id,
      hsn_code: p.hsn_code || "",
      salePrice: salePrice
    };
  });
}, [products]);
console.log("productOptions",productOptions)

// Auto-show HSN column when any row has HSN filled

useEffect(() => {
  // const hasAnyHsn = formData.rows.some(row => row.hsn_code && row.hsn_code.trim() !== "");
  const hasAnyHsn = formData.rows.some(row => {
  const hsn = String(row.hsn_code || "").trim();
  return hsn !== "";
})
  setFormData(prev => ({
    ...prev,
    visibleColumns: {
      ...prev.visibleColumns,
      hsn_code: hasAnyHsn
    }
  }));
}, [formData.rows]);

useEffect(() => {
  if (!saleToEdit) return;

  let itemsArray = [];
  try {
    itemsArray = JSON.parse(saleToEdit.products || "[]");
  } catch (e) {
    console.error("Failed to parse products JSON", e);
    itemsArray = [];
  }


  const rows = Array.isArray(itemsArray) && itemsArray.length > 0
    ? itemsArray.map((product, index) => ({  // ← renamed to 'product' to avoid confusion
        id: generateUniqueId(),
        product_id: product.product_id || "",           
        product_name: product.product_name || "", 
        hsn_code: product.hsn_code || "",
        category: String(product.category || ""),
        
        Description: String(product.Description || ""),  // ← capital D!
        qty: String(product.qty || ""),
        unit: String(product.unit || "NONE"),
        priceUnitType: String(product.priceUnitType || "Without Tax"),
        price: String(product.price || ""),
        discountPercent: String(product.discountPercent || ""),
        discountAmount: String(product.discountAmount || "0.00"),
        taxPercent: Number(product.taxPercent || 0),
        taxAmount: String(product.taxAmount || "0.00"),
        amount: String(product.amount || "0.00"),
      }))
    : [INITIAL_ROW];

  // ... rest of your code (party selection, totals, etc.)
    if (saleToEdit.parties_id) {
    const partyFromList = parties.find(p => p.id == saleToEdit.parties_id || p.parties_id == saleToEdit.parties_id);
    if (partyFromList) {
      setSelectedPartyOption({
        value: partyFromList.id,
        label: partyFromList.name
      });
    }
  }

  const totalAmountRaw = rows.reduce((a, r) => a + Number(r.amount || 0), 0);
  const rount_off = Number(saleToEdit.rount_off || 0);
  const round_off_amount = String(saleToEdit.round_off_amount || "0");
  const finalRound = rount_off === 1 ? Number(round_off_amount) : 0;
  const total = (totalAmountRaw + finalRound).toFixed(2);

  // Auto vs Manual round-off detection
  let manual = false;
  if (rount_off === 1) {
    const autoRound = calculateAutoRoundOff(totalAmountRaw);
    manual = Math.abs(Number(round_off_amount) - Number(autoRound)) > 0.01;
  }
  setIsManualRoundOff(manual);

  // Reset image state properly
  setImagePreview(saleToEdit.add_image || "");
  setImageFileName(""); // or set to something like "Previously uploaded"
  setHasUserUploadedImage(false); // Important: user hasn't uploaded new one yet

  // Parse documents
  let docs = [];
  if (saleToEdit.documents) {
    try {
      docs = JSON.parse(saleToEdit.documents);
    } catch (e) {
      console.error("Failed to parse documents", e);
    }
  }
  setAttachedDocs(docs.map(d => ({ name: d.name, data: d.data })));

  setFormData({
    parties_id: saleToEdit.parties_id || "",
    name: saleToEdit.name || "",
    phone: saleToEdit.phone || "",
    billing_address: saleToEdit.billing_address || "",
    shipping_address: saleToEdit.shipping_address || "",
    invoice_no: saleToEdit.invoice_no || "",
    invoice_date: saleToEdit.invoice_date || new Date().toISOString().split("T")[0],
    state_of_supply: saleToEdit.state_of_supply || "",
    payment_type: saleToEdit.payment_type || "",
    description: saleToEdit.description || "",
    add_image: saleToEdit.add_image || "", // ← Always use directly from DB
    rows,
    rount_off,
    round_off_amount,
    total,
    received_amount: saleToEdit.received_amount || " ",
    visibleColumns: {
      category: false,
      description:false,
      hsn_code:false,
      
    },
  });
}, [saleToEdit,parties]); // ← Only depend on saleToEdit

  const handleDocumentUpload = (e) => {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert(`File ${file.name} is too large (max 10MB)`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedDocs(prev => [...prev, {
        name: file.name,
        data: reader.result, // base64 with mime
      }]);
    };
    reader.readAsDataURL(file);
  });
};
const documentsJson = JSON.stringify(attachedDocs.map(doc => ({
  name: doc.name,
  data: doc.data
})));

const payload = {
  ...formData,
  documents: documentsJson,
  // keep add_image as before
};

const removeDocument = (index) => {
  setAttachedDocs(prev => prev.filter((_, i) => i !== index));
};
// Computed totals
const totalQty = formData.rows.reduce((a, r) => a + (Number(r.qty) || 0), 0);
const totalDiscount = formData.rows.reduce( (a, r) => a + (Number(r.discountAmount) || 0), 0);
const totalTax = formData.rows.reduce( (a, r) => a + (Number(r.taxAmount) || 0),0);
const totalAmountRaw = formData.rows.reduce((a, r) => a + (Number(r.amount) || 0),0 );
const calculateAutoRoundOff = (amount) =>(Math.round(amount) - amount).toFixed(2);
const handlePartySelect = (selectedOption) => {
  if (!selectedOption) {
    setSelectedPartyOption(null);
    setFormData(prev => ({
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

  if (selectedOption.value === "add_party") {
    // handle add party logic
    return;
  }

  const selectedParty = parties.find(p => p.id === selectedOption.value);
  if (selectedParty) {
    setSelectedPartyOption(selectedOption); // ← Important!

    setFormData(prev => ({
      ...prev,
      parties_id: selectedParty.parties_id || selectedParty.id || "",
      name: selectedParty.name || "",
      phone: selectedParty.phone || "",
      billing_address: selectedParty.billing_address || "",
      shipping_address: selectedParty.shipping_address || "",
      state_of_supply: selectedParty.state_of_supply || "",
    }));
  }
};
const toggleCredit = () => setCredit(!credit);
const deleteRow = (id) => {
const newRows = formData.rows.filter((r) => r.id !== id);
const newTotalAmountRaw = newRows.reduce( (a, r) => a + Number(r.amount || 0),0);
let finalRound = formData.rount_off === 1 ? Number(formData.round_off_amount) : 0;
    if (formData.rount_off === 1 && !isManualRoundOff) {
      const autoRound = calculateAutoRoundOff(newTotalAmountRaw);
      finalRound = Number(autoRound);
      setFormData((prev) => ({ ...prev, round_off_amount: autoRound }));
    }
const newTotal = (newTotalAmountRaw + finalRound).toFixed(2);
    setFormData((prev) => ({ ...prev, rows: newRows, total: newTotal }));
  };

const addRow = () => {
    const newRows = [...formData.rows, { ...INITIAL_ROW, id: generateUniqueId() }];  // Use unique ID for new row
    const newTotalAmountRaw = newRows.reduce((a, r) => a + Number(r.amount || 0), 0);
    let finalRound = formData.rount_off === 1 ? Number(formData.round_off_amount) : 0;
    if (formData.rount_off === 1 && !isManualRoundOff) {
      const autoRound = calculateAutoRoundOff(newTotalAmountRaw);
      finalRound = Number(autoRound);
      setFormData((prev) => ({ ...prev, round_off_amount: autoRound }));
    }
    const newTotal = (newTotalAmountRaw + finalRound).toFixed(2);
    setFormData((prev) => ({ ...prev, rows: newRows, total: newTotal }));
  };
const onRowChange = (id, field, value) => {
  setFormData(prev => {
    const newRows = prev.rows.map(row => {
      if (row.id !== id) return row;

      // Handle Select component (value is object) vs input (value is in target)
      let actualValue = value;
      if (value && value.target) actualValue = value.target.value;
      if (value && value.value !== undefined) actualValue = value.value;

      const updatedRow = { ...row, [field]: actualValue };

      // Recalculate amounts
      const qty = Number(updatedRow.qty) || 0;
      const price = Number(updatedRow.price) || 0;
      const discountPercent = Number(updatedRow.discountPercent) || 0;
      const taxPercent = Number(updatedRow.taxPercent) || 0;
      const priceUnitType = updatedRow.priceUnitType || "Without Tax";

      let basicTotal = qty * price;
      const discountAmount = (basicTotal * discountPercent) / 100;
      let taxableAmount = basicTotal - discountAmount;
      let taxAmount = 0;
      let finalAmount = taxableAmount;

      if (priceUnitType === "Without Tax") {
        taxAmount = (taxableAmount * taxPercent) / 100;
        finalAmount = taxableAmount + taxAmount;
      } else {
        taxAmount = (taxableAmount * taxPercent) / (100 + taxPercent);
        finalAmount = taxableAmount;
      }

      return {
        ...updatedRow,
        discountAmount: discountAmount.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        amount: finalAmount.toFixed(2),
      };
    });

    // Recalculate total
    const totalAmountRaw = newRows.reduce((sum, r) => sum + Number(r.amount || 0), 0);
    let finalTotal = totalAmountRaw;
    let roundOffAmt = prev.round_off_amount;

    if (prev.rount_off === 1) {
      if (!isManualRoundOff) {
        roundOffAmt = (Math.round(totalAmountRaw) - totalAmountRaw).toFixed(2);
      }
      finalTotal = (totalAmountRaw + Number(roundOffAmt)).toFixed(2);
    } else {
      finalTotal = totalAmountRaw.toFixed(2);
    }

    return {
      ...prev,
      rows: newRows,
      total: finalTotal,
      round_off_amount: prev.rount_off === 1 ? roundOffAmt : "0",
    };
  });
};
const handleRoundOffChange = (e) => {
const val = e.target.value || "0";
    setIsManualRoundOff(true);
const newTotalAmountRaw = formData.rows.reduce((a, r) => a + Number(r.amount || 0),0);
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
const newTotalAmountRaw = formData.rows.reduce((a, r) => a + Number(r.amount || 0),0);
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
  console.log("444")
  try {
    // 1. Prepare documents JSON
    const documentsJson = JSON.stringify(
      attachedDocs.map(doc => ({
        name: doc.name,
        data: doc.data
      }))
    );
    console.log("documentsJson",documentsJson)

    // 2. Final payload
    // Create payload WITHOUT mutating formData
const payload = {
  ...formData,
  products: JSON.stringify(formData.rows), // ← Safe: rows still exist here
  add_image: formData.add_image || "",
  documents: documentsJson,
  invoice_no: formData.invoice_no,
  total: formData.total,
  rount_off: formData.rount_off ? 1 : 0,
  round_off_amount: formData.round_off_amount,
  received_amount: formData.received_amount || 0,
};

// Only AFTER stringifying, remove rows (optional, but safe now)
delete payload.rows;
     console.log("payload",payload);
    // VERY IMPORTANT: Only add edit_sales_id in EDIT mode
    if (isEditMode) {
      payload.edit_sales_id = id;
    }
    // In create mode → DO NOT send edit_sales_id

    delete payload.rows;

    console.log("Sending payload:", payload);

    if (isEditMode) {
      await dispatch(updateSale(payload)).unwrap();
      NotifyData("Sale Updated Successfully!", "success");
    } else {
      await dispatch(createSale(payload)).unwrap();
      NotifyData("Sale Created Successfully!", "success");
    }

    dispatch(searchSales(""));
    navigate("/sale");

  } catch (err) {
    console.error("Save error:", err);
    NotifyData(err || "Failed to save sale", "error");
  }
};
const handleBack = () => navigate("/Sale");
const title = isViewMode? "View Sale": isEditMode  ? "Edit Sale" : "Create Sale";
const unitOptions = UNITS.map((u) => ({ value: u, label: u }));
const priceUnitTypeOptions = PRICE_UNIT_TYPES.map((pt) => ({value: pt, label: pt,}));
 return (
    <div id="main">
      <Container fluid className="py-5">
        <Row className="py-3">
          <Col>
            <Row className="mb-3">
              <Col md={9}>
                <Row className="mb-3">
                  {!isViewMode && (
                  <div className="mb-3">
                  <label className="me-2">Credit</label>
                  <input type="checkbox" checked={credit} onChange={toggleCredit}/>
                  <label className="me-2">Cash</label>
                  </div>)}
                  <Col md={3}>
                  <label>Customer Name</label>
                  <div className="d-flex gap-2">
                    <Select
                        value={selectedPartyOption}  // ← This is the fix!
                        options={customers}
                        onChange={handlePartySelect}
                        placeholder="Select Customer"
                        isClearable
                        isDisabled={isDisabled}/>

                  </div>
                  </Col>
                  <Col md={3}>
                    <TextInputform  formLabel="Phone Number" formtype="tel"value={formData.phone}  onChange={(e) =>handleInputChange("phone", e.target.value) }readOnly={isDisabled}/>
                  </Col>
                </Row>
                {credit && (
                  <Row className="mb-3">
                    <Col md={3}>
                      <TextArea textlabel="Billing Address" value={formData.billing_address} onChange={(e) => handleInputChange("billing_address", e.target.value)}readOnly={isDisabled}/>
                    </Col>
                    <Col md={3}>
                      <TextArea textlabel="Shipping Address"  value={formData.shipping_address}  onChange={(e) => handleInputChange("shipping_address", e.target.value)} readOnly={isDisabled}/>
                    </Col>
                  </Row>
                )}
                </Col>
                <Col md={2} style={{ zIndex: 100 }}>
                <TextInputform formLabel="Invoice Number" value={formData.invoice_no}  onChange={(e) =>  handleInputChange("invoice_no", e.target.value)} readOnly={isDisabled}/>
                <Calender calenderlabel="Invoice Date" initialDate={formData.invoice_date}/>
                <DropDown textlabel="State of supply" value={formData.state_of_supply} onChange={(e) =>  handleInputChange("state_of_supply", e.target.value)} options={STATE_OF_SUPPLY_OPTIONS} disabled={isDisabled}/>
                </Col>
              </Row>
              <Row className="item-table-row mt-4">
              <Col>
                <Table bordered >
                 <thead>
                 <tr>
                 <th>#</th>
                 {formData.visibleColumns.category && <th>Category</th>}
                 <th>Item</th>
                 {formData.visibleColumns.description && <th>Description</th>}
                 {formData.visibleColumns.hsn_code && <th>HSN_code</th>}
                 <th>Qty</th>
                 <th>Unit</th>
                 <th>Price</th>
                 <th >Price/unit</th>
                {formData.visibleColumns.discount && <th>Discount</th>}
                <th>Tax</th>
                <th>
        <DropdownButton
          id="amount-column-dropdown"
          title={<span style={{ fontSize: "1rem", fontWeight: "bold" }}>Amount <FaPlus /></span>}
          size="sm"
          align="end"
          className="p-0 border-0 text-success shadow-none"
          style={{ background: "transparent", boxShadow: "none" }}
        >
          {[
            { key: "category", label: "Category" },
            { key: "hsn_code", label: "HSN-Code" },
            { key: "description", label: "Description" },
            { key: "discount", label: "Discount" },
            
            
          ].map(col => (
            <Dropdown.Item key={col.key} as="div" className="d-flex align-items-center px-3 py-2">
              <Form.Check
                type="checkbox"
                label={col.label}
                checked={formData.visibleColumns[col.key] || false}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  visibleColumns: { ...prev.visibleColumns, [col.key]: e.target.checked }
                }))}
                disabled={isDisabled}
              />
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          <Dropdown.Item className="text-primary fw-bold">More Settings</Dropdown.Item>
        </DropdownButton>
      </th>
      <th>Actions</th>
    </tr>
  </thead>
 
      <tbody>
  {formData.rows.map((row, index) => (
    <tr key={row.id}>
      <td>{index + 1}</td>        {/* ← ADD THIS LINE */}
      


{formData.visibleColumns.category && (
  <td style={{ minWidth: "180px" }}>
    <Select
      options={[
        { value: "", label: "ALL" },
        ...categories.map(cat => ({
          value: cat.category_name,
          label: cat.category_name
        }))
      ]}
      value={{ 
        value: row.category || "", 
        label: row.category ? row.category : "ALL" 
      }}
      onChange={(option) => {
        const selectedCat = option.value;
        onRowChange(row.id, "category", selectedCat);
      }}
      placeholder="Select Category"
      isDisabled={isDisabled}
      menuPortalTarget={document.body}
      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
    />
  </td>
)}

<td style={{ minWidth: "300px", position: "relative" }}>
  {/* Clickable Input Field - Looks like dropdown but opens table */}
  <div
    onClick={() => !isDisabled && setShowProductTable(true)}
    style={{
      padding: "8px 12px",
      border: "1px solid #ced4da",
      borderRadius: "6px",
      backgroundColor: isDisabled ? "#e9ecef" : "white",
      cursor: isDisabled ? "not-allowed" : "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      minHeight: "38px"
    }}
  >
    <span style={{ color: row.product_name ? "#000" : "#999" }}>
      {row.product_name || "Click to select item..."}
    </span>
    
  </div>

  {/* BIG PRODUCT TABLE POPUP - ONLY THIS WILL SHOW */}
  {showProductTable && (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }} onClick={() => setShowProductTable(false)}>
      
      <div
        style={{
          width: "90%",
          maxWidth: "1100px",
          height: "85vh",
          background: "white",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
        }}
        onClick={(e) => e.stopPropagation()} // Don't close when clicking inside
      >
        {/* Header */}
        <div className="p-3 bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Select Product</h4>
          <Button variant="light" size="sm" onClick={() => setShowProductTable(false)}>
            X Close
          </Button>
        </div>

        {/* Search Box */}
        <div className="p-3 border-bottom">
          <input
            type="text"
            placeholder="Search product..."
            className="form-control"
            onChange={(e) => {
              const term = e.target.value.toLowerCase();
              // You can filter products here if you want
            }}
            autoFocus
          />
        </div>

        {/* Table */}
        <div style={{ height: "calc(85vh - 140px)", overflowY: "auto" }}>
          <Table bordered hover className="mb-0">
            <thead className="table-light sticky-top">
              <tr>
                <th>Product Name</th>
                <th className="text-end">Sale Price</th>
                <th className="text-end">Stock</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
  {products
  .filter(product => {
    // Use current row's category instead of global selectedCategory
    if (!row.category || row.category === "" || row.category === "ALL") return true;

    const productCat = product.category_name || "";
    return productCat === row.category;
  })
  .map((product) => {
    let salePrice = "0";
    let stock = "0";
    let location = "-";

    try {
      const sp = JSON.parse(product.sale_price || "{}");
      salePrice = sp.price || "0";
    } catch (e) {}
    try {
      const st = JSON.parse(product.stock || "{}");
      stock = st.opening_qty || "0";
      location = st.location || "-";
    } catch (e) {}

    return (
      <tr
        key={product.product_id}
        style={{ cursor: "pointer" }}
        className="hover-row"
        onClick={() => {
          onRowChange(row.id, "product_name", product.product_name);
          onRowChange(row.id, "product_id", product.product_id);
          onRowChange(row.id, "hsn_code", product.hsn_code || "");
          onRowChange(row.id, "price", salePrice);
          onRowChange(row.id, "qty", " ");

          // Auto-fill category when product is selected
          const cat = product.category_name || "";
          onRowChange(row.id, "category", cat);
          // AUTO-FILL UNIT from product.unit_value
          const unitValue = product.unit_value || "";
          onRowChange(row.id, "unit", unitValue);
          

          setShowProductTable(false);
        }}
      >
        <td><strong>{product.product_name}</strong></td>
        <td className="text-end text-success fw-bold">₹{salePrice}</td>
        <td className="text-center">{stock}</td>
        <td className="text-center">{location}</td>
      </tr>
    );
  })}

{/* Show message if no products - also update this part */}
{products.filter(p => {
  if (!row.category || row.category === "" || row.category === "ALL") return true;
  const cat = p.category_name || "";
  return cat === row.category;
}).length === 0 && (
  <tr>
    <td colSpan="4" className="text-center py-5 text-muted">
      <h5>No products found in "{row.category}" category</h5>
      <small>Available categories: stationary, groceries</small>
    </td>
  </tr>
)}
</tbody>
          </Table>
        </div>
      </div>
    </div>
  )}
</td>


{formData.visibleColumns.description && (
  <td style={{minWidth:"180px"}}>
    <TextArea
      value={row.Description || ""}
      onChange={(e) => onRowChange(row.id, "Description", e.target.value)}
      readOnly={isDisabled}
      placeholder="Enter item description"
      rows={2}
    />
  </td>
)}
{formData.visibleColumns.hsn_code && (
  <td style={{minWidth:"100px"}}>
  <TextArea
    type="text"
    value={String(row.hsn_code || "").trim()}
    onChange={(e) => onRowChange(row.id, "hsn_code", e.target.value)}
    readOnly={isDisabled}
  />
</td>
)}

        <td style={{minWidth:"100px"}}><TextInputform expanse="number" value={row.qty} onChange={(e) => onRowChange(row.id, "qty", e.target.value)} readOnly={isDisabled} /></td>
        <td style={{minWidth:"150px"}}><DropDown value={row.unit} onChange={(v) => onRowChange(row.id, "unit", v)} options={unitOptions} disabled={isDisabled} /></td>
        <td style={{minWidth:"100px"}}><TextInputform formtype="number" value={row.price} onChange={(e) => onRowChange(row.id, "price", e.target.value)} readOnly={isDisabled} /></td>
        <td style={{minWidth:"100px"}}><DropDown value={row.priceUnitType} onChange={(v) => onRowChange(row.id, "priceUnitType", v)} options={priceUnitTypeOptions} disabled={isDisabled} /></td>

        {formData.visibleColumns.discount && (
          <td style={{minWidth:"100px"}}>
            <InputGroup size="sm">
              <FormControl type="number" placeholder="%" value={row.discountPercent} onChange={(e) => onRowChange(row.id, "discountPercent", e.target.value)} readOnly={isDisabled} />
              <FormControl value={row.discountAmount} readOnly />
            </InputGroup>
          </td>
        )}

        <td style={{minWidth:"100px"}}>
          <Select value={TAX_OPTIONS.find(opt => String(opt.value) === String(row.taxPercent)) || TAX_OPTIONS[0]}
            onChange={(v) => onRowChange(row.id, "taxPercent", v)} options={TAX_OPTIONS} isDisabled={isDisabled} menuPortalTarget={document.body} />
          <TextInputform readOnly value={row.taxAmount || "0.00"} />
        </td>
        <td><TextInputform readOnly value={row.amount} /></td>
        <td>{!isViewMode && <Button variant="danger" size="sm" onClick={() => deleteRow(row.id)}><FaTimes /></Button>}</td>
      </tr>
    ))}

    {!isViewMode && (
      <tr>
        <td colSpan="20">
          <Button size="sm" onClick={addRow}><FaPlus /> ADD ROW</Button>
        </td>
      </tr>
    )}

    <tr>
      <td colSpan={2 + Object.values(formData.visibleColumns).filter(Boolean).length}>
        <strong>TOTAL</strong>
      </td>
      <td>{totalQty}</td>
      <td colSpan="5"></td>
      {formData.visibleColumns.discount && <td>{totalDiscount.toFixed(2)}</td>}
      <td>{totalTax.toFixed(2)}</td>
      <td>{totalAmountRaw.toFixed(2)}</td>
      <td colSpan="2"></td>
    </tr>
  </tbody>
</Table>
                
              </Col>
            </Row>

            <Row className="additional-actions mt-3 align-items-center">
              <Col xs={3}>
                <DropDown textlabel="Payment Type" value={formData.payment_type} onChange={(e) =>handleInputChange("payment_type", e.target.value)}options={PAYMENT_OPTIONS} disabled={isDisabled} />
              </Col>
              <Row className="additional-actions mt-3 align-items-center">
              <Col xs={3}>
                <TextInputform formLabel="Description" value={formData.description || ""}onChange={(e) => handleInputChange("description", e.target.value)}readOnly={isDisabled}placeholder="Enter description (optional)" />
              </Col>
            </Row>
            <Row className="mt-3">
  <Col xs={3}>
  <label className="form-label">Add Image</label>

  {/* Clickable upload area */}
  <label
    htmlFor="sale-image-upload"
    style={{
      border: '2px solid #ced4da',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f8fbff',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.5 : 1,
      display: 'block'
    }}
  >
    {imagePreview ? (
      <>
        <div 
      onClick={(e) => {
        e.stopPropagation();     // ← Stops click from reaching the <label>
        e.preventDefault();      // ← Extra safety
        setShowImageModal(true);
      }}
      style={{ display: 'inline-block', cursor: 'zoom-in' }}
    >
      <img
        src={imagePreview}
        alt="Preview"
        style={{
          maxWidth: '100%',
          maxHeight: '200px',
          borderRadius: '8px',
          transition: '0.3s',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          pointerEvents: 'none'  // ← IMPORTANT: Image itself won't trigger events
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      />
    </div>
      
        {imageFileName && <p className="text-success"><strong>{imageFileName}</strong></p>}
      </>
    ) : (
      <>
        <i className="fas fa-cloud-upload-alt fa-3x text-primary mb-3"></i>
        <p><strong>Click to Upload Image</strong></p>
      </>
    )}
  </label>

  {/* Hidden file input */}
  <input
    id="sale-image-upload"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    style={{ display: 'none' }}
    disabled={isDisabled}
  />

  {/* Remove Image Button */}
  {imagePreview && !isDisabled && (
    <Button
      variant="outline-danger"
      size="sm"
      className="mt-2"
      onClick={() => {
        setImagePreview("");
        setImageFileName("");
        setHasUserUploadedImage(true);
        setFormData(prev => ({ ...prev, add_image: "" }));
        document.getElementById('sale-image-upload').value = "";
      }}
    >
      X
    </Button>
  )}
</Col>
          {/* If in Edit/View mode and image exists, show preview */}
          {formData.add_image && !imagePreview && (
          <Col md={4}>
          <label className="form-label">Current Image</label>
          <img src={formData.add_image} alt="Attached"
            //  style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #ddd' }}
          />
        </Col>
         )}
        </Row>
        <Col xs={3}  className="mt-4">
  <label className="form-label">Attach Documents (PDF/Excel)</label>
  
  <label
    htmlFor="doc-upload"
    style={{
      border: '2px solid #ced4da',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f8fff9',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      display: 'block'
    }}
  >
    <i className="fas fa-file-upload fa-3x text-success mb-3"></i>
    <p><strong>Click to upload PDF or Excel files</strong><br/>
    <small>Multiple files allowed</small></p>
  </label>

  <input
    id="doc-upload"
    type="file"
    accept=".pdf, .xlsx, .xls, " //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel
    multiple
    onChange={handleDocumentUpload}
    style={{ display: 'none' }}
    disabled={isDisabled}
  />

  {/* Show attached files */}
  {attachedDocs.length > 0 && (
    <div className="mt-3">
      <h6>Attached Files:</h6>
      {attachedDocs.map((doc, idx) => (
        <div key={idx} className="d-flex align-items-center gap-2 mb-2 p-2 border rounded">
          {doc.name.endsWith('.pdf') ? 
            <i className="fas fa-file-pdf text-danger fa-2x"></i> :
            <i className="fas fa-file-excel text-success fa-2x"></i>
          }
          <div className="flex-grow-1">
            <small className="d-block text-truncate" style={{maxWidth: '300px'}}>{doc.name}</small>
            <a href={doc.data} download={doc.name} className="text-primary small">Download</a>
          </div>
          {!isDisabled && (
            <Button 
              size="sm" 
              variant="outline-danger"
              onClick={() => removeDocument(idx)}
            >×</Button>
          )}
        </div>
      ))}
    </div>
  )}
</Col>
        <Col className="d-flex justify-content-end align-items-center gap-2">
            <CheckBox OnChange={handleRoundOffToggle} boxLabel="Round Off" type="checkbox" checked={formData.rount_off === 1} disabled={isDisabled}/>
              <TextInputform formtype="number" value={formData.round_off_amount} onChange={handleRoundOffChange} readOnly={formData.rount_off !== 1 || isDisabled}/>
                <strong>Total</strong>
              <TextInputform readOnly value={formData.total} />
              {/* Received Amount Row */}
              
    <div className="d-flex align-items-center gap-3 mb-2">
      <strong style={{ width: "140px" }}>Received Amount</strong>
      <TextInputform
        formtype="number"
        step="0.01"
        value={formData.received_amount || ""}
        onChange={(e) => handleInputChange("received_amount", e.target.value)}
        readOnly={isDisabled}
        style={{ width: "160px" }}
      />
    </div>

    {/* Balance Due Row */}
    <div className="d-flex align-items-center gap-3">
      <strong style={{ width: "140px", color: "#d63031" }}>Balance Due</strong>
      <TextInputform
        readOnly
        value={(Number(formData.total || 0) - Number(formData.received_amount || 0)).toFixed(2)}
        style={{ 
          width: "160px", 
          fontWeight: "bold",
          backgroundColor: "#fff4f4",
          border: "1px solid #fab1b1"
        }}
      />
    </div>
    
              
        </Col>
        </Row>
           {/* Show Back button in View mode too, but hide Save/Update button */}
              <Row className="py-3">
               <Col className="d-flex justify-content-between align-items-end">
                  <Button variant="secondary" onClick={handleBack} size="lg">Back </Button>
               {/* Only show Save/Update button when not in View mode */}
              {!isViewMode && (
              <Button variant="outline-primary"onClick={handleSave} size="lg">
              {isEditMode ? "Update Sale" : "Save Sale"} </Button>)}
              </Col>
              </Row>
          </Col>
          
        </Row>
        
<Modal 
  show={showImageModal} 
  onHide={() => {}}  // ← EMPTY: disables automatic close
  size="xl" 
  centered
  keyboard={false} 
  dialogClassName="transparent-modal"    // Disables ESC key
>
  <Modal.Body 
    className="p-0 d-flex align-items-center justify-content-center position-relative"
    style={{ 
      
      minHeight: '100vh',
      margin: 0
    }}
    // This stops ALL clicks on background/image from closing
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
  >
    <img
      src={imagePreview}
      alt="Full size"
      style={{
        maxWidth: '95vw',
        maxHeight: '95vh',
        objectFit: 'contain',
        borderRadius: '16px',
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    />

    {/* ONLY THIS X BUTTON CLOSES THE POPUP */}
    <Button
      variant="outline-light"
      size="lg"
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1051,
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255,255,255,0.3)'
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowImageModal(false);  // ← ONLY this closes
      }}
    >
      <FaTimes size={26} />
    </Button>
  </Modal.Body>
</Modal>

      </Container>
    </div>
  );
};

export default SaleCreation;
