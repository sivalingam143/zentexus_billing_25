import React, { useState, useEffect } from "react";
import {
  FaWhatsapp,
  FaClock,
  FaPen,
  FaCommentDots,
  FaSearch,
} from "react-icons/fa";
import { Button, Table, Card } from "react-bootstrap";
import PartyModal from "../creation/PartyModalCreation";
import { useDispatch, useSelector } from "react-redux";

import {
  searchPartiesAndSales,
  addNewParty,
  updateExistingParty,
  deleteExistingParty,
} from "../../slice/partySlice"



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
  transactionType: "pay",
  additionalFields: [
    { id: 1, name: "Additional Field 1", isChecked: false, value: "" },
    { id: 2, name: "Additional Field 2", isChecked: false, value: "" },
    { id: 3, name: "Additional Field 3", isChecked: false, value: "" },
  ],
};

function Parties() {
  const dispatch = useDispatch();
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
  }, [parties, selectedParty, setSelectedParty]);


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
        transactionType: party.transactionType || "pay",
        additionalFields: Initialstate.additionalFields,
      };

      if (party.additional_field) {
        try {
          const parsedFields = JSON.parse(party.additional_field);
          if (Array.isArray(parsedFields)) {
            newState.additionalFields = Initialstate.additionalFields.map(
              (defaultField) => {
                const pField = parsedFields.find(
                  (f) => f.id === defaultField.id
                );
                return pField
                  ? {
                      ...defaultField,
                      name: pField.name,
                      value: pField.value,
                      isChecked: true,
                    }
                  : defaultField;
              }
            );
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
    console.log("sent", dataToSend);
    let success = false;

    try {
      if (isEdit) {
        await dispatch(updateExistingParty(dataToSend)).unwrap();
        console.log("Updating Party:", dataToSend);
      } else {
        await dispatch(addNewParty(dataToSend)).unwrap();
        console.log("Creating Party:", dataToSend);
      }
      success = true;
    } catch (error) {
      console.error("Submission failed:", error);
    }

    if (success) {
      dispatch(searchPartiesAndSales(""));;
      setShowModal(false);
      // setShowModal(isSaveAndNew);
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
    dispatch(searchPartiesAndSales("")); // ← FIXED
    setFormData(Initialstate);
  }
};

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

  return (
    <div id="main">
      <div
        style={{
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",

          padding: "20px",
        }}
      >
        {/* Header Section */}

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
                    <th className="text-secondary">Party Name</th>
                    <th className="text-secondary">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(parties || []).map((p) => (
                    <tr
                      key={p.parties_id}
                      onClick={() => setSelectedParty(p)}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedParty?.parties_id === p.parties_id? "#e7f3ff" : "",
                      }}
                    >
                      <td>{p.name}</td>
                      {/* MODIFICATION: Removed the balance type label */}
                      <td
                        style={{
                          color:
                            p.balance_type === "To Pay"
                              ? "red"
                              : p.balance_type === "To Receive"
                              ? "green"
                              : "inherit",
                        }}
                      >
                        {p.balance_type !== "Nil"
                          ? `₹${p.display_amount?.toFixed(2) || "0.00"}` // Changed this line
                          : "Nil"}
                      </td>
                      {/* END MODIFICATION */}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>

            {/* Right Panel */}
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
                  {/* Transactions Card */}
                  <div className="bg-white shadow-sm rounded p-4 vh-100">
                    <h6 className="mb-3">Transactions</h6>
                    <Table
                      responsive
                      bordered
                      hover
                      size="sm"
                      className=" table align-middle text-center"
                    >
                      <thead>
                        <tr>
                          <td className="text-secondary">Type</td>
                          <td className="text-secondary">Number</td>
                          <td className="text-secondary">Date</td>
                          <td className="text-secondary">Total</td>
                          <td className="text-secondary">Balance</td>
                        </tr>
                      </thead>




<tbody>
  {selectedParty ? (
    (() => {
      // 1. CREATE OPENING BALANCE TRANSACTION
      const initialTransactions = [];
      const obAmount = parseFloat(selectedParty.amount || 0);

      if (obAmount > 0) {
        // Determine the type (Payable/Receivable) and color based on balance_type 
        const isPayable = selectedParty.balance_type === 'to pay';
        
        initialTransactions.push({
          // type: "Opening Balance", 
          balance_label: isPayable ? "Payable" : "Receivable", 
          color: isPayable ? "red" : "green", // Red/Green is correctly applied here
          number: null, 
          date: selectedParty.create_at || selectedParty.date || new Date().toISOString(), 
          total: obAmount, 
          balance: obAmount, 
        });
      }

      // 2. GET SALES TRANSACTIONS
      const partySales = sales.filter(
        (s) => s.parties_id === selectedParty.parties_id && s.delete_at == 0
      );

      // Map sales to transaction format
      const salesTransactions = partySales.map((s) => ({
        type: "Sale",
        balance_label: "Receivable", // Adding balance_label for completeness
        color: "", // FIX: Removed hardcoded "green" to default to black/inherit
        number: s.invoice_no || s.id, 
        date: s.invoice_date || s.date,
        total: parseFloat(s.total || 0),
        balance: parseFloat(s.total || 0) - parseFloat(s.paid_amount || 0),
      }));
      
      // 3. COMBINE TRANSACTIONS
      const transactions = [...initialTransactions, ...salesTransactions]; 
      
      // The optional sort step (recommended for a full ledger view)
      // transactions.sort((a, b) => new Date(a.date) - new Date(b.date)); 


      // 4. RENDER
      return transactions.length > 0 ? (
        transactions.map((t, i) => (
          <tr key={i}>
            {/* Type Column: Uses t.type for "Sale" or "Opening Balance" */}
            <td style={{ color: t.color, fontWeight: "bold" }}>
              {t.type || t.balance_label} 
            </td>
            {/* Number Column (Display '-' for null/empty number) */}
            <td>{t.number || '-'}</td> 
            {/* Date Column */}
            <td>{new Date(t.date).toLocaleDateString("en-IN")}</td>
            {/* Total Column */}
            <td>₹{t.total.toFixed(2)}</td>
            {/* Balance Column */}
            <td style={{ color: t.color, fontWeight: "bold" }}>
              ₹{t.balance.toFixed(2)}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="text-center text-muted py-4">
            No transactions yet
          </td>
        </tr>
      );
    })()
  ) : (
    <tr>
      <td colSpan="5" className="text-center text-muted py-4">
        Select a party to view transactions
      </td>
    </tr>
  )}
</tbody>
                    </Table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Party Modal */}
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