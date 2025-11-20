import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Button, Form, Table } from "react-bootstrap";
import { FaSearch, FaChartBar, FaFileExcel,FaPrint} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { searchSales, deleteSale } from "../../slice/saleSlice";
import { TextInputform } from "../../components/Forms";
import TableUI from "../../components/TableUI";
import { ActionButton } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { TbCircleLetterI } from "react-icons/tb";
import { HiOutlineDotsVertical } from "react-icons/hi";
import NotifyData from "../../components/NotifyData";

const Sale = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sales, status } = useSelector((state) => state.sale);
  const [searchTerm, setSearchTerm] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [openShareId, setOpenShareId] = useState(null);


  // Fetch initial sales
  useEffect(() => {
    dispatch(searchSales(searchTerm));
  }, [dispatch, searchTerm]);

  // Navigation handlers
  const handleCreate = () => navigate("/sale/create");

  const handleEdit = (sale) => navigate(`/sale/edit/${sale.sale_id}`);

  const handleView = (sale) => navigate(`/sale/view/${sale.sale_id}`);

  const handleDelete = async (saleId) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    try {
      await dispatch(deleteSale(saleId)).unwrap();
      NotifyData("Sale Deleted Successfully", "success");
    } catch {
      NotifyData("Sale Deletion Failed", "error");
    }
  };

  const filteredSales = sales || [];

  // Table configuration
  const SaleHead = [
    "Date",
    "Invoice No",
    "Party Name",
    "Transaction",
    "Payment Type",
    "Amount",
    "Balance",
  ];

  const SaleData =
    filteredSales.length > 0
      ? filteredSales.map((item) => ({
           icon: <TbCircleLetterI />,
         
          values: [
            item.invoice_date || "-",
            item.invoice_no || "-",
            item.name || "-",
            "Sale Invoice",
            item.payment_type || "Cash",
            `₹ ${Number(item.total || 0).toFixed(2)}`,
            "₹ 0",
            <Form.Select size="sm" defaultValue="Paid" key="status">
              <option>Paid</option>
              <option>Unpaid</option>
            </Form.Select>,
            <ActionButton
              options={[
                {
                  label: "View",
                  icon: <TbCircleLetterI />,
                  onClick: () => handleView(item),
                },
                {
                  label: "Edit",
                  icon: <TbCircleLetterI />,
                  onClick: () => handleEdit(item),
                },
                {
                  label: "Delete",
                  icon: <MdOutlineDelete />,
                  onClick: () => handleDelete(item.sale_id),
                },
              ]}
              label={<HiOutlineDotsVertical />}
            />,
          ],
        }))
      : 
      [];
      
      
  return (
    <div id="main">
      <Container fluid className="py-5">
        <Row>
          <Col xl={12}>
            {/* Business Name Row */}
            <div className="d-flex align-items-center">
              <span
                style={{ color: "red", fontWeight: "bold", fontSize: "1.5rem" }}
              >
                •
              </span>
              {isEditing ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginLeft: "8px",
                  }}
                >
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter Business Name"
                    autoFocus
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      padding: "5px 10px",
                      fontSize: "1rem",
                      width: "250px",
                    }}
                    onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
                  />
                  <Button
                    variant="info"
                    onClick={() => setIsEditing(false)}
                    style={{
                      borderRadius: "6px",
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <span
                  className="ms-2 text-muted"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsEditing(true)}
                >
                  {businessName || "Enter Business Name"}
                </span>
              )}
              <div className="ms-auto d-flex align-items-center gap-2">
                <Button
                  variant="danger"
                  style={{
                    fontWeight: 600,
                    borderRadius: "20px",
                    minWidth: "110px",
                  }}
                  onClick={handleCreate}
                >
                  +Add Sale
                </Button>
                <Button
                  variant="success"
                  style={{
                    fontWeight: 600,
                    borderRadius: "20px",
                    minWidth: "110px",
                  }}
                  onClick={() => navigate("/dashboardpurchase")}
                >
                  +Add Purchase
                </Button>
                <Button
                  variant="info"
                  style={{
                    fontWeight: 600,
                    borderRadius: "20px",
                    minWidth: "110px",
                    color: "white",
                  }}
                >
                  +Add More
                </Button>
                <Button
                  variant="light"
                  style={{
                    borderRadius: "50%",
                    padding: "0 10px",
                    minWidth: "20px",
                  }}
                >
                  :
                </Button>
              </div>
            </div>

            {/* Sale Invoices Header */}
            <Row className="sale-invoice-header align-items-center mb-3">
              <Col className="d-flex align-items-center gap-1">
                <h5 className="m-0">Sale Invoices</h5>
              </Col>
            </Row>

            {/* Filters */}
            <Row className="filters align-items-center mb-3">
              <Col lg={3} className="align-self-center">
                <TextInputform
                  PlaceHolder="Search by Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
            </Row>

            {/* Total Sales Amount Card */}
            <Row className="mb-4 sale-amount-card">
              <Col>
                <div className="amount-card">
                  <div className="card-title">Total Sales Amount</div>
                  <div className="total-amount">₹ 1,000</div>
                  <div className="growth-label">
                    100% ↑ <div className="growth-subtext">vs last month</div>
                  </div>
                  <div className="received-balance">
                    Received: <b>₹ 1,000 </b> | Balance: <b>₹ 0</b>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Transactions Header */}
            <Row className="transactions-header align-items-center mb-2">
              <Col>
                <div className="transactions-title">Transactions</div>
              </Col>
              <Col className="d-flex justify-content-end gap-2">
                <Button size="sm" className="icon-btn">
                  <FaSearch />
                </Button>
                <Button size="sm" className="icon-btn">
                  <FaChartBar />
                </Button>
                <Button size="sm" className="icon-btn">
                  <FaFileExcel />
                </Button>
                <Button size="sm" className="icon-btn">
                  <FaPrint />
                </Button>
              </Col>
            </Row>

            {/* Table */}
            <Col lg={12} xs={12}>
              <TableUI
                headers={SaleHead}
                body={SaleData}
                className="table-end"
              />
            </Col>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Sale;
