// src/components/modals/MoveCategoryModal.jsx
import React, { useState } from "react";
import { Modal, Button, Form, InputGroup, Table } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import axiosInstance from "../../config/API";
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

  const toggleItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedItems.length === filtered.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filtered.map((p) => p.product_id));
    }
  };

  const moveProductsToCategory = async () => {
    if (!selectedItems.length) return;

    setLoading(true);

    try {
      const tasks = selectedItems.map((pid) =>
        axiosInstance.post("products.php", {
          edit_product_id: pid,          // Product ID (primary key `id`)
          category_id: targetCategoryId, // Target Category ID (used by products.php to update both category_id and fetch/update category_name)
        })
      );
      await Promise.all(tasks);

      toast.success(`${selectedItems.length} product(s) moved successfully!`);

      if (onMoveSuccess) onMoveSuccess();  // ✔ required to refresh UI

      onHide();
    } catch (err) {
      console.error(err);
      toast.error("Failed to move product(s)");
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
                    checked={
                      selectedItems.length === filtered.length &&
                      filtered.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th>Item Name</th>
                <th>Quantity</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p) => {
                const qty = p.stock
                  ? JSON.parse(p.stock).opening_qty || 0
                  : 0;

                return (
                  <tr key={p.product_id}>
                    <td>
                      <Form.Check
                        checked={selectedItems.includes(p.product_id)}
                        onChange={() => toggleItem(p.product_id)}
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
          <div className="text-center text-muted py-3">
            No items available to move
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>

        <Button
          variant="danger"
          onClick={moveProductsToCategory}
          disabled={loading || selectedItems.length === 0}
        >
          {loading ? "Moving..." : "Move to this category"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
