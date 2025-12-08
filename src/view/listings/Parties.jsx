import React, { useState, useEffect } from "react";
import {
  FaWhatsapp,
  FaClock,
  FaPen,
  FaCommentDots,
  FaSearch,
  FaEllipsisV,
} from "react-icons/fa";
import { Button, Table, Card, Dropdown,Modal } from "react-bootstrap";
import PartyModal from "../creation/PartyModalCreation";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Added
              

import { FaFilter } from 'react-icons/fa';

import {
  searchPartiesAndSales,
  addNewParty,
  updateExistingParty,
  deleteExistingParty,
} from "../../slice/partySlice";
import { deleteSale } from "../../slice/saleSlice"; // Added for delete sale

const Initialstate = {
  id: null,
  name: "",
  gstin: "",
  phone: "",
  email: "",
  gstin_type_id: "",
  gstin_type_name: "",
  state_of_supply: "",
  billing_address: "",
  shipping_address: "",
  isEditingAddress: false,
  amount: "",
  limitType: "no",
  creditlimit: "",
  date: new Date(),
  transactionType: "to pay",
  additionalFields: [
    { id: 1, name: "Additional Field 1", isChecked: false, value: "" },
    { id: 2, name: "Additional Field 2", isChecked: false, value: "" },
    { id: 3, name: "Additional Field 3", isChecked: false, value: "" },
  ],
};

