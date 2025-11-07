import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import { TextInputform } from "../../../components/Forms";
import TableUI from "../../../components/TableUI";
import PageTitle from "../../../components/PageTitle";
const  Packing = () => {
  const ExpenseHead = ["No.", "Product Name", "Count"];
  const ExpenseData = [
    {
      values: ["1", "200 Wala", "120"],
    },
    {
      values: ["2", "100 Wala",  "180"],
    },
    {
      values: ["3", "28 Giant", "250"],
    },
  ];
  return (
    <div>
      <Container>
        <Row>
          <Col lg="12">
            <PageTitle showButton={false} PageTitle="Packing  Report" />
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
          <Col lg="12" className="py-3">
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

export default Packing;
