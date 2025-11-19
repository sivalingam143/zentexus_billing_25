
import React, { useState } from "react";
import {
  Button,
  Row,
  Col,
  Modal,
  Form,
  
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "./items.css";

function AdjustItem({ show, onHide, itemName = "sampleee" }) {
  const [type, setType] = useState("add");
    const [stock, setStock] = useState("no");
  // const [qty, setQty] = useState("");
  // const [price, setPrice] = useState("");
  // const [details, setDetails] = useState("");
  const [date, setDate] = useState(new Date());

  const handleSave = () => {
    console.log({ type,   date });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" dialogClassName="custom-modal">
      <Modal.Body className="p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-semibold mb-0">Stock Adjustment</h5>

          <div className="d-flex align-items-center gap-3">
            <div  className="position-absolute start-50 translate-middle-x d-flex align-items-center"
            style={{ gap: "10px" }} role="group">
              {/* <ToggleButton
                variant={type === "add" ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setType("add")}
              >
                Add Stock */}
              {/* </ToggleButton>
              <div
            className="px-2"
            style={{
              display: "flex",
              alignItems: "center",
              color: "#0d6efd",
              fontSize: "1.2rem",
            }}
          >
           ⇄
          </div>
              <ToggleButton
                variant={type === "reduce" ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setType("reduce")}
              >
                Reduce Stock
              </ToggleButton> */}
<div
                  className="d-flex position-relative mt-2"
                  style={{
                    marginLeft:"0",
                    width: "290px",
                    borderRadius: "50px",
                    padding: "2px",
                    justifyContent: "space-between",
                    backgroundColor: "#e9f3ff",
                  }}
                >
                  <div
                    className="position-absolute bg-primary"
                    style={{
                      width: "130px",
                      height: "85%",
                      borderRadius: "50px",
                      transition: "transform 0.3s",
                      transform:
                        stock === "no"
                          ? "translateX(0%)"
                          : "translateX(calc(100% + 24px))",
                    }}
                  ></div>
               <Button 
                                  variant="transparent"
                                  className={`flex-grow-1 ${
                                    stock === "no" ? "text-white" : "text-primary"
                                  }`}
                                  onClick={() => setStock("no")}
                                  style={{
                                    zIndex: 1,
                                    borderRadius: "50px",
                                    width: "130px",
                                  }}
                                >
                                  reduce stock
                                </Button>
              
                                <div
                                  className="px-1"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    color: "#0d6efd",
                                    fontSize: "1.2rem",
                                    zIndex: 1,
                                  }}
                                >
                                  ⇄
                                </div>
              
                                <Button
                                  variant="transparent"
                                  className={`flex-grow-1 ${
                                    stock === "add" ? "text-white" : "text-primary"
                                  }`}
                                  onClick={() => setStock("add")}
                                  style={{
                                    zIndex: 1,
                                    borderRadius: "50px",
                                    width: "130px",
                                  }}
                                >
                                  add stock
                                </Button>
            </div>

            
          </div>
        </div>
        <Button variant="light" size="sm" onClick={onHide}>
              ×
            </Button>
</div>
        {/* Item & Date */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <label className="text-muted small d-block mb-1">Item Name</label>
            <span className="fw-normal">{itemName}</span>
          </div>
          <div>
            <label className="text-muted small d-block mb-1">Adjustment Date</label>
            <DatePicker
              selected={date}
              onChange={setDate}
              className="form-control form-control-sm"
              dateFormat="dd/MM/yyyy"
              style={{ width: "140px" }}
            />
          </div>
        </div>

        <hr />

        {/* Form Fields */}
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Control
                type="number"
                placeholder="Total Qty"
                // value={qty}
                // onChange={(e) => setQty(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Control
                type="number"
                placeholder="At Price"
                // value={price}
                // onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Details"
                // value={details}
                // onChange={(e) => setDetails(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Footer */}
        <div className="text-end">
          <Button variant="primary"  onClick={handleSave}>
            Save
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AdjustItem;
