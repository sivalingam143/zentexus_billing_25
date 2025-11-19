import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Table,
  Row,
  Col,
  Nav,
  Card,
  Spinner,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { FaSearch, FaFilter, FaFileExcel, FaEllipsisV } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";

import AdjustItem from "../creation/AdjustItemCreation";
import AddItem from "../creation/ItemModalCreation";
import AddCate from "../creation/CategoryModalCreation";
import AddUnit from "../creation/UnitModalCreation";
import AddConvo from "./UnitConversion";

import { fetchUnits, fetchCategories } from "../../services/ItemService";

function Items() {
  const [activeTab, setActiveTab] = useState("PRODUCT");
  const [showAdjustItem, setShowAdjustItem] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showConvoModal, setShowConvoModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  // Units state
  const [units, setUnits] = useState([]);
  const [unitsLoading, setUnitsLoading] = useState(true);

  // Categories state
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const [uncategorizedItems, setUncategorizedItems] = useState([]); // You can populate this later
  const [activeCategory, setActiveCategory] = useState(null);

  // Handle Edit Unit
  const handleEditUnit = (unit) => {
    setSelectedUnit(unit);
    setShowUnitModal(true);
  };

  // Handle Delete Unit
  const handleDeleteUnit = (unit) => {
    if (window.confirm(`Are you sure you want to delete unit: ${unit.unit_name}?`)) {
      // Add your delete API call here
      console.log(`Deleting unit with ID: ${unit.id}`);
      // After deletion, refetch units
      // deleteUnit(unit.id).then(() => fetchAllUnits());
    }
  };

  // Fetch all categories
  const fetchAllCategories = async () => {
    setLoadingCategories(true);
    setErrorCategories(null);
    try {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
      // Optional: fetch uncategorized items here if you have the endpoint
    } catch (error) {
      setErrorCategories(error.message);
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch all units
  const fetchAllUnits = useCallback(async () => {
    setUnitsLoading(true);
    try {
      const fetchedUnits = await fetchUnits();
      setUnits(fetchedUnits);
    } catch (error) {
      console.error("Failed to load units:", error);
    } finally {
      setUnitsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchAllUnits();
    fetchAllCategories();
  }, [fetchAllUnits]);

  // Category rows for table
  const categoryRows = Array.isArray(categories)
    ? categories.map((cat, index) => (
        <tr key={cat.id || index}>
          <td>{cat.category_name}</td>
          <td>{cat.item_count || 0}</td>
        </tr>
      ))
    : [];

  // Unit rows with action dropdown
  const unitRows = Array.isArray(units)
    ? units.map((unit, index) => (
        <tr key={unit.id || index}>
          <td>{unit.unit_name}</td>
          <td>{unit.short_name || "-"}</td>
          <td className="text-center">
            <DropdownButton
              id={`dropdown-unit-${unit.id || index}`}
              title={<FaEllipsisV />}
              variant="light"
             size="sm"
              align="end"
              className="p-0 border-0 bg-transparent"
            >
              <Dropdown.Item onClick={() => handleEditUnit(unit)}>
                View or Edit
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleDeleteUnit(unit)}
                className="text-danger"
              >
                Delete
              </Dropdown.Item>
            </DropdownButton>
          </td>
        </tr>
      ))
    : [];

  // Placeholder rows
  const defaultProductRow = (
    <tr>
      <td>sampleee</td>
      <td>0</td>
    </tr>
  );

  const defaultServiceRow = (
    <tr>
      <td>serviceee</td>
    </tr>
  );

  const renderTableBody = () => {
    switch (activeTab) {
      case "PRODUCT":
        return defaultProductRow;
      case "SERVICE":
        return defaultServiceRow;
      case "CATEGORY":
        if (loadingCategories) {
          return (
            <tr>
              <td colSpan={2} className="text-center">
                <Spinner animation="border" size="sm" /> Loading categories...
              </td>
            </tr>
          );
        }

        const uncategorizedRow = (
          <tr key="uncategorized" className="fw-bold">
            <td>Items not in category</td>
            <td>{uncategorizedItems.length || 2}</td>
          </tr>
        );

        return (
          <>
            {uncategorizedRow}
            {categoryRows.length > 0 ? (
              categoryRows
            ) : (
              <tr>
                <td colSpan={2} className="text-center text-muted">
                  No Categories Found
                </td>
              </tr>
            )}
          </>
        );

      case "UNITS":
        return unitsLoading ? (
          <tr>
            <td colSpan={3} className="text-center">
              <Spinner animation="border" size="sm" /> Loading units...
            </td>
          </tr>
        ) : unitRows.length > 0 ? (
          unitRows
        ) : (
          <tr>
            <td colSpan={3} className="text-center text-muted">
              No Units Found
            </td>
          </tr>
        );

      default:
        return null;
    }
  };

  return (
    <div id="main" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Top Tabs */}
      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
        className="d-flex justify-content-between px-2"
        style={{ height: "50px", alignItems: "center", marginTop: "50px" }}
      >
        {["PRODUCT", "SERVICE", "CATEGORY", "UNITS"].map((tab) => (
          <Nav.Item key={tab}>
            <Nav.Link eventKey={tab} className="text-center flex-grow-1">
              {tab}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <Row className="m-0" style={{ height: "calc(100vh - 50px)", backgroundColor: "#e9ecef" }}>
        {/* Left Panel - List */}
        <Col md={3} className="d-flex flex-column p-3">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column p-0">
              <div className="p-3 d-flex justify-content-between align-items-center">
                <FaSearch />
                <Button
                  variant="warning"
                  className="text-white fw-bold px-3"
                  onClick={() => {
                    if (activeTab === "CATEGORY") setShowCategoryModal(true);
                    else if (activeTab === "UNITS") setShowUnitModal(true);
                    else setShowAddItem(true);
                  }}
                >
                  {activeTab === "PRODUCT"
                    ? "+ Add Item"
                    : activeTab === "SERVICE"
                    ? "+ Add Service"
                    : activeTab === "CATEGORY"
                    ? "+ Add Category"
                    : activeTab === "UNITS"
                    ? "+ Add Unit"
                    : `+ Add ${activeTab}`}
                </Button>
              </div>

              <Table responsive bordered hover size="sm" className="mb-0 text-start">
                <thead>
                  <tr>
                    {activeTab === "PRODUCT" && (
                      <>
                        <th>ITEM</th>
                        <th>QUANTITY</th>
                      </>
                    )}
                    {activeTab === "SERVICE" && <th>ITEM</th>}
                    {activeTab === "CATEGORY" && (
                      <>
                        <th>CATEGORY</th>
                        <th>ITEM</th>
                      </>
                    )}
                    {activeTab === "UNITS" && (
                      <>
                        <th>FULL NAME</th>
                        <th>SHORT NAME</th>
                        <th>ACTION</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>{renderTableBody()}</tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Panel - Details & Transactions */}
        <Col md={9} className="p-3 d-flex flex-column" style={{ height: "100%" }}>
          {/* Detail Cards */}
          {activeTab === "PRODUCT" && (
            <Card className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3 mt-0">
                  <div>
                    <h6 className="fw-bold mb-1">SAMPLEEE</h6>
                    <div className="small mb-1">
                      SALE PRICE: <span className="text-success">₹ 0.00</span> (excl)
                    </div>
                    <div className="small mb-1">
                      PURCHASE PRICE: <span className="text-success">₹ 0.00</span> (excl)
                    </div>
                  </div>
                  <div className="text-end">
                    <Button
                      variant="primary"
                      className="mb-2 fw-semibold text-white p-3"
                      style={{ borderRadius: "6px" }}
                      onClick={() => setShowAdjustItem(true)}
                    >
                      ADJUST ITEM
                    </Button>
                    <div className="small fw-normal">
                      <span className="text-danger">Warning</span> STOCK QUANTITY:{" "}
                      <span className="text-danger">0</span>
                    </div>
                    <div className="small fw-normal">
                      STOCK VALUE: <span className="text-success">₹ 0.00</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {activeTab === "SERVICE" && (
            <Card className="mb-3">
              <Card.Body>
                <h6 className="fw-bold mb-1">SAMPLE SERVICE</h6>
                <div className="small">Sale Price: <span className="text-success">₹ 0.00</span></div>
              </Card.Body>
            </Card>
          )}

          {activeTab === "CATEGORY" && (
            <Card className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3 mt-0">
                  <div>
                    <h6 className="fw-bold mb-1">ITEMS NOT IN ANY CATEGORY</h6>
                    <div className="small mb-1">2</div>
                  </div>
                  <div className="text-end">
                    <Button variant="primary" className="mb-2 fw-semibold text-white p-3">
                      ADJUST ITEM
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {activeTab === "UNITS" && (
            <Card className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3 mt-0">
                  <div>
                    <h6 className="fw-bold">
                      {units.length > 0 ? units[0].unit_name.toUpperCase() : "UNITS"}
                    </h6>
                  </div>
                  <div className="text-end">
                    <Button
                      variant="primary"
                      className="mb-2 fw-semibold text-white p-3"
                      onClick={() => setShowConvoModal(true)}
                    >
                      ADD CONVERSION
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Transactions Table */}
          <Card className="flex-grow-1 d-flex flex-column">
            <Card.Body className="d-flex flex-column h-100 p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">TRANSACTIONS</h5>
                <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                  <div style={{ position: "relative", width: "200px" }}>
                    <FaSearch
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "gray",
                      }}
                    />
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      style={{ paddingLeft: "30px" }}
                      placeholder="Search..."
                    />
                  </div>
                  <Button variant="light">
                    <FaFileExcel size={20} color="#217346" />
                  </Button>
                </div>
              </div>

              {/* Conditional Transaction Tables */}
              {(activeTab === "PRODUCT" || activeTab === "SERVICE") && (
                <Table responsive bordered hover size="sm" className="pro-table text-center mt-3">
                  <thead>
                    <tr>
                      <th>TYPE <FaFilter /></th>
                      <th>INVOICE <FaFilter /></th>
                      <th>NAME <FaFilter /></th>
                      <th>DATE <FaFilter /></th>
                      <th>QUANTITY <FaFilter /></th>
                      <th>PRICE <FaFilter /></th>
                      <th>STATUS <FaFilter /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* No data yet */}
                  </tbody>
                </Table>
              )}

              {activeTab === "CATEGORY" && (
                <Table responsive bordered hover size="sm" className="pro-table text-center mt-3 text-muted">
                  <thead>
                    <tr>
                      <th>NAME <FaFilter /></th>
                      <th>QUANTITY <FaFilter /></th>
                      <th>STOCK VALUE <FaFilter /></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Sampleee</td>
                      <td className="text-danger">0</td>
                      <td className="text-success">₹ 0.00</td>
                    </tr>
                    <tr>
                      <td>Service</td>
                      <td className="text-danger">0</td>
                      <td className="text-success">₹ 0.00</td>
                    </tr>
                  </tbody>
                </Table>
              )}

              {activeTab === "UNITS" && (
                <Table responsive bordered hover size="sm" className="pro-table mt-3">
                  <thead>
                    <tr>
                      <th>CONVERSION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Conversions will go here */}
                  </tbody>
                </Table>
              )}

              <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                <span className="text-muted">No Rows to Show</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      <AdjustItem show={showAdjustItem} onHide={() => setShowAdjustItem(false)} itemName="SAMPLEEE" />

      <AddItem
        show={showAddItem}
        onHide={() => setShowAddItem(false)}
        activeTab={activeTab}
        units={units}
        categories={categories}
      />

      <AddCate
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        onSaveSuccess={fetchAllCategories}
      />

      <AddUnit
        show={showUnitModal}
        onHide={() => {
          setShowUnitModal(false);
          setSelectedUnit(null);
        }}
        onSaveSuccess={fetchAllUnits}
        unitToEdit={selectedUnit}
      />

      <AddConvo show={showConvoModal} onHide={() => setShowConvoModal(false)} />
    </div>
  );
}

export default Items;