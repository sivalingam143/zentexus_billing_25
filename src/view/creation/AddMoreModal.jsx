// // src/components/AddMoreModal.jsx
// import React from "react";
// import { Modal } from "react-bootstrap";
// import "./AddMoreModal.css";

// function AddMoreModal({ show, onHide }) {
//   const handleOptionClick = (action) => {
//     console.log(`Selected: ${action}`);
//     onHide();
//   };

//   return (
//     <Modal
//       show={show}
//       onHide={onHide}
//       centered
//       size="sm"
//       dialogClassName="add-more-modal"
//       backdrop="static"
//       keyboard={false}
//     >
//       <Modal.Body className="p-0">
//         {/* Header */}
//         <div className="modal-header-section">
//           <h6>Create New...</h6>
//         </div>

//         {/* SALE Section */}
//         <div>
//           <div className="section-header sale-section"># SALE</div>
//           {[
//             { label: "Sale Invoice", shortcut: "Alt + S" },
//             { label: "Payment-In", shortcut: "Alt + I" },
//             { label: "Sale Return", shortcut: "Alt + R" },
//             { label: "Dr Note", shortcut: "" },
//             { label: "Sale Order", shortcut: "Alt + F" },
//             { label: "Estimate/Quotation", shortcut: "Alt + M" },
//             { label: "Proforma Invoice", shortcut: "Alt + K" },
//             { label: "Delivery Challan", shortcut: "Alt + D" },
//           ].map((item, idx) => (
//             <div
//               key={idx}
//               className="menu-item"
//               onClick={() => handleOptionClick(item.label)}
//             >
//               <span className="item-label">{item.label}</span>
//               {item.shortcut ? (
//                 <span className="item-shortcut">{item.shortcut}</span>
//               ) : (
//                 <span style={{ width: "70px" }}></span> 
//               )}
//             </div>
//           ))}
//         </div>

//         {/* PURCHASE Section */}
//         <div>
//           <div className="section-header purchase-section"># PURCHASE</div>
//           {[
//             { label: "Purchase Bill", shortcut: "Alt + P" },
//             { label: "Payment-Out", shortcut: "Alt + O" },
//             { label: "Purchase Return", shortcut: "Alt + L" },
//             { label: "Dr Note", shortcut: "" },
//             { label: "Purchase Order", shortcut: "Alt + G" },
//           ].map((item, idx) => (
//             <div
//               key={idx}
//               className="menu-item"
//               onClick={() => handleOptionClick(item.label)}
//             >
//               <span className="item-label">{item.label}</span>
//               {item.shortcut ? (
//                 <span className="item-shortcut">{item.shortcut}</span>
//               ) : (
//                 <span style={{ width: "70px" }}></span>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* OTHERS Section */}
//         <div>
//           <div className="section-header others-section"># OTHERS</div>
//           {[
//             { label: "Expenses", shortcut: "Alt + E" },
//             { label: "Party To Party Transfer", shortcut: "Alt + J" },
//           ].map((item, idx) => (
//             <div
//               key={idx}
//               className="menu-item"
//               onClick={() => handleOptionClick(item.label)}
//             >
//               <span className="item-label">{item.label}</span>
//               <span className="item-shortcut">{item.shortcut}</span>
//             </div>
//           ))}
//         </div>

//         {/* Footer */}
//         <div className="modal-footer-section">
//           <span>Shortcut to open this menu :</span>
//           <div className="d-flex align-items-center gap-2">
//             <kbd className="shortcut-key">Ctrl</kbd>
//             <span>+</span>
//             <kbd className="shortcut-key">Enter</kbd>
//           </div>
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// }

// export default AddMoreModal;

// AddMoreModal.jsx - 100% YOUR IMAGE
import React from "react";
import { Modal } from "react-bootstrap";
import "./AddMoreModal.css";

const AddMoreModal = ({ show, onHide }) => {
  const handleClick = (name) => {
    console.log("Selected:", name);
    onHide();
  };

  const Column = ({ items }) => (
    <div className="column">
      {items.map((it, idx) => (
        <div key={idx}>
          <div
            className={`item ${idx === 0 ? "first-item" : ""}`}
            onClick={() => handleClick(it.label)}
          >
            <span className="label">{it.label}</span>
            {it.shortcut && <span className="shortcut">{it.shortcut}</span>}
          </div>
          {it.sub && <div className="subnote">{it.sub}</div>}
        </div>
      ))}
    </div>
  );

  const saleItems = [
    { label: "Sale Invoice", shortcut: "Alt + S" },
    { label: "Payment-In", shortcut: "Alt + I" },
    { label: "Sale Return", shortcut: "Alt + R", sub: "Cr Note" },
    { label: "Sale Order", shortcut: "Alt + F" },
    { label: "Estimate/Quotation", shortcut: "Alt + M" },
    { label: "Proforma Invoice", shortcut: "Alt + K" },
    { label: "Delivery Challan", shortcut: "Alt + D" },
  ];

  const purchaseItems = [
    { label: "Purchase Bill", shortcut: "Alt + P" },
    { label: "Payment-Out", shortcut: "Alt + O" },
    { label: "Purchase Return", shortcut: "Alt + L", sub: "Dr Note" },
    { label: "Purchase Order", shortcut: "Alt + G" },
  ];

  const othersItems = [
    { label: "Expenses", shortcut: "Alt + E" },
    { label: "Party To Party Transfer", shortcut: "Alt + J" },
  ];

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="add-more-modal"
      backdrop={true}           // Click outside → closes
      keyboard={true}
    >
      <Modal.Body className="p-0">
        {/* Header */}
        <div className="header-row">
          <div className="header-col">SALE</div>
          <div className="header-col">PURCHASE</div>
          <div className="header-col">OTHERS</div>
        </div>

        {/* Body */}
        <div className="columns">
          <Column items={saleItems} />
          <Column items={purchaseItems} />
          <Column items={othersItems} />
        </div>

        {/* Footer */}
        <div className="footer">
          <span>Shortcut to open this menu :</span>
          <div className="d-flex align-items-center gap-2">
            <kbd>Ctrl</kbd>
            <span style={{ color: "#856404" }}>+</span>
            <kbd>Enter</kbd>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddMoreModal;