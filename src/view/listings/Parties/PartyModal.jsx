
import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Nav } from "react-bootstrap";
import StateSelect from "./States";

function PartyModal({ show, handleClose, isEdit }) {
  const [activeTab, setActiveTab] = useState("gst");



  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Edit Party" : "Add Party"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="mb-3">
          <Col>
            <Form.Control type="text" placeholder="Party Name *" />
          </Col>
          <Col>
            <Form.Control type="text" placeholder="GSTIN" />
          </Col>
          <Col>
            <Form.Control type="text" placeholder="Phone Number" />
          </Col>
        </Row>

        <Nav
          variant="tabs"
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key)}
          className="mb-3"
        >
          <Nav.Item>
            <Nav.Link eventKey="gst">GST & Address</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="credit">Credit & Balance</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="additional">Additional Fields</Nav.Link>
          </Nav.Item>
        </Nav>

        {activeTab === "gst" && (
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>GST Type</Form.Label>
                <Form.Select>
                  <option>Unregistered/Consumer</option>
                  <option>Registered-Business/Regular</option>
                  <option>Registered-Business/Composition</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" style={{ overflow: "visible" }}>
                <Form.Label>Select State</Form.Label>
                <Form.Select>
                  <StateSelect />
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email ID</Form.Label>
                <Form.Control type="email" placeholder="Email ID" />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Billing Address</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Billing Address" />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Label>Shipping Address</Form.Label>
              <div>
                <Button variant="link" className="p-0 text-primary">
                  + Add New Address
                </Button>
              </div>
            </Col>
          </Row>
        )}
      </Modal.Body>

      {/* Footer Buttons */}
      <Modal.Footer>
        {isEdit ? (
          <>
            <Button variant="danger" className="px-4 py-2" >
              Delete
            </Button>
            <Button variant="primary bg-primary" className="text-white px-4 py-2">
              Update
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline-primary" className="">
              Save & New
            </Button>
            <Button variant="primary bg-primary" className=" text-white px-4 py-2">
              Save
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default PartyModal;
