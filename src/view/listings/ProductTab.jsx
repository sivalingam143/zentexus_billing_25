// src/pages/tabs/ProductTab.jsx   (or src/listings/ProductTab.jsx)
import React, { useState,useEffect } from "react";
import { Button, Table, Col, Card } from "react-bootstrap";
import { FaSearch, FaFileExcel } from "react-icons/fa";   // ← Fixed import
import AdjustItem from "../creation/AdjustItemCreation";
import AddItem from "../creation/ItemModalCreation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../slice/ProductSlice";


export default function ProductTab() {
  const [showAdjustItem, setShowAdjustItem] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.product);

  useEffect(() => {
  console.log("Fetching products...");
  dispatch(fetchProducts());
}, [dispatch]);

const { units = [] } = useSelector((state) => state.unit);

  return (
    <>
      {/* Left Panel */}
      <Col md={3} className="d-flex flex-column p-3">
        <Card className="h-100">
          <Card.Body className="d-flex flex-column p-0">
            <div className="p-3 d-flex justify-content-between align-items-center">
              <FaSearch />
              <Button variant="warning" className="text-white fw-bold px-3" onClick={() => setShowAddItem(true)}>
                + Add Item
              </Button>
            </div>

            <Table responsive bordered hover size="sm" className="mb-0 text-start">
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th>QUANTITY</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>sampleee</td>
                  <td>0</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>

      {/* Right Panel */}
      <Col md={9} className="p-3 d-flex flex-column" style={{ height: "100%" }}>
        {/* Detail Card – ADJUST ITEM button is here */}
        <Card className="mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="fw-bold mb-1">SAMPLEEE</h6>
                <div className="small mb-1">
                  SALE PRICE: <span className="text-success">₹ 0.00</span> (excl)
                </div>
                <div className="small mb-1">
                  PURCHASE PRICE: <span className="text-success">₹ 0.00</span> (excl)
                </div>
              </div>

              <div className="text-end">
                <Button
                  variant="primary"
                  className="mb-2 fw-semibold text-black px-4 py-2"
                  style={{ 
    borderRadius: "6px",
    
  }}
                  onClick={() => setShowAdjustItem(true)}
                >
                  ADJUST ITEM
                </Button>
                <div className="small fw-normal">
                  <span className="text-danger">Warning</span> STOCK QUANTITY:{" "}
                  <span className="text-danger">0</span>
                </div>
                <div className="small fw-normal">
                  STOCK VALUE: <span className="text-success">₹ 0.00</span>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Transactions Card */}
        <Card className="flex-grow-1 d-flex flex-column">
          <Card.Body className="d-flex flex-column h-100 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">TRANSACTIONS</h5>
              <div className="d-flex align-items-center gap-2">
                <div style={{ position: "relative", width: "200px" }}>
                  <FaSearch
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "gray",
                    }}
                  />
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{ paddingLeft: "30px" }}
                    placeholder="Search..."
                  />
                </div>
                {/* Fixed Excel button */}
                <Button variant="light">
                  <FaFileExcel size={20} color="#217346" />
                </Button>
              </div>
            </div>

            <Table responsive bordered hover size="sm" className="pro-table text-center mt-3">
              <thead>
                <tr>
                  <th>TYPE</th>
                  <th>INVOICE</th>
                  <th>NAME</th>
                  <th>DATE</th>
                  <th>QUANTITY</th>
                  <th>PRICE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody />
            </Table>

            <div className="flex-grow-1 d-flex justify-content-center align-items-center">
              <span className="text-muted">No Rows to Show</span>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Modals */}
      <AdjustItem show={showAdjustItem} onHide={() => setShowAdjustItem(false)} itemName="SAMPLEEE" />
      <AddItem show={showAddItem} onHide={() => setShowAddItem(false)} activeTab="PRODUCT" />
    </>
  );
}







// // src/pages/tabs/ProductTab.jsx
// import React, { useState, useEffect } from "react";
// import { Button, Table, Col, Card } from "react-bootstrap";
// import { FaSearch, FaFileExcel } from "react-icons/fa";
// import AdjustItem from "../creation/AdjustItemCreation";
// import AddItem from "../creation/ItemModalCreation";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "../../slice/ProductSlice"; // Note: your import path

// export default function ProductTab() {
//   const [showAdjustItem, setShowAdjustItem] = useState(false);
//   const [showAddItem, setShowAddItem] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null); // For detail card
//   const dispatch = useDispatch();
//   const { products = [], status, error } = useSelector((state) => state.product);

//   useEffect(() => {
//     console.log("🔄 Fetching products...");
//     dispatch(fetchProducts("")); // Empty search = all products
//   }, [dispatch]);

//   // Select first product for detail card (or change on click)
//   useEffect(() => {
//     if (products.length > 0 && !selectedProduct) {
//       setSelectedProduct(products[0]);
//     }
//   }, [products, selectedProduct]);

