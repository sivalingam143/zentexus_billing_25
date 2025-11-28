// src/components/AddItem.jsx  (Keep this single file for both Product & Service)
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
import { createService } from "../../slice/serviceSlice";  // Your service slice
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "../../App.css";

const ImageModal = ({ show, onHide, imageSrc }) => (
  <Modal show={show} onHide={onHide} centered size="lg">
    <Modal.Header closeButton>
      <Modal.Title>{imageSrc.includes("product") ? "Product" : "Service"} Image</Modal.Title>
    </Modal.Header>
    <Modal.Body className="text-center">
      <img src={imageSrc} alt="Full View" style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
    </Modal.Body>
  </Modal>
);

function AddItem({ show, onHide, activeTab = "PRODUCT" }) {
  const dispatch = useDispatch();
  const { units = [], status: unitStatus } = useSelector(state => state.unit);
  const { categories = [], status: categoryStatus } = useSelector(state => state.category);
  const productStatus = useSelector(state => state.product?.status);
  const serviceStatus = useSelector(state => state.service?.status);

  const [type, setType] = useState("add"); // "add" = Product, "reduce" = Service (your old logic)
  const [imagePreview, setImagePreview] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const imageInputRef = useRef(null);

  // Form Fields
  const [itemName, setItemName] = useState("");
  const [hsn, setHsn] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activePricingTab, setActivePricingTab] = useState("pricing");

  // Pricing
  const [salePriceDetails, setSalePriceDetails] = useState({
    price: "", tax_type: "Without Tax", discount: "", discount_type: "Percentage"
  });
  const [purchasePriceDetails, setPurchasePriceDetails] = useState({
    price: "", tax_type: "Without Tax", tax_rate: "None"
  });
  const [stockDetails, setStockDetails] = useState({
    opening_qty: "", at_price: "", stock_date: new Date().toISOString().split("T")[0],
    min_stock: "", location: ""
  });

  // Dropdowns
  const [showUnitMenu, setShowUnitMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const unitRef = useRef();
  const categoryRef = useRef();

  const isProduct = type === "add";

  // Sync type with activeTab
  useEffect(() => {
    if (activeTab === "SERVICE") setType("reduce");
    else setType("add");
  }, [activeTab, show]);

  

  // Fetch units & categories
  useEffect(() => {
    if (show) {
      if (unitStatus === "idle") dispatch(fetchUnits());
      if (categoryStatus === "idle") dispatch(fetchCategories());
    }
  }, [show, unitStatus, categoryStatus, dispatch]);

  // Auto select first unit & category
  useEffect(() => {
    if (units.length > 0 && !selectedUnit) setSelectedUnit(units[0].unit_name);
    if (categories.length > 0 && !selectedCategory) setSelectedCategory(categories[0].id);
  }, [units, categories]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (unitRef.current && !unitRef.current.contains(e.target)) setShowUnitMenu(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setShowCategoryMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // IMAGE LOGIC
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        e.target.value = null;
        return;
      }
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImagePreview("");
    setImageFileName("");
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleImageClick = () => {
    imagePreview ? setShowImageModal(true) : imageInputRef.current?.click();
  };

  // MAIN SAVE FUNCTION
  const handleSave = async () => {
    const selectedUnitObj = units.find(u => u.unit_name === selectedUnit) || {};
    const unit_id = selectedUnitObj.units_id || "";
    const selectedCatObj = categories.find(c => c.id == selectedCategory) || {};
    const category_name = selectedCatObj.category_name || "";

    const sale_price = JSON.stringify({
      price: salePriceDetails.price || "0",
      tax_type: salePriceDetails.tax_type,
      discount: salePriceDetails.discount || "0",
      discount_type: salePriceDetails.discount_type
    });

    const commonData = {
   product_name: itemName.trim(),
product_code:itemCode,
      hsn_code: hsn || 0,
      category_id: selectedCategory,
      category_name: category_name,
      unit_value: selectedUnit,
      unit_id: unit_id,
      add_image: imagePreview,
      sale_price: sale_price,
    };

    if (!commonData.product_name || !commonData.category_id || !commonData.unit_value) {
      alert("Please fill Item Name, Category & Unit");
      return;
    }

    try {
      if (isProduct) {
        const productData = {
          ...commonData,
          purchase_price: JSON.stringify({
            price: purchasePriceDetails.price || "0",
            tax_type: purchasePriceDetails.tax_type,
            tax_rate: purchasePriceDetails.tax_rate
          }),
          stock: JSON.stringify(stockDetails),
          type: "product"
        };
        await dispatch(createProduct(productData)).unwrap();
      } else {
        const serviceData = {
          service_name: itemName.trim(),
          service_hsn: hsn || 0,
          category_id: selectedCategory,
          category_name: category_name,
          unit_value: selectedUnit,
          unit_id: unit_id,
          add_image: imagePreview,
          service_code :itemCode,
          sale_price: sale_price,
          tax_rate: purchasePriceDetails.tax_rate,  // reuse the tax_rate field
          type: "service"
        };
        await dispatch(createService(serviceData)).unwrap();
      }

      alert("Saved Successfully!");
      onHide();
    } catch (err) {
      console.error("Save failed:", err);
      alert(err.message || "Failed to save");
    }
  };

  return (
    <>
      <ImageModal show={showImageModal} onHide={() => setShowImageModal(false)} imageSrc={imagePreview} />

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

            {/* Image Upload */}
            <Col md={3}>
              <input type="file" ref={imageInputRef} accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              <Button variant="link" className="text-primary d-flex align-items-center gap-1 p-0" onClick={handleImageClick}>
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" style={{ height: "20px", width: "20px", objectFit: "cover", borderRadius: "3px", border: "1px solid #ccc" }} />
                    <span className="text-dark text-truncate" style={{ maxWidth: "120px" }} title={imageFileName}>{imageFileName || "View Image"}</span>
                    <span className="text-danger ms-2 fw-bold" onClick={handleRemoveImage} style={{ cursor: "pointer", fontSize: "1.2em" }}>×</span>
                  </>
                ) : (
                  <> <FaCamera /> Add Item Image</>
                )}
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
<Tabs activeKey={activePricingTab} onSelect={(k) => setActivePricingTab(k)} className="mb-3 border-bottom" justify>
            <Tab eventKey="pricing" title={<span style={{ color: "#dc3545" }}>Pricing</span>}>
              <div className="pt-3">
                <Card className="p-5 mb-3 shadow-sm" style={{ backgroundColor: "#f2f2f2" }}>
                  <h6 className="mb-3">Sale Price</h6>
                  <Row className="g-2 p-3">
                    <Col md={3}><Form.Control className="white-input" placeholder="Sale Price" value={salePriceDetails.price} onChange={e => setSalePriceDetails({ ...salePriceDetails, price: e.target.value })} /></Col>
                    <Col md={3}><Form.Select className="white-input" value={salePriceDetails.tax_type} onChange={e => setSalePriceDetails({ ...salePriceDetails, tax_type: e.target.value })}>
                      <option>Without Tax</option>
                      <option>With Tax</option>
                    </Form.Select></Col>
                    <Col md={3}><Form.Control className="white-input" placeholder="Disc. On Sale Price" value={salePriceDetails.discount} onChange={e => setSalePriceDetails({ ...salePriceDetails, discount: e.target.value })} /></Col>
                    <Col md={3}><Form.Select className="white-input" value={salePriceDetails.discount_type} onChange={e => setSalePriceDetails({ ...salePriceDetails, discount_type: e.target.value })}>
                      <option>Percentage</option>
                      <option>Amount</option>
                    </Form.Select></Col>
                  </Row>
                </Card>

                {isProduct ? (
                  <Row className="g-3">
                    <Col md={6}>
                      <Card className="p-4 shadow-sm h-100" style={{ backgroundColor: "#f2f2f2" }}>
                        <h6 className="mb-3">Purchase Price</h6>
                        <Row className="g-2 p-2">
                          <Col md={6}><Form.Control className="white-input" placeholder="Purchase Price" value={purchasePriceDetails.price} onChange={e => setPurchasePriceDetails({ ...purchasePriceDetails, price: e.target.value })} /></Col>
                          <Col md={6}><Form.Select className="white-input" value={purchasePriceDetails.tax_type} onChange={e => setPurchasePriceDetails({ ...purchasePriceDetails, tax_type: e.target.value })}>
                            <option>Without Tax</option>
                            <option>With Tax</option>
                          </Form.Select></Col>
                        </Row>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="p-4 shadow-sm h-100" style={{ backgroundColor: "#f2f2f2" }}>
                        <h6 className="mb-3">Taxes</h6>
                        <Form.Select className="white-input" value={purchasePriceDetails.tax_rate} onChange={e => setPurchasePriceDetails({ ...purchasePriceDetails, tax_rate: e.target.value })}>
                          <option>Tax Rate</option>
                          <option>None</option>
                          <option>IGST @0.25%</option>
                        </Form.Select>
                      </Card>
                    </Col>
                  </Row>
                ) : (
                  <Card className="p-4 shadow-sm" style={{ backgroundColor: "#f2f2f2" }}>
                    <h6 className="mb-3">Taxes</h6>
                    <Form.Select className="white-input" style={{ width: "20%" }} value={purchasePriceDetails.tax_rate} onChange={e => setPurchasePriceDetails({ ...purchasePriceDetails, tax_rate: e.target.value })}>
                      <option>Tax Rate</option>
                      <option>None</option>
                      <option>IGST @0.25%</option>
                    </Form.Select>
                  </Card>
                )}
              </div>
            </Tab>

            {isProduct && (
              <Tab eventKey="stock" title="Stock">
                <div className="pt-4">
                  <Card className="p-4" style={{ border: "none" }}>
                    <Row className="g-3">
                      <Col md={2}><Form.Control className="white-input" placeholder="Opening Qty" value={stockDetails.opening_qty} onChange={e => setStockDetails({ ...stockDetails, opening_qty: e.target.value })} /></Col>
                      <Col md={2}><Form.Control className="white-input" placeholder="At Price" value={stockDetails.at_price} onChange={e => setStockDetails({ ...stockDetails, at_price: e.target.value })} /></Col>
                      <Col md={3}><DatePicker selected={new Date(stockDetails.stock_date)} onChange={date => setStockDetails({ ...stockDetails, stock_date: date.toISOString().split("T")[0] })} className="form-control white-input" dateFormat="dd/MM/yyyy" /></Col>
                      <Col md={2}><Form.Control className="white-input" placeholder="Min Stock" value={stockDetails.min_stock} onChange={e => setStockDetails({ ...stockDetails, min_stock: e.target.value })} /></Col>
                      <Col md={3}><Form.Control className="white-input" placeholder="Location" value={stockDetails.location} onChange={e => setStockDetails({ ...stockDetails, location: e.target.value })} /></Col>
                    </Row>
                  </Card>
                </div>
              </Tab>
            )}
          </Tabs>
        </Modal.Body>

        <Modal.Footer className="border-0 justify-content-end bg-light">
          <Button variant="outline-secondary" className="me-2" onClick={handleSave} disabled={productStatus === "loading" || serviceStatus === "loading" }>
            Save & New
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={productStatus === "loading" || serviceStatus === "loading" }>
            {productStatus === "loading" || serviceStatus === "loading" ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddItem;