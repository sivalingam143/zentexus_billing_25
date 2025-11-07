import React from "react";
import { Col, Container, Row, Form } from "react-bootstrap";

const StaffCreation = ({ formData, setFormData, schema }) => {
  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (option) => {
    setFormData((prevData) => {
      const updatedTypes = prevData.StaffType.includes(option)
        ? prevData.StaffType.filter((type) => type !== option) // Remove if already selected
        : [...prevData.StaffType, option]; // Add if not selected

      return { ...prevData, StaffType: updatedTypes };
    });
  };

  return (
    <Container>
      <Row>
        {schema.map((field) => (
          <Col xs="12" className="py-3" key={field.name}>
            {field.type === "multi-select" ? (
              <Form.Group controlId={field.name}>
                <Form.Label>{field.label}</Form.Label>
                <Row>
                  {/* First Row: Top 3 Options */}
                  {field.options.slice(0, 3).map((option) => (
                    <Col xs={4} key={option}>
                      <Form.Check>
                        <Form.Check.Input
                          type="checkbox"
                          id={`checkbox-${option}`} // Unique ID
                          value={option}
                          checked={formData.StaffType.includes(option)}
                          onChange={() => handleCheckboxChange(option)}
                        />
                        <Form.Check.Label htmlFor={`checkbox-${option}`}>
                          {option}
                        </Form.Check.Label>
                      </Form.Check>
                    </Col>
                  ))}
                </Row>
                <Row>
                  {/* Second Row: Bottom 3 Options */}
                  {field.options.slice(3).map((option) => (
                    <Col xs={4} key={option}>
                      <Form.Check>
                        <Form.Check.Input
                          type="checkbox"
                          id={`checkbox-${option}`} // Unique ID
                          value={option}
                          checked={formData.StaffType.includes(option)}
                          onChange={() => handleCheckboxChange(option)}
                        />
                        <Form.Check.Label htmlFor={`checkbox-${option}`}>
                          {option}
                        </Form.Check.Label>
                      </Form.Check>
                    </Col>
                  ))}
                </Row>
              </Form.Group>
            ) : (
              <Form.Group controlId={field.name}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                />
              </Form.Group>
            )}
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default StaffCreation;
