// src/components/modals/BulkUpdateModal.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Modal,
  Button,
  Form,
  Table,
  InputGroup,
  DropdownButton,
  Dropdown,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { bulkUpdateItems, fetchProducts } from "../../slice/ProductSlice";
import { fetchCategories } from "../../slice/CategorySlice";
const $ = (json) => { try { return JSON.parse(json) } catch { return {} } };



const TAX_RATES = [
  "None",
  "IGST@0%", "IGST@0.25%", "IGST@3%", "IGST@5%", "IGST@12%", "IGST@18%", "IGST@28%",
  "CGST@0% + SGST@0%", "CGST@0.125% + SGST@0.125%", "CGST@1.5% + SGST@1.5%",
  "CGST@2.5% + SGST@2.5%", "CGST@6% + SGST@6%", "CGST@9% + SGST@9%", "CGST@14% + SGST@14%",
  "Exempt",
];

// Memoized Row Component - THIS FIXES INPUT/CHECKBOX/DROPDOWN ISSUES
const ProductRow = React.memo(({ product, idx, editValues, selectedItems, toggleSelect, handleFieldChange, categories, categoryStatus, activeSection      }) => {
  const vals = editValues[product.product_id] || {};
  const sale = product.sale_price ? $(product.sale_price) : {};
  const purchase = product.purchase_price ? $(product.purchase_price) : {};
  const stock = product.stock ? $(product.stock) : {};

  const isSelected = selectedItems.includes(product.product_id);
 // "Pricing", "Stock", "Item Info"
  return (
   <tr>
  <td>
    <Form.Check
      type="checkbox"
      checked={isSelected}
      onChange={() => toggleSelect(product.product_id)}
    />
  </td>
  <td>{idx + 1}</td>

  {activeSection === "Pricing" && (
    <>
      <td>{product.product_name}</td>

      <td>
        {categoryStatus === "loading" ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <DropdownButton
            title={vals.category_name || product.category_name || "Select"}
            size="sm"
            variant="outline-secondary"
          >
            {categories.map((cat) => (
              <Dropdown.Item
                key={cat.category_id}
                onClick={() =>
                  handleFieldChange(
                    product.product_id,
                    "category_id",
                    cat.category_id,
                    "category_name",
                    cat.category_name
                  )
                }
              >
                {cat.category_name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        )}
      </td>

      <td>
        <Form.Control
          size="sm"
          type="text"
          value={vals.hsn_code ?? product.hsn_code ?? ""}
          onChange={(e) => handleFieldChange(product.product_id, "hsn_code", e.target.value)}
        />
      </td>

      <td>
        <Form.Control
          size="sm"
          type="number"
          value={vals.purchase_price ?? purchase.price ?? ""}
          onChange={(e) => handleFieldChange(product.product_id, "purchase_price", e.target.value)}
        />
      </td>

      <td>
        <DropdownButton
          title={vals.purchase_tax_type || purchase.tax_type || "Excluded"}
          size="sm"
          variant="outline-secondary"
        >
          {["Excluded", "Included"].map((opt) => (
            <Dropdown.Item
              key={opt}
              onClick={() => handleFieldChange(product.product_id, "purchase_tax_type", opt)}
            >
              {opt}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </td>

      <td>
        <Form.Control
          size="sm"
          type="number"
          value={vals.sale_price ?? sale.price ?? ""}
          onChange={(e) => handleFieldChange(product.product_id, "sale_price", e.target.value)}
        />
      </td>

      <td>
        <DropdownButton
          title={vals.sale_tax_type || sale.tax_type || "Excluded"}
          size="sm"
          variant="outline-secondary"
        >
          {["Excluded", "Included"].map((opt) => (
            <Dropdown.Item
              key={opt}
              onClick={() => handleFieldChange(product.product_id, "sale_tax_type", opt)}
            >
              {opt}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </td>

      <td>
        <Form.Control
          size="sm"
          type="number"
          value={vals.discount ?? sale.discount ?? ""}
          onChange={(e) => handleFieldChange(product.product_id, "discount", e.target.value)}
        />
      </td>

      <td>
        <DropdownButton
          title={vals.discount_type || sale.discount_type || "Percentage"}
          size="sm"
          variant="outline-secondary"
        >
          {["Percentage", "Amount"].map((opt) => (
            <Dropdown.Item
              key={opt}
              onClick={() => handleFieldChange(product.product_id, "discount_type", opt)}
            >
              {opt}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </td>

      <td>
        <DropdownButton
          title={vals.tax_rate || product.tax_rate || "None"}
          size="sm"
          variant="outline-secondary"
        >
          {TAX_RATES.map((rate) => (
            <Dropdown.Item
              key={rate}
              onClick={() => handleFieldChange(product.product_id, "tax_rate", rate)}
            >
              {rate}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </td>
    </>
  )}


{activeSection === "Stock" && (
  <>
    <td>{product.product_name}</td>

    <td>
      <Form.Control
        size="sm"
        type="number"
      value={vals.opening_qty ?? stock.opening_qty ?? ""}

        onChange={(e) =>
          handleFieldChange(product.product_id, "opening_qty", e.target.value)
        }
      />
    </td>

    <td>
      <Form.Control
        size="sm"
        type="number"
        value={vals.at_price ?? stock.at_price ?? ""}
        onChange={(e) =>
          handleFieldChange(product.product_id, "at_price", e.target.value)
        }
      />
    </td>

    <td>
      <Form.Control
        size="sm"
        type="date"
       value={vals.opening_date ?? stock.opening_date ?? ""}
        onChange={(e) =>
          handleFieldChange(product.product_id, "opening_date", e.target.value)
        }
      />
    </td>

    <td>
      <Form.Control
        size="sm"
        type="number"
       value={vals.min_stock ?? stock.min_stock ?? ""}
        onChange={(e) =>
          handleFieldChange(product.product_id, "min_stock", e.target.value)
        }
      />
    </td>

    <td>
      <Form.Control
        size="sm"
  value={vals.location ?? stock.location ?? ""}
        onChange={(e) =>
          handleFieldChange(product.product_id, "location", e.target.value)
        }
      />
    </td>
  </>
)}



{activeSection === "Item Info" && (
  <>
    <td>{product.product_name}</td>

    {/* Category Dropdown */}
    <td>
      {categoryStatus === "loading" ? (
        <Spinner animation="border" size="sm" />
      ) : (
        <DropdownButton
          title={vals.category_name || product.category_name || "Select Category"}
          size="sm"
          variant="outline-secondary"
        >
          {categories.map((cat) => (
            <Dropdown.Item
              key={cat.category_id}
              onClick={() =>
                handleFieldChange(
                  product.product_id,
                  "category_id",
                  cat.category_id,
                  "category_name",
                  cat.category_name
                )
              }
            >
              {cat.category_name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      )}
    </td>

    {/* HSN Code */}
    <td>
      <Form.Control
        size="sm"
        type="text"
        value={vals.hsn_code ?? product.hsn_code ?? ""}
        onChange={(e) => handleFieldChange(product.product_id, "hsn_code", e.target.value)}
      />
    </td>

    {/* Item Code */}
   {/* Item Code */}
<td>
  <Form.Control
    size="sm"
    type="text"
    value={vals.item_code ?? product.product_code ?? ""}
    onChange={(e) => handleFieldChange(product.product_id, "item_code", e.target.value)}  // ← FIXED: was "product_code"
  />
</td>
  </>
)}


  </tr>
  );
  });

const BulkUpdateModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const { products = [] } = useSelector((state) => state.product);
  const { categories = [], status: categoryStatus } = useSelector((state) => state.category);

  const activeProducts = useMemo(() => 
    products.filter((p) => p.status_code == 0), [products]
  );

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editValues, setEditValues] = useState({});
  const [activeSection, setActiveSection] = useState("Pricing");


  // Fetch categories
  useEffect(() => {
    if (show && categoryStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [show, categoryStatus, dispatch]);

  // Initialize edit values
  useEffect(() => {
  if (!show) {
    // Reset when modal closes
    setEditValues({});
    return;
  }

  // Rebuild editValues every time modal opens OR products update
  const initial = {};
  activeProducts.forEach((p) => {
    const sale = $(p.sale_price);
    const purchase = $(p.purchase_price);

    initial[p.product_id] = {
      category_id: p.category_id || "",
      category_name: p.category_name || "",
      hsn_code: p.hsn_code || "",
      tax_rate: p.tax_rate || "None",

      // From JSON
      sale_price: sale.price || "",
      sale_tax_type: sale.tax_type || "Excluded",
      discount: sale.discount || "",
      discount_type: sale.discount_type || "Percentage",

      purchase_price: purchase.price || "",
      purchase_tax_type: purchase.tax_type || "Excluded",
      opening_qty: p.opening_qty || "",
at_price: p.at_price || "",
opening_date: p.opening_date || "",
min_stock: p.min_stock || "",
location: p.location || "",
item_code: p.product_code || "",  // ← Use product_code from DB

    };
  });
  setEditValues(initial);
}, [show, activeProducts]); // This is the key!
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return activeProducts.filter(
      (p) =>
        p.product_name?.toLowerCase().includes(term) ||
        (p.hsn_code && p.hsn_code.toString().includes(searchTerm))
    );
  }, [activeProducts, searchTerm]);

  useEffect(() => {
    if (selectAll) {
      setSelectedItems(filteredProducts.map((p) => p.product_id));
    } else {
      setSelectedItems([]);
    }
  }, [selectAll, filteredProducts]);

  useEffect(() => {
    if (!show) {
      setSelectedItems([]);
      setSelectAll(false);
      setSearchTerm("");
      setEditValues({});
    }
  }, [show]);

  const toggleSelect = useCallback((id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const handleFieldChange = useCallback((product_id, field, value, extraField = null, extraValue = null) => {
    setEditValues((prev) => ({
      ...prev,
      [product_id]: {
        ...prev[product_id],
        [field]: value,
        ...(extraField && { [extraField]: extraValue }),
      },
    }));
  }, []);

// src/components/modals/BulkUpdateModal.jsx (inside BulkUpdateModal component)

// ... (other functions and variables)

const handleUpdate = () => {
    // We only need the product IDs for the bulk update
    if (selectedItems.length === 0) {
        alert("Please select at least one item to update.");
        return;
    }

    // CRITICAL: We determine the bulk update values from the FIRST selected item
    // that has changes, as a single set of values is applied to ALL selected products.
    const firstId = selectedItems[0];
    const original = activeProducts.find(p => p.product_id === firstId);
    const edited = editValues[firstId] || {};

    const payload = {
        bulk_update_items: true,
        product_ids: selectedItems,
    };
    
    let hasChanges = false;


    // STOCK FIELDS

// ONLY THIS BLOCK GOES IN handleUpdate() — REPLACE EVERYTHING ELSE FOR STOCK

// STOCK UPDATE - FINAL & 100% WORKING
const stockFields = ["opening_qty", "at_price", "opening_date", "min_stock", "location"];

const originalStock = original?.stock ? $(original.stock) : {};
const stockPayload = {};

stockFields.forEach((field) => {
  const newVal = edited[field];
  const oldVal = originalStock[field];

  if (newVal !== undefined && newVal !== "" && String(newVal) !== String(oldVal || "")) {
    stockPayload[field] = newVal;
  ;
  }
});

if (Object.keys(stockPayload).length > 0) {
  const newQty = parseFloat(stockPayload.opening_qty ?? originalStock.opening_qty ?? 0);
  const newPrice = parseFloat(stockPayload.at_price ?? originalStock.at_price ?? 0);

  const updatedStock = {
    ...originalStock,
    ...stockPayload,
    current_qty: newQty,
    current_value: (newQty * newPrice).toFixed(2),
  };

  payload.stock = JSON.stringify(updatedStock);
  hasChanges = true;
}



    // --- Simple change detection for each field ---

    // 1. HSN Code (Number)
    const hsnValue = edited.hsn_code ?? original?.hsn_code ?? "";
    if (hsnValue !== (original?.hsn_code ?? "")) {
        payload.hsn_code = hsnValue;
        hasChanges = true;
    }
if (edited.item_code !== undefined && edited.item_code !== (original?.product_code ?? "")) {
  payload.product_code = edited.item_code;
  hasChanges = true;
}
    // 2. Category ID (String)
    const categoryIdValue = edited.category_id ?? original?.category_id ?? "";
    if (categoryIdValue !== (original?.category_id ?? "")) {
        payload.category_id = categoryIdValue;
        // We do NOT send category_name here. The PHP script is responsible for 
        // fetching the category_name based on category_id and updating it in the DB.
        hasChanges = true;
    }
    // Send tax_rate to backend
    // ADD THIS → Tax Rate (exactly like your current payload expects)
 
    // 3. Sale Price JSON (Requires parsing and comparison)
    // Pull original values out of the JSON string
   // 3. Sale Price JSON – ONLY THIS MATTERS
const origSale = original?.sale_price ? $(original.sale_price) : {};

const newSaleObject = {
    price: edited.sale_price ?? origSale.price ?? "",
    tax_type: edited.sale_tax_type ?? origSale.tax_type ?? "Excluded",
    discount: edited.discount ?? origSale.discount ?? "",
    discount_type: edited.discount_type ?? origSale.discount_type ?? "Percentage",
};

const newSaleJSON = JSON.stringify(newSaleObject);

// Only send if actually changed
if (newSaleJSON !== (original?.sale_price ?? '{}')) {
    payload.sale_price = newSaleJSON;
    hasChanges = true;
}

    // 4. Purchase Price JSON
       // 4. Purchase Price JSON — INCLUDING tax_rate inside it
    const origPurchase = original?.purchase_price ? $(original.purchase_price) : {};
    
    const newPurchaseObject = {
        price: edited.purchase_price ?? origPurchase.price ?? "",
        tax_type: edited.purchase_tax_type ?? origPurchase.tax_type ?? "Excluded",
        tax_rate: edited.tax_rate ?? origPurchase.tax_rate ?? "None",  // ← THIS LINE ADDED
    };

    const newPurchaseJSON = JSON.stringify(newPurchaseObject);

    if (newPurchaseJSON !== (original?.purchase_price ?? '{}')) {
        payload.purchase_price = newPurchaseJSON;
        hasChanges = true;
    }

    

    if (!hasChanges) {
        alert("No changes detected. Please edit a field before updating.");
        return;
    }
    
    // Dispatch the action with the combined payload
    dispatch(bulkUpdateItems(payload))
        .unwrap()
        .then(() => {
            alert("Items updated successfully!");
            // Refresh products to ensure the main table and modal show correct values
            dispatch(fetchProducts()); 
            onHide();
        })
        .catch((error) => {
            alert(`Update failed: ${error.message || error}`);
        });
};

// ... (rest of the component)

  return (
    <Modal show={show} onHide={onHide} size="xl" fullscreen="xl-down" >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fs-4 ">Bulk Update Items</Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <InputGroup style={{ width: "420px" }}>
            <InputGroup.Text className="bg-white border-end-0">Search</InputGroup.Text>
            <Form.Control
              placeholder="Search by item name / HSN Code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>

         <div className="d-flex gap-2">
  <Button
    variant={activeSection === "Pricing" ? "primary" : "outline-secondary"}
    size="sm"
    onClick={() => setActiveSection("Pricing")}
  >
    Pricing
  </Button>
  <Button
    variant={activeSection === "Stock" ? "primary" : "outline-secondary"}
    size="sm"
    onClick={() => setActiveSection("Stock")}
  >
    Stock
  </Button>
  <Button
    variant={activeSection === "Item Info" ? "primary" : "outline-secondary"}
    size="sm"
    onClick={() => setActiveSection("Item Info")}
  >
    Item Information
  </Button>
</div>

        </div>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-muted small">
            <strong>{selectedItems.length}</strong> items selected
          </span>
          <Button variant="outline-primary" size="sm">
            Update Tax Slab
          </Button>
        </div>

        <div style={{ maxHeight: "1000px", overflow: "auto" }}>
          <Table bordered hover size="sm">
            <thead className="table-light sticky-top">
  <tr>
    <th style={{ width: 40 }}>
      <Form.Check
        checked={selectAll}
        onChange={(e) => setSelectAll(e.target.checked)}
      />
    </th>
    <th>#</th>

    {activeSection === "Pricing" && (
      <>
        <th>ITEM NAME</th>
        <th>CATEGORY</th>
        <th>ITEM HSN</th>
        <th>PURCHASE PRICE</th>
        <th>TAX TYPE</th>
        <th>SALE PRICE</th>
        <th>TAX TYPE</th>
        <th>DISCOUNT</th>
        <th>DISCOUNT TYPE</th>
        <th>TAX RATE</th>
      </>
    )}

    {activeSection === "Stock" && (
      <>
        <th>ITEM NAME</th>
        <th>OPENING QTY</th>
        <th>AT PRICE</th>
        <th>AS OF DATE</th>
        <th>MIN STOCK</th>
        <th>LOCATION</th>
      </>
    )}

    {activeSection === "Item Info" && (
      <>
        <th>ITEM NAME</th>
        <th>ITEM HSN</th>
        <th>CATEGORY</th>
        <th>ITEM CODE</th>
      </>
    )}
  </tr>
</thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center text-muted py-5">
                    No items found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, idx) => (
                  <ProductRow
                    key={product.product_id}
                    product={product}
                    idx={idx}
                    editValues={editValues}
                    selectedItems={selectedItems}
                    toggleSelect={toggleSelect}
                    handleFieldChange={handleFieldChange}
                    categories={categories}
                    categoryStatus={categoryStatus}
                      activeSection={activeSection}
                  />
                ))
              )}
            </tbody>
          </Table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
          <span className="text-muted small">
            Pricing: {selectedItems.length} Updates Pending
          </span>
          <Button
            variant="primary"
            onClick={handleUpdate}
            disabled={selectedItems.length === 0}
          >
            Update Selected Items
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default BulkUpdateModal;