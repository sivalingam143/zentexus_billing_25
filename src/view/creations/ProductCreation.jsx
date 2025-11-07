import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { DropDown, TextInputform } from "../../components/Forms";

const ProductCreation = ({ formData, setFormData, schema }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Container>
        <Row>
          {schema.map((field, index) => (
            <Col lg="12" md="12" xs="12" className="py-3" key={index}>
              <TextInputform
                textlabel={field.label}
                formLabel={field.label}
                PlaceHolder={field.label}
                name={field.name}
                value={formData[field.name] || ""}
                formtype={field.type} // Toggle password visibility per field
                onChange={handleChange}
                classname={field.classname || ""}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default ProductCreation;
