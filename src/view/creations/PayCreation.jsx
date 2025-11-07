import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { TextInputform, DropDown } from "../../components/Forms";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaff } from "../../slice/StaffSlice";
import { fetchPaySetting } from "../../slice/paySettingSlice";

const PayCreation = ({ schema, formData, setFormData }) => {
  const dispatch = useDispatch();
  const { Staff } = useSelector((state) => state.Staff);
  const { paySetting } = useSelector((state) => state.paySetting);

  // Extract pay settings (assuming paySetting is an array with one object)
  const paySettingData = paySetting?.[0] || {};
  const payCoolyOptions = [
    {
      label: `கூலி 1 - ${paySettingData.pay_setting_cooly_one || "0"}`,
      value: paySettingData.pay_setting_cooly_one || "0",
    },
    {
      label: `கூலி 2 - ${paySettingData.pay_setting_cooly_two || "0"}`,
      value: paySettingData.pay_setting_cooly_two || "0",
    },
  ];

  useEffect(() => {
    dispatch(fetchStaff());
    dispatch(fetchPaySetting());
  }, [dispatch]);

  // Set default product with pay_setting_cooly_one as initial per_cooly_rate
  useEffect(() => {
    if (!formData.products && paySettingData.pay_setting_cooly_one) {
      setFormData((prev) => ({
        ...prev,
        products: [
          {
            product_name: "செலுத்து எடை",
            count: "",
            per_cooly_rate: paySettingData.pay_setting_cooly_one, // Default to pay_setting_cooly_one
            total: "",
          },
        ],
      }));
    }
  }, [paySettingData, formData, setFormData]);

  const staffOptions = Staff.filter(
    (staffMember) =>
      Array.isArray(staffMember.staff_type) &&
      staffMember.staff_type.includes("செலுத்து")
  ).map((staffMember) => ({
    label: staffMember.Name,
    value: staffMember.id,
  }));

  const defaultStaffId =
    Staff.find((staffMember) => staffMember.Name === formData.staff_name)?.id ||
    "";

  const handleInputChange = (e, fieldName) => {
    const inputValue = e.target.value;

    if (fieldName === "staff_name") {
      const selectedStaff = Staff.find(
        (staffMember) => staffMember.id === parseInt(inputValue)
      );
      if (selectedStaff) {
        setFormData((prevData) => ({
          ...prevData,
          staff_name: selectedStaff.Name || "",
          staff_id: selectedStaff.id || "",
        }));
      }
      return;
    }

    if (fieldName === "per_cooly_rate") {
      setFormData((prev) => {
        const updatedProducts = [...(prev.products || [])];
        updatedProducts[0] = {
          ...updatedProducts[0],
          product_name: updatedProducts[0]?.product_name || "செலுத்து எடை",
          per_cooly_rate: inputValue,
        };

        const count = parseFloat(updatedProducts[0].count || 0);
        const perCoolyRate = parseFloat(inputValue || 0);
        updatedProducts[0].total = count * perCoolyRate || 0;

        return {
          ...prev,
          products: updatedProducts,
          total: updatedProducts[0].total,
        };
      });
      return;
    }

    if (fieldName === "count") {
      setFormData((prev) => {
        const updatedProducts = [...(prev.products || [])];
        updatedProducts[0] = {
          ...updatedProducts[0],
          product_name: updatedProducts[0]?.product_name || "செலுத்து எடை",
          count: inputValue,
        };

        const count = parseFloat(inputValue || 0);
        const perCoolyRate = parseFloat(updatedProducts[0].per_cooly_rate || 0);
        updatedProducts[0].total = count * perCoolyRate || 0;

        return {
          ...prev,
          products: updatedProducts,
          total: updatedProducts[0].total,
        };
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: inputValue,
    }));
  };

  return (
    <div>
      <Container>
        <Row>
          {schema.map((field, index) => (
            <Col xs="12" className="py-3" key={index}>
              {field.name === "staff_name" ? (
                <DropDown
                  textlabel={field.label}
                  options={staffOptions}
                  value={formData.staff_id || defaultStaffId}
                  onChange={(e) => handleInputChange(e, "staff_name")}
                />
              ) : field.name === "total" ? (
                <TextInputform
                  formLabel={field.label}
                  formtype={field.type || "text"}
                  value={formData.products?.[0]?.total || formData.total || ""}
                  onChange={(e) => handleInputChange(e, field.name)}
                  disabled
                />
              ) : field.name === "per_cooly_rate" ? (
                <DropDown
                  textlabel={field.label}
                  options={payCoolyOptions}
                  value={
                    formData.products?.[0]?.per_cooly_rate ||
                    payCoolyOptions[0]?.value ||
                    ""
                  }
                  onChange={(e) => handleInputChange(e, "per_cooly_rate")}
                />
              ) : field.name === "count" ? (
                <TextInputform
                  formLabel={field.label}
                  formtype={field.type || "text"}
                  value={formData.products?.[0]?.count || ""}
                  onChange={(e) => handleInputChange(e, "count")}
                />
              ) : (
                <TextInputform
                  formLabel={field.label}
                  formtype={field.type || "text"}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(e, field.name)}
                />
              )}
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default PayCreation;
