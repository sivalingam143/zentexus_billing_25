import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import TableUI from "../../components/TableUI";
import { ActionButton, Buttons } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import {
  fetchProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../slice/ProductSlice";
import { HiOutlineDotsVertical } from "react-icons/hi";
import CustomModal from "../../components/Modal";
import NotifyData from "../../components/NotifyData";
import PageTitle from "../../components/PageTitle";
import ProductCreation from "../creations/ProductCreation";
import { ToastContainer } from "react-toastify"; // Add ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import CSS

const Products = () => {
  const dispatch = useDispatch();
  const { Product, status, error } = useSelector((state) => state.Product);

  const productSchema = [
    {
      name: "product_name",
      label: "பொருள்களின் பெயர்கள் ",
      type: "text",
      required: true,
    },
    {
      name: "Knitting_wage",
      label: "பின்னல் கூலி",
      type: "text",
      required: true,
    },
    {
      name: "deluxe_Knitting_wage",
      label: "டீலக்ஸ் பின்னல் கூலி",
      type: "text",
      required: true,
    },

    {
      name: "packing_cooly",
      label: "பாக்கெட் கூலி",
      type: "text",
      required: true,
    },
    {
      name: "unit_cooly",
      label: "அலகு கூலி",
      type: "text",
      required: true,
    },
  ];

  const [formData, setFormData] = useState({});
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProduct());
  }, [dispatch]);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleEdit = (product) => {
    setEditMode(true);
    setSelectedProduct(product || {});
    setFormData({
      product_name: product?.product_name || "",
      Knitting_wage: product?.Knitting_wage || "",
      deluxe_Knitting_wage: product?.deluxe_Knitting_wage || "",
      packing_cooly: product?.packing_cooly || "",
      unit_cooly: product?.unit_cooly || "",
    });
    handleOpen();
  };

  const handleCreate = () => {
    setEditMode(false);
    setFormData({
      product_name: "",
      Knitting_wage: "",
      deluxe_Knitting_wage: "",
      packing_cooly: "",
      unit_cooly: "",
    });
    handleOpen();
  };

  const handleSubmit = async () => {
    console.log("Submitting formData:", formData);

    try {
      if (editMode) {
        if (!selectedProduct?.id) {
          NotifyData("Product Update Failed: No product selected", "error");
          return;
        }
        console.log("Updating product:", {
          id: selectedProduct.id,
          ...formData,
        });
        await dispatch(
          updateProduct({ id: selectedProduct.id, ...formData })
        ).unwrap();
        console.log("Update successful");
        NotifyData("Product Updated Successfully", "success");
      } else {
        console.log("Creating product:", formData);
        const addResult = await dispatch(addProduct(formData)).unwrap();
        console.log("Creation successful, result:", addResult);
        NotifyData("Product Created Successfully", "success");
      }
      console.log("Fetching products...");
      await dispatch(fetchProduct()).unwrap();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      NotifyData(
        editMode ? "Product Update Failed" : "Product Creation Failed",
        "error"
      );
    }

    handleClose();
    setFormData({
      product_name: "",
      Knitting_wage: "",
      deluxe_Knitting_wage: "",
      packing_cooly: "",
      unit_cooly: "",
    });
    setEditMode(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id)).unwrap();
    NotifyData("Product Deleted Successfully", "success");
    dispatch(fetchProduct());
  };

  const filteredProduct =
    Product?.filter(
      (p) =>
        typeof p?.product_name === "string" &&
        p.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const ProductHead = ["No", "Product Name"];
  const ProductData =
    filteredProduct?.length > 0
      ? filteredProduct.map((p, index) => ({
          values: [
            index + 1,
            p.product_name,
            <ActionButton
              options={[
                {
                  label: "Edit",
                  icon: <LiaEditSolid />,
                  onClick: () => handleEdit(p),
                },
                {
                  label: "Delete",
                  icon: <MdOutlineDelete />,
                  onClick: () => handleDelete(p.id),
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
            <PageTitle PageTitle="பொருள்கள்" showButton={false} />
          </Col>
          <Col xs="6" className="py-3 text-end">
            <Buttons
              btnlabel="Add New"
              className="submit-btn"
              onClick={handleCreate}
            />
          </Col>
          <Col xs="12" className="py-3">
            <TableUI headers={ProductHead} body={ProductData} />
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={show}
        setShow={setShow}
        pageTitle={
          editMode ? (
            <>பொருள்களின் விவரங்களை திருத்து</>
          ) : (
            <>பொருள்களின் விவரங்களை உருவாக்கு</>
          )
        }
        showButton={true}
        submitButton={true}
        submitLabel={editMode ? <>Update</> : <>Submit</>}
        CancelLabel="Cancel"
        BodyComponent={
          <ProductCreation
            formData={formData}
            setFormData={setFormData}
            schema={productSchema}
          />
        }
        OnClick={handleSubmit}
        Size="md"
        handleOpen={handleOpen}
        handleClose={handleClose}
      />
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

export default Products;
