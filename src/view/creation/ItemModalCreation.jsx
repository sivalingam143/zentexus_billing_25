import React, { useState, useEffect, useRef } from "react";
import SelectUnitModal from "./SelectUnitModal"
import {
  Button,
  Row,
  Col,
  Modal,
  Form,
  Tabs,
  Tab,
  Card,
} from "react-bootstrap";
import { FaCamera, FaCog, FaChevronDown } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnits } from "../../slice/UnitSlice";
import { fetchCategories } from "../../slice/CategorySlice";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../slice/ProductSlice";
import {
  createService,
  updateService,
  deleteService,
} from "../../slice/serviceSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "../../App.css";

const ImageModal = ({ show, onHide, imageSrc }) => (
  <Modal show={show} onHide={onHide} centered size="lg">
    <Modal.Header closeButton>
      <Modal.Title>
        {imageSrc.includes("product") ? "Product" : "Service"} Image
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className="text-center">
      <img
        src={imageSrc}
        alt="Full View"
        style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain" }}
      />
    </Modal.Body>
  </Modal>
);

function AddItem({ show, onHide, activeTab = "PRODUCT", editProduct = null }) {
  const dispatch = useDispatch();
  const { units = [], status: unitStatus } = useSelector((state) => state.unit);
  const { categories = [], status: categoryStatus } = useSelector(
    (state) => state.category
  );

const [showSelectUnitModal, setShowSelectUnitModal] = useState(false);
const [baseUnit, setBaseUnit] = useState("");        // new
const [secondaryUnit, setSecondaryUnit] = useState(""); // new
const [unitMapping, setUnitMapping] = useState(null);
  const [type, setType] = useState("add"); // add = Product, reduce = Service
  const [imagePreview, setImagePreview] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const imageInputRef = useRef(null);

  // Form fields
  const [itemName, setItemName] = useState("");
  const [hsn, setHsn] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activePricingTab, setActivePricingTab] = useState("pricing");
