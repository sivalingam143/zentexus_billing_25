// src/view/listings/CompanyCreation/index.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaff } from "../../slice/StaffSlice";
import { BsStopCircleFill } from "react-icons/bs";
import { Calender, TextInputform } from "../../components/Forms";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CompanyCreation = ({ onSubmit, onCancel, initialData = null }) => {
  const dispatch = useDispatch();
  const { Staff, status } = useSelector((state) => state.Staff);

  // Set default date to last month
  const getLastMonthDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth());
    return date.toISOString().split("T")[0];
  };

  const [date, setDate] = useState(initialData?.date || getLastMonthDate());
  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  useEffect(() => {
    const initialAttendance = {};
    if (initialData?.data?.length) {
      initialData.data.forEach((staff) => {
        initialAttendance[staff.staff_name] = {
          staff_id: staff.staff_id,
          status: staff.status || "absent",
          wages: staff.wages || "",
        };
      });
    } else {
      Staff.filter(
        (staff) =>
          Array.isArray(staff.staff_type) &&
          staff.staff_type.includes("கம்பெனி")
      ).forEach((staff) => {
        initialAttendance[staff.Name] = {
          staff_id: staff.id,
          status: "absent",
          wages: "",
        };
      });
    }
    setAttendanceData(initialAttendance);
  }, [Staff, initialData]);

  const handleAttendanceChange = (staffName, type) => {
    setAttendanceData((prev) => ({
      ...prev,
      [staffName]: { ...prev[staffName], status: type },
    }));
  };

  const handleWagesChange = (staffName, value) => {
    setAttendanceData((prev) => ({
      ...prev,
      [staffName]: { ...prev[staffName], wages: value },
    }));
  };

  const handleSubmit = () => {
    const finalData = {
      date,
      data: Object.keys(attendanceData).map((name) => ({
        staff_id: attendanceData[name].staff_id,
        staff_name: name,
        status: attendanceData[name].status,
        wages: attendanceData[name].wages || "0",
      })),
    };

    onSubmit(finalData);
  };

  return (
    <div>
      <ToastContainer />
      <Container fluid>
        <Row>
          <Col lg="4" md="6" xs="12" className="py-3">
            <Calender
              setLabel={setDate}
              calenderlabel="Date"
              initialDate={date}
            />
          </Col>
          <Col xs="12">
            {status === "loading" ? (
              <p>Loading staff...</p>
            ) : (
              <>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Staff Name</th>
                      <th>Present</th>
                      <th>Absent</th>
                      <th>Wages</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(attendanceData).map((name, index) => (
                      <tr key={index}>
                        <td>{name}</td>
                        <td>
                          <BsStopCircleFill
                            size={32}
                            onClick={() =>
                              handleAttendanceChange(name, "present")
                            }
                            style={{
                              color:
                                attendanceData[name].status === "present"
                                  ? "green"
                                  : "gray",
                              cursor: "pointer",
                            }}
                          />
                        </td>
                        <td>
                          <BsStopCircleFill
                            size={32}
                            onClick={() =>
                              handleAttendanceChange(name, "absent")
                            }
                            style={{
                              color:
                                attendanceData[name].status === "absent"
                                  ? "red"
                                  : "gray",
                              cursor: "pointer",
                            }}
                          />
                        </td>
                        <td>
                          <TextInputform
                            value={attendanceData[name].wages || ""}
                            onChange={(e) =>
                              handleWagesChange(name, e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="d-flex justify-content-center mt-3 gap-3">
                  <Button
                    variant="success"
                    className="px-3"
                    onClick={handleSubmit}
                  >
                    {initialData ? "Update" : "Submit"}
                  </Button>
                  <Button variant="danger" onClick={onCancel}>
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CompanyCreation;
