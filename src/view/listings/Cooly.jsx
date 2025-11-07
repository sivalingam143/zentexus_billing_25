import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchSetting, updateSetting } from "../../slice/SettingSlice";
import "./Cooly.css";

const Cooly = () => {
  const dispatch = useDispatch();
  const { Setting, status, error } = useSelector((state) => state.Setting);

  const [formData, setFormData] = useState({
    id: "",

    sorcha_cooly: "",

    giant_cooly: "",

    thiri_sorcha_cooly: "",

    thiri_giant_cooly: "",
  });

  useEffect(() => {
    dispatch(fetchSetting());
  }, [dispatch]);

  useEffect(() => {
    if (Setting?.length > 0) {
      const setting = Setting[0];
      setFormData({
        id: setting.id || "",

        sorcha_cooly: setting.sorcha_cooly || "",

        giant_cooly: setting.giant_cooly || "",

        thiri_sorcha_cooly: setting.thiri_sorcha_cooly || "",

        thiri_giant_cooly: setting.thiri_giant_cooly || "",
      });
    }
  }, [Setting]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    const {
      id,

      sorcha_cooly,

      giant_cooly,

      thiri_sorcha_cooly,

      thiri_giant_cooly,
    } = formData;

    if (
      !id ||
      !sorcha_cooly ||
      !giant_cooly ||
      !thiri_sorcha_cooly ||
      !thiri_giant_cooly
    ) {
      toast.error("Please fill in all fields!");
      return;
    }

    const updatedData = {
      id,

      sorcha_cooly,

      giant_cooly,

      thiri_sorcha_cooly,

      thiri_giant_cooly,
    };

    try {
      await dispatch(updateSetting(updatedData)).unwrap();
      toast.success("புதுப்பிப்பு வெற்றிகரமாக முடிந்தது!");
    } catch (err) {
      toast.error(
        err || "புதுப்பிப்பு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்."
      );
    }
  };

  return (
    <div id="main" className="cooly-container">
      <Container className="cooly-form-container">
        <Row>
          <Col xs="12" className="py-3">
            <h2 className="text-center">வளையம் குத்து புதுப்பிக்கவும்</h2>
          </Col>
        </Row>

        {/* Top Section: Sorcha (Left) and Giant (Right) */}
        <Row className="mb-4">
          {/* Sorcha Fields - Left */}
          <Col md={6} className="mb-3">
            <div className="form-box">
              <Form.Group controlId="sorcha_cooly" className="mb-3">
                <Form.Label>சோர்சா கூலி</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Sorcha Cooly Rate"
                  name="sorcha_cooly"
                  value={formData.sorcha_cooly}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </Col>

          {/* Giant Fields - Right */}
          <Col md={6} className="mb-3">
            <div className="form-box">
              <Form.Group controlId="giant_cooly" className="mb-3">
                <Form.Label>ஜெயிண்ட் கூலி</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Giant Cooly Rate"
                  name="giant_cooly"
                  value={formData.giant_cooly}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </Col>
        </Row>

        {/* Bottom Section: Thiri Sorcha and Thiri Giant in Separate Boxes */}
        <Row className="mb-4">
          {/* Thiri Sorcha Box */}
          <Col md={6} className="mb-3">
            <div className="form-box">
              <Form.Group controlId="thiri_sorcha_cooly" className="mb-3">
                <Form.Label>திரி சோர்சா கூலி</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Thiri Sorcha Cooly Rate"
                  name="thiri_sorcha_cooly"
                  value={formData.thiri_sorcha_cooly}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </Col>

          {/* Thiri Giant Box */}
          <Col md={6} className="mb-3">
            <div className="form-box">
              <Form.Group controlId="thiri_giant_cooly" className="mb-3">
                <Form.Label>திரி ஜெயிண்ட் கூலி</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Thiri Giant Cooly Rate"
                  name="thiri_giant_cooly"
                  value={formData.thiri_giant_cooly}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </Col>
        </Row>

        {/* Update Button - Bottom Center */}
        <Row>
          <Col className="text-center py-1">
            <Button
              variant="secondary"
              onClick={handleUpdate}
              disabled={status === "loading"}
              className="update-button"
            >
              {status === "loading" ? "புதுப்பிக்கிறது..." : "புதுப்பி"}
            </Button>
          </Col>
        </Row>
      </Container>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={true}
        closeButton={false}
        newestOnTop={true}
      />
    </div>
  );
};

export default Cooly;
