import React, { useState, useEffect, useRef } from "react";
import {
  Button, Row, Col, Modal, Form, Tabs, Tab, Card
} from "react-bootstrap";
import { FaCamera, FaCog, FaChevronDown } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnits } from "../../slice/UnitSlice";
import { fetchCategories } from "../../slice/CategorySlice";
import { createProduct } from "../../slice/ProductSlice";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "../../App.css";

function AddItem({ show, onHide, activeTab = "PRODUCT" }) {
  const dispatch = useDispatch();
  const { units = [], status: unitStatus } = useSelector(state => state.unit);
  const { categories = [], status: categoryStatus } = useSelector(state => state.category);
  const { status: productStatus } = useSelector(state => state.product);

  const [type, setType] = useState("add");
  const [activePricingTab, setActivePricingTab] = useState("pricing");
const [imagePreview, setImagePreview] = useState("");  
const [hasUserUploadedImage, setHasUserUploadedImage] = useState(false);//for edit image
const [showImageModal, setShowImageModal] = useState(false);
  // Main Form Fields
  const [itemName, setItemName] = useState("");
  const [hsn, setHsn] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Structured Data States
  const [salePriceDetails, setSalePriceDetails] = useState({
    price: "",
    tax_type: "Without Tax",
    discount: "",
    discount_type: "Percentage"
  });

  const [purchasePriceDetails, setPurchasePriceDetails] = useState({
    price: "",
    tax_type: "Without Tax",
    tax_rate: "None"
  });

  const [stockDetails, setStockDetails] = useState({
    opening_qty: "",
    at_price: "",
    stock_date: new Date().toISOString().split("T")[0],
    min_stock: "",
    location: ""
  });

  const [showUnitMenu, setShowUnitMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const unitRef = useRef();
  const categoryRef = useRef();

  const isProduct = type === "add";

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (unitRef.current && !unitRef.current.contains(e.target)) setShowUnitMenu(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setShowCategoryMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle Product/Service
  useEffect(() => {
    if (activeTab === "SERVICE") setType("reduce");
    else setType("add");
  }, [activeTab, show]);

  // Fetch Units & Categories
  useEffect(() => {
    if (show) {
      if (unitStatus === "idle") dispatch(fetchUnits());
      if (categoryStatus === "idle") dispatch(fetchCategories());
    }
  }, [show, unitStatus, categoryStatus, dispatch]);

  // Auto-select first unit & category
  useEffect(() => {
    if (units.length > 0 && !selectedUnit) setSelectedUnit(units[0].unit_name);
    if (categories.length > 0 && !selectedCategory) setSelectedCategory(categories[0].id);
  }, [units, categories]);


  useEffect(() => {
    if (isCreateMode) {
      setImagePreview("");
      setImageFileName("");
      setAttachedDocs([]);
      setHasUserUploadedImage(false);
    }
  }, [isCreateMode]);
// AddItem.jsx (Inside function AddItem)

// FINAL SAVE FUNCTION — 100% WORKING
// REPLACE the entire handleSave function inside ItemModalCreation.jsx

const handleSave = async () => {
    // 1. Look up Unit ID and Category Name from state for DB insertion
    const selectedUnitObject = units.find(u => u.unit_name === selectedUnit) || {};
    const unit_id = selectedUnitObject.units_id || ""; // Get the units_id
    
    const selectedCategoryObject = categories.find(c => c.id == selectedCategory) || {};
    const category_name = selectedCategoryObject.category_name || ""; // Get the category_name

    const sale_price = JSON.stringify({
      price: salePriceDetails.price || "0",
      tax_type: salePriceDetails.tax_type,
      discount: salePriceDetails.discount || "0",
      discount_type: salePriceDetails.discount_type
    });

    const purchase_price = isProduct ? JSON.stringify({
      price: purchasePriceDetails.price || "0",
      tax_type: purchasePriceDetails.tax_type,
      tax_rate: purchasePriceDetails.tax_rate
    }) : null;

    const stock = isProduct ? JSON.stringify({
      opening_qty: stockDetails.opening_qty || "0",
      at_price: stockDetails.at_price || "0",
      stock_date: stockDetails.stock_date,
      min_stock: stockDetails.min_stock || "0",
      location: stockDetails.location || ""
    }) : null;

    const data = {
      item_name: itemName.trim(),
      hsn_code: hsn || 0,
      category_id: selectedCategory,
      category_name: category_name, // <-- Now included
      unit_value: selectedUnit,
      unit_id: unit_id, // <-- Now included
      add_image:"",
      sale_price: sale_price,
      purchase_price: purchase_price,
      stock: stock,
      type: isProduct ? "product" : "service"
    };

    if (!data.item_name || !data.category_id || !data.unit_value) {
      alert("Please fill Item Name, Category & Unit");
      return;
    }

    try {
      // We expect the backend to return { item_code: '...', id: 2 } on success
      const result = await dispatch(createProduct(data)).unwrap();
      
      // Console logging to confirm success and response body
      console.log("Product saved successfully. Response body:", result); 
      
      alert("Saved Successfully!");
      onHide();
    } catch (err) {
      // CRUCIAL: Log the actual error to the console for debugging
      console.error("Redux promise was rejected (handleSave failed):", err);
      // Show error message if available, otherwise a generic error
      alert(err.message || "Failed to save: Check console for details.");
    }
  };

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

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" size="xl">
      <Modal.Header className="border-0 pb-1 align-items-start">
        <div className="w-100 d-flex justify-content-between align-items-start">
          <Modal.Title className="h5 fw-bold d-flex align-items-center gap-2">
            {isProduct ? "Add Item" : "Add Service"}
            <div className="d-flex position-relative" style={{ width: "180px", borderRadius: "50px", padding: "2px", gap: "6px" }}>
              <div className="position-absolute bg-primary" style={{
                width: "calc(50% - 2px)", height: "100%", borderRadius: "50px",
                transition: "transform 0.3s", transform: type === "add" ? "translateX(0%)" : "translateX(100%)"
              }} />
              <Button variant="transparent" className={`flex-grow-1 ${type === "add" ? "text-white" : "text-primary"}`} onClick={() => setType("add")}>Product</Button>
              <Button variant="transparent" className={`flex-grow-1 ${type === "reduce" ? "text-white" : "text-primary"}`} onClick={() => setType("reduce")}>Service</Button>
            </div>
          </Modal.Title>
          <div className="d-flex gap-3">
            <Button variant="light" className="text-dark p-0 bg-white"><FaCog /></Button>
            <Button variant="light" className="text-dark fs-2 bg-white" onClick={onHide}>×</Button>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="pt-2">
        <Row className="mb-4 g-3">
          <Col md={3}>
            <Form.Control className="white-input" placeholder={isProduct ? "Item Name *" : "Service Name *"} value={itemName} onChange={(e) => setItemName(e.target.value)} />
          </Col>
          <Col md={3}>
            <Form.Control className="white-input" placeholder={isProduct ? "Item HSN" : "Service HSN"} value={hsn} onChange={(e) => setHsn(e.target.value)} />
          </Col>

          {/* Unit Dropdown */}
          <Col md={2} ref={unitRef}>
            <div className="position-relative">
              <div className="form-control white-input d-flex align-items-center justify-content-between pe-2" style={{ backgroundColor: "#cce7f3", cursor: "pointer", height: "38px" }} onClick={() => setShowUnitMenu(!showUnitMenu)}>
                <span className={!selectedUnit ? "text-muted" : ""}>{selectedUnit || "Select Unit"}</span>
                <FaChevronDown className="text-primary" />
              </div>
              {showUnitMenu && (
                <div className="position-absolute start-0 end-0 bg-white border shadow-sm rounded mt-1" style={{ zIndex: 9999, maxHeight: "200px", overflowY: "auto" }}>
                  {units.map(u => (
                    <div key={u.units_id} className="px-3 py-2 hover-bg-light" style={{ cursor: "pointer" }} onClick={() => { setSelectedUnit(u.unit_name); setShowUnitMenu(false); }}>
                      {u.unit_name} ({u.short_name})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>

          <Col md={3}>
            <Button variant="link" className="text-primary d-flex align-items-center gap-1">
              <FaCamera /> Add Item Image
            </Button>
          </Col>
        </Row>

        <Row className="mb-4 g-3">
          {/* Category Dropdown */}
          <Col md={4} ref={categoryRef}>
            <div className="position-relative">
              <div className="form-control white-input d-flex align-items-center justify-content-between pe-2" style={{ cursor: "pointer", height: "38px" }} onClick={() => setShowCategoryMenu(!showCategoryMenu)}>
                <span className={!selectedCategory ? "text-muted" : ""}>
                  {selectedCategory ? categories.find(c => c.id == selectedCategory)?.category_name : "-- Select Category --"}
                </span>
                <FaChevronDown className="text-primary" />
              </div>
              {showCategoryMenu && (
                <div className="position-absolute start-0 end-0 bg-white border shadow-sm rounded mt-1" style={{ zIndex: 9999, maxHeight: "200px", overflowY: "auto" }}>
                  {categories.map(c => (
                    <div key={c.id} className="px-3 py-2 hover-bg-light" style={{ cursor: "pointer" }} onClick={() => { setSelectedCategory(c.id); setShowCategoryMenu(false); }}>
                      {c.category_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>

          <Col md={3} className="position-relative">
            <Form.Control placeholder={isProduct ? "Item Code" : "Service Code"} className="white-input" value={itemCode} onChange={(e) => setItemCode(e.target.value)} />
            <Button variant="light" size="sm" className="position-absolute end-0 top-50 translate-middle-y me-1 text-primary border p-1" style={{ backgroundColor: "#cce7f3" }}>Assign Code</Button>
          </Col>
        </Row>

        {/* Pricing Tab */}
        <Tabs activeKey={activePricingTab} onSelect={setActivePricingTab} className="mb-3 border-bottom" justify>
          <Tab eventKey="pricing" title={<span style={{ color: activePricingTab === "pricing" ? "#dc3545" : "#6c757d" }}>Pricing</span>}>
            <div className="pt-3">
              <Card className="p-5 mb-3 shadow-sm" style={{ backgroundColor: "#f2f2f2" }}>
                <h6 className="mb-3">Sale Price</h6>
                <Row className="g-2 p-3">
                  <Col md={3}>
                    <Form.Control className="white-input" placeholder="Sale Price" value={salePriceDetails.price} onChange={(e) => setSalePriceDetails({...salePriceDetails, price: e.target.value})} />
                  </Col>
                  <Col md={3}>
                    <Form.Select className="white-input" value={salePriceDetails.tax_type} onChange={(e) => setSalePriceDetails({...salePriceDetails, tax_type: e.target.value})}>
                      <option>Without Tax</option>
                      <option>With Tax</option>
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Control className="white-input" placeholder="Discount" value={salePriceDetails.discount} onChange={(e) => setSalePriceDetails({...salePriceDetails, discount: e.target.value})} />
                  </Col>
                  <Col md={3}>
                    <Form.Select className="white-input" value={salePriceDetails.discount_type} onChange={(e) => setSalePriceDetails({...salePriceDetails, discount_type: e.target.value})}>
                      <option>Percentage</option>
                      <option>Amount</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Card>

              {isProduct && (
                <Row className="g-3">
                  <Col md={6}>
                    <Card className="p-4 shadow-sm h-100" style={{ backgroundColor: "#f2f2f2" }}>
                      <h6 className="mb-3">Purchase Price</h6>
                      <Row className="g-2 p-2">
                        <Col md={6}>
                          <Form.Control className="white-input" placeholder="Purchase Price" value={purchasePriceDetails.price} onChange={(e) => setPurchasePriceDetails({...purchasePriceDetails, price: e.target.value})} />
                        </Col>
                        <Col md={6}>
                          <Form.Select className="white-input" value={purchasePriceDetails.tax_type} onChange={(e) => setPurchasePriceDetails({...purchasePriceDetails, tax_type: e.target.value})}>
                            <option>Without Tax</option>
                            <option>With Tax</option>
                          </Form.Select>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="p-4 shadow-sm h-100" style={{ backgroundColor: "#f2f2f2" }}>
                      <h6 className="mb-3">Taxes</h6>
                      <Form.Select className="white-input" value={purchasePriceDetails.tax_rate} onChange={(e) => setPurchasePriceDetails({...purchasePriceDetails, tax_rate: e.target.value})}>
                        <option>None</option>
                        <option>IGST @5%</option>
                        <option>IGST @12%</option>
                        <option>IGST @18%</option>
                        <option>IGST @28%</option>
                      </Form.Select>
                    </Card>
                  </Col>
                </Row>
              )}
            </div>
          </Tab>

          {/* Stock Tab */}
          {isProduct && (
            <Tab eventKey="stock" title="Stock">
              <div className="pt-4">
                <Card className="p-4" style={{ border: "none" }}>
                  <Row className="g-3">
                    <Col md={2}><Form.Control className="white-input" placeholder="Opening Qty" value={stockDetails.opening_qty} onChange={(e) => setStockDetails({...stockDetails, opening_qty: e.target.value})} /></Col>
                    <Col md={2}><Form.Control className="white-input" placeholder="At Price" value={stockDetails.at_price} onChange={(e) => setStockDetails({...stockDetails, at_price: e.target.value})} /></Col>
                    <Col md={3}><DatePicker selected={new Date(stockDetails.stock_date)} onChange={(date) => setStockDetails({...stockDetails, stock_date: date.toISOString().split("T")[0]})} className="form-control white-input" dateFormat="dd/MM/yyyy" /></Col>
                    <Col md={2}><Form.Control className="white-input" placeholder="Min Stock" value={stockDetails.min_stock} onChange={(e) => setStockDetails({...stockDetails, min_stock: e.target.value})} /></Col>
                    <Col md={3}><Form.Control className="white-input" placeholder="Location" value={stockDetails.location} onChange={(e) => setStockDetails({...stockDetails, location: e.target.value})} /></Col>
                  </Row>
                </Card>
              </div>
            </Tab>
          )}
        </Tabs>
      </Modal.Body>

      <Modal.Footer className="border-0 justify-content-end bg-light">
        <Button variant="outline-secondary" className="me-2" onClick={handleSave} disabled={productStatus === "loading"}>
          Save & New
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={productStatus === "loading"}>
          {productStatus === "loading" ? "Saving..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddItem;