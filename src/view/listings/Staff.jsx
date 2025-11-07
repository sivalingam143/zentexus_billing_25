import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import TableUI from "../../components/TableUI";
import { ActionButton, Buttons } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import {
  fetchStaff,
  addStaff,
  updateStaff,
  deleteStaff,
} from "../../slice/StaffSlice";
import { HiOutlineDotsVertical } from "react-icons/hi";
import CustomModal from "../../components/Modal";
import NotifyData from "../../components/NotifyData";
import PageTitle from "../../components/PageTitle";
import StaffCreation from "../creations/StaffCreation";

const Staff = () => {
  const dispatch = useDispatch();
  const { Staff, status, error } = useSelector((state) => state.Staff);

  const staffSchema = [
    { name: "Name", label: "ஊழியர் பெயர்", type: "text", required: true },
    {
      name: "MobileNumber",
      label: "மொபைல் எண்",
      type: "text",
      required: true,
    },
    { name: "Place", label: "இடம்", type: "text", required: true },
    {
      name: "StaffType",
      label: "பணியாளர் வகை",
      type: "multi-select",
      options: [
        "வளையம் குத்து",
        "பின்னல்",
        "செலுத்து",
        "டிலெஸ் பின்னல்",
        "பாக்கெட் கூலி",
        "கம்பெனி",
        "வெடி உருடு",
      ],
      required: true,
    },
  ];

  const [formData, setFormData] = useState({
    Name: "",
    MobileNumber: "",
    Place: "",
    StaffType: [],
  });
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleEdit = (staff) => {
    setEditMode(true);
    setSelectedStaff(staff || {});
    setFormData({
      Name: staff?.Name || "",
      MobileNumber: staff?.Mobile_Number || "",
      Place: staff?.Place || "",
      StaffType: Array.isArray(staff?.staff_type) ? staff.staff_type : [], // Already an array from backend
    });
    handleOpen();
  };

  const handleCreate = () => {
    setEditMode(false);
    setFormData({ Name: "", MobileNumber: "", Place: "", StaffType: [] });
    handleOpen();
  };

  const handleSubmit = async () => {
    const submitData = {
      ...formData,
      Staff_Type: formData.StaffType, // Send as array, backend will encode as JSON
    };

    if (editMode) {
      if (!selectedStaff?.id) {
        NotifyData("Staff Update Failed: No staff selected", "error");
        return;
      }
      if (!formData?.Name || formData.StaffType.length === 0) {
        NotifyData("Staff Update Failed: Incomplete data", "error");
        return;
      }
      try {
        await dispatch(
          updateStaff({ id: selectedStaff.id, ...submitData })
        ).unwrap();
        NotifyData("Staff Updated Successfully", "success");
        dispatch(fetchStaff());
      } catch (error) {
        NotifyData("Staff Update Failed", "error");
      }
    } else {
      if (!formData?.Name || formData.StaffType.length === 0) {
        NotifyData("Staff Creation Failed: Incomplete data", "error");
        return;
      }
      try {
        await dispatch(addStaff(submitData)).unwrap();
        NotifyData("Staff Created Successfully", "success");
        dispatch(fetchStaff());
      } catch (error) {
        NotifyData("Staff Creation Failed", "error");
      }
    }

    handleClose();
    setFormData({ Name: "", MobileNumber: "", Place: "", StaffType: [] });
    setEditMode(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteStaff(id)).unwrap();
    NotifyData("Staff Deleted Successfully", "success");
    dispatch(fetchStaff());
  };

  const filteredStaff =
    Staff?.filter((s) =>
      s?.Name?.toLowerCase()?.includes(searchTerm.toLowerCase())
    ) || [];

  const StaffHead = ["No", "Staff Name", "Place", "Mobile Number"];
  const StaffData =
    filteredStaff?.length > 0
      ? filteredStaff.map((s, index) => ({
          values: [
            index + 1,
            s.Name,
            s.Place,
            s.Mobile_Number,

            <ActionButton
              options={[
                {
                  label: "Edit",
                  icon: <LiaEditSolid />,
                  onClick: () => handleEdit(s),
                },
                {
                  label: "Delete",
                  icon: <MdOutlineDelete />,
                  onClick: () => handleDelete(s.id),
                },
              ]}
              label={<HiOutlineDotsVertical />}
            />,
          ],
        }))
      : [];

  return (
    <div id="main">
      <Container>
        <Row>
          <Col xs="6" className="py-3">
            <PageTitle PageTitle="ஊழியர்கள்" showButton={false} />
          </Col>
          <Col xs="6" className="py-3 text-end">
            <Buttons
              btnlabel="Add New"
              className="submit-btn"
              onClick={handleCreate}
            />
          </Col>
          <Col xs="12" className="py-3">
            <TableUI headers={StaffHead} body={StaffData} />
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={show}
        setShow={setShow}
        pageTitle={
          editMode ? <>ஊழியர்கள் திருத்து</> : <>ஊழியர்கள் உருவாக்கு</>
        }
        showButton={true}
        submitButton={true}
        submitLabel={editMode ? <>Update</> : <>Submit</>}
        CancelLabel="Cancel"
        BodyComponent={
          <StaffCreation
            formData={formData}
            setFormData={setFormData}
            schema={staffSchema}
          />
        }
        OnClick={handleSubmit}
        Size="md"
        handleOpen={handleOpen}
        handleClose={handleClose}
      />
    </div>
  );
};

export default Staff;
