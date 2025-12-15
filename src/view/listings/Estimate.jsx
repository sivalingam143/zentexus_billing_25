
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { FaSearch, FaChartBar, FaFileExcel, FaPrint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { searchEstimates, deleteEstimate } from "../../slice/estimateSlice";
import { TextInputform } from "../../components/Forms";
import TableUI from "../../components/TableUI";
import { ActionButton } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { TbCircleLetterI } from "react-icons/tb";
import { HiOutlineDotsVertical } from "react-icons/hi";
import NotifyData from "../../components/NotifyData";
import { FiPrinter, FiShare2 } from "react-icons/fi";
import { FaWhatsapp, FaChevronDown, FaRegCalendarAlt } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { MdSms } from "react-icons/md";
import { Form, InputGroup } from "react-bootstrap";
// IMPORT THE ESTIMATE CREATION COMPONENT
import EstimateCreation from "../creation/EstimateCreationModal";

// ADD THIS IMPORT - date-fns for filtering
import {
  isToday,
  isYesterday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
  parseISO,
} from "date-fns";

const Estimate = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // FIXED: Changed from sales to estimates
  const { estimates = [] } = useSelector((state) => state.estimate);
  
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [openShareId, setOpenShareId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");
  
  // Date filter states
  const [selectedPeriod, setSelectedPeriod] = useState("This Year");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState("All Firms");
  const [firmOpen, setFirmOpen] = useState(false);

  // Fetch estimates on search change
  useEffect(() => {
    dispatch(searchEstimates(searchTerm));
  }, [dispatch, searchTerm]);

  // Get status from data (for status filter) - FIXED for estimates
  const getStatusFromData = (item) => {
    // Use the status from database if available
    if (item.status) {
      return item.status;
    }
    
    // Fallback calculation if status is not in data
    const balance = Number(item.balance_due || 0);
    const received = Number(item.received_amount || 0);
    const isCancelled = item.delete_at === 1; // Changed from is_cancelled

    if (isCancelled) return "Cancelled";
    if (balance === 0) return "Paid";
    if (received === 0 && balance > 0) return "Unpaid";
    if (received > 0 && balance > 0) return "Partially Paid";
    return "Unpaid";
  };

  // MAIN FILTERING LOGIC - Status + Date Period
  const filteredEstimates = useMemo(() => {
    if (!estimates || !Array.isArray(estimates)) return [];
    
    let filtered = [...estimates];

    // Apply Status Filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((item) => getStatusFromData(item) === statusFilter);
    }

    // Apply Date Period Filter
    if (selectedPeriod === "All Time" || !selectedPeriod) return filtered;

    return filtered.filter((item) => {
      if (!item.estimate_date) return false;
      try {
        const estimateDate = parseISO(item.estimate_date);
        const now = new Date();

        switch (selectedPeriod) {
          case "Today":
            return isToday(estimateDate);
          case "Yesterday":
            return isYesterday(estimateDate);
          case "This Week":
            return isWithinInterval(estimateDate, {
              start: startOfWeek(now),
              end: endOfWeek(now),
            });
          case "This Month":
            return isWithinInterval(estimateDate, {
              start: startOfMonth(now),
              end: endOfMonth(now),
            });
          case "This Year":
            return isWithinInterval(estimateDate, {
              start: startOfYear(now),
              end: endOfYear(now),
            });
          case "Last Year":
            const lastYear = new Date(now.getFullYear() - 1, 0, 1);
            return isWithinInterval(estimateDate, {
              start: startOfYear(lastYear),
              end: endOfYear(lastYear),
            });
          default:
            return true;
        }
      } catch (error) {
        console.error("Error parsing date:", error);
        return false;
      }
    });
  }, [estimates, statusFilter, selectedPeriod]);

  // Calculate totals from FILTERED data - FIXED
const totals = useMemo(() => {
  if (!filteredEstimates || !Array.isArray(filteredEstimates)) {
    return { /* default */ };
  }

  const totalQuotations = filteredEstimates.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);
  const totalReceived = filteredEstimates.reduce((sum, s) => sum + parseFloat(s.received_amount || 0), 0);
  const totalBalance = filteredEstimates.reduce((sum, s) => sum + parseFloat(s.balance_due || 0), 0);

 
  const convertedEstimates = filteredEstimates.filter(item => 
    item.converted_to_sale === 1 || item.converted_to_sale === "1"
  );

  const openEstimates = filteredEstimates.filter(item => 
    (item.converted_to_sale !== 1 && item.converted_to_sale !== "1") &&
    getStatusFromData(item) !== "Cancelled"
  );

  const totalConverted = convertedEstimates.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);
  const totalOpen = openEstimates.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);

  return {
    totalQuotations: totalQuotations.toFixed(2),
    totalReceived: totalReceived.toFixed(2),
    totalBalance: totalBalance.toFixed(2),
    totalConverted: totalConverted.toFixed(2),
    totalOpen: totalOpen.toFixed(2),
  };
}, [filteredEstimates]);

  // Calculate percentage change vs last year
  const comparisonTotals = useMemo(() => {
    if (selectedPeriod !== "This Year") return null;
    if (!estimates || !Array.isArray(estimates)) return 0;

    const lastYearStart = new Date(new Date().getFullYear() - 1, 0, 1);
    const lastYearEnd = new Date(new Date().getFullYear() - 1, 11, 31);

    const lastYearEstimates = estimates.filter((item) => {
      if (!item.estimate_date) return false;
      try {
        const date = parseISO(item.estimate_date);
        return date >= lastYearStart && date <= lastYearEnd;
      } catch (error) {
        console.error("Error parsing date for comparison:", error);
        return false;
      }
    });

    return lastYearEstimates.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);
  }, [estimates, selectedPeriod]);

  const percentageChange = comparisonTotals !== null && comparisonTotals > 0
    ? ((parseFloat(totals.totalQuotations) - comparisonTotals) / comparisonTotals) * 100
    : totals.totalQuotations > 0 ? 100 : 0;

  const statusDisplay = (item) => {
    const status = getStatusFromData(item);
    const colorMap = {
      Paid: "#27ae60",
      Unpaid: "#e74c3c",
      "Partially Paid": "#f39c12",
      Cancelled: "#0be0f0ff",
    };
    return <span style={{ color: colorMap[status], fontWeight: "600" }}>{status}</span>;
  };

  // Navigation - FIXED for estimates
  const handleCreate = () => navigate("/estimate/create");
  const handleEdit = (estimate) => navigate(`/estimate/edit/${estimate.estimate_id}`);
  const handleView = (estimate) => navigate(`/estimate/view/${estimate.estimate_id}`);

  const handleDelete = async (estimateId) => {
    if (!window.confirm("Are you sure you want to delete this estimate?")) return;
    try {
      await dispatch(deleteEstimate(estimateId)).unwrap();
      NotifyData("Estimate Deleted Successfully", "success");
    } catch {
      NotifyData("Estimate Deletion Failed", "error");
    }
  };
