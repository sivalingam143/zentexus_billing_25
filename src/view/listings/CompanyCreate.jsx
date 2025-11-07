import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CompanyCreation from "../creations/CompanyCreation";
import { addCompanyApi } from "../../services/companyService";
import PageTitle from "../../components/PageTitle";
import { Container, Row, Col } from "react-bootstrap";

const CompanyCreate = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await addCompanyApi(formData);
      toast.success("Company Payroll Submitted!", { autoClose: 3000 });
      setTimeout(() => {
        navigate("/company");
      }, 3000);
    } catch (error) {
      toast.error("Failed to submit company payroll");
      console.error("Submit error:", error);
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
            <PageTitle PageTitle="Create Company Payroll" showButton={false} />
          </Col>
          <Col xs="12">
            <CompanyCreation
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialData={null}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CompanyCreate;
