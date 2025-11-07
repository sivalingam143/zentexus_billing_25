import React, { useEffect, useState } from "react";
import { Container, Col, Row, Form } from "react-bootstrap";
import TableUI from "../../../components/TableUI";
import PageTitle from "../../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { fetchReport } from "../../../slice/ReportSlice";
import { fetchProduct } from "../../../slice/ProductSlice";
import { fetchCompany } from "../../../slice/companySlice";
import { fetchringboxing } from "../../../slice/RingboxingsectionSlice";
import { fetchknotting } from "../../../slice/KnottingSlice";
import { fetchpacking } from "../../../slice/PackingSlice";
import { fetchPay } from "../../../slice/PaySlice";

import "./stock.css";

const Stock = () => {
  const dispatch = useDispatch();

  // Access stock data from Redux
  const { Report, status, error } = useSelector((state) => state.Report);
  const { Product } = useSelector((state) => state.Product);
  const { Company } = useSelector((state) => state.Company);
  const { ringboxing } = useSelector((state) => state.ringboxing);
  const { knotting } = useSelector((state) => state.knotting);
  const { packing } = useSelector((state) => state.packing);
  // const { dccpunch } = useSelector((state) => state.dccpunch);

  // State for selected staff
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedringboxingStaff, setSelectedringboxingStaff] = useState("");
  const [selectedKnottingStaff, setSelectedKnottingStaff] = useState("");
  const [selectedPackingStaff, setSelectedPackingStaff] = useState("");
  const [selecteddccpunchStaff, setSelecteddccpunchStaff] = useState("");

  useEffect(() => {
    dispatch(fetchReport());
    dispatch(fetchProduct());
    dispatch(fetchCompany());
    dispatch(fetchringboxing());
    dispatch(fetchknotting());
    dispatch(fetchpacking());
    dispatch(fetchPay());
  }, [dispatch]);

  const tableHeaders = [
    "No.",
    "Product Name",
    "Per Stock Count",
    "For Cash Stock Count",
  ];
  const tableBody =
    Report?.product_stock?.map((item, index) => {
      const product = Product.find((p) => p.product_name === item.product_name);
      const perCaseCount = product?.per_case_count || 1; // Default per_case_count to avoid divide by zero
      const forCashStockCount = (item.stock / perCaseCount).toFixed(2); // Include two decimal points for fractional count

      return {
        values: [
          index + 1,
          item.product_name,
          item.stock,
          forCashStockCount, // Add calculated stock count with decimal points
        ],
      };
    }) || [];

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [ringboxingFromDate, setringboxingFromDate] = useState("");
  const [ringboxingToDate, setringboxingToDate] = useState("");
  const [knottingFromDate, setKnottingFromDate] = useState("");
  const [knottingToDate, setKnottingToDate] = useState("");
  const [packingFromDate, setpackingFromDate] = useState("");
  const [packingToDate, setpackingToDate] = useState("");
  const [dccpunchFromDate, setdccpunchFromDate] = useState("");
  // const [dccpunchToDate, setdccpunchToDate] = useState("");

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear().toString().slice(2); // Get last two digits of the year
    return `${day}/${month}/${year}`;
  };

  const uniqueStaffNames = Array.from(
    new Set(Company?.map((staff) => staff.staff_name))
  );

  const uniqueringboxingStaffNames = Array.from(
    new Set(ringboxing?.map((staff) => staff.staff_name))
  );

  const uniqueKnottingStaffNames = Array.from(
    new Set(knotting?.map((staff) => staff.staff_name))
  );

  const uniquePackingStaffNames = Array.from(
    new Set(packing?.map((staff) => staff.staff_name))
  );

  // const uniqueDccpunchStaffNames = Array.from(
  //   new Set(dccpunch?.map((staff) => staff.staff_name))
  // );

  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  const filteredCompany = Company?.filter((staff) => {
    const staffDate = new Date(staff.entry_date);

    // Ensure fromDate and toDate are valid
    const validFromDate = fromDate ? isValidDate(new Date(fromDate)) : true;
    const validToDate = toDate ? isValidDate(new Date(toDate)) : true;

    const isWithinDateRange =
      validFromDate &&
      validToDate &&
      (!fromDate || staffDate >= new Date(fromDate)) &&
      (!toDate || staffDate <= new Date(toDate));

    return (
      isWithinDateRange &&
      (selectedStaff ? staff.staff_name === selectedStaff : true)
    );
  });

  const staffTableHeaders = ["No.", "Date", "Staff Name", "Coolie"];
  const staffTableBody =
    filteredCompany?.map((staff, index) => ({
      values: [
        index + 1,
        formatDate(staff.entry_date),
        staff.staff_name,
        staff.per_coolie || 0,
      ], // Default coolie to 0 if missing
    })) || [];

  // Handle staff selection
  const handleStaffSelection = (e) => {
    setSelectedStaff(e.target.value);
  };

  const totalCoolie = filteredCompany?.reduce(
    (total, staff) => total + parseFloat(staff.per_coolie || 0),
    0
  );

  //ringboxing Report

  const filteredringboxing = ringboxing?.filter((entry) => {
    const entryDate = new Date(entry.entry_date);

    const validFromDate = ringboxingFromDate
      ? isValidDate(new Date(ringboxingFromDate))
      : true;
    const validToDate = ringboxingToDate
      ? isValidDate(new Date(ringboxingToDate))
      : true;

    const isWithinDateRange =
      validFromDate &&
      validToDate &&
      (!ringboxingFromDate || entryDate >= new Date(ringboxingFromDate)) &&
      (!ringboxingToDate || entryDate <= new Date(ringboxingToDate));

    return (
      isWithinDateRange &&
      (selectedringboxingStaff
        ? entry.staff_name === selectedringboxingStaff
        : true)
    );
  });
  console.log("ringboxing", ringboxing);

  const ringboxingTableHeaders = ["No.", "Date", "Staff Name", "Coolie"];
  const ringboxingTableBody =
    filteredringboxing?.map((entry, index) => ({
      values: [
        index + 1,
        formatDate(entry.entry_date),
        entry.staff_name,
        entry.total,
      ],
    })) || [];
  console.log("filteredringboxing", filteredringboxing);

  // Handle ringboxing staff selection
  const handleringboxingStaffSelection = (e) => {
    setSelectedringboxingStaff(e.target.value);
  };

  const totalringboxingCoolie = filteredringboxing?.reduce(
    (total, entry) => total + parseFloat(entry.total || 0),
    0
  );

  //Knotting Report

  const filteredKnotting = knotting?.filter((entry) => {
    const entryDate = new Date(entry.entry_date);

    const validFromDate = knottingFromDate
      ? isValidDate(new Date(knottingFromDate))
      : true;
    const validToDate = knottingToDate
      ? isValidDate(new Date(knottingToDate))
      : true;

    const isWithinDateRange =
      validFromDate &&
      validToDate &&
      (!knottingFromDate || entryDate >= new Date(knottingFromDate)) &&
      (!knottingToDate || entryDate <= new Date(knottingToDate));

    return (
      isWithinDateRange &&
      (selectedKnottingStaff
        ? entry.staff_name === selectedKnottingStaff
        : true)
    );
  });
  console.log("filteredKnotting", filteredKnotting);

  const knottingTableHeaders = ["No.", "Date", "Staff Name", "Coolie"];
  const knottingTableBody =
    filteredKnotting?.map((entry, index) => ({
      values: [
        index + 1,
        formatDate(entry.entry_date),
        entry.staff_name,
        entry.total,
      ],
    })) || [];
  console.log("filteredringboxing", filteredringboxing);

  // Handle ringboxing staff selection
  const handleKnottingStaffSelection = (e) => {
    setSelectedKnottingStaff(e.target.value);
  };

  const totalKnottingCoolie = filteredKnotting?.reduce(
    (total, entry) => total + parseFloat(entry.total || 0),
    0
  );

  //packing Report

  const filteredpacking = packing?.filter((entry) => {
    const entryDate = new Date(entry.entry_date);

    const validFromDate = packingFromDate
      ? isValidDate(new Date(packingFromDate))
      : true;
    const validToDate = packingToDate
      ? isValidDate(new Date(packingToDate))
      : true;

    const isWithinDateRange =
      validFromDate &&
      validToDate &&
      (!packingFromDate || entryDate >= new Date(packingFromDate)) &&
      (!packingToDate || entryDate <= new Date(packingToDate));

    return (
      isWithinDateRange &&
      (selectedPackingStaff ? entry.staff_name === selectedPackingStaff : true)
    );
  });
  console.log("filteredKnotting", filteredpacking);

  const PackingTableHeaders = ["No.", "Date", "Staff Name", "Coolie"];
  const PackingTableBody =
    filteredpacking?.map((entry, index) => ({
      values: [
        index + 1,
        formatDate(entry.entry_date),
        entry.staff_name,
        entry.total,
      ],
    })) || [];
  console.log("filteredringboxing", filteredringboxing);

  // Handle ringboxing staff selection
  const handlePackingStaffSelection = (e) => {
    setSelectedPackingStaff(e.target.value);
  };

  const totalPackingCoolie = filteredpacking?.reduce(
    (total, entry) => total + parseFloat(entry.total || 0),
    0
  );

  //dccpunch Report

  // const filtereddccpunch = dccpunch?.filter((entry) => {
  //   const entryDate = new Date(entry.entry_date);

  //   const validFromDate = dccpunchFromDate
  //     ? isValidDate(new Date(dccpunchFromDate))
  //     : true;
  //   const validToDate = dccpunchToDate
  //     ? isValidDate(new Date(dccpunchToDate))
  //     : true;

  //   const isWithinDateRange =
  //     validFromDate &&
  //     validToDate &&
  //     (!dccpunchFromDate || entryDate >= new Date(dccpunchFromDate)) &&
  //     (!dccpunchToDate || entryDate <= new Date(dccpunchToDate));

  //   return (
  //     isWithinDateRange &&
  //     (selecteddccpunchStaff
  //       ? entry.staff_name === selecteddccpunchStaff
  //       : true)
  //   );
  // });
  // console.log("filteredKnotting", filtereddccpunch);

  // const dccpunchTableHeaders = ["No.", "Date", "Staff Name", "Coolie"];
  // const dccpunchTableBody =
  //   filtereddccpunch?.map((entry, index) => ({
  //     values: [
  //       index + 1,
  //       formatDate(entry.entry_date),
  //       entry.staff_name,
  //       entry.total,
  //     ],
  //   })) || [];
  // console.log("filteredringboxing", filteredringboxing);

  // // Handle ringboxing staff selection
  // const handledccpunchStaffSelection = (e) => {
  //   setSelecteddccpunchStaff(e.target.value);
  // };

  // const totaldccpunchCoolie = filtereddccpunch?.reduce(
  //   (total, entry) => total + parseFloat(entry.total || 0),
  //   0
  // );

  return (
    <div>
      <Container>
        <Row>
          <Col lg="12">
            <PageTitle showButton={false} PageTitle="Stock Report" />
          </Col>

          {/* Empty Plat Current Stock */}
          {/* <Col lg="6" className="py-3">
            <div className="stock-box">
              <h4>Empty Plat Current Stock</h4>
              <p className="stock-value">
                {Report?.magazine_stock?.[0]?.empty_plate_count || 0}
              </p>
            </div>
          </Col> */}

          {/* Finished Bijili Current Stock */}
          {/* <Col lg="6" className="py-3">
            <div className="stock-box">
              <h4>Finished Bijili Current Stock</h4>
              <p className="stock-value">
                {Report?.magazine_stock?.[0]?.finshed_bijili_count || 0}
              </p>
            </div>
          </Col> */}

          {/* Product Wise Stock Report */}
          {/* <Col lg="12" className="py-3">
            <PageTitle
              showButton={false}
              PageTitle="Product Wise Stock Report"
            />
          </Col> */}
          {/* <Col lg="12" className="py-3">
            {status === "loading" ? (
              <p>Loading...</p>
            ) : status === "failed" ? (
              <p className="text-danger">Error: {error}</p>
            ) : (
              <TableUI
                headers={tableHeaders}
                body={tableBody}
                showActionColumn={false}
              />
            )}
          </Col> */}

          {/* Staff Name and Coolie Table */}
          {/* <Col lg="12" className="py-3">
            <PageTitle showButton={false} PageTitle="Company Payroll Report" />
          </Col> */}
          {/* Staff Dropdown */}
          {/* <Col lg="3" className="py-3">
            <Form.Group controlId="staffSelect">
              <Form.Label>Select Staff</Form.Label>
              <Form.Control
                as="select"
                value={selectedStaff}
                onChange={handleStaffSelection}
              >
                <option value="">All Staff</option>
                {uniqueStaffNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col> */}
          {/* Filters */}

          {/* <Col lg="3" className="py-3">
            <Form.Group controlId="fromDate">
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg="3" className="py-3">
            <Form.Group controlId="toDate">
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg="12" className="py-3">
            {status === "loading" ? (
              <p>Loading...</p>
            ) : status === "failed" ? (
              <p className="text-danger">Error: {error}</p>
            ) : (
              <TableUI
                headers={staffTableHeaders}
                body={staffTableBody}
                showActionColumn={false}
              />
            )}
          </Col>
          <Col lg="12" className="py-3">
            <div className="total-box">
              <h5>Total Coolie: {totalCoolie?.toFixed(2) || 0}</h5>
            </div>
          </Col> */}
          <hr />
          {/* ringboxing Report Section */}
          <Col lg="12" className="py-3">
            <PageTitle showButton={false} PageTitle="ringboxing Report" />
          </Col>
          {/* Staff Dropdown */}
          <Col lg="3" className="py-3">
            <Form.Group controlId="staffSelect">
              <Form.Label>Select Staff</Form.Label>
              <Form.Control
                as="select"
                value={selectedringboxingStaff}
                onChange={handleringboxingStaffSelection}
              >
                <option value="">All Staff</option>
                {uniqueringboxingStaffNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          {/* Filters */}
          <Col lg="3" className="py-3">
            <Form.Group controlId="fromDate">
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                value={fromDate}
                onChange={(e) => setringboxingFromDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg="3" className="py-3">
            <Form.Group controlId="toDate">
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                value={toDate}
                onChange={(e) => setringboxingToDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg="12" className="py-3">
            <TableUI
              headers={ringboxingTableHeaders}
              body={ringboxingTableBody}
              showActionColumn={false}
            />
          </Col>
          <Col lg="12" className="py-3">
            <div className="total-box">
              <h5>Total Coolie: {totalringboxingCoolie?.toFixed(2) || 0}</h5>
            </div>
          </Col>
          <hr />
          {/* Knotting Report Section */}
          <Col lg="12" className="py-3">
            <PageTitle showButton={false} PageTitle="Knotting Report" />
          </Col>
          {/* Staff Dropdown */}
          <Col lg="3" className="py-3">
            <Form.Group controlId="staffSelect">
              <Form.Label>Select Staff</Form.Label>
              <Form.Control
                as="select"
                value={selectedKnottingStaff}
                onChange={handleKnottingStaffSelection}
              >
                <option value="">All Staff</option>
                {uniqueKnottingStaffNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          {/* Filters */}
          <Col lg="3" className="py-3">
            <Form.Group controlId="fromDate">
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                value={knottingFromDate}
                onChange={(e) => setKnottingFromDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg="3" className="py-3">
            <Form.Group controlId="toDate">
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                value={knottingToDate}
                onChange={(e) => setKnottingToDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg="12" className="py-3">
            <TableUI
              headers={knottingTableHeaders}
              body={knottingTableBody}
              showActionColumn={false}
            />
          </Col>
          <Col lg="12" className="py-3">
            <div className="total-box">
              <h5>Total Coolie: {totalKnottingCoolie?.toFixed(2) || 0}</h5>
            </div>
          </Col>
          <hr />
          {/* packing Report Section */}
          <Col lg="12" className="py-3">
            <PageTitle showButton={false} PageTitle="Packing Report" />
          </Col>
          {/* Staff Dropdown */}
          <Col lg="3" className="py-3">
            <Form.Group controlId="staffSelect">
              <Form.Label>Select Staff</Form.Label>
              <Form.Control
                as="select"
                value={selectedPackingStaff}
                onChange={handlePackingStaffSelection}
              >
                <option value="">All Staff</option>
                {uniquePackingStaffNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          {/* Filters */}
          <Col lg="3" className="py-3">
            <Form.Group controlId="fromDate">
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                value={packingFromDate}
                onChange={(e) => setpackingFromDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg="3" className="py-3">
            <Form.Group controlId="toDate">
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                value={packingToDate}
                onChange={(e) => setpackingToDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg="12" className="py-3">
            <TableUI
              headers={PackingTableHeaders}
              body={PackingTableBody}
              showActionColumn={false}
            />
          </Col>
          <Col lg="12" className="py-3">
            <div className="total-box">
              <h5>Total Coolie: {totalPackingCoolie?.toFixed(2) || 0}</h5>
            </div>
          </Col>
          <hr />
          {/* Dccpunch Report Section */}
          {/* <Col lg="12" className="py-3">
            <PageTitle showButton={false} PageTitle="Dcc Punch Report" />
          </Col> */}
          {/* Staff Dropdown */}
          {/* <Col lg="3" className="py-3">
            <Form.Group controlId="staffSelect">
              <Form.Label>Select Staff</Form.Label>
              <Form.Control
                as="select"
                value={selecteddccpunchStaff}
                onChange={handledccpunchStaffSelection}
              >
                <option value="">All Staff</option>
                {uniqueDccpunchStaffNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col> */}
          {/* Filters */}
          {/* <Col lg="3" className="py-3">
            <Form.Group controlId="fromDate">
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                value={dccpunchFromDate}
                onChange={(e) => setdccpunchFromDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg="3" className="py-3">
            <Form.Group controlId="toDate">
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                value={dccpunchToDate}
                onChange={(e) => setdccpunchToDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg="12" className="py-3">
            <TableUI
              headers={dccpunchTableHeaders}
              body={dccpunchTableBody}
              showActionColumn={false}
            />
          </Col>
          <Col lg="12" className="py-3">
            <div className="total-box">
              <h5>Total Coolie: {totaldccpunchCoolie?.toFixed(2) || 0}</h5>
            </div>
          </Col> */}
        </Row>
      </Container>
    </div>
  );
};

export default Stock;
