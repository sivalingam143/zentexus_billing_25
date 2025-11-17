// import React, { useState, useEffect } from "react";
// import {
//   FaWhatsapp,
//   FaClock,
//   FaPen,
//   FaCommentDots,
//   FaSearch,
// } from "react-icons/fa";
// import { Button, Table } from "react-bootstrap";
// import PartyModal from "./PartyModal";

// function Parties() {
//   const [showModal, setShowModal] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [businessName, setBusinessName] = useState("");
//   const [selectedParty, setSelectedParty] = useState(null);
//   const [parties, setParties] = useState([]);

//   useEffect(() => {
//     if (parties.length === 0) {
//       const defaultParty = {
//         id: 1,
//         name: "Yash",
//         phone: "9342606037",
//         email: "yash@gmail.com",
//         amount: 100,
//         transactions: [
//           {
//             type: "Sale",
//             number: 1,
//             date: "09/11/2025",
//             total: 100,
//             balance: 100,
//           },
//         ],
//       };
//       setParties([defaultParty]);
//       setSelectedParty(defaultParty);
//     }
//   }, [parties]);

//   return (
//     <div id="main">
//       <div
//         style={{
//           backgroundColor: "#f0f2f5",
//           minHeight: "100vh",
//           padding: "20px",
//         }}
//       >
//         {/* Top Bar */}
//         <div className="mb-0 d-flex align-items-center justify-content-end bg-white p-4 rounded shadow-sm">
//           <span
//             style={{
//               color: "red",
//               fontWeight: "bold",
//               fontSize: "1.5rem",
//             }}
//           >
//             •
//           </span>

//           {isEditing ? (
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 marginLeft: "8px",
//               }}
//             >
//               <input
//                 type="text"
//                 value={businessName}
//                 onChange={(e) => setBusinessName(e.target.value)}
//                 placeholder="Enter Business Name"
//                 autoFocus
//                 style={{
//                   borderRadius: "6px",
//                   padding: "5px 10px",
//                   fontSize: "1rem",
//                   width: "250px",
//                 }}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") setIsEditing(false);
//                 }}
//               />
//               <Button
//                 variant="info"
//                 onClick={() => setIsEditing(false)}
//                 style={{
//                   borderRadius: "6px",
//                   fontWeight: 600,
//                   color: "white",
//                 }}
//               >
//                 Save
//               </Button>
//             </div>
//           ) : (
//             <span
//               className="ms-2 text-muted"
//               style={{ cursor: "pointer" }}
//               onClick={() => setIsEditing(true)}
//             >
//               {businessName || "Enter Business Name"}
//             </span>
//           )}

//           <div className="ms-auto d-flex align-items-center gap-2">
//             <button
//               className="rounded-pill"
//               style={{
//                 backgroundColor: "#f8d7da",
//                 color: "red",
//                 border: "none",
//                 padding: "6px 15px",
//               }}
//             >
//               + Add Sale
//             </button>
//             <button
//               className="rounded-pill"
//               style={{
//                 backgroundColor: "#cce7f3",
//                 color: "blue",
//                 border: "none",
//                 padding: "6px 15px",
//               }}
//             >
//               + Add Purchase
//             </button>
//             <button
//               className="rounded-pill"
//               style={{
//                 backgroundColor: "#cce7f3",
//                 color: "blue",
//                 border: "none",
//                 padding: "6px 15px",
//               }}
//             >
//               +
//             </button>
//           </div>
//         </div>

//         {/* Outer Card */}

