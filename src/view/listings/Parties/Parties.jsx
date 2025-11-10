import React, { useEffect } from "react";
import { Row, Col, Card, Table, Form } from "react-bootstrap";
import { Buttons } from "../../../components/Buttons";
import { FaEdit,  } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addParty } from "../../../slice/partySlice";

function Parties() {
  const dispatch = useDispatch();
  const parties = useSelector((state) => state.party.parties);
useEffect(() => {
  if (parties.length === 0) {
    const staticParties = [
      {
        name: "Yash",
        phone: "9342606037",
        email: "yasvindhini@gmail.com",
        transactions: [
          { type: "Sale", number: 1, date: "09/11/2025", total: "₹ 100.00", balance: "₹ 100.00" },
        ],
      },
    ];

    staticParties.forEach((party) => dispatch(addParty(party)));
  }
}, [dispatch, parties]);

 

   

  return (
    <div className="p-3" id="main">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold text-muted ">
          <span className="text-danger">•</span> Enter Business Name
        </h5>
         <div className="d-flex gap-2"> 
          <Buttons type="button" className="btn btn-danger rounded-pill px-3" btnlabel="+ Add Sale" />
          <Buttons type="button" className="btn btn-primary rounded-pill px-3" btnlabel="+ Add Purchase" />
          <Buttons type="button" className="btn btn-danger rounded-pill px-3" btnlabel="+ Add Party" />
        </div>
      </div>

      <Row>
        {/* Left Side: Party List */}
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-bottom fw-semibold">Parties ▼</Card.Header>
            <Card.Body className="p-2">
              <Form.Control type="text" placeholder="Search Party Name" className="mb-2" />

              {parties.map((party, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-between border-bottom py-2 px-2 bg-light align-items-center"
                >
                  <span>{party.name}</span>
                  <span className="text-success fw-semibold">
                    {party.transactions[0].balance.replace("₹ ", "")}
                  </span>
                </div>
              ))}

              {/* <div className="mt-3 bg-light p-2 rounded text-center small text-muted">
                Easily convert your <b>Phone contacts</b> into parties
              </div> */}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Side: Party Details */}
        <Col md={9}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              {parties.map((party, index) => (
                <div key={index}>
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                    <h6 className="fw-semibold mb-0">
                      {party.name} <FaEdit className="text-primary ms-2" />
                    </h6>
                  </div>

                  <div className="mb-3">
                    <p className="mb-1"><b>Phone Number:</b> {party.phone}</p>
                    <p className="mb-0"><b>Email:</b> {party.email}</p>
                  </div>

                  <h6 className="fw-semibold border-bottom pb-2">Transactions</h6>
                  <Table hover responsive className="align-middle text-center">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Number</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {party.transactions.map((txn, i) => (
                        <tr key={i} className="bg-light">
                          <td>{txn.type}</td>
                          <td>{txn.number}</td>
                          <td>{txn.date}</td>
                          <td>{txn.total}</td>
                          <td>{txn.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ))}

              {/* Buttons */}
              {/* <div className="d-flex justify-content-end gap-2">
                <ActionButton
                  label={<FaPrint />}
                  options={[{ label: "Print", onClick: () => alert("Print clicked") }]}
                />
                <Buttons type="button" className="btn btn-success" btnlabel="xls" />
              </div> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Parties;
// import React, { useEffect } from "react";
// import { Row, Col, Card, Table, Form } from "react-bootstrap";
// import { Buttons, ActionButton } from "../../../components/Buttons";
// import { FaEdit, FaPrint } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
// import { addParty } from "../../../slice/partySlice";

// function Parties() {
//   const dispatch = useDispatch();
//   const parties = useSelector((state) => state.party.parties);

//   useEffect(() => {
//     // Add static data only if no parties exist
//     if (parties.length === 0) {
//       const staticParties = [
//         {
//           name: "Yash",
//           phone: "9342606037",
//           email: "yasvindhini@gmail.com",
//           transactions: [
//             {
//               type: "Sale",
//               number: 1,
//               date: "09/11/2025",
//               total: "₹ 100.00",
//               balance: "₹ 100.00",
//             },
//           ],
//         },
//       ];

//       staticParties.forEach((party) => dispatch(addParty(party)));
//     }
//   }, [dispatch, parties]);

//   return (
//     <main className="flex-grow-1 p-3" style={{ overflowX: "hidden" }}>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h5 className="fw-bold text-muted">
//           <span className="text-danger">•</span> Enter Business Name
//         </h5>
//         <div className="d-flex gap-2">
//           <Buttons
//             type="button"
//             className="btn btn-danger rounded-pill px-3"
//             btnlabel="+ Add Sale"
//           />
//           <Buttons
//             type="button"
//             className="btn btn-primary rounded-pill px-3"
//             btnlabel="+ Add Purchase"
//           />
//           <Buttons
//             type="button"
//             className="btn btn-danger rounded-pill px-3"
//             btnlabel="+ Add Party"
//           />
//         </div>
//       </div>

//       <Row>
//         {/* Left Side: Party List */}
//         <Col md={3}>
//           <Card className="shadow-sm border-0">
//             <Card.Header className="bg-white border-bottom fw-semibold">
//               Parties ▼
//             </Card.Header>
//             <Card.Body className="p-2">
//               <Form.Control
//                 type="text"
//                 placeholder="Search Party Name"
//                 className="mb-2"
//               />

//               {parties.map((party, index) => (
//                 <div
//                   key={index}
//                   className="d-flex justify-content-between border-bottom py-2 px-2 bg-light align-items-center"
//                 >
//                   <span>{party.name}</span>
//                   <span className="text-success fw-semibold">
//                     {party.transactions[0].balance.replace("₹ ", "")}
//                   </span>
//                 </div>
//               ))}

//               <div className="mt-3 bg-light p-2 rounded text-center small text-muted">
//                 Easily convert your <b>Phone contacts</b> into parties
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Right Side: Party Details */}
//         <Col md={9}>
//           <Card className="shadow-sm border-0">
//             <Card.Body>
//               {parties.map((party, index) => (
//                 <div key={index}>
//                   <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
//                     <h6 className="fw-semibold mb-0">
//                       {party.name} <FaEdit className="text-primary ms-2" />
//                     </h6>
//                   </div>

//                   <div className="mb-3">
//                     <p className="mb-1">
//                       <b>Phone Number:</b> {party.phone}
//                     </p>
//                     <p className="mb-0">
//                       <b>Email:</b> {party.email}
//                     </p>
//                   </div>

//                   <h6 className="fw-semibold border-bottom pb-2">
//                     Transactions
//                   </h6>
//                   <Table hover responsive className="align-middle text-center">
//                     <thead>
//                       <tr>
//                         <th>Type</th>
//                         <th>Number</th>
//                         <th>Date</th>
//                         <th>Total</th>
//                         <th>Balance</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {party.transactions.map((txn, i) => (
//                         <tr key={i} className="bg-light">
//                           <td>{txn.type}</td>
//                           <td>{txn.number}</td>
//                           <td>{txn.date}</td>
//                           <td>{txn.total}</td>
//                           <td>{txn.balance}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               ))}

//               {/* Buttons */}
//               <div className="d-flex justify-content-end gap-2">
//                 <ActionButton
//                   label={<FaPrint />}
//                   options={[
//                     { label: "Print", onClick: () => alert("Print clicked") },
//                   ]}
//                 />
//                 <Buttons
//                   type="button"
//                   className="btn btn-success"
//                   btnlabel="xls"
//                 />
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </main>
//   );
// }

// export default Parties;

