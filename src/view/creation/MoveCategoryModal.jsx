
// src/components/modals/MoveCategoryModal.jsx
import React, { useState, useEffect } from "react";

import { Modal, Button, Form, InputGroup, Table } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import axiosInstance from "../../config/API";
import { toast } from "react-toastify";

export default function MoveCategoryModal({
  show,
  onHide,
  allProducts,
  categories, 
  targetCategoryId,
  onMoveSuccess,
}) {
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removeExisting, setRemoveExisting] = useState(false);
useEffect(() => {
  if (show) {
    // Reset modal state every time it opens
    setSearch("");
    setSelectedItems([]);
    setRemoveExisting(false);
    setLoading(false);
  }
}, [show, targetCategoryId]);

  // Define targetCategory here for use in JSX and handleMove
  const targetCategory = categories.find(c => String(c.category_id) === String(targetCategoryId));

  // Filter products that are not currently in the target category list
  const availableProducts = allProducts.filter(
    (p) => {
        if (!p.category_id) return true;
        try {
            const currentIds = JSON.parse(p.category_id).map(String);
            return !currentIds.includes(String(targetCategoryId));
        } catch (e) {
            return String(p.category_id) !== String(targetCategoryId);
        }
    }
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

const handleMove = async () => {
  if (!selectedItems.length) return;

  if (!targetCategoryId || !targetCategory) {
    toast.error("Invalid target category");
    return;
  }

  setLoading(true);

  try {
    const responses = [];

    const tasks = selectedItems.map(async (pid) => {
      const product = allProducts.find((p) => p.product_id === pid);
      if (!product) return;

      const targetIdString = String(targetCategoryId);

      // Parse existing category IDs
      const existingCategoryIds = product.category_id
        ? (() => {
            try {
              return JSON.parse(product.category_id).map(String);
            } catch {
              return [String(product.category_id)];
            }
          })()
        : [];

      // Parse existing category names
      const existingCategoryNames = product.category_name
        ? (() => {
            try {
              return JSON.parse(product.category_name);
            } catch {
              return [product.category_name];
            }
          })()
        : [];

      let finalCategoryIds = [];
      let finalCategoryNames = [];

      // MOVE
      if (removeExisting) {
        finalCategoryIds = [targetIdString];
        finalCategoryNames = [targetCategory.category_name];
      }
      // COPY
      else {
        if (existingCategoryIds.includes(targetIdString)) return;

        finalCategoryIds = [...existingCategoryIds, targetIdString];
        finalCategoryNames = [...existingCategoryNames, targetCategory.category_name];
      }

      const res = await axiosInstance.post("products.php", {
        edit_product_id: pid,
        category_id: JSON.stringify(finalCategoryIds),
        category_name: JSON.stringify(finalCategoryNames),
      });

      responses.push(res.data);
    });

    await Promise.all(tasks);

    // ✅ Use message from PHP
    const successMsg =
      responses.find((r) => r?.head?.code === 200)?.head?.msg ||
      "Operation completed";

    toast.success(successMsg);

    onMoveSuccess?.();
    onHide();
  } catch (err) {
    console.error(err);

    const errorMsg =
      err?.response?.data?.head?.msg || "Failed to process items";

    toast.error(errorMsg);
  } finally {
    setLoading(false);
  }
};



  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Assign Items to Multiple Categories</Modal.Title>
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
                <th>Current Categories</th>
                <th>Quantity</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p) => {
                const qty = p.stock
                  ? JSON.parse(p.stock).opening_qty || 0
                  : 0;
                  
                // Display current categories for context
                const currentNames = p.category_name
                    ? (() => {
                        try {
                            return JSON.parse(p.category_name).join(", ");
                        } catch {
                            return p.category_name || "None";
                        }
                    })()
                    : "None";

                return (
                  <tr key={p.product_id}>
                    <td>
                      <Form.Check
                        checked={selectedItems.includes(p.product_id)}
                        onChange={() => toggleItem(p.product_id)}
                      />
                    </td>
                    <td>{p.product_name}</td>
                    <td>{currentNames}</td>
                    <td>{qty}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-muted py-3">
            No items available to assign to this category
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between align-items-center">



  <div>
    <Form.Check
    
  type="checkbox"
  label="Remove from existing category"
  checked={removeExisting}
  onChange={(e) => setRemoveExisting(e.target.checked)}
/>
</div>
<div   className="text-end">
    <Button variant="secondary" className="me-2" onClick={onHide}>
      Cancel
    </Button>

    <Button
      variant="danger"
     
      onClick={handleMove}
      disabled={loading || selectedItems.length === 0 || !targetCategoryId}
    >
      {loading 
        ? "Processing..." 
        : "Move to Category"}
    </Button>
  </div>
</Modal.Footer>

    </Modal>
  );
}