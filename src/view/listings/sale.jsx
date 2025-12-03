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
import { FaWhatsapp,FaChevronDown,FaRegCalendarAlt } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { MdSms } from "react-icons/md";


const Sale = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sales = [] } = useSelector((state) => state.sale);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [openShareId, setOpenShareId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Fetch sales on search change
  useEffect(() => {
    dispatch(searchSales(searchTerm));
  }, [dispatch, searchTerm]);

  // Add this function inside your Sale component, before statusDisplay
const getStatusFromData = (item) => {
  const balance = Number(item.balance_due || 0);
  const received = Number(item.received_amount || 0);
  const isCancelled = !!item.is_cancelled;

  if (isCancelled) return "Cancelled";
  if (balance === 0) return "Paid";
  if (received === 0 && balance > 0) return "Unpaid";
  if (received > 0 && balance > 0) return "Partially Paid";
  return "Unpaid";
};

const filteredSales = useMemo(() => {
  if (statusFilter === "All") return sales;
  return sales.filter(item => item.status === statusFilter);
}, [sales, statusFilter]);

  // Calculate totals using real DB values
  const totals = useMemo(() => {
  const totalSales = sales.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);
  const totalReceived = sales.reduce((sum, s) => sum + parseFloat(s.received_amount || 0), 0);
  const totalBalance = sales.reduce((sum, s) => sum + parseFloat(s.balance_due || 0), 0);

  return {
    totalSales: totalSales.toFixed(2),
    totalReceived: totalReceived.toFixed(2),
    totalBalance: totalBalance.toFixed(2),
  };
}, [sales]);
const statusDisplay = (item) => {
  const status = item.status || "Unpaid";
  const colorMap = {
    Paid: "#27ae60",
    Unpaid: "#e74c3c",
    "Partially Paid": "#f39c12",
    Cancelled: "#0be0f0ff"
  };
  return <span style={{ color: colorMap[status], fontWeight: "600" }}>{status}</span>;
};

  // Navigation
  const handleCreate = () => navigate("/sale/create");
  const handleEdit = (sale) => navigate(`/sale/edit/${sale.sale_id}`);
  const handleView = (sale) => navigate(`/sale/view/${sale.sale_id}`);
  const [selectedPeriod, setSelectedPeriod] = useState("This Year");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState("All Firms");
  const [firmOpen, setFirmOpen] = useState(false);

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
  
    // Status Dropdown
        <div key="status" style={{ position: "relative", display: "inline-block" }} onClick={(e) => e.stopPropagation()}>
          <span
            style={{ cursor: "pointer", fontWeight: "bold", color: "#212529" }}
            onClick={(e) => {
              const dropdown = e.currentTarget.nextElementSibling;
              dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
            }}
          >
            Status<FaChevronDown style={{ marginLeft: "8px", fontSize: "16px", color: "#212529" }} />
          </span>
    
          <div style={{
            display: "none",
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "10px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            zIndex: 9999,
            minWidth: "160px",
            marginTop: "8px",
            overflow: "hidden"
          }}>
            {["All", "Paid", "Unpaid", "Partially Paid", "Cancelled"].map((status) => (
              <div
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: "12px 18px",
                  cursor: "pointer",
                  backgroundColor: statusFilter === status ? "#3498db" : "white",
                  color: statusFilter === status ? "white" : "#2c3e50",
                  fontWeight: statusFilter === status ? "bold" : "500",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => statusFilter !== status && (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                onMouseLeave={(e) => statusFilter !== status && (e.currentTarget.style.backgroundColor = "white")}
              >
                {status}
              </div>
            ))}
          </div>
        </div>,
  ];
  // Close dropdown on outside click
    useEffect(() => {
      const close = () => {
        document.querySelectorAll('div[style*="z-index: 9999"]').forEach(d => d.style.display = "none");
      };
      document.addEventListener("click", close);
      return () => document.removeEventListener("click", close);
    }, []);

  