function Parties() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Added
  const partyState = useSelector((state) => state.party || {});
  const { parties = [], sales = [] } = partyState;
  const [searchText, setSearchText] = useState("");
  const [selectedParty, setSelectedParty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(Initialstate);

  useEffect(() => {
    dispatch(searchPartiesAndSales(searchText));
  }, [dispatch, searchText]);

  useEffect(() => {
    if (parties?.length > 0 && !selectedParty) {
      setSelectedParty(parties[0]);
    }
  }, [parties]);

  const handleOpenModal = (party = null) => {
    if (party) {
      setIsEdit(true);

      let newState = {
        id: party.parties_id || party.id,
        name: party.name || "",
        gstin: party.gstin || "",
        phone: party.phone || "",
        email: party.email || "",
        gstin_type_id: String(party.gstin_type_id || ""),
        gstin_type_name: party.gstin_type_name || "",
        state_of_supply: party.state_of_supply || "",
        billing_address: party.billing_address || "",
        shipping_address: party.shipping_address || "",
        isEditingAddress: !!(
          party.shipping_address &&
          party.shipping_address !== party.billing_address
        ),
        amount: String(party.amount || ""),
        creditlimit: String(party.creditlimit || ""),
        limitType: parseFloat(party.creditlimit) > 0 ? "custom" : "no",
        date: party.date ? new Date(party.date) : new Date(),
        transactionType: party.transaction_type === 'to receive' ? 'to receive' : 'to pay',
        additionalFields: Initialstate.additionalFields,
      };

      if (party.additional_field) {
        try {
          const parsedFields = JSON.parse(party.additional_field);
          if (Array.isArray(parsedFields)) {
            newState.additionalFields = Initialstate.additionalFields.map((defaultField) => {
              const pField = parsedFields.find((f) => f.id === defaultField.id);
              return pField
                ? { ...defaultField, name: pField.name, value: pField.value, isChecked: true }
                : defaultField;
            });
          }
        } catch (e) {
          console.error("Error parsing additional fields on edit:", e);
        }
      }
      setFormData(newState);
    } else {
      setIsEdit(false);
      setFormData(Initialstate);
    }
    setShowModal(true);
  };

  const createPayload = () => {
    const additionalFieldsPayload = JSON.stringify(
      formData.additionalFields
        .filter((f) => f.isChecked && f.name)
        .map((f) => ({ id: f.id, name: f.name, value: f.value || "" }))
    );

    const payload = {
      name: formData.name,
      gstin: formData.gstin,
      phone: formData.phone,
      email: formData.email,
      gstin_type_id: formData.gstin_type_id,
      gstin_type_name: formData.gstin_type_name,
      state_of_supply: formData.state_of_supply,
      billing_address: formData.billing_address,
      shipping_address: formData.shipping_address,
      amount: parseFloat(formData.amount) || 0,
      creditlimit:
        formData.limitType === "custom"
          ? parseFloat(formData.creditlimit) || 0
          : 0,
      transactionType: formData.transactionType,
      additional_field: additionalFieldsPayload,
    };

    if (isEdit) {
      payload.id = formData.id;
      payload.parties_id = formData.id;
    }

    return payload;
  };

  const handleSubmit = async () => {
    const dataToSend = createPayload();
    let success = false;

    try {
      if (isEdit) {
        await dispatch(updateExistingParty(dataToSend)).unwrap();
      } else {
        await dispatch(addNewParty(dataToSend)).unwrap();
      }
      success = true;
    } catch (error) {
      console.error("Submission failed:", error);
    }

    if (success) {
      dispatch(searchPartiesAndSales(""));
      setShowModal(false);
      setFormData(Initialstate);
    }
  };

  const handleSaveAndNew = async () => {
    const dataToSend = createPayload();
    let success = false;

    try {
      await dispatch(addNewParty(dataToSend)).unwrap();
      success = true;
    } catch (error) {
      console.error("Save & New failed:", error);
    }

    if (success) {
      dispatch(searchPartiesAndSales(""));
      setFormData(Initialstate);
    }
  };

  // Removed the unused handleEdit function
  // const handleEdit = (sale) => navigate(`/sale/edit/${sale.sale_id}`);


  const handleDelete = async () => {
    const idToDelete = formData.id;
    if (!idToDelete) return;

    if (!window.confirm(`Are you sure you want to delete ${formData.name}?`)) {
      return;
    }

    try {
      await dispatch(deleteExistingParty(idToDelete)).unwrap();
      dispatch(searchPartiesAndSales(""));
      setShowModal(false);
      setSelectedParty(null);
    } catch (error) {
      console.error("Failed to delete party: ", error);
    }
  };

  // NEW: Handler for deleting opening balance (set amount to 0)
  const handleDeleteOpening = async () => {
    if (!window.confirm("Are you sure you want to delete the opening balance?")) {
      return;
    }

    const payload = {
      id: selectedParty.parties_id,
      name: selectedParty.name,
      gstin: selectedParty.gstin || "",
      phone: selectedParty.phone || "",
      email: selectedParty.email || "",
      gstin_type_id: selectedParty.gstin_type_id || "",
      gstin_type_name: selectedParty.gstin_type_name || "",
      state_of_supply: selectedParty.state_of_supply || "",
      billing_address: selectedParty.billing_address || "",
      shipping_address: selectedParty.shipping_address || "",
      amount: 0,
      creditlimit: selectedParty.creditlimit || 0,
      transactionType: selectedParty.transaction_type,
      additional_field: selectedParty.additional_field || "[]",
    };

    try {
      await dispatch(updateExistingParty(payload)).unwrap();
      dispatch(searchPartiesAndSales(""));
    } catch (error) {
      console.error("Failed to delete opening balance:", error);
    }
  };

  const partiesWithBalance = parties.map(p => {

    const partySales = sales.filter(s => s.parties_id === p.parties_id && s.delete_at == 0);
    const unpaidSales = partySales.reduce((sum, s) => {
      return sum + (parseFloat(s.total || 0) - parseFloat(s.paid_amount || 0));
    }, 0);

    const openingBalance = parseFloat(p.amount || 0);


    const totalAmount = openingBalance + unpaidSales;

    const isToPay = p.transaction_type === "to pay";
    const running_transaction_type = totalAmount > 0.01
      ? (isToPay ? "To Pay" : "To Receive")
      : "Nil";

    const running_balance_amount = totalAmount > 0.01 ? totalAmount : 0;

    return {
      ...p,
      running_transaction_type,
      running_balance_amount: Number(running_balance_amount.toFixed(2)),
    };
  });

 
const TransactionMenu = ({ transaction, isOpening = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Modal states (one per dropdown)
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleViewEdit = () => {
    if (isOpening) {
      handleOpenModal(selectedParty);
    } else {
      const saleId = transaction.sale_id || transaction.id;
      navigate(`/sale/edit/${saleId}`);
    }
  };

  const handleCancelInvoice = () => {
    setShowCancelModal(true);
  };

  const handleDeleteInvoice = () => {
    setShowDeleteModal(true);
  };

  const confirmCancel = () => {
    alert(`Invoice ${transaction.invoice_no || transaction.number} has been CANCELLED!`);
    setShowCancelModal(false);
    // Later: dispatch(cancelSale(transaction.sale_id))
  };

  const confirmDelete = () => {
    if (isOpening) {
      handleDeleteOpening();
    } else {
      const saleId = transaction.sale_id || transaction.id;
      dispatch(deleteSale(saleId))
        .unwrap()
        .then(() => {
          dispatch(searchPartiesAndSales(""));
          alert("Invoice deleted permanently!");
        })
        .catch(() => alert("Delete failed"));
    }
    setShowDeleteModal(false);
  };

  return (
    <>
      {/* Dropdown Menu */}
      <Dropdown drop="up" align="end">
        <Dropdown.Toggle variant="link" bsPrefix="p-0" className="text-muted shadow-none">
          <FaEllipsisV />
        </Dropdown.Toggle>

        <Dropdown.Menu
          style={{ zIndex: 9999, minWidth: "220px", fontSize: "13.5px" }}
          popperConfig={{ strategy: "fixed" }}
        >
          {isOpening ? (
            <>
              <Dropdown.Item onClick={() => handleOpenModal(selectedParty)} className="text-primary fw-bold">
                View / Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={handleDeleteInvoice} className="text-danger">
                Delete
              </Dropdown.Item>
               <Dropdown.Item>
                Duplicate
               </Dropdown.Item>
               <Dropdown.Item>Open PDF</Dropdown.Item>
              <Dropdown.Item>Preview</Dropdown.Item>
              <Dropdown.Item>Print</Dropdown.Item>
              <Dropdown.Item>convert to return</Dropdown.Item>
              <Dropdown.Item>make payment</Dropdown.Item>
              <Dropdown.Item>view history</Dropdown.Item>
            </>
          ) : (
            <>
              <Dropdown.Item onClick={handleViewEdit} className="fw-bold">
                View/Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={handleCancelInvoice} className="text-warning">
                Cancel Invoice
              </Dropdown.Item>
              <Dropdown.Item onClick={handleDeleteInvoice} className="text-danger fw-bold">
                Delete
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Duplicate</Dropdown.Item>
              <Dropdown.Item>Open PDF</Dropdown.Item>
              <Dropdown.Item>Preview</Dropdown.Item>
              <Dropdown.Item>Print</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-success fw-bold">Receive Payment</Dropdown.Item>
              <Dropdown.Item>View History</Dropdown.Item>
            </>
          )}
        </Dropdown.Menu>
      </Dropdown>

      {/* CANCEL INVOICE MODAL */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered size="sm">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-danger fs-5">Cancel Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center pt-2">
          <p className="mb-2">
            Are you sure you want to <strong>cancel</strong> the invoice?
          </p>
          <p className="text-muted small">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center gap-3">
          <Button variant="outline-secondary" onClick={() => setShowCancelModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={confirmCancel}>
            Cancel Invoice
          </Button>
        </Modal.Footer>
      </Modal>

      {/* DELETE INVOICE MODAL */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-center w-100">
            <div className="text-danger mb-3">
              <div style={{ fontSize: "60px" }}></div>
            </div>
            Deleting the invoice will delete all records of this invoice.
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p className="text-muted">
            You can also <strong>CANCEL</strong> the invoice, which will preserve the cancelled copy and serial number of the invoice.
          </p>
          <div className="form-check mt-3">
            <input className="form-check-input" type="checkbox" id="dontShow" />
            <label className="form-check-label small" htmlFor="dontShow">
              Don't show this message again!
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center gap-3 border-0">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Continue Deleting
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Cancel Invoice
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};



  return (
    <div id="main">
      <div
        style={{
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
          height:"100vh",
          padding: "20px",
        }}
      >
        <Card
          className="bg-white rounded shadow-sm"
          style={{
            marginBottom: "15px",
            marginTop: "10px",
            border: "none",
          }}
        >
          <Card.Body className="d-flex justify-content-between align-items-center px-4 py-3">
            <h5 className="m-0">Parties</h5>
            <Button
              variant="danger"
              className="rounded-pill px-3"
              onClick={() => handleOpenModal(null)}
            >
              + Add Party
            </Button>
          </Card.Body>
        </Card>

        <div
          className="card mx-auto shadow-sm mt-3"
          style={{
            border: "none",
            borderRadius: "10px",
            padding: "15px",
            backgroundColor: "#f0f2f5",
          }}
        >
          <div className="d-flex gap-3">
            <Card
              className="shadow-sm rounded"
              style={{
                width: "35%",
                padding: "15px",
                height: "70vh",
              }}
            >
              <div style={{ position: "relative", width: "100%" }}>
                <FaSearch
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "gray",
                  }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Party Name"
                  style={{
                    width: "100%",
                    padding: "8px 8px 8px 35px",
                    borderRadius: "20px",
                    border: "1px solid #ccc",
                    outline: "none",
                  }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>


<Table hover size="sm" className="mt-3">
    <thead>
        <tr>
            <th className="text-secondary">
                <div className="d-flex align-items-center">
                    Party Name
                    {/* Dropdown component for the Filter Icon */}
                    <Dropdown className="ms-1">
                        <Dropdown.Toggle 
                            as="span" 
                            id="dropdown-filter-party-name" 
                            style={{ cursor: 'pointer', color: 'red' }}
                        >
                            {/* NOTE: FaFilter must be imported from 'react-icons/fa' or similar */}
                            <FaFilter size={14} /> 
                        </Dropdown.Toggle>

                        {/* Updated Dropdown Menu Content to include Checkboxes */}
                        <Dropdown.Menu align="start" style={{ width: '180px', padding: '10px' }}>
                            
                            {/* Filter Options Group */}
                            <div className="mb-3">
                                
                                {/* Option: All (Selected State) */}
                                <div 
                                    className="d-flex justify-content-between align-items-center py-1 px-2 rounded"
                                    style={{ backgroundColor: '#e7f3ff', cursor: 'pointer' }} // Simulate selected row
                                >
                                    <div className="form-check m-0">
                                        <input 
                                            className="form-check-input" 
                                            type="radio" // Using radio to simulate single selection like in the image
                                            name="partyFilter" 
                                            id="filterAll" 
                                            defaultChecked // Simulate being checked/selected
                                        />
                                        <label className="form-check-label fw-bold" htmlFor="filterAll">
                                            All
                                        </label>
                                    </div>
                                </div>
                                
                                {/* Option: Active */}
                                <div 
                                    className="d-flex justify-content-between align-items-center py-1 px-2 rounded"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="form-check m-0">
                                        <input 
                                            className="form-check-input" 
                                            type="radio" 
                                            name="partyFilter" 
                                            id="filterActive" 
                                        />
                                        <label className="form-check-label" htmlFor="filterActive">
                                            Active
                                        </label>
                                    </div>
                                </div>
                                
                                {/* Option: Inactive */}
                                <div 
                                    className="d-flex justify-content-between align-items-center py-1 px-2 rounded"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="form-check m-0">
                                        <input 
                                            className="form-check-input" 
                                            type="radio" 
                                            name="partyFilter" 
                                            id="filterInactive" 
                                        />
                                        <label className="form-check-label" htmlFor="filterInactive">
                                            Inactive
                                        </label>
                                    </div>
                                </div>

                                {/* Option: To Receive */}
                                <div 
                                    className="d-flex justify-content-between align-items-center py-1 px-2 rounded"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="form-check m-0">
                                        <input 
                                            className="form-check-input" 
                                            type="radio" 
                                            name="partyFilter" 
                                            id="filterToReceive" 
                                        />
                                        <label className="form-check-label" htmlFor="filterToReceive">
                                            To Receive
                                        </label>
                                    </div>
                                </div>
                                
                                {/* Option: To Pay */}
                                <div 
                                    className="d-flex justify-content-between align-items-center py-1 px-2 rounded"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="form-check m-0">
                                        <input 
                                            className="form-check-input" 
                                            type="radio" 
                                            name="partyFilter" 
                                            id="filterToPay" 
                                        />
                                        <label className="form-check-label" htmlFor="filterToPay">
                                            To Pay
                                        </label>
                                    </div>
                                </div>
                                
                            </div>
                            
                            {/* Clear and Apply Buttons */}
                            <div className="d-flex justify-content-between pt-2 border-top">
                                <Button variant="outline-secondary" size="sm">
                                    Clear
                                </Button>
                                <Button variant="danger" size="sm">
                                    Apply
                                </Button>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </th>
            <th className="text-secondary">Amount</th>
        </tr>
    </thead>
    <tbody>
    {partiesWithBalance.map((p) => (
        <tr
            key={p.parties_id}
            onClick={() => setSelectedParty(p)}
            style={{
                cursor: "pointer",
                backgroundColor:
                    selectedParty?.parties_id === p.parties_id ? "#e7f3ff" : "",
            }}
        >
            <td>{p.name}</td>
            <td
                style={{
                    color:
                        p.running_transaction_type === "To Pay"
                            ? "red"
                            : p.running_transaction_type === "To Receive"
                                ? "green"
                                : "inherit",
                    fontWeight: "bold"
                }}
            >
                {p.running_transaction_type !== "Nil"
                    ? `₹${p.running_balance_amount.toFixed(2)}`
                    : "Nil"}
            </td>
        </tr>
    ))}
    </tbody>
</Table>
            </Card>

            <div
              className="flex-grow-1 d-flex flex-column gap-3"
              style={{
                height: "70vh",
              }}
            >
              {selectedParty && (
                <>
                  <Card className="shadow-sm rounded">
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="m-0">{selectedParty.name}</h6>
                          <FaPen
                            className="text-primary"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleOpenModal(selectedParty)}
                          />
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <FaWhatsapp className="text-success" />
                          <FaCommentDots className="text-primary" />
                          <FaClock className="text-secondary" />
                        </div>
                      </div>

                      <div className="d-flex gap-5">
                        <div>
                          <p className="mb-0 text-secondary">Phone Number</p>
                          <p className="mb-0">{selectedParty.phone}</p>
                        </div>
                        <div>
                          <p className="mb-0 text-secondary">Email</p>
                          <p className="mb-0">{selectedParty.email}</p>
                        </div>
                        <div>
                          <p className="mb-0 text-secondary">Billing Address</p>
                          <p className="mb-0">
                            {selectedParty.billing_address}
                          </p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  <div className="bg-white shadow-sm rounded p-4" style={{ height: "100vh" }}>
  <div style={{ maxHeight: "50vh", overflowY: "auto", overflowX: "visible" }}>
    <h6 className="mb-3">Transactions</h6>
                    <Table
                      responsive
                      bordered
                      hover
                      size="sm"
                      className="table align-middle text-center"
                    >
                      <thead>
                        <tr>
                          <td className="text-secondary">Type</td>
                          <td className="text-secondary">Number</td>
                          <td className="text-secondary">Date</td>
                          <td className="text-secondary">Total</td>
                          <td className="text-secondary">Balance</td>
                          <td className="text-secondary"></td> {/* Added column for dropdown */}
                        </tr>
                      </thead>

                      <tbody>
                        {selectedParty ? (
                          (() => {
                            const rows = [];
                            const obAmount = parseFloat(selectedParty.amount || 0);

                            if (obAmount > 0) {
                              const isPayable = selectedParty.transaction_type === 'to pay';
                              rows.push({
                                id: "opening",
                                type: isPayable ? "Payable" : "Receivable",
                                color: isPayable ? "red" : "green",
                                number: "-",
                                date: selectedParty.create_at || new Date(),
                                total: obAmount,
                                balance: obAmount,
                              });
                            }

                            sales
                              .filter(s => s.parties_id === selectedParty.parties_id && s.delete_at == 0)
                              .forEach(s => {
                                const unpaid = parseFloat(s.total || 0) - parseFloat(s.paid_amount || 0);
                                if (unpaid > 0) {
                                  rows.push({
                                    // FIX: Using s.sale_id for the ID to ensure correct routing/deletion ID is passed
                                    id: s.sale_id || s.id,
                                    // Including all sale properties for robustness in TransactionMenu
                                    ...s,
                                    type: "Sale",
                                    color: "green",
                                    number: s.invoice_no || s.id,
                                    date: s.invoice_date || s.date,
                                    total: parseFloat(s.total || 0),
                                    balance: unpaid,
                                  });
                                }
                              });

                            return rows.length > 0 ? rows.map((t, i) => (
                              <tr key={i}>
                                <td style={{ color: t.color }}>{t.type}</td>
                                <td>{t.number}</td>
                                <td>{new Date(t.date).toLocaleDateString("en-IN")}</td>
                                <td>₹{t.total.toFixed(2)}</td>
                                <td style={{ color: t.color, fontWeight: "bold" }}>₹{t.balance.toFixed(2)}</td>
                                <td><TransactionMenu transaction={t} isOpening={t.id === "opening"} /></td>
                              </tr>
                            )) : (
                              <tr><td colSpan={6} className="text-center text-muted py-4">No transactions yet</td></tr>
                            );
                          })()
                        ) : (
                          <tr><td colSpan={6} className="text-center text-muted py-4">Select a party</td></tr>
                        )}
                      </tbody>
                    </Table>
                    </div>
                  </div>
                </>
              )}
            </div>
            
          </div>
        </div>
      </div>

      <PartyModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setFormData(Initialstate);
        }}
        isEdit={isEdit}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handleSaveAndNew={handleSaveAndNew}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default Parties;