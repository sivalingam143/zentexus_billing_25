import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { TextInputform } from "../../components/Forms";

const PlateCreation = ({ schema, formData, setFormData }) => {
  const handleInputChange = (e, fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: e.target.value,
    }));
  };

  return (
    <div>
      <Container>
        <Row>
          {schema.map((field, index) => (
            <Col xs={12} className="py-3" key={index}>
              <TextInputform
                formLabel={field.label}
                formtype={field.type || "text"}
                required={field.required || false}
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(e, field.name)}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default PlateCreation;