//   if (status === "loading") return <div className="text-center p-4">Loading products...</div>;
//   if (error) return <div className="text-danger p-4">Error: {error}</div>;
//   if (products.length === 0) return <div className="text-muted p-4">No products found. Add one!</div>;

//   // Pass categories and units to modal (hardcoded for now — replace with Redux later)
//   const categories = [{ id: 1, category_name: "Electronics" }, { id: 2, category_name: "Clothing" }];
//   const units = [{ unit_name: "Piece", short_name: "pc" }, { unit_name: "Kg", short_name: "kg" }];

//   return (
//     <>
//       {/* Left Panel - NOW SHOWS REAL PRODUCTS */}
//       <Col md={3} className="d-flex flex-column p-3">
//         <Card className="h-100">
//           <Card.Body className="d-flex flex-column p-0">
//             <div className="p-3 d-flex justify-content-between align-items-center">
//               <FaSearch />
//               <Button variant="warning" className="text-white fw-bold px-3" onClick={() => setShowAddItem(true)}>
//                 + Add Item
//               </Button>
//             </div>

//             <Table responsive bordered hover size="sm" className="mb-0 text-start">
//               <thead>
//                 <tr>
//                   <th>ITEM</th>
//                   <th>QUANTITY</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map((product) => (
//                   <tr key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
//                     <td>{product.item_name || "Unnamed"}</td>
//                     <td>{product.stock || 0}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>
//       </Col>

//       {/* Right Panel - NOW SHOWS SELECTED PRODUCT DETAILS */}
//       <Col md={9} className="p-3 d-flex flex-column" style={{ height: "100%" }}>
//         {selectedProduct ? (
//           <Card className="mb-3">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-start">
//                 <div>
//                   <h6 className="fw-bold mb-1">{selectedProduct.item_name}</h6>
//                   <div className="small mb-1">
//                     SALE PRICE: <span className="text-success">₹ {parseFloat(selectedProduct.sale_price || 0).toFixed(2)}</span> (excl)
//                   </div>
//                   <div className="small mb-1">
//                     PURCHASE PRICE: <span className="text-success">₹ {parseFloat(selectedProduct.purchase_price || 0).toFixed(2)}</span> (excl)
//                   </div>
//                   <div className="small mb-1">
//                     TYPE: <span className="text-primary">{selectedProduct.type}</span>
//                   </div>
//                 </div>

//                 <div className="text-end">
//                   <Button
//                     variant="primary"
//                     className="mb-2 fw-semibold text-black px-4 py-2"
//                     style={{ borderRadius: "6px" }}
//                     onClick={() => setShowAdjustItem(true)}
//                   >
//                     ADJUST ITEM
//                   </Button>
//                   <div className="small fw-normal">
//                     <span className="text-danger">Warning</span> STOCK QUANTITY: <span className="text-danger">{selectedProduct.stock || 0}</span>
//                   </div>
//                   <div className="small fw-normal">
//                     STOCK VALUE: <span className="text-success">₹ {(selectedProduct.stock * selectedProduct.purchase_price || 0).toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         ) : (
//           <Card className="mb-3">
//             <Card.Body className="text-center text-muted">Select a product from left panel</Card.Body>
//           </Card>
//         )}

//         {/* Transactions Card */}
//         <Card className="flex-grow-1 d-flex flex-column">
//           <Card.Body className="d-flex flex-column h-100 p-3">
//             <div className="d-flex justify-content-between align-items-center mb-2">
//               <h5 className="mb-0">TRANSACTIONS</h5>
//               <div className="d-flex align-items-center gap-2">
//                 <div style={{ position: "relative", width: "200px" }}>
//                   <FaSearch
//                     style={{
//                       position: "absolute",
//                       left: "10px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       color: "gray",
//                     }}
//                   />
//                   <input
//                     type="text"
//                     className="form-control form-control-sm"
//                     style={{ paddingLeft: "30px" }}
//                     placeholder="Search..."
//                   />
//                 </div>
//                 <Button variant="light">
//                   <FaFileExcel size={20} color="#217346" />
//                 </Button>
//               </div>
//             </div>

//             <Table responsive bordered hover size="sm" className="pro-table text-center mt-3">
//               <thead>
//                 <tr>
//                   <th>TYPE</th>
//                   <th>INVOICE</th>
//                   <th>NAME</th>
//                   <th>DATE</th>
//                   <th>QUANTITY</th>
//                   <th>PRICE</th>
//                   <th>STATUS</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {/* Add transaction data here later */}
//                 <tr>
//                   <td colSpan="7" className="text-muted">No transactions yet</td>
//                 </tr>
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>
//       </Col>

//       {/* Modals - NOW PASSING PROPS */}
//       <AdjustItem show={showAdjustItem} onHide={() => setShowAdjustItem(false)} itemName={selectedProduct?.item_name} />
//       <AddItem 
//         show={showAddItem} 
//         onHide={() => setShowAddItem(false)} 
//         activeTab="PRODUCT" 
//         categories={categories}  // ← NOW PASSED
//         units={units}           // ← NOW PASSED
//       />
//     </>
//   );
// }