//         {/* Header */}
//         <div
//           className="d-flex justify-content-between align-items-center bg-white px-4 py-3 rounded shadow-sm"
//           style={{
//             marginBottom: "15px",
//           }}
//         >
//           <h5 className="m-0">Parties</h5>
//           <button
//             className="btn btn-danger rounded-pill px-3"
//             onClick={() => {
//               setShowModal(true);
//               setIsEdit(false);
//             }}
//           >
//             + Add Party
//           </button>
//         </div>
//         <div
//           className="card mx-auto shadow-sm mt-3"
//           style={{
//             border: "none",
//             borderRadius: "10px",
//             padding: "15px",
//             backgroundColor: "#f0f2f5",
//           }}
//         >
//           {/* Inner Panels */}
//           <div className="d-flex gap-3">
//             {/* Left Panel */}
//             <div
//               className="bg-white shadow-sm rounded"
//               style={{
//                 width: "35%",
//                 padding: "15px",
//                 height: "70vh",
//               }}
//             >
//               <div style={{ position: "relative", width: "100%" }}>
//                 <FaSearch
//                   style={{
//                     position: "absolute",
//                     left: "15px",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     color: "gray",
//                   }}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search Party Name"
//                   style={{
//                     width: "100%",
//                     padding: "8px 8px 8px 35px",
//                     borderRadius: "20px",
//                     border: "1px solid #ccc",
//                     outline: "none",
//                   }}
//                 />
//               </div>

//               <table className="table table-hover table-sm mt-3">
//                 <thead>
//                   <tr>
//                     <th className="text-secondary">Party Name</th>
//                     <th className="text-secondary">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {parties.map((p) => (
//                     <tr
//                       key={p.id}
//                       onClick={() => setSelectedParty(p)}
//                       style={{
//                         cursor: "pointer",
//                         backgroundColor:
//                           selectedParty?.id === p.id ? "#e7f3ff" : "",
//                       }}
//                     >
//                       <td>{p.name}</td>
//                       <td>{p.amount.toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Right Panel */}
//             <div
//               className="flex-grow-1 d-flex flex-column gap-3"
//               style={{
//                 height: "70vh",
//               }}
//             >
//               {selectedParty && (
//                 <>
//                   {/* Party Details Card */}
//                   <div className="bg-white shadow-sm rounded p-4">
//                     <div className="d-flex justify-content-between align-items-center mb-3">
//                       <div className="d-flex align-items-center gap-2">
//                         <h6 className="m-0">{selectedParty.name}</h6>
//                         <FaPen
//                           className="text-primary"
//                           style={{ cursor: "pointer" }}
//                           onClick={() => {
//                             setShowModal(true);
//                             setIsEdit(true);
//                           }}
//                         />
//                       </div>
//                       <div className="d-flex align-items-center gap-3">
//                         <FaWhatsapp className="text-success" />
//                         <FaCommentDots className="text-primary" />
//                         <FaClock className="text-secondary" />
//                       </div>
//                     </div>

//                     <div className="d-flex gap-5">
//                       <div>
//                         <p className="mb-0 text-secondary">Phone Number</p>
//                         <p className="mb-0">{selectedParty.phone}</p>
//                       </div>
//                       <div>
//                         <p className="mb-0 text-secondary">Email</p>
//                         <p className="mb-0">{selectedParty.email}</p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Transactions Card */}
//                   <div className="bg-white shadow-sm rounded p-4 vh-100">
//                     <h6 className="mb-3">Transactions</h6>
//                     <Table
//                       responsive
//                       bordered
//                       hover
//                       size="sm"
//                       className=" table align-middle text-center"
//                     >
//                       <thead>
//                         <tr>
//                           <td className="text-secondary">Type</td>
//                           <td className="text-secondary">Number</td>
//                           <td className="text-secondary">Date</td>
//                           <td className="text-secondary">Total</td>
//                           <td className="text-secondary">Balance</td>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {selectedParty.transactions.map((txn, i) => (
//                           <tr key={i} className="bg-light">
//                             <td>{txn.type}</td>
//                             <td>{txn.number}</td>
//                             <td>{txn.date}</td>
//                             <td>₹ {txn.total}</td>
//                             <td>₹ {txn.balance}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Party Modal */}
//       <PartyModal
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         isEdit={isEdit}
//       />
//     </div>
//   );
// }

// export default Parties;

import React, { useState, useEffect } from "react";
import {
  FaWhatsapp,
  FaClock,
  FaPen,
  FaCommentDots,
  FaSearch,
} from "react-icons/fa";
import { Button, Table } from "react-bootstrap";
import PartyModal from "./PartyModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchParties } from "../../../slice/partySlice";

