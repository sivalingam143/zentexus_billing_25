// AddConvo.jsx
import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
// import "../items.css";

function AddConvo({ show, onHide }) {
//   const [baseUnit, setBaseUnit] = useState("");
//   const [rate, setRate] = useState("");
//   const [secondaryUnit, setSecondaryUnit] = useState("");

//   const handleSave = () => {
//     if (!baseUnit || !rate || !secondaryUnit) return;
//     console.log({ baseUnit, rate, secondaryUnit });
//     setBaseUnit("");
//     setRate("");
//     setSecondaryUnit("");
//     onHide();
//   };

  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="convo">
      {/* Header */}
      <Modal.Header
        className="text-muted border-0 d-flex justify-content-between align-items-center p-3 mb-4"
        style={{ backgroundColor: "rgba(139, 174, 227, 1)" }}
      >
        <Modal.Title className=" fw-bold m-0">Add Conversation</Modal.Title>
        <Button
          variant="light"
          className=" fs-4 p-0 bg-transparent border-0"
          onClick={onHide}
        >
          ×
        </Button>
      </Modal.Header>

      {/* Body */}
      <Modal.Body>
        <Form>
          <Row className="align-items-center mb-4 ">
            <Col>
              <Form.Select
                // value={baseUnit}
                // onChange={(e) => setBaseUnit(e.target.value)}
              >
                <option value="">Base Unit</option>
                <option value="Bag">Bag</option>
                <option value="Bottle">Bottle</option>
              </Form.Select>
            </Col>

            <Col xs="auto" className="text-center fw-bold">
              =
            </Col>

            <Col>
              <Form.Control
                type="number"
                placeholder="Rate"
                // value={rate}
                // onChange={(e) => setRate(e.target.value)}
              />
            </Col>

            <Col>
              <Form.Select
                // value={secondaryUnit}
                // onChange={(e) => setSecondaryUnit(e.target.value)}
              >
                <option value="">Secondary Unit</option>
                <option value="Bag">Bag</option>
                <option value="Bottle">Bottle</option>
              </Form.Select>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      {/* Footer */}
      <Modal.Footer>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button className="add-unit-btn px-4 py-2">Save & New</Button>
          <Button className=" add-unit-btn px-4 py-2" >
            Save
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default AddConvo;
