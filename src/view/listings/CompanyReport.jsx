import React, { useEffect, useState } from "react";
import {
  Container,
  Col,
  Row,
  Form,
  Table,
  Button,
  Modal,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyPayrollReport } from "../../slice/CompanyReportSlice";
import CompanyReportPDF from "./CompanyReportPDF";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer"; // Import PDFDownloadLink and PDFViewer
import { Buttons } from "../../components/Buttons";

const CompanyReport = () => {
  const dispatch = useDispatch();
  const { CompanyReport, status } = useSelector(
    (state) => state.CompanyReport || {}
  );
  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [showModal, setShowModal] = useState(false); // State for PDF preview modal

  useEffect(() => {
    if (fromDate && toDate) {
      dispatch(
        fetchCompanyPayrollReport({ from_date: fromDate, to_date: toDate })
      );
    }
  }, [dispatch, fromDate, toDate]);

  const clearFilters = () => {
    setFromDate(today);
    setToDate(today);
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  // Calculate Total Salary
  const totalSalary = CompanyReport?.reduce(
    (acc, item) => acc + (item.salary || 0),
    0
  );

  return (
    <div id="main">
      <Container>
        <Row className="mb-3">
          <Col>
            <h1 className="text-center">Company Report</h1>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col lg="3" className="py-1">
            <Form.Group controlId="fromDate">
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg="3">
            <Form.Group controlId="toDate">
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg="2" className="d-flex align-items-end py-2 ">
            <Buttons
              btnlabel="Clear Filters"
              className="submit-btn"
              onClick={clearFilters}
            />
          </Col>
          <Col lg="2" className="d-flex align-items-end py-2">
            <Buttons
              btnlabel="Preview PDF"
              className="submit-btn"
              onClick={handleShowModal}
            />
          </Col>
          <Col lg="2" className="d-flex align-items-end py-2">
            <PDFDownloadLink
              document={<CompanyReportPDF data={CompanyReport} />}
              fileName="CompanyReport.pdf"
            >
              {({ loading }) =>
                loading ? (
                  <Buttons
                    btnlabel="Generating PDF..."
                    className="submit-btn"
                    disabled
                  />
                ) : (
                  <Buttons btnlabel="Download PDF" className="submit-btn" />
                )
              }
            </PDFDownloadLink>
          </Col>
        </Row>

        {/* Table */}
        <Row>
          <Col>
            <Table bordered>
              <thead>
                <tr>
                  <th>S No</th>
                  <th>Staff Name</th>
                  <th>Total Days</th>
                  <th>Present Days</th>
                  <th>Absent Days</th>
                  <th>Salary</th>
                </tr>
              </thead>
              <tbody>
                {status === "loading" ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : CompanyReport && CompanyReport.length > 0 ? (
                  CompanyReport.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.staff_name}</td>
                      <td>{item.total_days}</td>
                      <td>{item.present_days}</td>
                      <td>{item.absent_days}</td>
                      <td>{item.salary}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
                {/* Total Row */}
                {CompanyReport && CompanyReport.length > 0 && (
                  <tr
                    style={{ fontWeight: "bold", backgroundColor: "#f2f2f2" }}
                  >
                    <td colSpan="5" className="text-end">
                      Total Salary:
                    </td>
                    <td>{totalSalary.toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* PDF Preview Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>PDF Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <PDFViewer width="100%" height="600px">
              <CompanyReportPDF data={CompanyReport} />
            </PDFViewer>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default CompanyReport;
