
import React, { useState, useEffect, useCallback } from "react";
import { Button, Table, Row, Col, Nav, Card, Spinner, DropdownButton } from "react-bootstrap";
import { FaSearch, FaFilter } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./items.css";
import { FaFileExcel ,FaEllipsisV} from "react-icons/fa";
import AdjustItem from "./AdjustItem";
import AddItem from "./AddItem";
import AddCate from "./CategoryModal";
import AddUnit from "../items/unit/UnitModal";
import AddConvo from "./unit/UnitConversion";

// Assume ItemService has fetchUnits and fetchCategories function
import { fetchUnits, fetchCategories } from '../../../services/ItemService'; 

function Items() {
  const [activeTab, setActiveTab] = useState("PRODUCT");
  const [showAdjustItem, setShowAdjustItem] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showConvoModal, setShowConvoModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  
  // Existing state for units and loading
  const [units, setUnits] = useState([]);
  const [unitsLoading, setUnitsLoading] = useState(true);
  
  // Category States
  const [categories, setCategories] = useState([]); 
  const [loadingCategories, setLoadingCategories] = useState(true); // Changed default to true
  const [errorCategories, setErrorCategories] = useState(null);
  const [uncategorizedItems, setUncategorizedItems] = useState([]); // Added state for uncategorized items
  const [activeCategory, setActiveCategory] = useState(null); // Added state for active selection


  const handleEditUnit = (unit) => {
    // Set the unit data and open the modal
    setSelectedUnit(unit);
    setShowUnitModal(true);
  };

  const handleDeleteUnit = (unit) => {
    if (window.confirm(`Are you sure you want to delete unit: ${unit.unit_name}?`)) {
      // ⚠️ Add your delete service call here (e.g., deleteUnit(unit.id).then(fetchAllUnits))
      console.log(`Deleting unit with ID: ${unit.id}`);
      // For demonstration, simply refetch:
      // fetchAllUnits(); 
    }
  };
  // Function to fetch categories
  const fetchAllCategories = async () => {
    setLoadingCategories(true);
    setErrorCategories(null);
    try {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
      
      // ⚠️ ASSUMPTION: You would call fetchUncategorizedItems here 
      // const fetchedUncategorized = await fetchUncategorizedItems();
      // setUncategorizedItems(fetchedUncategorized);

    } catch (error) {
      setErrorCategories(error.message);
      console.error("Error fetching categories in component:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Function to fetch units from the backend
  const fetchAllUnits = useCallback(async () => {
    setUnitsLoading(true);
    try {
      const fetchedUnits = await fetchUnits();
      setUnits(fetchedUnits);
    } catch (error) {
      console.error("Failed to load units:", error);
      // Optionally show a toast/alert for the error
    } finally {
      setUnitsLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchAllUnits();
    fetchAllCategories();
  }, []);

  // Data to display in the CATEGORY tab (NEW: maps the saved categories)
  const categoryRows = Array.isArray(categories) ? categories.map((cat, index) => (
    <tr key={cat.id || index}>
      <td>{cat.category_name}</td>
      <td>{cat.item_count || 0}</td> 
    </tr>
)) : [];

  // Data to display in the UNITS tab
//    const unitRows = Array.isArray(units) ? units.map((unit, index) => (
//     <tr key={unit.id || index}>
//       <td>{unit.unit_name}</td>
//       <td>{unit.short_name || 0}</td> 
//     </tr>
// )) : [];


const unitRows = Array.isArray(units) ? units.map((unit, index) => (
    <tr key={unit.id || index}>
      <td>{unit.unit_name}</td>
      <td>{unit.short_name || 0}</td> 
      {/* <--- START ACTION COLUMN ---> */}
      <td className="text-center">
        <DropdownButton
          id={`dropdown-unit-${unit.id || index}`}
          title={<FaEllipsisV />} // The three-dot icon (which looks like :)
          variant="light"
          size="sm"
          align="end" // Align the dropdown menu to the right
          className="p-0"
        >
          {/* Option 1: View/Edit */}
          <Dropdown.Item onClick={() => handleEditUnit(unit)}>
            View / Edit
          </Dropdown.Item>
          {/* Option 2: Delete */}
          <Dropdown.Item onClick={() => handleDeleteUnit(unit)} className="text-danger">
            Delete
          </Dropdown.Item>
        </DropdownButton>
      </td>
      {/* <--- END ACTION COLUMN ---> */}
    </tr>
)) : [];
 
  // Placeholder rows for other tabs (keep original logic)
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
        // Category list rendering logic (REPLACEMENT START)
        if (loadingCategories) {
          return (
            <tr>
              <td colSpan={2} className="text-center">
                {/* <Spinner animation="border" size="sm" /> Loading categories... */}
              </td>
            </tr>
          );
        }

        // 1. Uncategorized Row (Maintaining the user's placeholder format)
        const uncategorizedRow = (
            // The item count should be uncategorizedItems.length, default to 2
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
                        <td colSpan={2} className="text-center text-muted">No Categories Found</td>
                    </tr>
                )}
            </>
        );
      // Category list rendering logic (REPLACEMENT END)
      case "UNITS":
        // Display loading or the fetched units
        return unitsLoading ? (
          <tr>
            <td colSpan={2} className="text-center">
              <Spinner animation="border" size="sm" /> Loading units...
            </td>
          </tr>
        ) : unitRows.length > 0 ? (
          unitRows
        ) : (
          <tr>
            <td colSpan={2} className="text-center text-muted">No Units Found</td>
          </tr>
        );
      default:
        return null;
    }
  };


  return (
    <div id="main" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Top Tabs (unchanged) */}
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

      <Row
        className="m-0"
        style={{ height: "calc(100vh - 50px)", backgroundColor: "#e9ecef" }}
      >
        {/* Left Panel */}
        <Col md={3} className="d-flex flex-column p-3">
          <Card className="vh-100">
            <Card.Body className="d-flex flex-column p-0">
              <div className="p-3 d-flex justify-content-between align-items-center">
                <FaSearch />
                {/* Add Unit Button Logic (unchanged) */}
                <Button
                  variant="warning"
                  className="text-white fw-bold px-3"
                  onClick={() => {
                    if (activeTab === "CATEGORY") setShowCategoryModal(true);
                    else if (activeTab === "UNITS")
                      setShowUnitModal(true); 
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

              {/* Table of Items/Units */}
              <Table
                responsive
                bordered
                hover
                size="sm"
                className="mb-0 text-start"
              >
                <thead>
                  <tr>
                    {activeTab === "PRODUCT" ? (
                      <>
                        <th>ITEM</th>
                        <th>QUANTITY</th>
                      </>
                    ) : activeTab === "SERVICE" ? (
                      <th>ITEM</th>
                    ) : activeTab === "CATEGORY" ? (
                      <>
                        <th>CATEGORY</th>
                        <th>ITEM</th>
                      </>
                    ) : (
                      <>
                       <th>FULL NAME</th>
                        <th>SHORT NAME</th>
                        <th>ACTION</th>
                      </>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {/* Render dynamic content based on activeTab */}
                  {renderTableBody()} 
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Panel (unchanged) */}
        <Col
          md={9}
          className="p-3 d-flex flex-column"
          style={{ height: "100%" }}
        >
          {/* Details Card (unchanged) */}
          {activeTab === "PRODUCT" && (
            <Card className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3  mt-0">
                  <div>
                    <h6 className="fw-bold mb-1">SAMPLEEE</h6>
                    <div className="small mb-1">
                      SALE PRICE: <span className="text-success"> ₹ 0.00 </span>
                      (excl)
                    </div>
                    <div className="small mb-1">
                      PURCHASE PRICE:{" "}
                      <span className="text-success"> ₹ 0.00 </span>(excl)
                    </div>
                  </div>
                  <div className="text-end">
                    <Button
                      variant="primary bg-primary p-3"
                      className="mb-2 fw-semibold text-white"
                      style={{ borderRadius: "6px" }}
                      onClick={() => setShowAdjustItem(true)} 
                    >
                      ADJUST ITEM
                    </Button>

                    <div className="small fw-normal">
                      <span className="text-danger"> ⚠ </span> STOCK QUANTITY:{" "}
                      <span className="text-danger">0</span>
                    </div>
                    <div className="small fw-normal">
                      STOCK VALUE:{" "}
                      <span className="text-success"> ₹ 0.00 </span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {activeTab === "SERVICE" && (
            <Card className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3  mt-0">
                  <div>
                    <h6 className="fw-bold mb-1">SAMPLE SERVICE</h6>
                    <div className="small mb-1">
                      Sale Price: <span className="text-success"> ₹ 0.00 </span>
                    </div>
                  </div>
                </div>
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
                    <Button
                      variant="primary bg-primary p-3"
                      className="mb-2 fw-semibold text-white"
                      style={{ borderRadius: "6px" }}
                    >
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
                    {/* Display the selected unit name or default title */}
                    <h6>
                    {units.length > 0 && units[0].unit_name 
                        ? units[0].unit_name.toUpperCase() 
                        : "UNITS"}</h6>
                  </div>
                  <div className="text-end">
                    <Button
                      variant="primary bg-primary p-3"
                      className="mb-2 fw-semibold text-white"
                      style={{ borderRadius: "6px" }}
                      onClick={() => setShowConvoModal(true)}
                    >
                      ADD CONVERSATION
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Transactions Card (unchanged) */}
          <Card className="flex-grow-1 d-flex flex-column ">
            <Card.Body className="d-flex flex-column h-100 p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">TRANSACTIONS</h5>
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "8px" }}
                >
                  {/* Search Input with icon inside */}
                  <div style={{ position: "relative", width: "200px" }}>
                    <FaSearch
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "gray",
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      type="text"
                      className="form-control form-control-sm bg-white"
                      style={{
                        paddingLeft: "30px",
                        borderColor: "transparent",
                      }}
                    />
                  </div>

                  <Button variant="light">
                    <FaFileExcel size={20} color="#217346" />
                  </Button>
                </div>
              </div>

              {/* Tables for each tab (unchanged) */}
              {activeTab === "PRODUCT" && (
                <Table
                  responsive
                  bordered
                  hover
                  size="sm"
                  className="pro-table text-center mt-auto"
                >
                  <thead>
                    <tr>
                      <th>
                        TYPE
                        <FaFilter className="fa-filter" />
                      </th>
                      <th>
                        INVOICE <FaFilter className="fa-filter" />
                      </th>
                      <th>
                        NAME
                        <FaFilter className="fa-filter" />
                      </th>
                      <th>
                        DATE
                        <FaFilter className="fa-filter" />
                      </th>
                      <th>
                        QUANTITY
                        <FaFilter className="fa-filter" />
                      </th>
                      <th>
                        PRICE
                        <FaFilter className="fa-filter" />
                      </th>
                      <th>
                        STATUS
                        <FaFilter className="fa-filter" />
                      </th>
                    </tr>
                  </thead>
                </Table>
              )}

              {activeTab === "SERVICE" && (
                <Table
                  responsive
                  bordered
                  hover
                  size="sm"
                  className="pro-table text-center mt-auto"
                >
                  <thead>
                    <tr>
                      <th>
                        TYPE <FaFilter className="fa-filter" />
                      </th>
                      <th>
                        INVOICE <FaFilter className="fa-filter" />
                      </th>
                      <th>
                        NAME <FaFilter className="fa-filter" />
                      </th>
                      <th>
                        DATE <FaFilter className="fa-filter" />
                      </th>
                      <th>
                        QUANTITY <FaFilter className="fa-filter" />
                      </th>
                      <th>
                        PRICE <FaFilter className="fa-filter" />
                      </th>
                      <th>
                        STATUS <FaFilter className="fa-filter" />
                      </th>
                    </tr>
                  </thead>
                </Table>
              )}

              {activeTab === "CATEGORY" && (
                <Table
                  responsive
                  bordered
                  hover
                  size="sm"
                  className="pro-table text-center mt-auto text-muted"
                >
                  <thead>
                    <tr>
                      <th>
                        NAME <FaFilter className="fa-filter" />
                      </th>
                      <th>
                        QUANTITY <FaFilter className="fa-filter" />
                      </th>
                      <th>
                        STOCK VALUE <FaFilter className="fa-filter" />
                      </th>
                    </tr>
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
                  </thead>
                </Table>
              )}

              {activeTab === "UNITS" && (
                <Table
                  responsive
                  bordered
                  hover
                  size="sm"
                  className="pro-table mt-auto"
                >
                  <thead>
                    <tr>
                      <th>CONVERSION </th>
                    </tr>
                  </thead>
                </Table>
              )}

              {/* Centered No Rows */}
              <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                <span className="text-muted">No Rows to Show</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <AdjustItem
        show={showAdjustItem}
        onHide={() => setShowAdjustItem(false)}
        itemName="SAMPLEEE"
      />
      
      {/* Pass units to AddItem */}
      <AddItem
        show={showAddItem}
        onHide={() => setShowAddItem(false)}
        activeTab={activeTab}
        units={units} 
        categories={categories}// <-- Pass the fetched categories here
      />

      <AddCate
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        onSaveSuccess={fetchAllCategories} // Refetches categories on successful save
      />

      {/* Pass fetchAllUnits as onSaveSuccess to AddUnit */}
      <AddUnit 
        show={showUnitModal} 
        onHide={() => setShowUnitModal(false)} 
        onSaveSuccess={fetchAllUnits} // Refetches units on successful save
      />

      <AddConvo show={showConvoModal} onHide={() => setShowConvoModal(false)} />
    </div>
  );
}

export default Items;