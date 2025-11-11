import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Dropdown } from "react-bootstrap";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";



const DashBoard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [businessName, setBusinessName] = useState("");

  return (
    <div id="main" style={{backgroundColor:"#DEE2E6",minHeight: "100vh"}}>
      <Container className="mt-5">
        <Row>
          <Col xl={12}>
            {/* Business Name Row */}
            <div className="mb-2 d-flex align-items-center">
              <span
                style={{ color: "red", fontWeight: "bold", fontSize: "1.5rem" }}
              >
                •
              </span>

              {isEditing ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginLeft: "8px",
                  }}
                >
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter Business Name"
                    autoFocus
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      padding: "5px 10px",
                      fontSize: "1rem",
                      width: "250px",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setIsEditing(false);
                    }}
                  />
                  {/* Save Button */}
                  <Button
                    variant="info"
                    onClick={() => {
                      console.log("Saved business:", businessName);
                      setIsEditing(false); // hide input after save
                    }}
                    style={{ borderRadius: "6px", fontWeight: 600, color:"white" }}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <span
                  className="ms-2 text-muted"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsEditing(true)}
                >
                  {businessName || "Enter Business Name"}
                </span>
              )}

              {/* Buttons Section */}
              <div className="ms-auto d-flex align-items-center gap-2">
                <Button
                  variant="danger"
                  style={{
                    fontWeight: 600,
                    borderRadius: "20px",
                    minWidth: "110px",
                  }}
                >
                  +Add Sale
                </Button>
                <Button
                  variant="success"
                  style={{
                    fontWeight: 600,
                    borderRadius: "20px",
                    minWidth: "110px",
                  }}
                >
                  +Add Purchase
                </Button>
                <Button
                  variant="info"
                  style={{
                    fontWeight: 600,
                    borderRadius: "20px",
                    minWidth: "110px",
                    color: "white"
                  }}
                >
                  +Add More
                </Button>
                <Button
                  variant="light"
                  style={{
                    borderRadius: "50%",
                    padding: "0 10px",
                    minWidth: "20px",
                  }}
                >
                  :
                </Button>
              </div>
            </div>

            {/* Receivable and Payable Cards */}
            <Row className="mb-2 g-1">
              <Col md={6}>
                <Card className="border-none">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                      <Card.Title
                        className="mb-1"
                        style={{ fontWeight: "600", fontSize: "0.95rem" }}
                      >
                        Total Receivable
                      </Card.Title>
                      <h5 className="mb-1">₹ 0</h5>
                      <Card.Text
                        className="text-muted"
                        style={{ fontSize: "0.85rem" }}
                      >
                        You don’t have any receivables as of now.
                      </Card.Text>
                    </div>
                    <FaArrowDown
                      style={{
                        color: "#00c49f",
                        fontSize: "1.8rem",
                        backgroundColor: "#d9f9ef",
                        borderRadius: "50%",
                        padding: "0.3rem",
                      }}
                    />
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="border-none">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                      <Card.Title
                        className="mb-1"
                        style={{ fontWeight: "600", fontSize: "0.95rem" }}
                      >
                        Total Payable
                      </Card.Title>
                      <h5 className="mb-1">₹ 0</h5>
                      <Card.Text
                        className="text-muted"
                        style={{ fontSize: "0.85rem" }}
                      >
                        You don’t have any payables as of now.
                      </Card.Text>
                    </div>
                    <FaArrowUp
                      style={{
                        color: "#fb7e81",
                        fontSize: "1.8rem",
                        backgroundColor: "#fde8e9",
                        borderRadius: "50%",
                        padding: "0.3rem",
                      }}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Total Sale Section */}
            <Card className="mb-3">
              <Card.Body>
                <Row className="align-items-center mb-3">
                  <Col >
                    <Card.Title style={{ fontWeight: 600, marginBottom: 0 }}>
                      Total Sale
                    </Card.Title>
                    <h4 className="mt-1">₹ 1,000</h4>
                  </Col>
                  <Col md="auto">
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="light"
                        size="sm"
                        id="dropdown-basic"
                      >
                        This Month
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#this-month">
                          Last Month
                        </Dropdown.Item>
                        <Dropdown.Item href="#last-month">
                          This Week
                        </Dropdown.Item>
                        <Dropdown.Item href="#this-year">
                          This Month
                        </Dropdown.Item>
                        <Dropdown.Item href="#this-year">
                          This Quarter
                        </Dropdown.Item>
                        <Dropdown.Item href="#this-year">
                          Half Year
                        </Dropdown.Item>
                        <Dropdown.Item href="#this-year">
                          This Year
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
<Row>
  <Col lg = "12">
  </Col>
</Row>
                {/* Simple Line Graph */}
                <div style={{ height: "200px", position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: "30px",
                      left: "40%",
                      backgroundColor: "#00B579",
                      color: "white",
                      padding: "5px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      lineHeight: 1.2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    6 Nov
                    <br />₹ 1,000
                  </div>

                  <svg width="100%" height="200px" style={{ display: "block" }}>
                    <polyline
                      fill="none"
                      stroke="#7bc1ff"
                      strokeWidth="2"
                      points="50,190 120,30 190,190"
                    />
                    {[1, 4, 7, 10, 13, 16, 19, 22, 25, 28].map((day, idx) => {
                      const x = 40 + idx * 30;
                      return (
                        <g key={day}>
                          <line
                            x1={x}
                            y1="190"
                            x2={x}
                            y2="185"
                            stroke="#ccc"
                            strokeWidth="1"
                          />
                          <text
                            x={x}
                            y="205"
                            fontSize="8"
                            fill="#666"
                            textAnchor="middle"
                          >
                            {day} Nov
                          </text>
                        </g>
                      );
                    })}
                    {[0, 200, 400, 600, 800, 1000].map((val, idx) => {
                      const y = 190 - idx * 38;
                      return (
                        <g key={val}>
                          <line
                            x1="40"
                            y1={y}
                            x2="340"
                            y2={y}
                            stroke="#eee"
                            strokeWidth="1"
                          />
                          <text
                            x="25"
                            y={y + 4}
                            fontSize="8"
                            fill="#666"
                            textAnchor="end"
                          >
                            {val === 0 ? "" : val}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </Card.Body>
            </Card>

            {/* Most Used Reports */}
            <Card>
              <Card.Body>
                <Row className="mb-3 align-items-center">
                  <Col>
                    <h6 style={{ marginBottom: 0, fontWeight: 600 }}>
                      Most Used Reports
                    </h6>
                  </Col>
                  <Col md="auto">
                    <a href="#" style={{ fontSize: "0.9rem" }}>
                      View All
                    </a>
                  </Col>
                </Row>

                <Row className="g-3">
                  {[
                    "Sale Report",
                    "All Transactions",
                    "Daybook Report",
                    "Party Statement",
                  ].map((report, idx) => (
                    <Col key={idx} xs={12} sm={6} md={3}>
                      <Button
                        variant="outline-primary"
                        className="w-100 d-flex justify-content-between align-items-center"
                        style={{ borderRadius: "8px", fontWeight: 600 }}
                      >
                        {report} <span>{">"}</span>
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashBoard;
