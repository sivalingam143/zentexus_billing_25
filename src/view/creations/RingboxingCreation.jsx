import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { TextInputform, DropDown } from "../../components/Forms";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaff } from "../../slice/StaffSlice";
import { fetchSetting } from "../../slice/SettingSlice";
import { Buttons } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";

const RingboxingCreation = ({ schema, formData, setFormData }) => {
  const dispatch = useDispatch();
  const { Staff } = useSelector((state) => state.Staff);
  const { Setting } = useSelector((state) => state.Setting);

  const [currentProduct, setCurrentProduct] = useState({
    product_name: "",
    count: "",
    per_cooly_rate: "",
    total: "",
  });

  useEffect(() => {
    dispatch(fetchStaff());
    dispatch(fetchSetting());
  }, [dispatch]);

  const staffOptions = Staff.filter(
    (staffMember) =>
      Array.isArray(staffMember.staff_type) &&
      staffMember.staff_type.includes("வளையம் குத்து")
  ).map((staffMember) => ({
    label: staffMember.Name,
    value: staffMember.id,
  }));

  const coolyOptions =
    Setting.length > 0
      ? [
          { label: "சோர்ச்சா", value: Setting[0].sorcha_cooly },
          { label: "ஜயன்ட்", value: Setting[0].giant_cooly },
          { label: "திரி சோர்ச்சா", value: Setting[0].thiri_sorcha_cooly },
          { label: "திரி ஜயன்ட்", value: Setting[0].thiri_giant_cooly },
        ]
      : [];

  const handleInputChange = (e, fieldName) => {
    const value = e.target.value;
    setCurrentProduct((prev) => {
      const updatedProduct = { ...prev, [fieldName]: value };

      if (fieldName === "product_name") {
        const selectedCooly = coolyOptions.find(
          (option) => option.value === value
        );
        updatedProduct.product_name = selectedCooly ? selectedCooly.label : "";
        updatedProduct.per_cooly_rate = selectedCooly
          ? selectedCooly.value
          : "";
      }

      if (fieldName === "count" || fieldName === "per_cooly_rate") {
        const count = parseFloat(updatedProduct.count || 0);
        const perCoolyRate = parseFloat(updatedProduct.per_cooly_rate || 0);
        updatedProduct.total = count * perCoolyRate || "";
      }

      return updatedProduct;
    });
  };

  const handleFormChange = (e, fieldName) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleAddProduct = () => {
    if (!currentProduct.product_name || !currentProduct.count) {
      alert("Please fill in product name and count.");
      return;
    }

    setFormData((prev) => {
      const updatedProducts = [...(prev.products || []), { ...currentProduct }];
      const grandTotal = updatedProducts.reduce(
        (sum, p) => sum + parseFloat(p.total || 0),
        0
      );
      return {
        ...prev,
        products: updatedProducts,
        total: grandTotal || "",
      };
    });
    setCurrentProduct({
      product_name: "",
      count: "",
      per_cooly_rate: "",
      total: "",
    });
  };

  const handleDeleteProduct = (index) => {
    setFormData((prev) => {
      const updatedProducts = (prev.products || []).filter(
        (_, i) => i !== index
      );
      const grandTotal = updatedProducts.reduce(
        (sum, p) => sum + parseFloat(p.total || 0),
        0
      );
      return {
        ...prev,
        products: updatedProducts,
        total: grandTotal || "",
      };
    });
  };

  return (
    <Container>
      <Row>
        {schema.map((field, index) => (
          <Col lg="12" className="py-3" key={index}>
            {field.name === "staff_id" ? (
              <DropDown
                textlabel={field.label}
                options={staffOptions}
                value={formData[field.name] || ""}
                onChange={(e) => handleFormChange(e, field.name)}
              />
            ) : field.name === "products" ? (
              <div>
                <Row>
                  <Col md={12} className="py-3">
                    <DropDown
                      textlabel="பொருளின் பெயர்"
                      options={coolyOptions}
                      value={currentProduct.per_cooly_rate || ""}
                      onChange={(e) => handleInputChange(e, "product_name")}
                    />
                  </Col>
                  <Col md={12} className="py-3">
                    <TextInputform
                      formLabel="எண்ணிக்கை"
                      formtype="text"
                      value={currentProduct.count || ""}
                      onChange={(e) => handleInputChange(e, "count")}
                    />
                  </Col>
                  <Col md={12} className="py-3">
                    <TextInputform
                      formLabel="கூலி விகிதம்"
                      formtype="text"
                      value={currentProduct.per_cooly_rate || ""}
                      onChange={(e) => handleInputChange(e, "per_cooly_rate")}
                      disabled
                    />
                  </Col>
                  <Col md={12} className="py-3">
                    <TextInputform
                      formLabel="மொத்தம்"
                      formtype="text"
                      value={currentProduct.total || ""}
                      disabled
                    />
                  </Col>
                  <Col md={4} className="d-flex align-items-end py-3">
                    <Buttons
                      btnlabel="Add Product"
                      onClick={handleAddProduct}
                      className="mt-2 w-100 add-btn"
                    />
                  </Col>
                </Row>
                {formData.products?.length > 0 && (
                  <div className="mt-3">
                    <h6 className="text-secondary">Added Products:</h6>
                    <ul>
                      {formData.products.map((p, idx) => (
                        <li
                          key={idx}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <span>
                            {p.product_name} - Count: {p.count}, Rate:{" "}
                            {p.per_cooly_rate}, Total: {p.total}
                          </span>
                          <MdOutlineDelete
                            className="text-danger"
                            style={{ cursor: "pointer", fontSize: "1.2rem" }}
                            onClick={() => handleDeleteProduct(idx)}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <TextInputform
                formLabel={field.label}
                formtype={field.type || "text"}
                value={formData[field.name] || ""}
                onChange={(e) => handleFormChange(e, field.name)}
              />
            )}
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RingboxingCreation;
