// src/components/creation/AdjustItemCreation.jsx
import React, { useState } from "react";
import {
  Button,
  Row,
  Col,
  Modal,
  Form,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useDispatch } from "react-redux";
import { updateProduct , fetchProducts} from "../../slice/ProductSlice";
import "react-datepicker/dist/react-datepicker.css";
import "../../App.css";

function AdjustItem({ show, onHide, product }) {
  const dispatch = useDispatch();

  // "no" = reduce, "add" = add (kept exactly as your original)
  const [stock, setStock] = useState("no");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState(new Date());

const handleSave = async () => {
  if (!qty || parseFloat(qty) <= 0) {
    alert("Please enter valid quantity");
    return;
  }

  let stockJson = {};
  try {
    stockJson = product.stock ? JSON.parse(product.stock) : {};
  } catch (e) {
    stockJson = {};
  }

  const currentQty   = parseFloat(stockJson.current_qty || stockJson.opening_qty || 0);
  const currentValue = parseFloat(stockJson.current_value || 0);
  const adjQty       = parseFloat(qty);
  const isAdd        = stock === "add";

  // Original cost price from Add Item → used ONLY for stock value calculation
  const originalCostPrice = parseFloat(stockJson.at_price) || 
                           (currentQty > 0 ? currentValue / currentQty : 0) || 0;

  // What user typed → this will appear in the "PRICE/UNIT" column in table
  const displayedPrice = parseFloat(price) || 0;

  // CALCULATION LOGIC:
  // → Reduce stock  → use originalCostPrice (correct stock value)
  // → Add stock     → use displayedPrice (what user entered)
  const priceForCalculation = isAdd ? displayedPrice : originalCostPrice;

  const valueChange = adjQty * priceForCalculation;
  const newQty   = isAdd ? currentQty + adjQty : currentQty - adjQty;
  const newValue = isAdd ? currentValue + valueChange : currentValue - valueChange;

  const newTransaction = {
    type: isAdd ? "Add Adjustment" : "Reduce Adjustment",
    reference: details || (isAdd ? "Add Stock" : "Reduce Stock"),
    name: isAdd ? "Add Stock" : "Reduce Stock",
    date: date.toISOString().split("T")[0],
    quantity: isAdd ? adjQty : -adjQty,
    price_per_unit: displayedPrice,   // ← This shows ₹100 (or whatever you type)
    status: "Completed"
  };

  const updatedStock = {
    ...stockJson,
    current_qty:   Math.max(0, newQty),
    current_value: parseFloat(newValue.toFixed(2)),
    transactions:  [...(stockJson.transactions || []), newTransaction]
  };

  await dispatch(updateProduct({
    edit_product_id: product.product_id,
    product_name: product.product_name,
    product_code: product.product_code || "",
    hsn_code: product.hsn_code || 0,
    category_id: product.category_id,
    category_name: product.category_name || "",
    unit_value: product.unit_value,
    unit_id: product.unit_id || "",
    add_image: product.add_image || "",
    sale_price: product.sale_price,
    purchase_price: product.purchase_price,
    type: "product",
    stock: JSON.stringify(updatedStock)
  })).unwrap();

  dispatch(fetchProducts());
  onHide();
};

  if (!product) return null;

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" dialogClassName="custom-modal">
      <Modal.Body className="p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-semibold mb-0">Stock Adjustment</h5>

          <div className="d-flex align-items-center gap-3">
            <div className="position-absolute start-50 translate-middle-x d-flex align-items-center" style={{ gap: "10px" }}>
              <div
                className="d-flex position-relative mt-2"
                style={{
                  marginLeft: "0",
                  width: "290px",
                  borderRadius: "50px",
                  padding: "2px",
                  justifyContent: "space-between",
                  backgroundColor: "#e9f3ff",
                }}
              >
                <div
                  className="position-absolute bg-primary"
                  style={{
                    width: "130px",
                    height: "85%",
                    borderRadius: "50px",
                    transition: "transform 0.3s",
                    transform: stock === "no" ? "translateX(0%)" : "translateX(calc(100% + 24px))",
                  }}
                ></div>

                <Button
                  variant="transparent"
                  className={`flex-grow-1 ${stock === "no" ? "text-white" : "text-primary"}`}
                  onClick={() => setStock("no")}
                  style={{ zIndex: 1, borderRadius: "50px", width: "130px" }}
                >
                  reduce stock
                </Button>

                <div className="px-1" style={{ display: "flex", alignItems: "center", color: "#0d6efd", fontSize: "1.2rem", zIndex: 1 }}>
                   ⇄
                </div>

                <Button
                  variant="transparent"
                  className={`flex-grow-1 ${stock === "add" ? "text-white" : "text-primary"}`}
                  onClick={() => setStock("add")}
                  style={{ zIndex: 1, borderRadius: "50px", width: "130px" }}
                >
                  add stock
                </Button>
              </div>
            </div>
          </div>
       

        <Button variant="light" size="sm"  onClick={onHide}>
          ×
        </Button>
 </div>
        {/* Item & Date */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <label className="text-muted small d-block mb-1">Item Name</label>
            <span className="fw-normal">{product.product_name}</span>
          </div>
          <div>
            <label className="text-muted small d-block mb-1">Adjustment Date</label>
            <DatePicker
              selected={date}
              onChange={setDate}
              className="form-control form-control-sm"
              dateFormat="dd/MM/yyyy"
              style={{ width: "140px" }}
            />
          </div>
        </div>

        <hr />

        {/* Form Fields */}
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Control
                type="number"
                placeholder="Total Qty"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Control
                type="number"
                placeholder="At Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Footer */}
        <div className="text-end">
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AdjustItem;