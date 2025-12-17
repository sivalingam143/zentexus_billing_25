// import React from "react";
// import { Modal } from "react-bootstrap";
// import "./AddMoreModal.css";

// const AddMoreModal = ({ show, onHide }) => {
//   const handleClick = (name) => {
//     console.log("Selected:", name);
//     onHide();
//   };

//   const Column = ({ items, title }) => (
//     <div className="column">
//       <div className="column-header">{title}</div>
//       {items.map((it, idx) => (
//         <div key={idx}>
//           <div
//             className={`item ${idx === 0 ? "first-item" : ""}`}
//             onClick={() => handleClick(it.label)}
//           >
//             <span className="label">{it.label}</span>
//             {it.shortcut && <span className="shortcut">{it.shortcut}</span>}
//           </div>
//           {it.sub && <div className="subnote">{it.sub}</div>}
//         </div>
//       ))}
//     </div>
//   );

//   const saleItems = [
//     { label: "Sale Invoice", shortcut: "Alt + S" },
//     { label: "Payment-In", shortcut: "Alt + I" },
//     { label: "Sale Return", shortcut: "Alt + R", sub: "Cr Note" },
//     { label: "Sale Order", shortcut: "Alt + F" },
//     { label: "Estimate/Quotation", shortcut: "Alt + M" },
//     { label: "Proforma Invoice", shortcut: "Alt + K" },
//     { label: "Delivery Challan", shortcut: "Alt + D" },
//   ];

//   const purchaseItems = [
//     { label: "Purchase Bill", shortcut: "Alt + P" },
//     { label: "Payment-Out", shortcut: "Alt + O" },
//     { label: "Purchase Return", shortcut: "Alt + L", sub: "Dr Note" },
//     { label: "Purchase Order", shortcut: "Alt + G" },
//   ];

//   const othersItems = [
//     { label: "Expenses", shortcut: "Alt + E" },
//     { label: "Party To Party Transfer", shortcut: "Alt + J" },
//     { label: "Journal Entry", shortcut: "Alt + T" },
//     { label: "Credit Note", shortcut: "Alt + N" },
//     { label: "Debit Note", shortcut: "Alt + B" },
//   ];

//   return (
//     <Modal
//       show={show}
//       onHide={onHide}
//       centered
//       size="lg"
//       dialogClassName="add-more-modal"
//       backdrop={true}
//       keyboard={true}
//     >
//       <Modal.Body className="p-0">
//         {/* Header */}
//         <div className="header-row">
//           <div className="header-col">SALE</div>
//           <div className="header-col">PURCHASE</div>
//           <div className="header-col">OTHERS</div>
//         </div>

//         {/* Body - 3 Columns */}
//         <div className="columns">
//           <Column items={saleItems} title="SALE" />
//           <Column items={purchaseItems} title="PURCHASE" />
//           <Column items={othersItems} title="OTHERS" />
//         </div>

//         {/* Footer */}
//         <div className="footer">
//           <span>Shortcut to open this menu :</span>
//           <div className="d-flex align-items-center gap-2">
//             <kbd>Ctrl</kbd>
//             <span style={{ color: "#856404" }}>+</span>
//             <kbd>Enter</kbd>
//           </div>
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default AddMoreModal;

import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./AddMoreModal.css";

const AddMoreModal = ({ show, onHide }) => {
  const navigate = useNavigate();

  
  const handleClick = (item) => {
    console.log("Selected:", item.label);
    
    // Define route mappings
    const routeMap = {
      "Sale Invoice": "/sale/create",
      "Payment-In": "/payments/in",
      "Sale Return": "/sale/return",
      "Sale Order": "/sale/order",
      "Estimate/Quotation": "/estimate/create",
      "Proforma Invoice": "/proforma/create",
      "Delivery Challan": "/delivery/challan",
      "Purchase Bill": "/purchase/create",
      "Payment-Out": "/payments/out",
      "Purchase Return": "/purchase/return",
      "Purchase Order": "/purchase/order",
      "Expenses": "/expenses",
      "Party To Party Transfer": "/party/transfer",
      "Journal Entry": "/journal/entry",
      "Credit Note": "/credit/note",
      "Debit Note": "/debit/note"
    };

    
    if (routeMap[item.label]) {
      navigate(routeMap[item.label]);
    } else {
      console.warn(`Route not defined for: ${item.label}`);
    }
    
    
    onHide();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only listen when modal is open
      if (!show) return;

      // Check for Alt + key combinations
      if (e.altKey) {
        e.preventDefault();
        
        // Map keys to actions
        const shortcutMap = {
          'S': "Sale Invoice",
          'I': "Payment-In",
          'R': "Sale Return",
          'F': "Sale Order",
          'M': "Estimate/Quotation",
          'K': "Proforma Invoice",
          'D': "Delivery Challan",
          'P': "Purchase Bill",
          'O': "Payment-Out",
          'L': "Purchase Return",
          'G': "Purchase Order",
          'E': "Expenses",
          'J': "Party To Party Transfer",
          'T': "Journal Entry",
          'N': "Credit Note",
          'B': "Debit Note"
        };

        const key = e.key.toUpperCase();
        if (shortcutMap[key]) {
          handleClick({ label: shortcutMap[key] });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [show, navigate]);

  const Column = ({ items, title }) => (
    <div className="column">
      <div className="column-header">{title}</div>
      {items.map((it, idx) => (
        <div key={idx}>
          <div
            className={`item ${idx === 0 ? "first-item" : ""}`}
            onClick={() => handleClick(it)}
            title={`Click or press ${it.shortcut}`}
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
    { label: "Journal Entry", shortcut: "Alt + T" },
    { label: "Credit Note", shortcut: "Alt + N" },
    { label: "Debit Note", shortcut: "Alt + B" },
  ];

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      dialogClassName="add-more-modal"
      backdrop={true}
      keyboard={true}
    >
      <Modal.Body className="p-0">
        <div className="header-row">
          <div className="header-col">SALE</div>
          <div className="header-col">PURCHASE</div>
          <div className="header-col">OTHERS</div>
        </div>

        <div className="columns">
          <Column items={saleItems} title="SALE" />
          <Column items={purchaseItems} title="PURCHASE" />
          <Column items={othersItems} title="OTHERS" />
        </div>

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