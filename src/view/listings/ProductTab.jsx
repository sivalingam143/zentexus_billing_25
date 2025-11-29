// src/pages/tabs/ProductTab.jsx
import React, { useState, useEffect } from "react";
import { Button, Table, Col, Card, Row } from "react-bootstrap";
import { FaSearch, FaFileExcel } from "react-icons/fa";
import AdjustItem from "../creation/AdjustItemCreation";
import AddItem from "../creation/ItemModalCreation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../slice/ProductSlice";

export default function ProductTab() {
  const [showAdjustItem, setShowAdjustItem] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const dispatch = useDispatch();
  const { products = [], status } = useSelector((state) => state.product);

  // Fetch products on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Auto-select first product when list updates (e.g. after adding new item)
  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);

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
                onClick={() => setShowAddItem(true)}
              >
                + Add Item
              </Button>
            </div>

            <div className="flex-grow-1 overflow-auto">
              <Table bordered hover size="sm" className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ITEM</th>
                    <th>QTY</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center text-muted py-4">
                        No items yet
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => {
                      const salePrice = product.sale_price ? JSON.parse(product.sale_price) : {};
                      const purchasePrice = product.purchase_price ? JSON.parse(product.purchase_price) : {};
                      const stock = product.stock ? JSON.parse(product.stock) : {};
                      const qty = stock.opening_qty || 0;

                      return (
                        <tr
                          key={product.id}
                          onClick={() => setSelectedProduct(product)}
                          className={`cursor-pointer ${selectedProduct?.id === product.id ? "table-primary" : ""}`}
                        >
                          <td className="fw-semibold">{product.product_name}</td>
                          <td className="text-center">{qty}</td>
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
                      const sale = selectedProduct.sale_price ? JSON.parse(selectedProduct.sale_price) : {};
                      const purchase = selectedProduct.purchase_price ? JSON.parse(selectedProduct.purchase_price) : {};
                      const stock = selectedProduct.stock ? JSON.parse(selectedProduct.stock) : {};

                      return (
                        <>
                          <div className="small text-muted">
                            SALE PRICE:{" "}
                            <strong className="text-success">
                              ₹ {parseFloat(sale.price || 0).toFixed(2)}{" "}
                              ({sale.tax_type === "With Tax" ? "incl" : "excl"})
                            </strong>
                          </div>
                          <div className="small text-muted">
                            PURCHASE PRICE:{" "}
                            <strong className="text-success">
                              ₹ {parseFloat(purchase.price || 0).toFixed(2)}{" "}
                              ({purchase.tax_type === "With Tax" ? "incl" : "excl"})
                            </strong>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="text-end">
                    <Button
                      variant="primary"
                      className="mb-3 px-4"
                      onClick={() => setShowAdjustItem(true)}
                    >
                      ADJUST ITEM
                    </Button>
                    <div className="small">
                      STOCK QUANTITY:{" "}
                      <strong className={parseFloat(selectedProduct.stock ? JSON.parse(selectedProduct.stock).opening_qty || 0 : 0) <= 0 ? "text-danger" : ""}>
                        {selectedProduct.stock ? JSON.parse(selectedProduct.stock).opening_qty || 0 : 0}
                      </strong>
                    </div>
                    <div className="small">
                      STOCK VALUE:{" "}
                      <strong className="text-success">
                        ₹{" "}
                        {(
                          (selectedProduct.stock ? JSON.parse(selectedProduct.stock).opening_qty || 0 : 0) *
                          (selectedProduct.purchase_price ? JSON.parse(selectedProduct.purchase_price).price || 0 : 0)
                        ).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Transactions Table */}
            <Card className="flex-grow-1 shadow-sm vh-100">
              <Card.Body className="d-flex flex-column h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">TRANSACTIONS</h5>
                  <div className="d-flex gap-2">
                    <div className="position-relative">
                      <FaSearch className="position-absolute top-50 start-2 translate-middle-y text-muted" />
                      <input
                        type="text"
                        className="form-control form-control-sm ps-5"
                        placeholder="Search..."
                        style={{ width: "200px" }}
                      />
                    </div>
                    <Button variant="light">
                      
                      <FaFileExcel size={20} className="text-success" />
                    </Button>
                  </div>
                </div>

                <Table bordered hover className="flex-grow-1">
                  <thead className="table-light">
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
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-5">
                        No transactions yet
                      </td>
                    </tr>
                  </tbody>
                </Table>
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
      <AddItem
        show={showAddItem}
        onHide={handleCloseAddItem}
        activeTab="PRODUCT"
      />
      <AdjustItem
        show={showAdjustItem}
        onHide={() => setShowAdjustItem(false)}
        itemName={selectedProduct?.product_name}
      />
    </Row>
  );
}