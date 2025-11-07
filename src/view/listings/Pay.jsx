import React, { useState, useEffect } from "react";
import { Container, Row, Col, Offcanvas, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import TableUI from "../../components/TableUI";
import { ActionButton, Buttons } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { fetchPay, addPay, updatePay, deletePay } from "../../slice/PaySlice";
import { HiOutlineDotsVertical } from "react-icons/hi";
import CustomModal from "../../components/Modal";
import NotifyData from "../../components/NotifyData";
import PageTitle from "../../components/PageTitle";
import PayCreation from "../creations/PayCreation";
import { fetchStaff } from "../../slice/StaffSlice";
import { fetchPaySetting } from "../../slice/paySettingSlice";

const Pay = () => {
  const dispatch = useDispatch();
  const { Pay, status, error } = useSelector((state) => state.Pay);
  const { Staff } = useSelector((state) => state.Staff);
  const { paySetting } = useSelector((state) => state.paySetting);

  const [formData, setFormData] = useState({});
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPay, setSelectedPay] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCoolyRate, setSelectedCoolyRate] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [filteredPay, setFilteredPay] = useState([]);

  const schema = [
    { name: "entry_date", label: "Date", type: "date" },
    {
      name: "staff_name",
      label: "பணியாளர்களைத் தேர்ந்தெடுக்கவும்",
      type: "dropdown",
      options: [],
    },
    { name: "per_cooly_rate", label: "கூலி விகிதம்", type: "text" },
    { name: "count", label: "எடை எண்ணிக்கை", type: "text" },
    { name: "ring_count", label: "வளையம் எண்ணிக்கை", type: "text" },
    { name: "total", label: "மொத்தம்", type: "text" },
  ];

  // payCoolyOptions from PayCreation
  const paySettingData = paySetting?.[0] || {};
  const payCoolyOptions = [
    {
      label: `கூலி 1 - ${paySettingData.pay_setting_cooly_one || "0"}`,
      value: paySettingData.pay_setting_cooly_one || "0",
    },
    {
      label: `கூலி 2 - ${paySettingData.pay_setting_cooly_two || "0"}`,
      value: paySettingData.pay_setting_cooly_two || "0",
    },
  ];

  // PayCreation.js ல இருந்து staffOptions லாஜிக்
  const staffOptions = Staff.filter(
    (staffMember) =>
      Array.isArray(staffMember.staff_type) &&
      staffMember.staff_type.includes("செலுத்து")
  ).map((staffMember) => ({
    label: staffMember.Name,
    value: staffMember.Name, // Filter-ல staff_name உடன் மேட்ச் பண்ண value ஆக Name பயன்படுத்துது
  }));

  useEffect(() => {
    dispatch(fetchPay());
    dispatch(fetchStaff());
    dispatch(fetchPaySetting());
  }, [dispatch]);

 

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleFilterOpen = () => setFilterShow(true);
  const handleFilterClose = () => setFilterShow(false);
  const [filterShow, setFilterShow] = useState(false);

  const handleApplyFilters = (e) => {
    e.preventDefault();

    let filteredData = [...(Pay || [])];

    if (fromDate) {
      filteredData = filteredData.filter(
        (entry) => new Date(entry.entry_date) >= new Date(fromDate)
      );
    }

    if (toDate) {
      filteredData = filteredData.filter(
        (entry) => new Date(entry.entry_date) <= new Date(toDate)
      );
    }

    if (selectedCoolyRate) {
      filteredData = filteredData.filter((entry) => {
        try {
          const products =
            typeof entry.products === "string"
              ? JSON.parse(entry.products)
              : entry.products || [];
          return (
            Array.isArray(products) &&
            products.some((p) => p.per_cooly_rate == selectedCoolyRate)
          );
        } catch (error) {
          console.error("Cooly rate filter error:", error);
          return false;
        }
      });
    }

    if (selectedStaff) {
      filteredData = filteredData.filter(
        (entry) => entry.staff_name === selectedStaff
      );
    }

    if (filteredData.length === 0) {
      NotifyData("No records found for selected filters", "error");
    }

    setFilteredPay(filteredData);
    setFilterShow(false);
  };

  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
    setSelectedCoolyRate("");
    setSelectedStaff("");
    setFilteredPay([]);
    setFilterShow(false);
  };

  const handleCreate = () => {
    setEditMode(false);
    setFormData({});
    handleOpen();
  };

  const handleEdit = (pay) => {
    setEditMode(true);
    setSelectedPay(pay);
    setFormData({
      id: pay.id,
      staff_name: pay.staff_name,
      entry_date: pay.entry_date,
      ring_count: pay.ring_count,
      products: pay.products || [
        {
          product_name: "செலுத்து எடை",
          count: "",
          per_cooly_rate: "",
          total: "",
        },
      ],
      total: pay.total,
    });
    handleOpen();
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await dispatch(updatePay(formData)).unwrap();
        NotifyData("Updated Successfully", "success");
      } else {
        await dispatch(addPay(formData)).unwrap();
        NotifyData("Created Successfully", "success");
      }
      dispatch(fetchPay());
      handleClose();
      setFormData({});
    } catch (error) {
      NotifyData(`Operation Failed: ${error}`, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deletePay(id)).unwrap();
      NotifyData("Deleted Successfully", "success");
      dispatch(fetchPay());
    } catch (error) {
      NotifyData(`Delete Failed: ${error}`, "error");
    }
  };

  const headers = ["No.", "Date", "Staff Name", "Total Coolie"];

  const data =
    filteredPay?.length > 0
      ? filteredPay.map((pay, index) => ({
          values: [
            index + 1,
            pay.entry_date,
            pay.staff_name,
            pay.total,
            <ActionButton
              options={[
                {
                  label: "Edit",
                  icon: <LiaEditSolid />,
                  onClick: () => handleEdit(pay),
                },
                // {
                //   label: "Delete",
                //   icon: <MdOutlineDelete />,
                //   onClick: () => handleDelete(pay.id),
                // },
              ]}
              label={<HiOutlineDotsVertical />}
            />,
          ],
        }))
      : [];
      const today = new Date().toISOString().split("T")[0];
  const data1 =
    Pay?.length > 0
      ? Pay.filter((entry)=> entry.entry_date === today).map((pay, index) => ({
          values: [
            index + 1,
            pay.entry_date,
            pay.staff_name,
            pay.total,
            <ActionButton
              options={[
                {
                  label: "Edit",
                  icon: <LiaEditSolid />,
                  onClick: () => handleEdit(pay),
                },
                // {
                //   label: "Delete",
                //   icon: <MdOutlineDelete />,
                //   onClick: () => handleDelete(pay.id),
                // },
              ]}
              label={<HiOutlineDotsVertical />}
            />,
          ],
        }))
      : [];

  return (
    <div id="main">
      <Container>
        <Row>
          <Col xs="6" className="py-3">
            <PageTitle PageTitle="செலுத்து" showButton={false} />
          </Col>
          <Col
            xs="6"
            md="6"
            className="d-flex flex-column flex-md-row justify-content-end gap-3 mt-3"
          >
            <Buttons
              btnlabel="Create New"
              onClick={handleCreate}
              className="submit-btn"
            />
            <Buttons
              btnlabel="Filter"
              onClick={handleFilterOpen}
              className="filter-btn"
            />
          </Col>
          <Col xs="12" className="py-3">
            {status === "loading" && <p>Loading...</p>}
            {status === "failed" && <p>Error: {error}</p>}
            <TableUI
              headers={headers}
              body={filteredPay.length > 0 ? data : data1}
            />
          </Col>
        </Row>
      </Container>

      <CustomModal
        show={show}
        setShow={setShow}
        pageTitle={editMode ? "செலுத்து திருத்து" : "செலுத்து உருவாக்கு"}
        showButton={true}
        submitButton={true}
        submitLabel={editMode ? "Update" : "Submit"}
        CancelLabel="Cancel"
        BodyComponent={
          <PayCreation
            formData={formData}
            setFormData={setFormData}
            schema={schema}
          />
        }
        OnClick={handleSubmit}
        Size="md"
        handleOpen={handleOpen}
        handleClose={handleClose}
      />

      <Offcanvas show={filterShow} onHide={handleFilterClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>செலுத்து Filter</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group controlId="fromDate">
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="toDate" className="mt-3">
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="coolyRateFilter" className="mt-3">
              <Form.Label>கூலி விகிதம்</Form.Label>
              <Form.Select
                value={selectedCoolyRate}
                onChange={(e) => setSelectedCoolyRate(e.target.value)}
              >
                <option value="">All Cooly Rates</option>
                {payCoolyOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="staffFilter" className="mt-3">
              <Form.Label>Staff Name</Form.Label>
              <Form.Select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
              >
                <option value="">All Staff</option>
                {staffOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="mt-4 d-flex justify-content-between">
              <Button variant="secondary" onClick={handleFilterClose}>
                Close
              </Button>
              <Button variant="danger" onClick={handleClearFilters}>
                Clear Filter
              </Button>
              <Buttons
                btnlabel={"Apply Filters"}
                className="submit-btn"
                onClick={handleApplyFilters}
              />
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Pay;
