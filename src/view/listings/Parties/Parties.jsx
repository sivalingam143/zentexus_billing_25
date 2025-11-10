
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addParty } from "../../../slice/partySlice";
// import { FaPen } from "react-icons/fa";
import { FaWhatsapp, FaClock, FaPen, FaCommentDots ,FaSearch} from "react-icons/fa";

 import {  } from "react-icons/fa";

import PartyModal from "../Parties/PartyModal";
// import "../Parties/Parties.css"

function Parties() {
  const dispatch = useDispatch();
  const { parties, selectedParty } = useSelector((state) => state.party);
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const [isEdit, setIsEdit] = useState(false);


  // Add default static party
  useEffect(() => {
    if (parties.length === 0) {
      const defaultParty = {
        id: 1,
        name: "Yash",
        phone: "9342606037",
        email: "yash@gmail.com",
        
        amount: 100,
        transactions: [
          { type: "Sale", number: 1, date: "09/11/2025", total: 100, balance: 100 },
        ],
      };
      dispatch(addParty(defaultParty));
    }
  }, [dispatch, parties]);

  return (
    <div id="main">
    <div className="d-flex vh-100">
      <div className="flex-grow-1 p-0 bg-light mt-5">
       
        <div className="d-flex justify-content-end align-items-center mb-3 gap-4">
  <h6 className="text-danger m-0 me-auto mt-0" style={{ lineHeight: "2.2" }}>• Enter Business Name</h6>
  
  <button
    type="button"

    className="rounded-pill mt-3"
    style={{
      backgroundColor: "#f8d7da",
      color: "red",
      border: "none",
      boxShadow: "none",
    }}
  >
    + Add Sale
  </button>
  
  <button
    type="button"
    className="rounded-pill mt-3"
    style={{
      backgroundColor: "#cce7f3",
      color: "blue",
      border: "none",
      boxShadow: "none",
    }}
  >
    + Add Purchase
  </button>
  
  <button
    type="button"
    className="rounded-pill mt-3"
    style={{
      backgroundColor: "#cce7f3",
      color: "blue",
      border: "none",
      boxShadow: "none",
    }}
  >
    +
  </button>
</div>


        {/* Main Card */}
        <div className="card" style={{ border: "5px solid #cce7f3", borderTop: "transparent" }}>
          {/* Card Header */}
          <div className="bg-white d-flex justify-content-between align-items-center" style={{ borderBottom: "5px solid #cce7f3" }}>
            <h5 className="m-4" style={{ borderTop: "transparent" }}>Parties</h5>
            {/* <button className="btn btn-danger rounded-pill px-3 mx-4" onClick={handleShow}>+ Add Party</button> */}
            
<button
  className="btn btn-danger rounded-pill px-3 mx-4"
  onClick={() => {
    setShowModal(true);
    setIsEdit(false);
  }}
>
  + Add Party
</button>

          </div>

          <div className="  d-flex ">
            {/* Left Party List */}
            <div style={{ width: "35%", height: "100vh" }}>
              <div style={{ width: "90%", margin: "20px" }}>
                {/* <input type="text" className="rounded-pill"style={{width:"100%"}} placeholder="Search Party Name" /> */}
 

<div style={{ position: "relative", width: "100%" }}>
  <FaSearch
    style={{
      position: "absolute",
      left: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "gray",
      pointerEvents: "none",
    }}
  />
  <input
    type="text"
    placeholder="Search Party Name"
    style={{
      width: "100%",
      padding: "8px 8px 8px 35px", // space for the icon
      borderRadius: "20px",
      border: "1px solid #ccc",
      outline: "none",
      fontWeight: "normal",
    }}
  />
</div>


                <table className="table table-hover table-sm mt-2 ">
                  <thead >
                    <tr >
                      <th className="text-secondary ">Party Name</th>
                      <th className=" text-secondary">Amount</th>
                    </tr>
                  </thead>
                  <tbody  >
                    {parties.map((p) => (
                      <tr key={p.id} >
                        <td>{p.name}</td>
                        <td>{p.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Party Details */}
            <div className="flex-grow-1" style={{ borderLeft: "5px solid #cce7f3" }}>
              {selectedParty && (
                <>
                 <div className="d-flex justify-content-between align-items-center m-3">
  <div className="d-flex align-items-center gap-2">
    <h6 className="m-0">{selectedParty.name}</h6>
    {/* <FaPen className="text-primary" style={{ cursor: "pointer" }} onClick={handleShow} /> */}
    <FaPen
  className="text-primary"
  style={{ cursor: "pointer" }}
  onClick={() => {
    setShowModal(true);
    setIsEdit(true);
  }}
/>

  </div>

  <div className="d-flex align-items-center gap-3">
    <FaWhatsapp className="text-success" style={{ cursor: "pointer" }} />
    <FaCommentDots className="text-primary" style={{ cursor: "pointer" }} />
    <FaClock className="text-secondary" style={{ cursor: "pointer" }} />
  </div>
</div>

                <div className="d-flex gap-5 m-3">
  <div>
    <p className="mb-0 text-secondary">Phone Number</p>
    <p className="mb-0">{selectedParty.phone}</p>
  </div>
  <div>
    <p className="mb-0 text-secondary">Email</p>
    <p className="mb-0">{selectedParty.email}</p>
  </div>
</div>
{/* style={{ borderTop: "none" }} */}
                 
<div style={{ borderTop: "5px solid #cce7f3"}}>
  <h6 className="m-3">Transactions</h6>
  <table className="table mt-4 align-middle text-center" >
    <thead className=" ">
      <tr  >
        <td className="text-secondary">Type</td>
        <td className="text-secondary">Number</td>
        <td className="text-secondary">Date</td>
        <td className="text-secondary">Total</td>
        <td className="text-secondary">Balance</td>
      </tr>
    </thead>
    <tbody>
      {selectedParty.transactions.map((txn, i) => (
        <tr key={i} className="bg-light">
          <td>{txn.type}</td>
          <td>{txn.number}</td>
          <td>{txn.date}</td> {/* or dynamic: {new Date().toLocaleDateString()} */}
          <td>{txn.total}</td>
          <td>{txn.balance}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Party Modal */}
      <PartyModal show={showModal} handleClose={handleClose} />
      <PartyModal show={showModal} handleClose={handleClose} isEdit={isEdit} />

    </div></div>
  );
}

export default Parties;

