import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaSearch, FaChartBar, FaFileExcel, FaPrint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { searchSales, deleteSale } from "../../slice/saleSlice";
import { TextInputform } from "../../components/Forms";
import TableUI from "../../components/TableUI";
import { ActionButton } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { TbCircleLetterI } from "react-icons/tb";
import { HiOutlineDotsVertical } from "react-icons/hi";
import NotifyData from "../../components/NotifyData";
import { FiPrinter, FiShare2 } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { MdSms } from "react-icons/md";

const Sale = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sales = [] } = useSelector((state) => state.sale);

  const [searchTerm, setSearchTerm] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [openShareId, setOpenShareId] = useState(null);

  // Fetch sales on search change
  useEffect(() => {
    dispatch(searchSales(searchTerm));
  }, [dispatch, searchTerm]);

  // Calculate totals using real DB values
  const totals = useMemo(() => {
    const totalSales = sales.reduce((sum, s) => sum + Number(s.total || 0), 0);
    const totalReceived = sales.reduce((sum, s) => sum + Number(s.received_amount || 0), 0);
    const totalBalance = sales.reduce((sum, s) => sum + Number(s.balance_due || 0), 0);

    return {
      totalSales: totalSales.toFixed(2),
      totalReceived: totalReceived.toFixed(2),
      totalBalance: totalBalance.toFixed(2),
    };
  }, [sales]);

  // Navigation
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

  // Table headers
  const SaleHead = [
    "Date",
    "Invoice No",
    "Party Name",
    "Transaction",
    "Payment Type",
    "Amount",
    "Balance",
    // "Actions",
  ];
  

  // THIS IS THE FIXED SaleData – NO ERRORS!
  const SaleData = sales.length > 0
    ? sales.map((item) => {
        const total = Number(item.total || 0).toFixed(2);
        const balance = Number(item.balance_due || 0).toFixed(2); // From DB!

        const balanceDisplay = balance > 0 ? (
          <span style={{ color: "#d63031", fontWeight: "bold" }}>₹ {balance}</span>
        ) : (
          <span style={{ color: "#27ae60" }}>₹ 0.00</span>
        );

        return {
          icon: <TbCircleLetterI />,
          values: [
            item.invoice_date || "-",
            item.invoice_no || "-",
            item.name || "-",
            "Sale Invoice",
            item.payment_type || "Cash",
            `₹ ${total}`,
            balanceDisplay,

            // Actions Column
            <div
              key={item.sale_id}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <FiPrinter size={20} style={{ cursor: "pointer" }} onClick={() => window.print()} />

              <FiShare2
                size={20}
                style={{ cursor: "pointer" }}
                onClick={() => setOpenShareId(openShareId === item.sale_id ? null : item.sale_id)}
              />

              {openShareId === item.sale_id && (
                <div
                  style={{
                    position: "absolute",
                    top: "30px",
                    left: "0",
                    display: "flex",
                    gap: "12px",
                    padding: "10px",
                    background: "white",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    zIndex: 999,
                  }}
                >
                  <FaWhatsapp
                    size={24}
                    color="green"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      window.open(
                        `https://wa.me/?text=Invoice ${item.invoice_no}%0ATotal: ₹${total}%0ABalance Due: ₹${balance}`,
                        "_blank"
                      )
                    }
                  />
                  <SiGmail
                    size={24}
                    color="#D44638"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      (window.location.href = `mailto:?subject=Invoice ${item.invoice_no}&body=Total: ₹${total}%0ABalance Due: ₹${balance}`)
                    }
                  />
                  <MdSms
                    size={26}
                    color="#1E90FF"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      (window.location.href = `sms:?body=Invoice ${item.invoice_no}%0ATotal: ₹${total}, Balance: ₹${balance}`)
                    }
                  />
                </div>
              )}

              <ActionButton
                options={[
                  { label: "View", icon: <TbCircleLetterI />, onClick: () => handleView(item) },
                  { label: "Edit", icon: <TbCircleLetterI />, onClick: () => handleEdit(item) },
                  { label: "Delete", icon: <MdOutlineDelete />, onClick: () => handleDelete(item.sale_id) },
                ]}
                label={<HiOutlineDotsVertical />}
              />
            </div>,
          ],
        };
      })
    : [];

  return (
    <div id="main">
      <Container fluid className="py-5">
        <Row>
          <Col xl={12}>
            {/* Business Name */}
            <div className="d-flex align-items-center">
              <span style={{ color: "red", fontWeight: "bold", fontSize: "1.5rem" }}>•</span>
              {isEditing ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "8px" }}>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter Business Name"
                    autoFocus
                    style={{ border: "1px solid #ccc", borderRadius: "6px", padding: "5px 10px", fontSize: "1rem", width: "250px" }}
                    onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
                  />
                  <Button variant="info" onClick={() => setIsEditing(false)}>
                    Save
                  </Button>
                </div>
              ) : (
                <span className="ms-2 text-muted" style={{ cursor: "pointer" }} onClick={() => setIsEditing(true)}>
                  {businessName || "Enter Business Name"}
                </span>
              )}
              <div className="ms-auto d-flex align-items-center gap-2">
                <Button variant="danger" onClick={handleCreate}>+Add Sale</Button>
                <Button variant="success" onClick={() => navigate("/dashboardpurchase")}>+Add Purchase</Button>
                <Button variant="info">+Add More</Button>
                <Button variant="light">:</Button>
              </div>
            </div>

            {/* Header */}
            <Row className="sale-invoice-header align-items-center mb-3">
              <Col><h5 className="m-0">Sale Invoices</h5></Col>
            </Row>

            {/* Search */}
            <Row className="mb-3">
              <Col lg={3}>
                <TextInputform
                  PlaceHolder="Search by Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
            </Row>

            {/* Totals Card */}
            <Row className="mb-4">
              <Col>
                <div className="p-4 rounded-4 text-gray shadow-sm">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-2 opacity-80">Total Sales Amount</h6>
                      <h2 className="mb-1 fw-bold">₹ {totals.totalSales}</h2>
                      <small className="opacity-75"><span style={{ color: "#45eb45ff" }}>100% up</span> vs last month</small>
                      <div className="mt-3 opacity-90">
                        Received: <strong>₹ {totals.totalReceived}</strong> | Balance: <strong>₹ {totals.totalBalance}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Table */}
            <Col lg={12} xs={12}>
              <TableUI headers={SaleHead} body={SaleData} className="table-end" />
            </Col>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Sale;