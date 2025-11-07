import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaySetting, updatePaySetting } from "../../slice/paySettingSlice";
import "./Cooly.css";

const PaySetting = () => {
  const dispatch = useDispatch();
  const { paySetting, status, error } = useSelector(
    (state) => state.paySetting
  );

  const [formData, setFormData] = useState({
    id: "",
    pay_setting_cooly_one: "",
    pay_setting_cooly_two: "",
  });

  useEffect(() => {
    dispatch(fetchPaySetting());
  }, [dispatch]);

  useEffect(() => {
    if (paySetting?.length > 0) {
      const setting = paySetting[0];
      setFormData({
        id: setting.id || "",
        pay_setting_cooly_one: setting.pay_setting_cooly_one || "",
        pay_setting_cooly_two: setting.pay_setting_cooly_two || "",
      });
    }
  }, [paySetting]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    const { id, pay_setting_cooly_one, pay_setting_cooly_two } = formData;

    if (!id || !pay_setting_cooly_one || !pay_setting_cooly_two) {
      toast.error("அனைத்து புலங்களையும் நிரப்பவும்!");
      return;
    }

    const updatedData = {
      id,
      pay_setting_cooly_one,
      pay_setting_cooly_two,
    };

    try {
      await dispatch(updatePaySetting(updatedData)).unwrap();
      toast.success("புதுப்பிப்பு வெற்றிகரமாக முடிந்தது!");
    } catch (err) {
      toast.error(
        err || "புதுப்பிப்பு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்."
      );
    }
  };

  return (
    <div id="main" className="cooly-container">
      <Container fluid className="cooly-form-container">
        <Row>
          <Col xs={12} className="py-5">
            <h2 className="text-center">செலுத்து புதுப்பிக்கவும்</h2>
          </Col>
        </Row>

        <Row className="mb-5 justify-content-center">
          <Col md={6} className="mb-3">
            <div className="form-box">
              <Form.Group controlId="pay_setting_cooly_one" className="mb-3">
                <Form.Label>செலுத்து கூலி 1</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="செலுத்து கூலி உள்ளிடவும்"
                  name="pay_setting_cooly_one"
                  value={formData.pay_setting_cooly_one}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </Col>
          <Col md={6} className="mb-3">
            <div className="form-box">
              <Form.Group controlId="pay_setting_cooly_two" className="mb-3">
                <Form.Label>செலுத்து கூலி 2</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="செலுத்து கூலி உள்ளிடவும்"
                  name="pay_setting_cooly_two"
                  value={formData.pay_setting_cooly_two}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </Col>
        </Row>

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

export default PaySetting;
