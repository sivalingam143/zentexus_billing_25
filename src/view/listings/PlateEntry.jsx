import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import TableUI from "../../components/TableUI";
import { ActionButton, Buttons } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import {
  fetchPlateEntry,
  addPlateEntry,
  updatePlateEntry,
  deletePlateEntry,
} from "../../slice/PlateEntrySlice"; // Adjust path as needed
import { HiOutlineDotsVertical } from "react-icons/hi";
import CustomModal from "../../components/Modal";
import NotifyData from "../../components/NotifyData";
import PageTitle from "../../components/PageTitle";
import PlateCreation from "../creations/PlateCreation"; // Ensure proper setup

const PlateEntry = () => {
  const dispatch = useDispatch();
  const { PlateEntry, status, error } = useSelector(
    (state) => state.PlateEntry
  );

  const plateEntrySchema = [
    { name: "entry_date", label: "Entry Date", type: "date", required: true },
    { name: "entry_count", label: "Entry Count", type: "text", required: true },
  ];

  const [formData, setFormData] = useState({});
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  console.log(formData);

  useEffect(() => {
    dispatch(fetchPlateEntry()); // Fetch PlateEntries on component mount
  }, [dispatch]);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleEdit = (entry) => {
    setEditMode(true);
    setSelectedEntry(entry || {});
    setFormData({
      entry_date: entry?.entry_date || "",
      entry_count: entry?.entry_count || "",
    });
    handleOpen();
  };

  const handleCreate = () => {
    setEditMode(false);
    setFormData({ entry_date: "", entry_count: "" });
    handleOpen();
  };

  const handleSubmit = async () => {
    if (editMode) {
      if (!selectedEntry?.id) {
        NotifyData("PlateEntry Update Failed: No entry selected", "error");
        return;
      }

      if (!formData?.entry_date || !formData?.entry_count) {
        NotifyData("PlateEntry Update Failed: Incomplete data", "error");
        return;
      }

      try {
        await dispatch(
          updatePlateEntry({ id: selectedEntry.id, ...formData })
        ).unwrap();
        NotifyData("PlateEntry Updated Successfully", "success");
        dispatch(fetchPlateEntry());
      } catch (error) {
        NotifyData("PlateEntry Update Failed", "error");
      }
    } else {
      if (!formData?.entry_date || !formData?.entry_count) {
        NotifyData("PlateEntry Creation Failed: Incomplete data", "error");
        return;
      }

      try {
        await dispatch(addPlateEntry(formData)).unwrap();
        NotifyData("PlateEntry Created Successfully", "success");
        dispatch(fetchPlateEntry());
      } catch (error) {
        NotifyData("PlateEntry Creation Failed", "error");
      }
    }

    handleClose();
    setFormData({ entry_date: "", entry_count: "" });
    setEditMode(false);
  };

  const handleDelete = (id) => {
    dispatch(deletePlateEntry(id)).unwrap();
    NotifyData("PlateEntry Deleted Successfully", "success");
    dispatch(fetchPlateEntry());
  };

  const filteredEntries =
    PlateEntry?.filter((entry) =>
      entry?.entry_date?.toLowerCase()?.includes(searchTerm.toLowerCase())
    ) || [];

  const PlateEntryHead = ["No", "Date", "Count"];
  const PlateEntryData =
    filteredEntries?.length > 0
      ? filteredEntries.map((entry, index) => ({
          values: [
            index + 1,
            entry.entry_date,
            entry.entry_count,
            <ActionButton
              options={[
                {
                  label: "Edit",
                  icon: <LiaEditSolid />,
                  onClick: () => handleEdit(entry),
                },
                {
                  label: "Delete",
                  icon: <MdOutlineDelete />,
                  onClick: () => handleDelete(entry.id),
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
            <PageTitle PageTitle="Plate Entries" showButton={false} />
          </Col>
          <Col xs="6" className="py-3 text-end">
            <Buttons
              btnlabel="Add New"
              onClick={handleCreate}
              className="submit-btn"
            />
          </Col>
          <Col xs="12" className="py-3">
            <TableUI headers={PlateEntryHead} body={PlateEntryData} />
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={show}
        setShow={setShow}
        pageTitle={editMode ? <>Edit Plate Entry</> : <>Create Plate Entry</>}
        showButton={true}
        submitButton={true}
        submitLabel={editMode ? <>Update</> : <>Submit</>}
        CancelLabel="Cancel"
        BodyComponent={
          <PlateCreation
            formData={formData}
            setFormData={setFormData}
            schema={plateEntrySchema}
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

export default PlateEntry;
