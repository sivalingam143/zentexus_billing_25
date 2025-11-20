// src/creation/CategoryModalCreation.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { createCategory, updateCategory } from "../../slice/CategorySlice";

function AddCate({ show, onHide, onSaveSuccess, categoryToEdit }) {
  const dispatch = useDispatch();
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryToEdit) {
      setCategoryName(categoryToEdit.category_name || "");
    } else {
      setCategoryName("");
    }
  }, [categoryToEdit, show]);

  const handleSave = async () => {
    if (!categoryName.trim()) return alert("Category name is required");

    setLoading(true);
    const data = { category_name: categoryName.trim() };

    if (categoryToEdit) {
      data.category_id = categoryToEdit.category_id;
      await dispatch(updateCategory(data));
    } else {
      await dispatch(createCategory(data));
    }

    setLoading(false);
    onSaveSuccess();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" dialogClassName="category">
      <Modal.Header className="border-0 d-flex justify-content-between align-items-center p-3">
        <Modal.Title className="fw-bold m-0">
          {categoryToEdit ? "Edit Category" : "Add Category"}
        </Modal.Title>
        <Button variant="light" className="text-dark fs-3 p-0 m-3" onClick={onHide}>
          ×
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label className="text-muted">Enter Category Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. Electronics"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            disabled={loading}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-center p-4">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={loading || !categoryName.trim()}
          style={{ borderRadius: "20px", width: "80%", padding: "10px" }}
        >
          {loading ? <Spinner size="sm" /> : categoryToEdit ? "Update" : "Create"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddCate;