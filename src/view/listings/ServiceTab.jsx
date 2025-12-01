// src/pages/tabs/ServiceTab.jsx
import React, { useState, useEffect } from "react";
import { Button, Table, Col, Card, Row, DropdownButton, Dropdown } from "react-bootstrap";
import { FaSearch, FaFileExcel, FaEllipsisV } from "react-icons/fa";
import AddItem from "../creation/ItemModalCreation";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices, deleteService } from "../../slice/serviceSlice";

export default function ServiceTab() {
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [editService, setEditService] = useState(null);

  const dispatch = useDispatch();
  const { services = [], status } = useSelector((state) => state.service);

  // Fetch services on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchServices());
    }
  }, [status, dispatch]);

  // Auto-select first service when list updates
  useEffect(() => {
    if (services.length > 0 && !selectedService) {
      setSelectedService(services[0]);
    }
  }, [services, selectedService]);

  // Refresh services after closing modal
  const handleCloseAddItem = () => {
    setShowAddItem(false);
    setEditService(null);
    dispatch(fetchServices());
  };

  if (status === "loading") return <div className="text-center p-5">Loading services...</div>;
  if (status === "failed") return <div className="text-danger p-5">Failed to load services</div>;

  return (
    <Row className="h-100">
      {/* LEFT PANEL - SERVICES LIST */}
      <Col md={3} className="p-3">
        <Card className="h-100 shadow-sm">
          <Card.Body className="p-3 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <FaSearch className="text-muted" />
              <Button
                variant="warning"
                className="text-white fw-bold small"
                onClick={() => {
                  setEditService(null);
                  setShowAddItem(true);
                }}
              >
                + Add Service
              </Button>
            </div>

            <div className="flex-grow-1 overflow-auto">
              <Table bordered hover size="sm" className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>SERVICE</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center text-muted py-4">
                        No services yet
                      </td>
                    </tr>
                  ) : (
                    services.map((service) =>
                      !service || !service.service_name ? null : (
                        <tr
                          key={service.service_id}
                          onClick={() => setSelectedService(service)}
                          className={`cursor-pointer ${
                            selectedService?.service_id === service.service_id
                              ? "table-primary"
                              : ""
                          }`}
                        >
                          <td className="fw-semibold">{service.service_name}</td>

                          <td className="text-center">
                            <DropdownButton
                              title={<FaEllipsisV />}
                              variant="link"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* VIEW / EDIT */}
                              <Dropdown.Item
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditService({
                                    ...service,
                                    product_name: service.service_name,
                                    product_id: service.service_id,
                                    product_code: service.service_code,
                                  });
                                  setShowAddItem(true);
                                }}
                              >
                                View/Edit
                              </Dropdown.Item>

                              {/* DELETE */}
                              <Dropdown.Item
                                className="text-danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm("Delete this service permanently?")) {
                                    dispatch(deleteService(service.service_id));
                                  }
                                }}
                              >
                                Delete
                              </Dropdown.Item>
                            </DropdownButton>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* RIGHT PANEL - SERVICE DETAILS */}
      <Col md={9} className="p-3">
        {selectedService ? (
          <>
            {/* DETAILS CARD */}
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <h5 className="fw-bold mb-1">{selectedService.service_name}</h5>

               <div className="small text-muted">
  SALE PRICE:
  <strong className="text-success ms-1">
    ₹ {selectedService.sale_price ? parseFloat(JSON.parse(selectedService.sale_price).price || 0).toFixed(2) : '0.00'}
  </strong>
</div>

              </Card.Body>
            </Card>

            {/* TRANSACTIONS TABLE */}
            <Card className="h-100 shadow-sm d-flex flex-column">
              <Card.Body className="d-flex flex-column h-100 p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 fw-bold">TRANSACTIONS</h5>

                  <div className="d-flex gap-2">
                    <div className="position-relative">
                      <FaSearch className="position-absolute top-50 start-2 translate-middle-y text-muted" />
                      <input
                        type="text"
                        className="form-control form-control-sm ps-5"
                        placeholder="Search..."
                        style={{ width: "200px" }}
                      />
                    </div>

                    <Button variant="light">
                      <FaFileExcel size={20} className="text-success" />
                    </Button>
                  </div>
                </div>

                {/* Empty message */}
                   <Table responsive bordered hover size="sm" className="pro-table text-center mt-3">
              <thead>
                <tr>
                  <th>TYPE</th><th>INVOICE</th><th>NAME</th><th>DATE</th><th>PRICE</th><th>STATUS</th>
                </tr>
              </thead>
              <tbody></tbody>
            </Table>
            <div className="flex-grow-1 d-flex justify-content-center align-items-center">
              <span className="text-muted">No Rows to Show</span>
            </div>
              </Card.Body>
            </Card>
          </>
        ) : (
          <Card className="h-100 d-flex align-items-center justify-content-center text-muted shadow-sm">
            <Card.Body className="text-center">
              <h5>No service selected</h5>
              <p>Select a service from the left panel or add a new one</p>
            </Card.Body>
          </Card>
        )}
      </Col>

      {/* MODAL */}
      <AddItem
        show={showAddItem}
        onHide={handleCloseAddItem}
        activeTab="SERVICE"
        editProduct={editService} // SAME PROP NAME AS PRODUCT
      />
    </Row>
  );
}