function Parties() {
const dispatch = useDispatch();
const parties = useSelector((state) => state.parties.parties);
const [searchText, setSearchText] = useState("");
  const [selectedParty, setSelectedParty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [businessName, setBusinessName] = useState("");
  

 useEffect(() => {
    // Pass the search text to the Redux thunk
    dispatch(fetchParties(searchText)); 
  }, [dispatch, searchText]); // Re-fetch when searchText changes

  useEffect(() => {
    if (parties.length > 0 && !selectedParty) {
      setSelectedParty(parties[0]);
    }
  }, [parties]);


  return (
    <div id="main">
      <div
        style={{
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        {/* Top Bar */}
        <div className="mb-0 d-flex align-items-center justify-content-end bg-white p-4 rounded shadow-sm">
          <span
            style={{
              color: "red",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
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
                  borderRadius: "6px",
                  padding: "5px 10px",
                  fontSize: "1rem",
                  width: "250px",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditing(false);
                }}
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
            <button
              className="rounded-pill"
              style={{
                backgroundColor: "#f8d7da",
                color: "red",
                border: "none",
                padding: "6px 15px",
              }}
            >
              + Add Sale
            </button>
            <button
              className="rounded-pill"
              style={{
                backgroundColor: "#cce7f3",
                color: "blue",
                border: "none",
                padding: "6px 15px",
              }}
            >
              + Add Purchase
            </button>
            <button
              className="rounded-pill"
              style={{
                backgroundColor: "#cce7f3",
                color: "blue",
                border: "none",
                padding: "6px 15px",
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Outer Card */}

        {/* Header */}
        <div
          className="d-flex justify-content-between align-items-center bg-white px-4 py-3 rounded shadow-sm"
          style={{
            marginBottom: "15px",
          }}
        >
          <h5 className="m-0">Parties</h5>
          <button
            className="btn btn-danger rounded-pill px-3"
            onClick={() => {
              setShowModal(true);
              setIsEdit(false);
            }}
          >
            + Add Party
          </button>
        </div>
        <div
          className="card mx-auto shadow-sm mt-3"
          style={{
            border: "none",
            borderRadius: "10px",
            padding: "15px",
            backgroundColor: "#f0f2f5",
          }}
        >
          {/* Inner Panels */}
          <div className="d-flex gap-3">
            {/* Left Panel */}
            <div
              className="bg-white shadow-sm rounded"
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
                  placeholder="Search Party Name"
                  style={{
                    width: "100%",
                    padding: "8px 8px 8px 35px",
                    borderRadius: "20px",
                    border: "1px solid #ccc",
                    outline: "none",
                  }}
                />
              </div>

              <table className="table table-hover table-sm mt-3">
                <thead>
                  <tr>
                    <th className="text-secondary">Party Name</th>
                    <th className="text-secondary">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(parties || []).map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedParty(p)}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedParty?.id === p.id ? "#e7f3ff" : "",
                      }}
                    >
                      <td>{p.name}</td>
                      <td>{p.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right Panel */}
            <div
              className="flex-grow-1 d-flex flex-column gap-3"
              style={{
                height: "70vh",
              }}
            >
              {selectedParty && (
                <>
                  {/* Party Details Card */}
                  <div className="bg-white shadow-sm rounded p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="m-0">{selectedParty.name}</h6>
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
                        <p className="mb-0">{selectedParty.billing_address}</p>
                      </div>

                    </div>
                  </div>

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
                        {(selectedParty.transactions || []).map((txn, i) => (
                          <tr key={i} className="bg-light">
                            <td>{txn.type}</td>
                            <td>{txn.number}</td>
                            <td>{txn.date}</td>
                            <td>₹ {txn.total}</td>
                            <td>₹ {txn.balance}</td>
                          </tr>
                        ))}
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
      {/* Party Modal */}
      <PartyModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        isEdit={isEdit}
        partyToEdit={selectedParty}
        />
    </div>
  );
}

export default Parties;