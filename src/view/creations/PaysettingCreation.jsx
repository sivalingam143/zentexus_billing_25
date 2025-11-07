import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import { DropDown, TextInputform } from "../../components/Forms";

const PaySettingCreation = () => {
  return (
    <div>
      <Container>
        <Row>
          <Col lg="12" className="py-3">
            <DropDown textlabel="Select Process" />
          </Col>
          <Col lg="12" className="py-3">
            <TextInputform formLabel="Cooly Price" />
          </Col>
          <Col lg="12" className="py-3">
            <TextInputform formLabel="Dry Process Count" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PaySettingCreation;
