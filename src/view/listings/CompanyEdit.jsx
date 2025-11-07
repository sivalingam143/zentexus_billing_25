// src/view/listings/CompanyEdit/index.jsx
import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import CompanyCreation from "../creations/CompanyCreation";
import { updateCompanyApi } from "../../services/companyService";
import PageTitle from "../../components/PageTitle";
import { Container, Row, Col } from "react-bootstrap";

const CompanyEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { initialData } = location.state || {};

  const handleSubmit = async (formData) => {
    try {
      await updateCompanyApi({ ...formData, id });
      toast.success("Company Payroll updated!", { autoClose: 3000 });
      setTimeout(() => {
        navigate("/company");
      }, 3000);
    } catch (error) {
      toast.error("Failed to update company payroll");
      console.error("Update error:", error);
    }
  };

  const handleCancel = () => {
    navigate("/company");
  };

  return (
    <div id="main">
      <Container>
        <Row>
          <Col xs="12" className="py-3">
            <PageTitle PageTitle="Edit Company Payroll" showButton={false} />
          </Col>
          <Col xs="12">
            <CompanyCreation
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialData={initialData}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CompanyEdit;