const handleConvertToSale = (item) => {
  navigate("/sale/create", {
    state: {
      fromEstimate: true,
      estimateData: item,
    },
  });
};

  // Handle Convert to Order
  const handleConvertToOrder = (estimate) => {
    NotifyData(`Converting estimate ${estimate.estimate_no} to order`, "info");
    setOpenShareId(null);
    // Add your conversion logic here
    // Example: navigate(`/order/create?estimateId=${estimate.estimate_id}`);
  };

  // Table headers
  const EstimateHead = [
    "Date",
    "Estimate No",
    "Party Name",
    "Transaction",
    "Payment Type",
    "Amount",
    "Balance",
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
    "Actions",
    " Estimate Status"
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const close = () => {
      document.querySelectorAll('div[style*="z-index: 9999"]').forEach(d => d.style.display = "none");
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  // Prepare table data with useMemo
  const EstimateData = useMemo(() => {
    if (!filteredEstimates || !Array.isArray(filteredEstimates) || filteredEstimates.length === 0) {
      return [];
    }
    
    return filteredEstimates.map((item) => {
      const total = Number(item.total || 0).toFixed(2);
      const balance = Number(item.balance_due || 0).toFixed(2);
      const isConverted = item.converted_to_sale === 1 || item.converted_to_sale === "1";
      const balanceDisplay = balance > 0 ? (
        <span style={{ color: "#d63031", fontWeight: "bold" }}>₹ {balance}</span>
      ) : (
        <span style={{ color: "#27ae60" }}>₹ 0.00</span>
      );

      return {
        icon: <TbCircleLetterI />,
        values: [
          item.estimate_date || "-",
          item.estimate_no || "-",
          item.name || "-",
          "Estimate",
          item.payment_type || "Cash",
          `₹ ${total}`,
          balanceDisplay,
          statusDisplay(item),
          <div
            key={item.estimate_id}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* Convert Dropdown */}
            <div className="position-relative">
              
              <button
  disabled={isConverted}
  className={`btn btn-sm ${isConverted ? 'btn-secondary' : 'btn-primary'} rounded-pill`}
  onClick={() => !isConverted && handleConvertToSale(item)}
>
  {isConverted ? 'Converted' : 'Select'} <FaChevronDown />
</button>

              {openShareId === item.estimate_id && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    marginTop: "5px",
                    background: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    zIndex: 1000,
                    minWidth: "160px",
                    border: "1px solid #dee2e6",
                  }}
                >
                  <div
                    onClick={() => handleConvertToSale(item)}
                    style={{
                      padding: "10px 15px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f1f3f4",
                      color: "#2c3e50",
                      fontWeight: "500",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                  >
                    Convert to Sale
                  </div>
                  <div
                    onClick={() => handleConvertToOrder(item)}
                    style={{
                      padding: "10px 15px",
                      cursor: "pointer",
                      color: "#2c3e50",
                      fontWeight: "500",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                  >
                    Convert to Order
                  </div>
                </div>
              )}
            </div>

            <ActionButton
              options={[
                { label: "View", icon: <TbCircleLetterI />, onClick: () => handleView(item) },
                { label: "Edit", icon: <TbCircleLetterI />, onClick: () => handleEdit(item) },
                { label: "Delete", icon: <MdOutlineDelete />, onClick: () => handleDelete(item.estimate_id) },
              ]}
              label={<HiOutlineDotsVertical />}
            />
          </div>,
        ],
      };
    });
  }, [filteredEstimates, openShareId]);

  return (
    <div id="main" style={{ backgroundColor: "#DEE2E6", minHeight: "100vh" }}>
      <Container fluid className="py-5">
        <Row>
          <Col xl={12}>
            {/* Business Name Header */}
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
                 <Button variant="danger" onClick={() => navigate("/sale/create")}>+Add Sale</Button>
                 <Button variant="success" onClick={handleCreate}>+Add Purchase</Button>
                  <Button variant="info">+Add More</Button>
                  <Button variant="light">:</Button>
              </div>
            </div>
            
            
            {/* Header - Estimate/Quotation Dropdown with Navigation */}
<Row className="align-items-center mb-4">
  <Col>
    <h5 
      style={{ cursor: "pointer" }} 
      onClick={() => setOpen(!open)}
    >
      Estimate / Quotation<FaChevronDown />
    </h5>

    {open && (
      <div style={{
        position: "absolute",
        background: "white",
        border: "1px solid #ddd",
        borderRadius: "6px",
        padding: "5px 0",
        width: "220px",
        zIndex: 999,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}>
        {[
          { label: "Sale Invoices", path: "/sale" },
          { label: "Estimate/Quotation", path: "/estimate" },
          { label: "Proforma Invoice", path: "/proforma" },
          { label: "Payment-In", path: "/payment-in" },
          { label: "sale Order", path: "/sale-order" },
          { label: "Delivery Challan", path: "/delivery-challan" },
          { label: "sale Return", path: "/sale-return" },
          { label: "Purchase Bill", path: "/purchase" },
          { label: "Payment-Out", path: "/payment-out" },
          { label: "Expenses", path: "/expenses" },
          { label: "Purchase Order", path: "/purchase-order" },
          { label: "Purchase Return", path: "/purchase-return" },
        ].map((item) => (
          <div 
            key={item.label}
            onClick={() => {
              setOpen(false);
              if (item.path !== "/estimate") {
                navigate(item.path);  // Navigate to the correct listing page
              }
            }} 
            style={{ 
              padding: "10px 16px", 
              cursor: "pointer",
              fontWeight: item.path === "/estimate" ? "bold" : "normal",
              backgroundColor: item.path === "/estimate" ? "#f0f8ff" : "transparent",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = item.path === "/estimate" ? "#f0f8ff" : "transparent"}
          >
            {item.label}
          </div>
        ))}
      </div>
    )}
  </Col>
  <Col className="text-end">
    <Button
      variant="danger"
      className="btn-sm px-3 py-1 shadow rounded-pill fw-bold"
      style={{ fontSize: "0.85rem" }}
      onClick={() => navigate("/estimate/create")}
    >
      + Add Estimate
    </Button>
  </Col>
</Row>

            {/* Filter Card */}
            <Row className="mb-3">
              <Col lg={12} className="p-3 pb-3 d-flex align-items-center flex-wrap gap-3 bg-white rounded shadow-sm border">
                <span className="text-muted fw-medium">Filter by :</span>

                {/* Period Dropdown */}
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
                      {["All Time", "Today", "Yesterday", "This Week", "This Month", "This Year", "Last Year", "Custom Range"].map((item) => (
                        <div
                          key={item}
                          onClick={() => {
                            setSelectedPeriod(item);
                            setPeriodOpen(false);
                          }}
                          className="px-4 py-2 hover-bg-light cursor-pointer"
                          style={{ cursor: "pointer" }}
                        >
                          {item === selectedPeriod ? <strong>{item}</strong> : item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date Range Display */}
                {/* Custom Date Range Picker */}
<div className="d-flex align-items-center gap-2">
  <InputGroup size="sm" className="w-auto">
    <Form.Control
      type="date"
      value={customFromDate}
      onChange={(e) => setCustomFromDate(e.target.value)}
      className="border-0"
      style={{ backgroundColor: "#e3f2fd", color: "#1565c0", minWidth: "160px" }}
    />
    <InputGroup.Text className="bg-transparent border-0 text-primary">
      
    </InputGroup.Text>
  </InputGroup>

  <span className="text-muted mx-2">To</span>

  <InputGroup size="sm" className="w-auto">
    <Form.Control
      type="date"
      value={customToDate}
      min={customFromDate}
      onChange={(e) => setCustomToDate(e.target.value)}
      className="border-0"
      style={{ backgroundColor: "#e3f2fd", color: "#1565c0", minWidth: "160px" }}
    />
    <InputGroup.Text className="bg-transparent border-0 text-primary">
      
    </InputGroup.Text>
  </InputGroup>

  {(customFromDate || customToDate) && (
    <Button
      variant="outline-secondary"
      size="sm"
      className="ms-2 rounded-circle"
      style={{ width: "32px", height: "32px", padding: 0 }}
      onClick={() => {
        setCustomFromDate("");
        setCustomToDate("");
      }}
    >
      ×
    </Button>
  )}
</div>

                {/* Firm Dropdown */}
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
                          {firm === selectedFirm ? <strong>{firm}</strong> : firm}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            {/* Totals Card - FIXED */}
            <Row className="mb-4">
              <Col>
                <div className="p-4 bg-white rounded shadow-sm border" style={{ maxWidth: "500px" }}>
                  <h5 className="mb-1">
                    Total quotations: <strong style={{ fontSize: "1.8rem" }}>₹{totals.totalQuotations}</strong>
                  </h5>
                  <small className="opacity-75 d-block mb-2">
                    {percentageChange > 0 ? (
                      <span style={{ color: "#27ae60" }}>↑ {percentageChange.toFixed(0)}% up</span>
                    ) : percentageChange < 0 ? (
                      <span style={{ color: "#e74c3c" }}>↓ {Math.abs(percentageChange).toFixed(0)}% down</span>
                    ) : (
                      <span>No change</span>
                    )}{" "}
                    vs last year
                  </small>

                  <div className="text-muted mt-3">
                   <div className="d-flex justify-content-between">
                     <span>Converted:</span>
                    <strong style={{ color: "#27ae60" }}>₹{totals.totalConverted}</strong>
                   </div>
                   <div className="d-flex justify-content-between">
                   <span>Open:</span>
                   <strong style={{ color: "#e74c3c" }}>₹{totals.totalOpen}</strong>
                   </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Simple Table - Direct rendering (safer approach) */}
            {filteredEstimates.length > 0 ? (
              <Table striped bordered hover responsive className="bg-white">
                <thead className="table-light">
                  <tr>
                    {EstimateHead.map((head, index) => (
                      <th key={index}>{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEstimates.map((item, index) => {
                    const total = Number(item.total || 0).toFixed(2);
                    const balance = Number(item.balance_due || 0).toFixed(2);

                    const balanceDisplay = balance > 0 ? (
                      <span style={{ color: "#d63031", fontWeight: "bold" }}>₹ {balance}</span>
                    ) : (
                      <span style={{ color: "#27ae60" }}>₹ 0.00</span>
                    );

                    return (
                      <tr key={item.estimate_id || index}>
                        <td>{item.estimate_date || "-"}</td>
                        <td>{item.estimate_no || "-"}</td>
                        <td>{item.name || "-"}</td>
                        <td>Estimate</td>
                        <td>{item.payment_type || " "}</td>
                        <td>₹ {total}</td>
                        <td>{balanceDisplay}</td>
                        <td>{statusDisplay(item)}</td>
                        
                        
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative", }}>
                            {/* Convert Dropdown */}
                            <div className="position-relative">
                              <button
                                className="btn btn-sm border rounded-pill d-flex align-items-center gap-2"
                                style={{
                                  backgroundColor: "#f8f9fa",
                                  color: "#495057",
                                  padding: "4px 12px",
                                  fontSize: "0.85rem",
                                  
                                }}
                                onClick={() => setOpenShareId(openShareId === item.estimate_id ? null : item.estimate_id)}
                              >
                                Select <FaChevronDown size={10} />
                              </button>

                              {openShareId === item.estimate_id && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    marginTop: "5px",
                                    background: "white",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                    zIndex: 1000,
                                    minWidth: "160px",
                                    border: "1px solid #dee2e6",
                                  }}
                                >
                                  <div
                                    onClick={() => handleConvertToSale(item)}
                                    style={{
                                      padding: "10px 15px",
                                      cursor: "pointer",
                                      borderBottom: "1px solid #f1f3f4",
                                      color: "#2c3e50",
                                      fontWeight: "500",
                                      
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                                  >
                                    Convert to Sale
                                  </div>
                                  <div
                                    onClick={() => handleConvertToOrder(item)}
                                    style={{
                                      padding: "10px 15px",
                                      cursor: "pointer",
                                      color: "#2c3e50",
                                      fontWeight: "500",
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                                  >
                                    Convert to Order
                                  </div>
                                </div>
                              )}
                            </div>

                            <ActionButton
                              options={[
                                { label: "View", icon: <TbCircleLetterI />, onClick: () => handleView(item) },
                                { label: "Edit", icon: <TbCircleLetterI />, onClick: () => handleEdit(item) },
                                { label: "Delete", icon: <MdOutlineDelete />, onClick: () => handleDelete(item.estimate_id) },
                              ]}
                              label={<HiOutlineDotsVertical />}
                            />
                          </div>
                        </td>
                        <td>
                        {item.converted_to_sale === 1 || item.converted_to_sale === "1" ? (
                             <span style={{ color: "#0795f3ff", fontWeight: "600" }}> Converted</span>
                         ) : (
                        <span style={{ color: "#e74c3c" }}>Open</span>)}
                        </td>
                        
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <div className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "60vh" }}
              >
                <div className="text-center">
                  <p className="text-muted mb-4">No estimates found</p>
                  <Button
                    variant="danger"
                    size="sm"
                    className="px-5 py-3 shadow-lg rounded-pill fw-bold"
                    style={{
                      fontSize: "1.2rem",
                      letterSpacing: "0.5px",
                    }}
                    onClick={() => navigate("/estimate/create")}
                  >
                    + Add Estimate
                  </Button>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Estimate;