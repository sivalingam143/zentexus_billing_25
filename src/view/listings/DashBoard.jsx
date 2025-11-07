import React, { useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import Stock from "../listings/stocks/Stock";
import Plate from "./stocks/Plates";
import { Buttons } from "../../components/Buttons";

import Knotting from "./stocks/Knotting";
import Packing from "./stocks/Packing";

const DashBoard = () => {
  const [activeComponent, setActiveComponent] = useState("Stock");

  const handleButtonClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div id="main">
      <Container>
        <Row>
          <Col xs="12">
            <ul className="d-flex mb-5 border-bottom">
              <li className="mx-3">
                <Buttons
                  btnlabel="Dashboard"
                  className={`tab-btn ${
                    activeComponent === "Stock" ? "bactive" : "cactive"
                  }`}
                  onClick={() => handleButtonClick("Stock")}
                />
              </li>
              {/* <li className="mx-3">
                  <Buttons
                    btnlabel="Plate"
                    className={`tab-btn  ${
                      activeComponent === "Plate" ? "bactive" : "cactive"
                    }`}
                    onClick={() => handleButtonClick("Plate")}
                  />
                </li>
                <li className="mx-3">
                  <Buttons
                    btnlabel="Dry Process"
                    className={`tab-btn  ${
                      activeComponent === "DryProcess" ? "bactive" : "cactive"
                    }`}
                    onClick={() => handleButtonClick("DryProcess")}
                  />
                </li>
                <li className="mx-3">
                  <Buttons
                    btnlabel="Knotting"
                    className={`tab-btn  ${
                      activeComponent === "Knotting" ? "bactive" : "cactive"
                    }`}
                    onClick={() => handleButtonClick("Knotting")}
                  />
                </li>
                <li className="mx-3">
                  <Buttons
                    btnlabel="Packing"
                    className={`tab-btn  ${
                      activeComponent === "Packing" ? "bactive" : "cactive"
                    }`}
                    onClick={() => handleButtonClick("Packing")}
                  />
                </li> */}
            </ul>
          </Col>
        </Row>
      </Container>
      {activeComponent === "Stock" && <Stock />}
      {/* {activeComponent === "Plate" && <Plate />}
      {activeComponent === "DryProcess" && <DryProcess />}
      {activeComponent === "Knotting" && <Knotting />}
      {activeComponent === "Packing" && <Packing />} */}
    </div>
  );
};

export default DashBoard;
