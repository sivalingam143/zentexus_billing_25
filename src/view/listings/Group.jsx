import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TableUI from "../../components/TableUI";
import { ActionButton } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import CustomModal from "../../components/Modal";
import { HiOutlineDotsVertical } from "react-icons/hi";
import PageTitle from "../../components/PageTitle";
import GroupCreation from "../creations/GroupCreation";
const Group = () => {
  const [show, setShow] = useState(false);
  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  const options = [
    { label: "Edit", icon: <LiaEditSolid />, onClick: handleOpen },
    { label: "Delete", icon: <MdOutlineDelete /> },
  ];

  const ExpenseHead = ["No.", "Group Name"];
  const ExpenseData = [
    {
      values: [
        "1",
        "Finished",
        <ActionButton
          options={options}
          label={
            <>
              <HiOutlineDotsVertical />
            </>
          }
          className="action-btn"
        />,
      ],
    },
    {
      values: [
        "1",
        "Semi Finished",
        <ActionButton
          options={options}
          label={
            <>
              <HiOutlineDotsVertical />
            </>
          }
          className="action-btn"
        />,
      ],
    },
  ];

  return (
    <div id="main">
      <Container>
        <Row>
          <Col xs="12" className="py-3">
            <PageTitle PageTitle="Company" showButton={false} />
          </Col>
          <Col xs="12" className="py-3">
            <TableUI headers={ExpenseHead} body={ExpenseData} />
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={show}
        setShow={setShow}
        pageTitle="Group"
        showButton={true}
        submitButton={true}
        submitLabel="Submit"
        CancelLabel="Cancel"
        BodyComponent={<><GroupCreation/></>}
        OnClick={() => alert("Submit clicked")}
        Size="md"
        handleOpen={handleOpen}
        handleClose={handleClose}
      />
    </div>
  );
};

export default Group;
