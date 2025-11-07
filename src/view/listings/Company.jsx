// src/view/listings/Company/index.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Offcanvas, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TableUI from "../../components/TableUI";
import { ActionButton, Buttons } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { HiOutlineDotsVertical } from "react-icons/hi";
import NotifyData from "../../components/NotifyData";
import PageTitle from "../../components/PageTitle";
import { fetchStaff } from "../../slice/StaffSlice";
import {
  fetchCompanyApi,
  deleteCompanyApi,
} from "../../services/companyService";

const Company = () => {
  const navigate = useNavigate();
  const [companyList, setCompanyList] = useState([]);


  useEffect(() => {
    fetchData();
  
  }, []);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const handleFilterOpen = () => setFilterShow(true);
  const handleFilterClose = () => setFilterShow(false);
  const [filterShow, setFilterShow] = useState(false);
   const [filteredcompany, setFilteredcompany] = useState([]);

   const handleApplyFilters = (e) => {
      e.preventDefault();
  
      let filteredData = [...companyList]; // Clone original data
  
      if (fromDate) {
        filteredData = filteredData.filter(
          (entry) => new Date(entry.date) >= new Date(fromDate)
        );
      }
  
      if (toDate) {
        filteredData = filteredData.filter(
          (entry) => new Date(entry.date) <= new Date(toDate)
        );
      }
  
      if (filteredData.length === 0) {
        NotifyData("No records found for selected filters", "error");
      }
  
      setFilteredcompany(filteredData);
      setFilterShow(false);
    };
  
  const fetchData = async () => {
    try {
      const data = await fetchCompanyApi();
      setCompanyList(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      NotifyData("Failed to fetch data", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCompanyApi(id);
      NotifyData("Deleted Successfully", "success");
      fetchData();
    } catch (error) {
      NotifyData("Delete Failed", "error");
      console.error("Delete error:", error);
    }
  };

  const headers = ["No.", "Date", "Presents", "Absents", "Total Wages"];

  const data =
    filteredcompany?.length > 0
      ? filteredcompany.map((entry, index) => ({
          values: [
            index + 1,
            entry.date || "N/A",
            entry.presents || 0,
            entry.absents || 0,
            entry.total_wages || 0,
            <ActionButton
              options={[
                {
                  label: "Edit",
                  icon: <LiaEditSolid />,
                  onClick: () =>
                    navigate(`/company/edit/${entry.id}`, {
                      state: { initialData: entry },
                    }),
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
        }))
      : [];
      const today = new Date().toISOString().split("T")[0];
      const data1 =
    companyList?.length > 0
      ? companyList.filter((entry)=> entry.date === today).map((entry, index) => ({
          values: [
            index + 1,
            entry.date || "N/A",
            entry.presents || 0,
            entry.absents || 0,
            entry.total_wages || 0,
            <ActionButton
              options={[
                {
                  label: "Edit",
                  icon: <LiaEditSolid />,
                  onClick: () =>
                    navigate(`/company/edit/${entry.id}`, {
                      state: { initialData: entry },
                    }),
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
        }))
      : [];
      const handleClearFilters = () => {
        setFromDate("");
        setToDate("");
        setFilteredcompany([]); // Reset to original dataset
        setFilterShow(false);
      };
  return (
    <div id="main">
      <Container>
        <Row>
          <Col xs="6" className="py-3">
            <PageTitle PageTitle="கம்பெனி பிரிவு" showButton={false} />
          </Col>

          <Col
            xs="6"
            md="6"
            className="d-flex flex-column flex-md-row justify-content-end gap-3 mt-3"
          >
            <Buttons
              btnlabel="Add New"
              onClick={() => navigate("/company/create")}
              className="submit-btn"
            />
            <Buttons
              btnlabel="Filter"
              onClick={handleFilterOpen}
              className="filter-btn"
            />
          </Col>
          <Col xs="12" className="py-3">
            <TableUI headers={headers} body={filteredcompany.length > 0 ? data : data1} />
          </Col>
        </Row>
      </Container>
      <Offcanvas show={filterShow} onHide={handleFilterClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>பின்னல் Filter</Offcanvas.Title>
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
              ></Buttons>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Company;