const SaleData = filteredSales.length > 0
  ? filteredSales.map((item) => {
      const total = Number(item.total || 0).toFixed(2);
      const balance = Number(item.balance_due || 0).toFixed(2);

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
            "Sales",
            item.payment_type || "Cash",
            `₹ ${total}`,
            balanceDisplay,
            statusDisplay(item),

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
    <div id="main"  style={{backgroundColor:"#DEE2E6",minHeight: "100vh"}}>
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
                <Button variant="success" onClick={() => navigate("/PurchaseModalCreation")}>+Add Purchase</Button>
                <Button variant="info">+Add More</Button>
                <Button variant="light">:</Button>
              </div>
            </div>

            {/* Header */}
            <Row className="align-items-center mb-3">
  <Col>
    <h5
      style={{ cursor: "pointer" }}
      onClick={() => setOpen(!open)}
    >
      Sale Invoices <FaChevronDown />
    </h5>

    {open && (
      <div
        style={{
          position: "absolute",
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "6px",
          padding: "5px 0",
          width: "180px",
          zIndex: 999,
        }}
      >
        {["Sale Invoices", "Estimate/Quotation", "Proforma Invoice", "Payment-In", "sale Order","Delivery Challan","sale Return","Purchase Bill","Payment-Out","Expenses","Purchase Order","Purchase Return"].map((x) => (
          <div
            key={x}
            onClick={() => setOpen(false)}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            {x}
          </div>
        ))}
      </div>
    )}
  </Col>
</Row>

<Row className="mb-3">
  <Col lg={12} className=" p-3 pb-3 d-flex align-items-center flex-wrap gap-3 bg-white rounded shadow-sm border ">
  
    <span className="text-muted fw-medium">Filter by :</span>

    {/* This Year - Working Dropdown */}
    <div className="position-relative">
      <button
        onClick={() => setPeriodOpen(!periodOpen)}
        className="btn rounded-pill border-0 shadow-sm d-flex align-items-center gap-2"
        style={{
          backgroundColor: "#e3f2fd",
          color: "#1565c0",
          fontWeight: "500",
          padding: "8px 20px",
        }}
      >
        {selectedPeriod} <FaChevronDown className={`transition-transform ${periodOpen ? 'rotate-180' : ''}`} size={12} />
      </button>

      {periodOpen && (
        <div className="position-absolute top-100 start-0 mt-2 bg-white rounded-3 shadow-lg border" style={{ zIndex: 1000, minWidth: "200px" }}>
          {["Today", "Yesterday", "This Week", "This Month", "This Year", "Last Year", "Custom Range"].map((item) => (
            <div
              key={item}
              onClick={() => {
                setSelectedPeriod(item);
                setPeriodOpen(false);
                // Later: filter data here
              }}
              className="px-4 py-2 hover-bg-light cursor-pointer"
              style={{ cursor: "pointer" }}
            >
              {item === "This Year" && <strong>{item}</strong>}
              {item !== "This Year" && item}
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Date Range with Calendar Icon */}
    <div
      className="d-flex align-items-center gap-3 px-4 py-2 rounded-pill shadow-sm"
      style={{
        backgroundColor: "#e3f2fd",
        color: "#1565c0",
        fontWeight: "500",
      }}
    >
      01/01/2025 <span className="text-muted">To</span> 31/12/2025
    </div>

    {/* All Firms - Working Dropdown */}
    <div className="position-relative">
      <button
        onClick={() => setFirmOpen(!firmOpen)}
        className="btn rounded-pill border-0 shadow-sm d-flex align-items-center gap-2"
        style={{
          backgroundColor: "#e3f2fd",
          color: "#1565c0",
          fontWeight: "500",
          padding: "8px 24px",
        }}
      >
        {selectedFirm} <FaChevronDown className={`transition-transform ${firmOpen ? 'rotate-180' : ''}`} size={12} />
      </button>

      {firmOpen && (
        <div className="position-absolute top-100 start-0 mt-2 bg-white rounded-3 shadow-lg border" style={{ zIndex: 1000, minWidth: "220px" }}>
          {["All Firms", "My Company Pvt Ltd", "ABC Traders", "XYZ Enterprises", "Global Exports"].map((firm) => (
            <div
              key={firm}
              onClick={() => {
                setSelectedFirm(firm);
                setFirmOpen(false);
              }}
              className="px-4 py-2 hover-bg-light cursor-pointer"
              style={{ cursor: "pointer" }}
            >
              {firm === "All Firms" ? <strong>{firm}</strong> : firm}
            </div>
          ))}
        </div>
      )}
    </div>
  </Col>
</Row>

            {/* Search */}
            {/* <Row className="mb-3">
              <Col lg={3}>
                <TextInputform
                  PlaceHolder="Search by Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
            </Row> */}

            {/* Totals Card */}
             <Row className="mb-3">
                          <Col>
                            <div className="p-3 bg-white rounded shadow-sm border" style={{ width: "500px" }} >
                              <h5>Total Sales: <strong style={{ fontSize: "1.8rem" }}>₹ {totals.totalSales}</strong></h5>
                              <small className="opacity-75"><span style={{ color: "#45eb45ff" }}>100% up</span> vs last month</small>
                              <div className="text-muted mt-2">
                                Received: <strong>₹ {totals.totalReceived}</strong> | 
                                Balance Due: <strong style={{ color: "#e74c3c" }}>₹ {totals.totalBalance}</strong>
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

