// src/components/modals/BulkProductModal.jsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Table,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { bulkUpdateProductStatus } from "../../slice/ProductSlice" // adjust path if needed

const BulkProductModal = ({
  show,
  onHide,
  title = "Bulk Action",
  actionButtonText = "Apply",
  actionButtonVariant = "primary",
  loading: externalLoading = false,
  isBulkInactive = false,
  mode = "custom", // new: "inactive" | "active" | "custom"
}) => {
  const dispatch = useDispatch();
  const { products = [], status } = useSelector((state) => state.product);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);

  // Only show active items (status_code != 1)
  const filteredProducts = products
    .filter(p => p.status_code == 0) 
    .filter((item) =>
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleToggleItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredProducts.map((p) => p.product_id));
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const allVisibleSelected = filteredProducts.length > 0 &&
      filteredProducts.every((p) => selectedItems.includes(p.product_id));
    setSelectAll(allVisibleSelected && filteredProducts.length > 0);
  }, [selectedItems, filteredProducts]);

  const handleClose = () => {
    setSearchTerm("");
    setSelectedItems([]);
    setSelectAll(false);
    onHide();
  };

const handleConfirm = async () => {
  if (selectedItems.length === 0) return alert("Please select at least one item.");

  setLoading(true);

  const statusCode = mode === "inactive" ? 1 : 0;
  const statusName = statusCode === 1 ? "inactive" : "active";

  try {
    await dispatch(
      bulkUpdateProductStatus({
        product_ids: selectedItems,
        status_code: statusCode,
        status_name: statusName,
      })
    ).unwrap();

    alert("Bulk update successful!");
    handleClose();
  } catch (err) {
    alert("Error: " + err);
  } finally {
    setLoading(false);
  }
};



  return (
    <Modal show={show} onHide={handleClose} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Search + Count */}
        <div className="mb-3">
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <div className="mt-2 text-muted small">
            Showing <strong>{filteredProducts.length}</strong> active items
            {selectedItems.length > 0 && (
              <span className="ms-3">
                • <Badge bg="primary">{selectedItems.length} selected</Badge>
              </span>
            )}
          </div>
        </div>

        <div style={{ maxHeight: "420px", overflowY: "auto" }}>
          <Table hover bordered size="sm">
            <thead className="table-light sticky-top">
              <tr>
                <th style={{ width: "50px" }}>
                  <Form.Check checked={selectAll} onChange={handleSelectAll} />
                </th>
                <th>Item Name</th>
                <th className="text-center">Qty</th>
                {isBulkInactive && <th className="text-center">Sold (90d)</th>}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stock = product.stock ? JSON.parse(product.stock) : {};
                const qty = parseFloat(stock.current_qty ?? stock.opening_qty ?? 0);
                const soldLast90 = stock.quantity_sold_last_90_days || 0;

                return (
                  <tr key={product.product_id}>
                    <td>
                      <Form.Check
                        checked={selectedItems.includes(product.product_id)}
                        onChange={() => handleToggleItem(product.product_id)}
                      />
                    </td>
                    <td className="fw-medium">{product.product_name}</td>
                    <td className="text-center">{qty}</td>
                    {isBulkInactive && (
                      <td className="text-center text-danger fw-bold">{soldLast90}</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button
          variant={actionButtonVariant}
          onClick={handleConfirm}
          disabled={loading || externalLoading || selectedItems.length === 0}
        >
          {loading ? "Processing..." : actionButtonText} ({selectedItems.length})
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BulkProductModal;