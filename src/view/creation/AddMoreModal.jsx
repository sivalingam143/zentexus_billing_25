import React from "react";
import { Modal } from "react-bootstrap";
import "./AddMoreModal.css";

const AddMoreModal = ({ show, onHide }) => {
  const handleClick = (name) => {
    console.log("Selected:", name);
    onHide();
  };

  const Column = ({ items, title }) => (
    <div className="column">
      <div className="column-header">{title}</div>
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
        {/* Header */}
        <div className="header-row">
          <div className="header-col">SALE</div>
          <div className="header-col">PURCHASE</div>
          <div className="header-col">OTHERS</div>
        </div>

        {/* Body - 3 Columns */}
        <div className="columns">
          <Column items={saleItems} title="SALE" />
          <Column items={purchaseItems} title="PURCHASE" />
          <Column items={othersItems} title="OTHERS" />
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