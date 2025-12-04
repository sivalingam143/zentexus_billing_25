// src/listings/CategoryTab.jsx   (or src/pages/tabs/CategoryTab.jsx)
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Table,
  Col,
  Card,
  Spinner,
  DropdownButton,
  Dropdown,
  Row,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import MoveCategoryModal from "../creation/MoveCategoryModal";
import { FaSearch, FaEllipsisV } from "react-icons/fa";
import AddCate from "../creation/CategoryModalCreation";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../slice/CategorySlice";
import { fetchProducts } from "../../slice/ProductSlice";

export default function CategoryTab() {
  const dispatch = useDispatch();

  const { categories = [], status: catStatus } = useSelector((state) => state.category);
  const { products = [], status: prodStatus } = useSelector((state) => state.product);

  const [selectedCategory, setSelectedCategory] = useState(null); // null = uncategorized
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
const [showMoveModal, setShowMoveModal] = useState(false);
  useEffect(() => {
    if (catStatus === "idle") dispatch(fetchCategories());
    if (prodStatus === "idle") dispatch(fetchProducts());
  }, [catStatus, prodStatus, dispatch]);

  // Items for selected category
  const getItemsForCategory = () => {
    if (!selectedCategory) {
      return products.filter((p) => !p.category_id || p.category_id === "");
    }
    return products.filter(
      (p) => String(p.category_id) === String(selectedCategory.category_id)
    );
  };

  const itemsToShow = getItemsForCategory().filter((item) =>
    item.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loading = catStatus === "loading" || prodStatus === "loading";

  return (
    <>
      {/* LEFT PANEL - CATEGORIES */}
      <Col md={3} className="d-flex flex-column p-3">
        <Card className="h-100">
          <Card.Body className="d-flex flex-column p-0">
            <div className="p-3 d-flex justify-content-between align-items-center">
              <FaSearch />
              <Button
                variant="warning"
                className="text-white fw-bold px-3"
                onClick={() => {
                  setCategoryToEdit(null);
                  setShowCategoryModal(true);
                }}
              >
                + Add Category
              </Button>
            </div>

            <Table responsive bordered hover size="sm" className="mb-0 text-start">
              <thead>
                <tr>
                  <th>CATEGORY</th>
                  <th>ITEM</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {/* Uncategorized Row */}
                <tr
                  className={selectedCategory === null ? "table-light" : ""}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedCategory(null)}
                >
                  <td>Items not in any Category</td>
                  <td>
                    {products.filter((p) => !p.category_id).length}
                  </td>
                  <td></td>
                </tr>

                {/* Categories */}
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center">
                      <Spinner animation="border" size="sm" /> Loading...
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => {
                    const count = products.filter(
                      (p) => String(p.category_id) === String(cat.category_id)
                    ).length;
                    return (
                      <tr
                        key={cat.category_id}
                        className={
                          selectedCategory?.category_id === cat.category_id
                            ? "table-light"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        <td>{cat.category_name}</td>
                        <td>{count}</td>
                        <td className="text-center">
                          <DropdownButton
                            title={<FaEllipsisV />}
                            variant="light"
                            size="sm"
                            className="p-0 border-0 bg-transparent"
                          >
                            <Dropdown.Item
                              onClick={(e) => {
                                e.stopPropagation();
                                setCategoryToEdit(cat);
                                setShowCategoryModal(true);
                              }}
                            >
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="text-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm("Delete this category?")) {
                                  // delete logic if you have
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
          </Card.Body>
        </Card>
      </Col>

      {/* RIGHT PANEL - ITEMS */}
      <Col md={9} className="p-3 d-flex flex-column">
        {/* Header Card */}
        <Card className="mb-3">
          <Card.Body>
            <Row className="align-items-center">
              <Col>
                <h6 className="fw-bold mb-1">
                  {selectedCategory
                    ? selectedCategory.category_name.toUpperCase()
                    : "ITEMS NOT IN ANY CATEGORY"}
                </h6>
                <div className="small text-muted">
                  {itemsToShow.length} items
                </div>
              </Col>
              <Col className="text-end">
        <Button
    variant="primary"
    className="fw-semibold"
    onClick={() => {
      if (!selectedCategory) {
        toast.error("You cannot perform this operation for 'Items not in any Category'", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }
      setShowMoveModal(true);
    }}
    disabled={!selectedCategory}
  >
    Move To This Category
  </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Search + Table Card */}
        <Card className="flex-grow-1 d-flex flex-column">
          <Card.Body className="d-flex flex-column h-100 p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">ITEMS</h5>
              <InputGroup style={{ width: "250px" }}>
                <InputGroup.Text className="bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </InputGroup.Text>
                <FormControl
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-start-0"
                />
              </InputGroup>
            </div>

            <div className="flex-grow-1 overflow-auto">
              <Table bordered hover className="table-sm">
                <thead className="table-light">
                  <tr>
                    <th>NAME</th>
                    <th>QUANTITY</th>
                    <th>STOCK VALUE</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsToShow.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center text-muted py-4">
                        No items found
                      </td>
                    </tr>
                  ) : (
                    itemsToShow.map((item) => {
                      const stock = item.stock ? JSON.parse(item.stock) : {};
                      const purchase = item.purchase_price
                        ? JSON.parse(item.purchase_price)
                        : {};
                      const qty = parseFloat(stock.opening_qty || 0);
                      const price = parseFloat(purchase.price || 0);
                      const value = (qty * price).toFixed(2);

                      return (
                        <tr key={item.id}>
                          <td className="fw-semibold">{item.product_name}</td>
                          <td>{qty}</td>
                          <td className="text-success">₹ {value}</td>
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

      {/* Add/Edit Category Modal */}
      <AddCate
        show={showCategoryModal}
        onHide={() => {
          setShowCategoryModal(false);
          setCategoryToEdit(null);
        }}
        onSaveSuccess={() => {
          dispatch(fetchCategories());
          dispatch(fetchProducts());
        }}
        categoryToEdit={categoryToEdit}
      />
<MoveCategoryModal
  show={showMoveModal}
  onHide={() => setShowMoveModal(false)}
  allProducts={products}
  targetCategoryId={selectedCategory?.category_id}
  
  onMoveSuccess={(movedProductIds) => {
    // This is the magic — instantly update products in Redux without new action
    dispatch(fetchProducts.fulfilled(
      products.map(p => 
        movedProductIds.includes(p.id) 
          ? { ...p, category_id: selectedCategory?.category_id }
          : p
      )
    ));


  }}
/>
    </>
    
  );
}