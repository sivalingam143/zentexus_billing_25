import React, { useState, useEffect } from "react";
import { Container, Row, Col, Offcanvas, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import TableUI from "../../components/TableUI";
import { ActionButton, Buttons } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import {
  fetchpacking,
  addpacking,
  updatepacking,
  deletepacking,
} from "../../slice/PackingSlice";
import { HiOutlineDotsVertical } from "react-icons/hi";
import CustomModal from "../../components/Modal";
import NotifyData from "../../components/NotifyData";
import PageTitle from "../../components/PageTitle";
import PackCreation from "../creations/PackCreation";
import { fetchStaff } from "../../slice/StaffSlice";
import { fetchProduct } from "../../slice/ProductSlice";

const Packing = () => {
  const dispatch = useDispatch();
  const { packing, status, error } = useSelector((state) => state.packing);
  const { Staff } = useSelector((state) => state.Staff);
  const { Product } = useSelector((state) => state.Product);

  const schema = [
    { name: "entry_date", label: "தேதி", type: "date" },
    {
      name: "staff_id",
      label: "பணியாளர்களைத் தேர்ந்தெடுக்கவும்",
      type: "dropdown",
    },
    { name: "products", label: "பொருட்கள்", type: "custom" },
    { name: "total", label: "மொத்தம்", type: "text" },
  ];

  const [formData, setFormData] = useState({ products: [] });
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [filteredPacking, setFilteredPacking] = useState([]);

  const ProductOptions = Product.map((product) => ({
    label: product.product_name,
    value: product.product_name,
  }));

  // PackCreation.js ல இருந்து staffOptions லாஜிக்
  const staffOptions = Staff.filter(
    (staffMember) =>
      Array.isArray(staffMember.staff_type) &&
      staffMember.staff_type.includes("பாக்கெட் கூலி")
  ).map((staffMember) => ({
    label: staffMember.Name,
    value: staffMember.Name, // Filter-ல staff_name உடன் மேட்ச் பண்ண value ஆக Name பயன்படுத்துது
  }));

  useEffect(() => {
    dispatch(fetchpacking());
    dispatch(fetchStaff());
    dispatch(fetchProduct());
  }, [dispatch]);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleFilterOpen = () => setFilterShow(true);
  const handleFilterClose = () => setFilterShow(false);
  const [filterShow, setFilterShow] = useState(false);

  const handleApplyFilters = (e) => {
    e.preventDefault();

    let filteredData = [...(packing || [])];

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

    if (selectedProduct) {
      filteredData = filteredData.filter((entry) => {
        try {
          const products =
            typeof entry.products === "string"
              ? JSON.parse(entry.products)
              : entry.products || [];
          return (
            Array.isArray(products) &&
            products.some((p) => p.product_name === selectedProduct)
          );
        } catch (error) {
          console.error("Product filter error:", error);
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

    setFilteredPacking(filteredData);
    setFilterShow(false);
  };

  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
    setSelectedProduct("");
    setSelectedStaff("");
    setFilteredPacking([]);
    setFilterShow(false);
  };

  const handleEdit = (entry) => {
    setEditMode(true);
    setSelectedEntry(entry || {});
    let products = [];
    try {
      products =
        typeof entry.products === "string"
          ? JSON.parse(entry.products)
          : entry.products || [];
    } catch (e) {
      console.error("Failed to parse products:", e);
      products = [];
    }
    setFormData({
      entry_date: entry.entry_date,
      staff_id: entry.staff_id,
      products: Array.isArray(products) ? products : [],
      total: entry.total,
    });
    handleOpen();
  };

  const handleCreate = () => {
    setEditMode(false);
    setFormData({ products: [] });
    handleOpen();
  };

  const handleSubmit = async () => {
    if (!formData.products || formData.products.length === 0) {
      NotifyData("Please add at least one product", "error");
      return;
    }
    if (editMode) {
      if (!selectedEntry?.id) {
        NotifyData("Update Failed: No entry selected", "error");
        return;
      }
      try {
        await dispatch(
          updatepacking({ id: selectedEntry.id, ...formData })
        ).unwrap();
        NotifyData("Updated Successfully", "success");
        dispatch(fetchpacking());
      } catch {
        NotifyData("Update Failed", "error");
      }
    } else {
      try {
        await dispatch(addpacking(formData)).unwrap();
        NotifyData("Created Successfully", "success");
        dispatch(fetchpacking());
      } catch {
        NotifyData("Creation Failed", "error");
      }
    }
    handleClose();
    setFormData({ products: [] });
    setEditMode(false);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deletepacking(id)).unwrap();
      NotifyData("Deleted Successfully", "success");
      dispatch(fetchpacking());
    } catch {
      NotifyData("Delete Failed", "error");
    }
  };

  const headers = ["No.", "Date", "Staff Name", "Products", "Total"];

  const data =
    filteredPacking?.length > 0
      ? filteredPacking.map((entry, index) => {
          let products = [];
          try {
            products =
              typeof entry.products === "string"
                ? JSON.parse(entry.products)
                : entry.products || [];
          } catch (e) {
            console.error("Failed to parse products for entry:", entry, e);
            products = [];
          }
          const productDisplay = Array.isArray(products)
            ? products.map((p) => `${p.product_name} (${p.count})`).join(", ")
            : "No products";

          return {
            values: [
              index + 1,
              entry.entry_date,
              entry.staff_name,
              productDisplay,
              entry.total,
              <ActionButton
                options={[
                  {
                    label: "Edit",
                    icon: <LiaEditSolid />,
                    onClick: () => handleEdit(entry),
                  },
                  // {
                  //   label: "Delete",
                  //   icon: <MdOutlineDelete />,
                  //   onClick: () => handleDelete(entry.id),
                  // },
                ]}
                label={<HiOutlineDotsVertical />}
              />,
            ],
          };
        })
      : [];
      const today = new Date().toISOString().split("T")[0];
  const data1 =
    packing?.length > 0
      ? packing.filter((entry)=> entry.entry_date === today).map((entry, index) => {
          let products = [];
          try {
            products =
              typeof entry.products === "string"
                ? JSON.parse(entry.products)
                : entry.products || [];
          } catch (e) {
            console.error("Failed to parse products for entry:", entry, e);
            products = [];
          }
          const productDisplay = Array.isArray(products)
            ? products.map((p) => `${p.product_name} (${p.count})`).join(", ")
            : "No products";

          return {
            values: [
              index + 1,
              entry.entry_date,
              entry.staff_name,
              productDisplay,
              entry.total,
              <ActionButton
                options={[
                  {
                    label: "Edit",
                    icon: <LiaEditSolid />,
                    onClick: () => handleEdit(entry),
                  },
                  // {
                  //   label: "Delete",
                  //   icon: <MdOutlineDelete />,
                  //   onClick: () => handleDelete(entry.id),
                  // },
                ]}
                label={<HiOutlineDotsVertical />}
              />,
            ],
          };
        })
      : [];

  return (
    <div id="main">
      <Container>
        <Row>
          <Col xs="6" className="py-3">
            <PageTitle PageTitle="பாக்கெட்" showButton={false} />
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
              body={filteredPacking.length > 0 ? data : data1}
            />
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={show}
        setShow={setShow}
        pageTitle={editMode ? <>பாக்கெட் திருத்து</> : <>பாக்கெட் உருவாக்கு</>}
        showButton={true}
        submitButton={true}
        submitLabel={editMode ? <>Update</> : <>Submit</>}
        CancelLabel="Cancel"
        BodyComponent={
          <PackCreation
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
          <Offcanvas.Title>பாக்கெட் Filter</Offcanvas.Title>
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

            <Form.Group controlId="productFilter" className="mt-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                as="select"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">All Products</option>
                {ProductOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Control>
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

export default Packing;
