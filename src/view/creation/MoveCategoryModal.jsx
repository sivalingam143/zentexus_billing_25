// src/components/modals/MoveCategoryModal.jsx
import React, { useState } from "react";
import { Modal, Button, Form, InputGroup, Table } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import axiosInstance from "../../config/API";   // your existing API instance
import { toast } from "react-toastify";
export default function MoveCategoryModal({
  show,
  onHide,
  allProducts,
  targetCategoryId,
  onMoveSuccess,
}) {

    
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const availableProducts = allProducts.filter(
    (p) => String(p.category_id || "") !== String(targetCategoryId)
  );

  const filtered = availableProducts.filter((p) =>
    p.product_name?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAll = () => {
    if (selectedItems.length === filtered.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filtered.map((p) => p.id));
    }
  };

const moveProductsToCategory = async () => {
  if (selectedItems.length === 0) return;

  setLoading(true);
  try {
    const requests = selectedItems.map((productId) =>
      axiosInstance.post("products.php", {
        edit_product_id: productId,
        category_id: targetCategoryId, // this is correct
      })
    );

    await Promise.all(requests);

    toast.success(`${selectedItems.length} product(s) moved successfully!`);
    if (onMoveSuccess) {
  onMoveSuccess(selectedItems); // <-- No longer needed
}
    onHide();
  } catch (error) {
    console.error("Move failed:", error);
    toast.error("Failed to move one or more products");
  } finally {
    setLoading(false);
  }
};


  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Items</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text className="bg-white">
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search items"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <Table bordered hover size="sm">
            <thead className="table-light sticky-top">
              <tr>
                <th style={{ width: "40px" }}>
         

<Form.Check
  type="checkbox"
  checked={selectedItems.length === filtered.length && filtered.length > 0}
  indeterminate={selectedItems.length > 0 && selectedItems.length < filtered.length ? true : undefined}
  onChange={toggleAll}
/>
                </th>
                <th>Item Name</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const qty = p.stock ? JSON.parse(p.stock).opening_qty || 0 : 0;
                return (
                  <tr key={p.id}>
                    <td>
                      <Form.Check
                        checked={selectedItems.includes(p.id)}
                        onChange={() => toggleItem(p.id)}
                      />
                    </td>
                    <td>{p.product_name}</td>
                    <td>{qty}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-muted py-4">No items available to move</div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Form.Check label="Remove selected items from existing category" className="me-auto" />
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button
          variant="danger"
        onClick={moveProductsToCategory} 
          disabled={selectedItems.length === 0 || loading}
        >
          {loading ? "Moving..." : "Move to this category"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}