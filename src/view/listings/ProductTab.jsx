// src/pages/tabs/ProductTab.jsx
import React, { useState, useEffect } from "react";
import { Button, Table, Col, Card, Row ,DropdownButton, Dropdown} from "react-bootstrap";
import { FaSearch, FaFileExcel,FaEllipsisV } from "react-icons/fa";
import AdjustItem from "../creation/AdjustItemCreation";
import AddItem from "../creation/ItemModalCreation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../../slice/ProductSlice";
import BulkProductModal from "../creation/BulkProductModal";
import BulkUpdateModal from "../creation/BulkUpdateModal";
import "../../App.css";

export default function ProductTab() {
  const $ = (json) => { try { return JSON.parse(json) } catch { return {} } };
  const [showAdjustItem, setShowAdjustItem] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
 
const [editProduct, setEditProduct] = useState(null);

  const dispatch = useDispatch();
  const { products = [], status } = useSelector((state) => state.product);
const [bulkModal, setBulkModal] = useState({ show: false, type: "" });

  // Filter products to only show ACTIVE items (status_code == 0)
  const activeProducts = products.filter(p => p.status_code == 0);

  // Fetch products on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Auto-select first product when list updates (e.g. after adding new item)
  useEffect(() => {
    if (activeProducts.length > 0 && !selectedProduct) {
      setSelectedProduct(activeProducts[0]);
    }
  }, [activeProducts, selectedProduct]);


// Keep selectedProduct in sync with latest products list (using activeProducts for a fresh check)
// Keep selected product always fresh when the products array changes
useEffect(() => {
  if (selectedProduct && activeProducts.length > 0) {
    const freshProduct = activeProducts.find(p => p.product_id === selectedProduct.product_id);
    if (freshProduct && freshProduct !== selectedProduct) {
      setSelectedProduct(freshProduct);
    }
  } else if (selectedProduct && !activeProducts.some(p => p.product_id === selectedProduct.product_id)) {
    // If the currently selected product is no longer active, deselect it
    setSelectedProduct(null);
  }
}, [activeProducts, selectedProduct]);



  // Re-fetch products when modal closes (in case new item was added)
  const handleCloseAddItem = () => {
    setShowAddItem(false);
    dispatch(fetchProducts()); // Refresh list
  };

  if (status === "loading") return <div className="text-center p-5">Loading items...</div>;
  if (status === "failed") return <div className="text-danger p-5">Failed to load items</div>;

  return (
    <Row className="h-100">
      {/* LEFT PANEL - LIST OF ITEMS */}
      <Col md={3} className="p-3">
        <Card className="h-100 shadow-sm">
          <Card.Body className="p-3 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <FaSearch className="text-muted" />
             <Button
  variant="warning"
  className="text-white fw-bold small"
  onClick={() => {
    setEditProduct(null);   // <-- RESET EDIT MODE
    setShowAddItem(true);   // <-- OPEN MODAL CLEAN
  }}
>
  + Add Item 

</Button>
<DropdownButton
  title={<FaEllipsisV />}
  variant="link"
  size="sm"
>
  <Dropdown.Item onClick={() => setBulkModal({ show: true, type: "inactive" })}>
    Bulk Inactive
  </Dropdown.Item>
  <Dropdown.Item onClick={() => setBulkModal({ show: true, type: "active" })}>
    Bulk Active
  </Dropdown.Item>

<Dropdown.Item onClick={() => setBulkModal({ show: true, type: "assignCode" })}>
  Bulk Assign Code
</Dropdown.Item>
  <Dropdown.Item onClick={() => setBulkModal({ show: true, type: "assignUnits" })}>
    Assign Units
  </Dropdown.Item>
<Dropdown.Item onClick={() => setBulkModal({ show: false, type: "update" })}>
  Bulk Update Items
</Dropdown.Item>
</DropdownButton>

            </div>

            <div className="flex-grow-1 overflow-auto">
              <Table bordered hover size="sm" className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ITEM</th>
                    <th>QTY</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {activeProducts.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center text-muted py-4">
                        No active items yet
                      </td>
                    </tr>
                  ) : (
                    activeProducts.map((product) => { // <-- Use activeProducts here
                      const salePrice = product.sale_price ? $(product.sale_price) : {};
                      const purchasePrice = product.purchase_price ? $(product.purchase_price) : {};
                      const stock = product.stock ? $(product.stock) : {};
              const qty = parseFloat(stock.current_qty ?? stock.opening_qty ?? 0);

                      return (
                        <tr
key={product.product_id}
onClick={() => setSelectedProduct(product)}
className={`cursor-pointer ${selectedProduct?.product_id === product.product_id ? "table-primary" : ""}`}
                        >
                          <td className="fw-semibold">{product.product_name}</td>
                          <td className="text-center">{qty}</td>
                          <td className="text-center">
<DropdownButton
  title={<FaEllipsisV />}
  variant="link"
  size="sm"
  onClick={(e) => e.stopPropagation()}
>
  <Dropdown.Item onClick={(e) => {
    e.stopPropagation();
    setEditProduct(product);
    setShowAddItem(true);
  }}>
    View/Edit
  </Dropdown.Item>
  <Dropdown.Item 
    className="text-danger" 
    onClick={(e) => {
      e.stopPropagation();
      if (window.confirm("Delete this item permanently?")) {
        dispatch(deleteProduct(product.product_id));  // ← THIS WAS WRONG BEFORE (was product.id)
      }
    }}
  >
    Delete
  </Dropdown.Item>
</DropdownButton>
        </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* RIGHT PANEL - SELECTED ITEM DETAILS */}
      <Col md={9} className="p-3">
        {selectedProduct ? (
  <>
    {/* Top Detail Card */}
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="fw-bold mb-1">{selectedProduct.product_name}</h5>

            {(() => {
              const sale = selectedProduct.sale_price ? $(selectedProduct.sale_price) : {};
              const purchase = selectedProduct.purchase_price ? $(selectedProduct.purchase_price) : {};
              const stock = selectedProduct.stock ? $(selectedProduct.stock) : {};

              const openingQty = parseFloat(stock.opening_qty) || 0;
              const atPrice = parseFloat(stock.at_price) || 0;
              const currentQty = stock.current_qty ?? openingQty;
              const currentValue = stock.current_value ?? (openingQty * atPrice);

              return (
                <>
                  <div className="small text-muted">
                    SALE PRICE: <strong className="text-success">
                      ₹ {parseFloat(sale.price || 0).toFixed(2)} (excl)
                    </strong>
                  </div>
                  <div className="small text-muted">
                    PURCHASE PRICE: <strong className="text-success">
                      ₹ {parseFloat(purchase.price || 0).toFixed(2)} (excl)
                    </strong>
                  </div>
                </>
              );
            })()}
          </div>

          <div className="text-end ">
            <Button variant="primary" className="mb-3 px-4 py-3 bg-primary text-white" onClick={() => setShowAdjustItem(true)}>
              ADJUST ITEM
            </Button>

           {(() => {
  const stock = selectedProduct.stock ? $(selectedProduct.stock) : {};
  const qty = parseFloat(stock.current_qty ?? stock.opening_qty ?? 0);
  const value = parseFloat(stock.current_value ?? 0);

  return (
    <>
      <div className="small">
        STOCK QUANTITY: <strong className={qty <= 0 ? "text-danger" : ""}>{qty}</strong>
      </div>
      <div className="small">
        STOCK VALUE: <strong className="text-success">₹ {value.toFixed(2)}</strong>
      </div>
    </>
  );
})()}
          </div>
        </div>
      </Card.Body>
    </Card>

    {/* Transactions Table */}
    
   
{/* Transactions Table */}
<Card className="h-100 shadow-sm d-flex flex-column">
  <Card.Body className="d-flex flex-column h-100 p-3">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="mb-0 fw-bold">TRANSACTIONS</h5>
      <div className="d-flex gap-2">
        <div className="position-relative">
          <FaSearch className="position-absolute top-50 start-2 translate-middle-y text-muted" />
          <input type="text" className="form-control form-control-sm ps-5" placeholder="Search..." style={{ width: "200px" }} />
        </div>
        <Button variant="light"><FaFileExcel size={20} className="text-success" /></Button>
      </div>
    </div>

    <div className="flex-grow-1 overflow-auto">
      <Table bordered hover className="mb-0 table-sm">
        <thead className="table-light sticky-top">
          <tr>
            <th>TYPE</th>
            <th>INVOICE/REF</th>
            <th>NAME</th>
            <th>DATE</th>
            <th>QUANTITY</th>
            <th>PRICE/UNIT</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            if (!selectedProduct) return null;

            const stock = selectedProduct.stock ? $(selectedProduct.stock) : {};
            let transactions = [...(stock.transactions || [])];

            // Opening stock first
            if (stock.opening_transaction) {
              transactions.unshift(stock.opening_transaction);
            }

            if (transactions.length === 0) {
              return (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-5">
                    No transactions yet
                  </td>
                </tr>
              );
            }

            return transactions.map((t, i) => {
              // NAME logic – exactly like Vyapar
              let displayName = "";
              if (t.type === "Opening Stock") {
                displayName = "Opening Stock";
              } else if (t.reference && t.reference.trim() !== "") {
                displayName = t.reference;           // ← Your typed Details
              } else if (t.type === "Add Adjustment") {
                displayName = "Add Stock";
              } else if (t.type === "Reduce Adjustment") {
                displayName = "Reduce Stock";
              } else {
                displayName = t.type;
              }

              return (
                <tr key={i}>
                  <td>{t.type}</td>
                  <td>-</td>
                  <td>{displayName}</td>
                  <td>{t.date.split("-").reverse().join("/")}</td>
                  <td className={t.quantity > 0 ? "text-success" : "text-danger"}>
                    {t.quantity > 0 ? "+" : ""}{Math.abs(t.quantity)}
                  </td>
                  <td>₹ {parseFloat(t.price_per_unit || 0).toFixed(2)}</td>
                  <td></td>
                </tr>
              );
            });
          })()}
        </tbody>
      </Table>
    </div>
  </Card.Body>
</Card>
    
  </>
) : (
          <Card className="h-100 d-flex align-items-center justify-content-center text-muted shadow-sm">
            <Card.Body className="text-center">
              <h5>No item selected</h5>
              <p>Select an item from the left panel or add a new one</p>
            </Card.Body>
          </Card>
        )}
      </Col>

      {/* Modals */}
      {/* <AddItem
        show={showAddItem}
        onHide={handleCloseAddItem}
        activeTab="PRODUCT"
      /> */}

   {/* AddItem Modal */}
<AddItem
  show={showAddItem}
  onHide={() => {
    setShowAddItem(false);
    setEditProduct(null);
    dispatch(fetchProducts()).then(() => {
      // Logic to re-select the edited product, if it's still active
      if (editProduct) {
        const fresh = activeProducts.find(p => p.product_id === editProduct.product_id); // <-- Use activeProducts for check
        if (fresh) setSelectedProduct(fresh);
      }
    });
  }}
  editProduct={editProduct}
/>

{/* AdjustItem Modal */}
<AdjustItem
  show={showAdjustItem}
  onHide={() => {
    setShowAdjustItem(false);
    dispatch(fetchProducts()).then(() => {
      if (selectedProduct) {
        const updated = activeProducts.find(p => p.product_id === selectedProduct.product_id); // <-- Use activeProducts for check
        if (updated) setSelectedProduct(updated);
        // If it was made inactive, it will be deselected by the main useEffect
      }
    });
  }}
  product={selectedProduct}
/>
{/* Bulk Action Modal */}
<BulkProductModal
  show={bulkModal.show}
  onHide={() => setBulkModal({ show: false, type: "" })}
  mode={bulkModal.type} // ← this controls Active/Inactive
  title={bulkModal.type === "inactive" ? "Bulk Inactive" : "Bulk Active"}
  actionButtonText={bulkModal.type === "inactive" ? "Mark as Inactive" : "Mark as Active"}
  actionButtonVariant={bulkModal.type === "inactive" ? "danger" : "success"}
  isBulkInactive={bulkModal.type === "inactive"}
/>

<BulkUpdateModal
  show={bulkModal.type === "update"}
  onHide={() => {
    setBulkModal({ show: false, type: "" });
    dispatch(fetchProducts()); // This forces left panel to show new current_qty/value
  }}
/>
    </Row>
  );
}