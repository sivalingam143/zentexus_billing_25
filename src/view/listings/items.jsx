// src/pages/Items.jsx
import React, { useState } from "react";
import { Nav, Row, Col } from "react-bootstrap";
import { FaSearch, FaFileExcel } from "react-icons/fa";

import ProductTab from "../listings/ProductTab";
import ServiceTab from "../listings/ServiceTab";
import CategoryTab from "../listings/CategoryTab";
import UnitsTab from "../listings/UnitTab";

function Items() {
  const [activeTab, setActiveTab] = useState("PRODUCT");

  return (
    <div id="main" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Top Tabs - EXACT SAME */}
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

      {/* Same Layout */}
      <Row className="m-0" style={{ height: "calc(100vh - 50px)", backgroundColor: "#e9ecef" }}>
        {/* Dynamic Tab Content */}
        {activeTab === "PRODUCT" && <ProductTab />}
        {activeTab === "SERVICE" && <ServiceTab />}
        {activeTab === "CATEGORY" && <CategoryTab />}
        {activeTab === "UNITS" && <UnitsTab />}
      </Row>
    </div>
  );
}

export default Items;