import React, { useEffect, useState } from "react";
import { Container, Col, Row, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import PDFReport from "./ReportPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { fetchSalaryReport } from "../../slice/salarySilce";
import { Buttons } from "../../components/Buttons";

const Report = () => {
  const dispatch = useDispatch();
  const { SalaryReport, status } = useSelector(
    (state) => state.SalaryReportSlice
  );

  // State for filters
  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [selectedStaffType, setSelectedStaffType] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const handleFilter = () => {
    dispatch(fetchSalaryReport({ from_date: fromDate, to_date: toDate }));
  };
  // useEffect(() => {
  //   if (fromDate && toDate) {
  //     dispatch(fetchSalaryReport({ from_date: fromDate, to_date: toDate }));
  //   }
  // }, [dispatch, fromDate, toDate]);

  const clearFilters = () => {
    setFromDate(today);
    setToDate(today);
    setSelectedStaffType("");
    setSelectedProduct("");
  };

  // Extract unique staff types and products from nested data
  const uniqueStaffTypes = [...new Set(SalaryReport?.map((d) => d.staff_type))];
  const uniqueProducts = [
    ...new Set(
      SalaryReport?.flatMap((d) => d.products.map((p) => p.product_name))
    ),
  ];

  // Filter data based on selection
  const filteredData = SalaryReport?.map((entry) => ({
    ...entry,
    products: entry.products.filter(
      (p) =>
        (selectedStaffType ? entry.staff_type === selectedStaffType : true) &&
        (selectedProduct ? p.product_name === selectedProduct : true)
    ),
  })).filter((entry) => entry.products.length > 0);

  // Transform data for table (group by staff_name first)
  const transformData = (data) => {
    let transformed = {};
    let uniqueDates = new Set();
    let grandTotal = { total_count: 0, total_value: 0, date_counts: {} };
    let staffTotals = {}; // For staff_name subtotals

    data.forEach((entry) => {
      const formattedDate = new Date(entry.entry_date).toLocaleDateString(
        "en-GB"
      );
      uniqueDates.add(formattedDate);

      if (!staffTotals[entry.staff_name]) {
        staffTotals[entry.staff_name] = { total_count: 0, total_value: 0 };
      }

      entry.products.forEach((product) => {
        const staffKey = entry.staff_name;
        const typeKey = `${entry.staff_name}-${entry.staff_type}`;
        const productKey = `${entry.staff_name}-${entry.staff_type}-${product.product_name}`;

        // Initialize staff_name level
        if (!transformed[staffKey]) {
          transformed[staffKey] = {};
        }

        // Initialize staff_type level
        if (!transformed[staffKey][typeKey]) {
          transformed[staffKey][typeKey] = {
            staff_type: entry.staff_type,
            products: {},
          };
        }

        // Initialize product level
        if (!transformed[staffKey][typeKey].products[productKey]) {
          transformed[staffKey][typeKey].products[productKey] = {
            product_name: product.product_name,
            per_cooly_rate: product.per_cooly_rate,
            total: 0,
            total_count: 0,
            counts: {},
          };
        }

        // Update counts and totals
        transformed[staffKey][typeKey].products[productKey].counts[
          formattedDate
        ] =
          (transformed[staffKey][typeKey].products[productKey].counts[
            formattedDate
          ] || 0) + product.count;
        transformed[staffKey][typeKey].products[productKey].total +=
          product.total;
        transformed[staffKey][typeKey].products[productKey].total_count +=
          product.count;

        staffTotals[staffKey].total_count += product.count;
        staffTotals[staffKey].total_value += product.total;

        grandTotal.total_count += product.count;
        grandTotal.total_value += product.total;
        grandTotal.date_counts[formattedDate] =
          (grandTotal.date_counts[formattedDate] || 0) + product.count;
      });
    });

    return {
      transformedData: transformed,
      uniqueDates: Array.from(uniqueDates).sort(),
      grandTotal,
      staffTotals,
    };
  };

  const { transformedData, uniqueDates, grandTotal, staffTotals } =
    transformData(filteredData || []);

  // Calculate totals by staff_type for the summary table
  const staffTypeTotals = {};
  filteredData?.forEach((entry) => {
    if (!staffTypeTotals[entry.staff_type]) {
      staffTypeTotals[entry.staff_type] = { total_count: 0, total_value: 0 };
    }
    entry.products.forEach((product) => {
      staffTypeTotals[entry.staff_type].total_count += product.count;
      staffTypeTotals[entry.staff_type].total_value += product.total;
    });
  });
 
  return (
    <div id="main">
      <Container>
        <Row className="mb-3">
          <Col>
            <h3 className="text-center">SRI GURU LAKSHMI FIREWORKS</h3>
            <h6 className="text-center">Salary Report</h6>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-3">
          <Col lg="3">
            <Form.Group controlId="staffType">
              <Form.Label>Staff Type</Form.Label>
              <Form.Select
                value={selectedStaffType}
                onChange={(e) => setSelectedStaffType(e.target.value)}
              >
                <option value="">All</option>
                {uniqueStaffTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg="3">
            <Form.Group controlId="product">
              <Form.Label>Product Name</Form.Label>
              <Form.Select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">All</option>
                {uniqueProducts.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg="3">
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
        </Row>

        {/* Action Buttons */}
        <Row className="mb-3">
          <Col md={2} className="py-2">
            <Buttons
              btnlabel="Clear Filters"
              className="submit-btn"
              onClick={clearFilters}
            />
          </Col>
          <Col md={2} className="py-2">
            <Buttons
              btnlabel="Filter submit"
              className="submit-btn"
              onClick={handleFilter}
            />
          </Col>
          <Col md={2} className="py-2">
            <PDFDownloadLink
              document={<PDFReport data={filteredData} />}
              fileName="SalaryReport.pdf"
            >
              {({ loading }) => (
                <Buttons
                  btnlabel={loading ? "Generating PDF..." : "Download PDF"}
                  className="submit-btn"
                  disabled={loading}
                />
              )}
            </PDFDownloadLink>
          </Col>
        </Row>

        {/* Main Table */}
        <Row>
          <Col>
            <Table bordered responsive>
              <thead>
                <tr>
                  <th className="pdftable">Staff Name</th>
                  <th className="pdftable">Staff Type</th>
                  <th className="pdftable">Product Name</th>
                  {uniqueDates.map((date) => (
                    <th key={date}>{date}</th>
                  ))}
                  <th className="pdftable">Total Count</th>
                  <th className="pdftable">Per Cooly Rate</th>
                  <th className="pdftable">Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(transformedData).map(
                  ([staffName, staffData], staffIndex) => (
                    <>
                      {Object.entries(staffData).map(
                        ([typeKey, typeData], typeIndex) => (
                          <>
                            {Object.values(typeData.products).map(
                              (product, productIndex) => (
                                <tr
                                  key={`${staffIndex}-${typeIndex}-${productIndex}`}
                                >
                                  {typeIndex === 0 && productIndex === 0 && (
                                    <td
                                      rowSpan={Object.values(staffData).reduce(
                                        (acc, td) =>
                                          acc +
                                          Object.values(td.products).length,
                                        0
                                      )}
                                      style={{
                                        fontSize: 15,
                                        textAlign: "center",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {staffName}
                                    </td>
                                  )}
                                  {productIndex === 0 && (
                                    <td
                                      rowSpan={
                                        Object.values(typeData.products).length
                                      }
                                      style={{
                                        fontSize: 15,
                                        textAlign: "center",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {typeData.staff_type}
                                    </td>
                                  )}
                                  <td className="pdftable">
                                    {product.product_name}
                                  </td>
                                  {uniqueDates.map((date) => (
                                    <td
                                      key={date}
                                      style={{
                                        fontSize: 15,
                                        textAlign: "center",
                                      }}
                                    >
                                      {product.counts[date] || "-"}
                                    </td>
                                  ))}
                                  <td className="pdftable">
                                    {product.total_count}
                                  </td>
                                  <td className="pdftable">
                                    {product.per_cooly_rate}
                                  </td>
                                  <td className="pdftable">{parseFloat(product.total).toFixed(2)}</td>
                                </tr>
                              )
                            )}
                          </>
                        )
                      )}
                      {/* Subtotal Row for Staff Name */}
                      <tr
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#e6f3ff",
                        }}
                      >
                        <td
                          colSpan={5 + uniqueDates.length}
                          className="text-end"
                        >
                          {staffName} Total:
                        </td>

                        <td>{(staffTotals[staffName].total_value).toFixed(2)}</td>
                      </tr>
                    </>
                  )
                )}
                {/* Grand Total Row */}
                <tr style={{ fontWeight: "bold", backgroundColor: "#f2f2f2" }}>
                  <td colSpan={5 + uniqueDates.length} className="text-end">
                    Grand Total:
                  </td>

                  <td>{grandTotal.total_value}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Report;
