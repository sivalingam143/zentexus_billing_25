import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import { TextInputform } from "../../../components/Forms";
import TableUI from "../../../components/TableUI";
import PageTitle from "../../../components/PageTitle";

const Plate = () => {
  const ExpenseHead = ["No.", "Plate Count",];
  const ExpenseData = [
    {
      values: ["1", "200 "],
    },
  ];
  return (
    <div>
      <Container>
        <Row className="justify-content-center">
        <Col lg='12'>
            <PageTitle showButton={false} PageTitle="Plates Report"/>
        </Col>
          <Col lg="4" className="py-3">
            <TextInputform formLabel="Search" />
          </Col>
          <Col lg="4" className="py-3">
            <TextInputform formLabel="From Date" formtype="date" />
          </Col>
          <Col lg="4" className="py-3">
            <TextInputform formLabel="To Date" formtype="date" />
          </Col>
          <Col xs="6" className="py-3">
            <TableUI
              headers={ExpenseHead}
              body={ExpenseData}
              showActionColumn={false}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Plate;