const handleSaveUnitMapping = (mapping) => {
  setUnitMapping(mapping);
  setSelectedUnit(mapping.baseUnit);   // Set base unit as the selected unit
};

  const [showWholesale, setShowWholesale] = useState(false);
  const [wholesaleDetails, setWholesaleDetails] = useState({
    price: "",
    tax_type: "Without Tax",
    min_qty: "",
  });
  const [salePriceDetails, setSalePriceDetails] = useState({
    price: "",
    tax_type: "Without Tax",
    discount: "",
    discount_type: "Percentage",
  });
  const [purchasePriceDetails, setPurchasePriceDetails] = useState({
    price: "",
    tax_type: "Without Tax",
    tax_rate: "None",
  });
  const [stockDetails, setStockDetails] = useState({
    opening_qty: "",
    at_price: "",
    stock_date: new Date().toISOString().split("T")[0],
    min_stock: "",
    location: "",
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

  // Detect if editing a service
  useEffect(() => {
    if (editProduct?.itemType === "service") {
      setType("reduce");
    } else if (editProduct?.itemType !== "service" && activeTab !== "SERVICE") {
      setType("add");
    }
  }, [editProduct, activeTab]);

  
useEffect(() => {
  if (editProduct?.itemType === "service" || editProduct?.isService) {
    setType("reduce");      
  } else if (activeTab === "SERVICE") {
    setType("reduce");
  } else {
    setType("add");           
  }
}, [editProduct, activeTab]);

useEffect(() => {
  if (!editProduct || !show) return;

  const isService = editProduct.itemType === "service" || editProduct.isService || activeTab === "SERVICE";

  setType(isService ? "reduce" : "add");

  setItemName(isService ? editProduct.service_name || "" : editProduct.product_name || "");
  // Load saved unit when editing product
if (editProduct?.unit_value) {
  let mapping = { baseUnit: editProduct.unit_value, secondaryUnit: null, conversion: null, shortText: editProduct.unit_value };

  try {
    const parsed = JSON.parse(editProduct.unit_value);
    if (parsed.baseUnit) mapping = { ...parsed, shortText: parsed.shortText || parsed.baseUnit };
  } catch { /* it's plain string → already handled above */ }

  setUnitMapping(mapping);
}
  setHsn(isService ? editProduct.service_hsn || editProduct.hsn_code || "" : editProduct.hsn_code || "");
setItemCode(isService 
  ? String(editProduct.service_code ?? "") 
  : String(editProduct.product_code ?? ""));
  // If unit_value is just a string (like "GRAMMES"), show it
// If it's JSON (old format), extract baseUnit
let displayUnit = "";
if (editProduct.unit_value) {
  try {
    const parsed = JSON.parse(editProduct.unit_value);
    displayUnit = parsed.baseUnit || editProduct.unit_value;
  } catch {
    displayUnit = editProduct.unit_value; // already a string
  }
}
setSelectedUnit(displayUnit);
  setSelectedCategory(editProduct.category_id || "");
  if (editProduct.add_image) {
    setImagePreview(editProduct.add_image);
    setImageFileName("uploaded-image.jpg");
  }
  
try {
  const sale = editProduct.sale_price ? JSON.parse(editProduct.sale_price) : {};
  setSalePriceDetails({
    price: sale.price || "",
    tax_type: sale.tax_type || "Without Tax",
    discount: sale.discount || "",
    discount_type: sale.discount_type || "Percentage"
  });

  // Load wholesale if exists
  if (sale.wholesale) {
    setShowWholesale(true);
    setWholesaleDetails({
      price: sale.wholesale.price || "",
      tax_type: sale.wholesale.tax_type || "Without Tax",
      min_qty: sale.wholesale.min_qty || ""
    });
  } else {
    setShowWholesale(false);
  }
} catch (e) {
  console.error("Failed to parse sale_price", e);
}

  // Purchase Price (only products)
  if (!isService && editProduct.purchase_price) {
    try {
      const p = JSON.parse(editProduct.purchase_price);
      setPurchasePriceDetails({
  price: p.price || "",
  tax_type: p.tax_type || "Without Tax",
  tax_rate: editProduct.tax_rate || "None"   // This line fixes edit modal

      });
    } catch (e) {}
  }

  // Stock (only products)
  if (!isService && editProduct.stock) {
    try {
      const s = JSON.parse(editProduct.stock);
      setStockDetails(prev => ({
        ...prev,
        opening_qty: s.opening_qty || "",
        at_price: s.at_price || "",
        stock_date: s.stock_date || new Date().toISOString().split("T")[0],
        min_stock: s.min_stock || "",
        location: s.location || ""
      }));
    } catch (e) {}
  }
}, [editProduct, show, activeTab]);

  // Fetch units & categories
  useEffect(() => {
    if (show) {
      if (unitStatus === "idle") dispatch(fetchUnits());
      if (categoryStatus === "idle") dispatch(fetchCategories());
    }
  }, [show, unitStatus, categoryStatus, dispatch]);

  // Auto-select first unit & category


  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (unitRef.current && !unitRef.current.contains(e.target))
        setShowUnitMenu(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target))
        setShowCategoryMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Image logic
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

  const resetForm = () => {
    setItemName("");
    setHsn("");
    setItemCode("");
    setSelectedUnit(units[0]?.unit_name || "");
    setSelectedCategory(categories[0]?.category_id || "");
    setImagePreview("");
    setImageFileName("");
    setShowWholesale(false);
    setUnitMapping(null);
setSelectedUnit("");
setWholesaleDetails({
  price: "",
  tax_type: "Without Tax",
  min_qty: "",
});
    setSalePriceDetails({
      price: "",
      tax_type: "Without Tax",
      discount: "",
      discount_type: "Percentage",
    });
    setPurchasePriceDetails({
      price: "",
      tax_type: "Without Tax",
      tax_rate: "None",
    });
    setStockDetails({
      opening_qty: "",
      at_price: "",
      stock_date: new Date().toISOString().split("T")[0],
      min_stock: "",
      location: "",
    });
  };

  const handleSaveNew = async () => {
    try {
      await handleSave(false, true);
      alert("Saved Successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };
const handleAssignCode = () => {
    const uniqueIntCode = Date.now().toString(); 
    setItemCode(uniqueIntCode); 
};
  const handleSave = async (closeModal = true, isNew = false) => {
    const selectedCatObj =
      categories.find((c) => c.category_id == selectedCategory) || {};
   const unit_value = unitMapping?.baseUnit || "";
const unit_id = units.find(u => u.unit_name === unit_value)?.unit_id || "";
    const category_name = selectedCatObj.category_name || "";
    
   const sale_price_obj = {
  price: salePriceDetails.price || "0",
  tax_type: salePriceDetails.tax_type,
  discount: salePriceDetails.discount || "0",
  discount_type: salePriceDetails.discount_type,
};

if (showWholesale && wholesaleDetails.price) {
  sale_price_obj.wholesale = {
    price: wholesaleDetails.price || "0",
    tax_type: wholesaleDetails.tax_type,
    min_qty: wholesaleDetails.min_qty || "1"
  };
}

const sale_price = JSON.stringify(sale_price_obj);

    const commonData = {
      product_name: itemName.trim(),
      product_code: itemCode,
      hsn_code: hsn || 0,
      category_id: selectedCategory,
      category_name,
      unit_value: selectedUnit,
      unit_id,
      add_image: imagePreview,
      sale_price,
    };

  

    try {
      if (isProduct) {
        const openingQty = parseFloat(stockDetails.opening_qty) || 0;
        const atPrice = parseFloat(stockDetails.at_price) || 0;
let currentStock = {};
if (editProduct?.stock) {
  try {
    currentStock = JSON.parse(editProduct.stock);
  } catch (e) {
    currentStock = {};
  }
}

const enhancedStock = {
  ...currentStock, 
  ...stockDetails,
  opening_qty: openingQty,
  at_price: atPrice,
  current_qty: currentStock.current_qty || openingQty,
  current_value: currentStock.current_value || (openingQty * atPrice),
  opening_transaction: currentStock.opening_transaction || (openingQty > 0 ? {
    type: "Opening Stock",
    reference: "Opening Stock",
    name: "Opening Stock",
    date: stockDetails.stock_date || new Date().toISOString().split("T")[0],
    quantity: openingQty,
    price_per_unit: atPrice,
    status: "Completed",
  } : null)
};
        const payload = {
          ...commonData,
          purchase_price: JSON.stringify({
            price: purchasePriceDetails.price || "0",
            tax_type: purchasePriceDetails.tax_type,
            tax_rate: purchasePriceDetails.tax_rate,
          }),
          stock: JSON.stringify(enhancedStock),
          type: "product",
        };

     if (purchasePriceDetails.price !== "" || editProduct?.purchase_price) {
  payload.purchase_price = JSON.stringify({
    price: purchasePriceDetails.price || "0",
    tax_type: purchasePriceDetails.tax_type,
    tax_rate: purchasePriceDetails.tax_rate
  });
} else {
  delete payload.purchase_price;
}
        if (editProduct)
          await dispatch(
            updateProduct({
              edit_product_id: editProduct.product_id,
              ...payload,
            })
          ).unwrap();
        else await dispatch(createProduct(payload)).unwrap();
      } else {
        const payload = {
          service_name: itemName.trim(),
          service_hsn: hsn || 0,
          service_code: itemCode,
          category_id: selectedCategory,
          category_name,
          unit_value: selectedUnit,
          unit_id,
          add_image: imagePreview,
          sale_price,
          tax_rate: purchasePriceDetails.tax_rate,
          type: "service",
        };
        if (editProduct)
          await dispatch(
            updateService({
              edit_service_id: editProduct.service_id,
              ...payload,
            })
          ).unwrap();
        else await dispatch(createService(payload)).unwrap();
      }

      if (closeModal && !isNew) onHide();
      if (isNew) resetForm();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save");
    }
  };

  const handleDelete = () => {
    if (isProduct) dispatch(deleteProduct(editProduct.product_id));
    else dispatch(deleteService(editProduct.service_id));
    onHide();
  };

  return (
    <>
      <ImageModal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        imageSrc={imagePreview}
      />
      <Modal show={show} onHide={onHide} centered backdrop="static" size="xl">
        <Modal.Header className="border-0 pb-1 align-items-start">
          <div className="w-100 d-flex justify-content-between align-items-start">
            <Modal.Title className="h5 fw-bold d-flex align-items-center gap-2">
              {editProduct
                ? "Edit Item"
                : isProduct
                ? "Add Item"
                : "Add Service"}
              <div
                className="d-flex position-relative"
                style={{
                  width: "180px",
                  borderRadius: "50px",
                  padding: "2px",
                  gap: "6px",
                }}
              >
                <div
                  className="position-absolute bg-primary"
                  style={{
                    width: "calc(50% - 2px)",
                    height: "100%",
                    borderRadius: "50px",
                    transition: "transform 0.3s",
                    transform:
                      type === "add" ? "translateX(0%)" : "translateX(100%)",
                  }}
                />
                <Button
                  variant="transparent"
                  style={{
                    zIndex: 2,
                    background: "transparent",
                    border: "none",
                  }}
                  className={`flex-grow-1 fw-semibold ${
                    type === "add" ? "text-white" : "text-primary"
                  }`}
                  onClick={() => setType("add")}
                >
                  Product
                </Button>
                <Button
                  variant="transparent"
                  style={{
                    zIndex: 2,
                    background: "transparent",
                    border: "none",
                  }}
                  className={`flex-grow-1 fw-semibold ${
                    type === "reduce" ? "text-white" : "text-primary"
                  }`}
                  onClick={() => setType("reduce")}
                >
                  Service
                </Button>
              </div>
            </Modal.Title>
            <div className="d-flex gap-3">
              <Button variant="light" className="text-dark p-0 bg-white">
                <FaCog />
              </Button>
              <Button
                variant="light"
                className="text-dark fs-2 bg-white"
                onClick={onHide}
              >
                ×
              </Button>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body className="pt-2">
          <Row className="mb-4 g-3">
            <Col md={3}>
              <Form.Control
                className="white-input"
                placeholder={isProduct ? "Item Name *" : "Service Name *"}
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                className="white-input"
                placeholder={isProduct ? "Item HSN" : "Service HSN"}
                value={hsn}
                onChange={(e) => setHsn(e.target.value)}
              />
            </Col>
<Col md={2}>
  <div className="position-relative">
    <div
      className="form-control white-input d-flex align-items-center justify-content-between pe-2"
      style={{
        backgroundColor: "#cce7f3",
        cursor: "pointer",
        height: "38px",
      }}
      onClick={() => setShowSelectUnitModal(true)}
    >
     <span className={!unitMapping?.baseUnit ? "text-muted" : "fw-bold"}>
  {unitMapping?.baseUnit || "Select Unit *"}
</span>
      <FaChevronDown className="text-primary" />
    </div>
 {unitMapping && (
      <div
        className="position-absolute start-50 translate-middle-x text-center"
        style={{ top: "100%", marginTop: "4px", width: "100%" }}
      >
        <Button
          variant="link"
          size="sm"
          className="text-primary p-0 fw-medium"
          onClick={() => setShowSelectUnitModal(true)}
          style={{ fontSize: "12.5px", textDecoration: "none" }}
        >
          Edit Unit
        </Button>
        <div
          className="text-primary fw-bold"
          style={{ fontSize: "11.5px", lineHeight: "1.2" }}
        >
          {unitMapping.shortText}
        </div>
      </div>
    )}
  </div>
</Col>

            {/* Image Upload */}
            <Col md={3}>
              <input
                type="file"
                ref={imageInputRef}
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <Button
                variant="link"
                className="text-primary d-flex align-items-center gap-1 p-0"
                onClick={handleImageClick}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        height: "20px",
                        width: "20px",
                        objectFit: "cover",
                        borderRadius: "3px",
                        border: "1px solid #ccc",
                      }}
                    />
                    <span
                      className="text-dark text-truncate"
                      style={{ maxWidth: "120px" }}
                      title={imageFileName}
                    >
                      {imageFileName || "View Image"}
                    </span>
                    <span
                      className="text-danger ms-2 fw-bold"
                      onClick={handleRemoveImage}
                      style={{ cursor: "pointer", fontSize: "1.2em" }}
                    >
                      ×
                    </span>
                  </>
                ) : (
                  <>
                    {" "}
                    <FaCamera /> Add Item Image
                  </>
                )}
              </Button>
            </Col>
          </Row>

          <Row className="mb-4 g-3">
            <Col md={4} ref={categoryRef}>
              <div className="position-relative">
                <div
                  className="form-control white-input d-flex align-items-center justify-content-between pe-2"
                  style={{ cursor: "pointer", height: "38px" }}
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                >
                  <span className={!selectedCategory ? "text-muted" : ""}>
                    {selectedCategory
                      ? categories.find(
                          (c) => c.category_id == selectedCategory
                        )?.category_name
                      : "-- Select Category --"}
                  </span>
                  <FaChevronDown className="text-primary" />
                </div>
                {showCategoryMenu && (
                  <div
                    className="position-absolute start-0 end-0 bg-white border shadow-sm rounded mt-1"
                    style={{
                      zIndex: 9999,
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                  >
                    {categories.map((c) => (
                      <div
                        key={c.category_id}
                        className="px-3 py-2 hover-bg-light"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSelectedCategory(c.category_id);
                          setShowCategoryMenu(false);
                        }}
                      >
                        {c.category_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Col>

            <Col md={3} className="position-relative">
              <Form.Control
                placeholder={isProduct ? "Item Code" : "Service Code"}
                className="white-input"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
              />
              
              <Button
                variant="light"
                size="sm"
                className="position-absolute end-0 top-50 translate-middle-y me-1 text-primary border p-1"
                style={{ backgroundColor: "#cce7f3" }}
                onClick={handleAssignCode}
              >
                Assign Code
              </Button>
            </Col>
          </Row>
          <Tabs
            activeKey={activePricingTab}
            onSelect={(k) => setActivePricingTab(k)}
            className="mb-3 border-bottom"
            justify
          >
            <Tab
              eventKey="pricing"
              title={<span style={{ color: "#dc3545" }}>Pricing</span>}
            >
              <div className="pt-3">
                <Card
                  className="p-5 mb-3 shadow-sm"
                  style={{ backgroundColor: "#f2f2f2" }}
                >
                  <h6 className="mb-3">Sale Price</h6>
                  <Row className="g-2 p-3">
                    <Col md={3}>
                      <Form.Control
                        className="white-input"
                        placeholder="Sale Price"
                        value={salePriceDetails.price}
                        onChange={(e) =>
                          setSalePriceDetails({
                            ...salePriceDetails,
                            price: e.target.value,
                          })
                        }
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Select
                        className="white-input"
                        value={salePriceDetails.tax_type}
                        onChange={(e) =>
                          setSalePriceDetails({
                            ...salePriceDetails,
                            tax_type: e.target.value,
                          })
                        }
                      >
                        <option>Without Tax</option>
                        <option>With Tax</option>
                      </Form.Select>
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        className="white-input"
                        placeholder="Disc. On Sale Price"
                        value={salePriceDetails.discount}
                        onChange={(e) =>
                          setSalePriceDetails({
                            ...salePriceDetails,
                            discount: e.target.value,
                          })
                        }
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Select
                        className="white-input"
                        value={salePriceDetails.discount_type}
                        onChange={(e) =>
                          setSalePriceDetails({
                            ...salePriceDetails,
                            discount_type: e.target.value,
                          })
                        }
                      >
                        <option>Percentage</option>
                        <option>Amount</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  {showWholesale && (
                    <Row className="g-2 mt-3 p-3 border-top pt-3">
                      <Col md={4}>
                        <Form.Control
                          className="white-input"
                          placeholder="Wholesale Price"
                          value={wholesaleDetails.price}
                          onChange={(e) =>
                            setWholesaleDetails({
                              ...wholesaleDetails,
                              price: e.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Select
                          className="white-input"
                          value={wholesaleDetails.tax_type}
                          onChange={(e) =>
                            setWholesaleDetails({
                              ...wholesaleDetails,
                              tax_type: e.target.value,
                            })
                          }
                        >
                          <option>Without Tax</option>
                          <option>With Tax</option>
                        </Form.Select>
                      </Col>
                      <Col md={4}>
                        <Form.Control
                          className="white-input"
                          placeholder="Minimum Wholesale Qty"
                          value={wholesaleDetails.min_qty}
                          onChange={(e) =>
                            setWholesaleDetails({
                              ...wholesaleDetails,
                              min_qty: e.target.value,
                            })
                          }
                        />
                      </Col>
                    </Row>
                  )}

                  <Row className="mt-3">
                    <Col>
                      <Button
                        variant="link"
                        className="text-primary p-0"
                        onClick={() => setShowWholesale(!showWholesale)}
                      >
                        {showWholesale ? "− Remove" : "+ Add"} wholesale price
                      </Button>
                    </Col>
                  </Row>
                </Card>

                {isProduct ? (
                  <Row className="g-3">
                    <Col md={6}>
                      <Card
                        className="p-4 shadow-sm h-100"
                        style={{ backgroundColor: "#f2f2f2" }}
                      >
                        <h6 className="mb-3">Purchase Price</h6>
                        <Row className="g-2 p-2">
                          <Col md={6}>
                            <Form.Control
                              className="white-input"
                              placeholder="Purchase Price"
                              value={purchasePriceDetails.price}
                              onChange={(e) =>
                                setPurchasePriceDetails({
                                  ...purchasePriceDetails,
                                  price: e.target.value,
                                })
                              }
                            />
                          </Col>
                          <Col md={6}>
                            <Form.Select
                              className="white-input"
                              value={purchasePriceDetails.tax_type}
                              onChange={(e) =>
                                setPurchasePriceDetails({
                                  ...purchasePriceDetails,
                                  tax_type: e.target.value,
                                })
                              }
                            >
                              <option>Without Tax</option>
                              <option>With Tax</option>
                            </Form.Select>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card
                        className="p-4 shadow-sm h-100"
                        style={{ backgroundColor: "#f2f2f2" }}
                      >
                        <h6 className="mb-3">Taxes</h6>
                        <Form.Select
                          className="white-input"
                          value={purchasePriceDetails.tax_rate}
                          onChange={(e) =>
                            setPurchasePriceDetails({
                              ...purchasePriceDetails,
                              tax_rate: e.target.value,
                            })
                          }
                        >
                          <option>Tax Rate</option>
                          <option>None</option>
                          <option>IGST @0.25%</option>
                        </Form.Select>
                      </Card>
                    </Col>
                  </Row>
                ) : (
                  <Card
                    className="p-4 shadow-sm"
                    style={{ backgroundColor: "#f2f2f2" }}
                  >
                    <h6 className="mb-3">Taxes</h6>
                    <Form.Select
                      className="white-input"
                      style={{ width: "20%" }}
                      value={purchasePriceDetails.tax_rate}
                      onChange={(e) =>
                        setPurchasePriceDetails({
                          ...purchasePriceDetails,
                          tax_rate: e.target.value,
                        })
                      }
                    >
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
                      <Col md={2}>
                        <Form.Control
                          className="white-input"
                          placeholder="Opening Qty"
                          value={stockDetails.opening_qty}
                          onChange={(e) =>
                            setStockDetails({
                              ...stockDetails,
                              opening_qty: e.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col md={2}>
                        <Form.Control
                          className="white-input"
                          placeholder="At Price"
                          value={stockDetails.at_price}
                          onChange={(e) =>
                            setStockDetails({
                              ...stockDetails,
                              at_price: e.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col md={3}>
                        <DatePicker
                          selected={new Date(stockDetails.stock_date)}
                          onChange={(date) =>
                            setStockDetails({
                              ...stockDetails,
                              stock_date: date.toISOString().split("T")[0],
                            })
                          }
                          className="form-control white-input"
                          dateFormat="dd/MM/yyyy"
                        />
                      </Col>
                      <Col md={2}>
                        <Form.Control
                          className="white-input"
                          placeholder="Min Stock"
                          value={stockDetails.min_stock}
                          onChange={(e) =>
                            setStockDetails({
                              ...stockDetails,
                              min_stock: e.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Control
                          className="white-input"
                          placeholder="Location"
                          value={stockDetails.location}
                          onChange={(e) =>
                            setStockDetails({
                              ...stockDetails,
                              location: e.target.value,
                            })
                          }
                        />
                      </Col>
                    </Row>
                  </Card>
                </div>
              </Tab>
            )}
          </Tabs>
        </Modal.Body>

        <Modal.Footer className="border-0 justify-content-end bg-light">
          {editProduct ? (
            <>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
              <Button variant="primary" onClick={() => handleSave(true)}>
                Update
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline-secondary"
                className="me-2"
                onClick={handleSaveNew}
              >
                Save & New
              </Button>
              <Button variant="primary" onClick={() => handleSave(true)}>
                Save
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>


<SelectUnitModal
  show={showSelectUnitModal}
  onHide={() => setShowSelectUnitModal(false)}
  units={units}
  unitMapping={unitMapping}
  onSaveMapping={handleSaveUnitMapping}
/>


    </>
  );
}

export default AddItem;
