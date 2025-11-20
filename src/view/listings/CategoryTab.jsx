// // src/listings/CategoryTab.jsx
// import React, { useState, useEffect } from "react";
// import { Button, Table, Col, Card, Spinner } from "react-bootstrap";
// import { FaSearch, FaFileExcel } from "react-icons/fa";
// import AddCate from "../creation/CategoryModalCreation";
// import { fetchCategories } from "../../services/ItemService";

// export default function CategoryTab() {
//   const [showCategoryModal, setShowCategoryModal] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchAllCategories = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchCategories();
//       setCategories(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllCategories();
//   }, []);

//   return (
//     <>
//       <Col md={3} className="d-flex flex-column p-3">
//         <Card className="h-100">
//           <Card.Body className="d-flex flex-column p-0">
//             <div className="p-3 d-flex justify-content-between align-items-center">
//               <FaSearch />
//               <Button variant="warning" className="text-white fw-bold px-3" onClick={() => setShowCategoryModal(true)}>
//                 + Add Category
//               </Button>
//             </div>
//             <Table responsive bordered hover size="sm" className="mb-0 text-start">
//               <thead>
//                 <tr>
//                   <th>CATEGORY</th>
//                   <th>ITEM</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="fw-bold">
//                   <td>Items not in category</td>
//                   <td>2</td>
//                 </tr>
//                 {loading ? (
//                   <tr><td colSpan={2} className="text-center"><Spinner animation="border" size="sm" /> Loading...</td></tr>
//                 ) : categories.length > 0 ? (
//                   categories.map((cat) => (
//                     <tr key={cat.id}>
//                       <td>{cat.category_name}</td>
//                       <td>{cat.item_count || 0}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr><td colSpan={2} className="text-center text-muted">No Categories Found</td></tr>
//                 )}
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>
//       </Col>

//       <Col md={9} className="p-3 d-flex flex-column">
//         <Card className="mb-3">
//           <Card.Body>
//             <div className="d-flex justify-content-between align-items-start mb-3 mt-0">
//               <div>
//                 <h6 className="fw-bold mb-1">ITEMS NOT IN ANY CATEGORY</h6>
//                 <div className="small mb-1">2</div>
//               </div>
//               <div className="text-end">
//                 <Button variant="primary" className="mb-2 fw-semibold text-white p-3">ADJUST ITEM</Button>
//               </div>
//             </div>
//           </Card.Body>
//         </Card>

//         <Card className="flex-grow-1 d-flex flex-column">
//           <Card.Body className="d-flex flex-column h-100 p-3">
//             <div className="d-flex justify-content-between align-items-center mb-2">
//               <h5 className="mb-0">TRANSACTIONS</h5>
//               <div className="d-flex align-items-center" style={{ gap: "8px" }}>
//                 <div style={{ position: "relative", width: "200px" }}>
//                   <FaSearch style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "gray" }} />
//                   <input type="text" className="form-control form-control-sm" style={{ paddingLeft: "30px" }} placeholder="Search..." />
//                 </div>
//                 <Button variant="light"><FaFileExcel size={20} color="#217346" /></Button>
//               </div>
//             </div>
//             <Table responsive bordered hover size="sm" className="pro-table text-center mt-3 text-muted">
//               <thead>
//                 <tr>
//                   <th>NAME</th><th>QUANTITY</th><th>STOCK VALUE</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr><td>Sampleee</td><td className="text-danger">0</td><td className="text-success">₹ 0.00</td></tr>
//                 <tr><td>Service</td><td className="text-danger">0</td><td className="text-success">₹ 0.00</td></tr>
//               </tbody>
//             </Table>
//             <div className="flex-grow-1 d-flex justify-content-center align-items-center">
//               <span className="text-muted">No Rows to Show</span>
//             </div>
//           </Card.Body>
//         </Card>
//       </Col>

//       <AddCate show={showCategoryModal} onHide={() => setShowCategoryModal(false)} onSaveSuccess={fetchAllCategories} />
//     </>
//   );
// }





// src/listings/CategoryTab.jsx
import React, { useEffect, useState } from "react";
import { Button, Table, Col, Card, Spinner, DropdownButton, Dropdown } from "react-bootstrap";
import { FaSearch, FaFileExcel, FaEllipsisV } from "react-icons/fa";
import AddCate from "../creation/CategoryModalCreation";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, deleteCategory } from "../../slice/CategorySlice";

export default function CategoryTab() {
  const dispatch = useDispatch();
  const { categories, status } = useSelector((state) => state.category);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const loadCategories = () => {
    dispatch(fetchCategories());
  };

  useEffect(() => {
    loadCategories();
  }, [dispatch]);

  const categoryRows = categories.map((cat) => (
    <tr key={cat.category_id || cat.id}>
      <td>{cat.category_name}</td>
      <td>{cat.item_count || 0}</td>
      <td className="text-center">
        <DropdownButton
          title={<FaEllipsisV />}
          variant="light"
          size="sm"
          className="p-0 border-0 bg-transparent"
        >
          <Dropdown.Item
            onClick={() => {
              setSelectedCategory(cat);
              setShowCategoryModal(true);
            }}
          >
            Edit
          </Dropdown.Item>
          <Dropdown.Item
            className="text-danger"
            onClick={() => {
              if (window.confirm("Delete this category?")) {
                dispatch(deleteCategory(cat.category_id));
              }
            }}
          >
            Delete
          </Dropdown.Item>
        </DropdownButton>
      </td>
    </tr>
  ));

  return (
    <>
      <Col md={3} className="d-flex flex-column p-3">
        <Card className="h-100">
          <Card.Body className="d-flex flex-column p-0">
            <div className="p-3 d-flex justify-content-between align-items-center">
              <FaSearch />
              <Button
                variant="warning"
                className="text-white fw-bold px-3"
                onClick={() => {
                  setSelectedCategory(null);
                  setShowCategoryModal(true);
                }}
              >
                + Add Category
              </Button>
            </div>
            <Table responsive bordered hover size="sm" className="mb-0 text-start">
              <thead>
                <tr>
                  <th>CATEGORY</th>
                  <th>ITEM</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr className="fw-bold">
                  <td>Items not in category</td>
                  <td>2</td>
                  <td></td>
                </tr>
                {status === "loading" ? (
                  <tr>
                    <td colSpan={3} className="text-center">
                      <Spinner animation="border" size="sm" /> Loading...
                    </td>
                  </tr>
                ) : categoryRows.length > 0 ? (
                  categoryRows
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-muted">
                      No Categories Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>

       <Col md={9} className="p-3 d-flex flex-column">
       <Card className="mb-3">
           <Card.Body>
             <div className="d-flex justify-content-between align-items-start mb-3 mt-0">
               <div>
                 <h6 className="fw-bold mb-1">ITEMS NOT IN ANY CATEGORY</h6>
                 <div className="small mb-1">2</div>
               </div>
               <div className="text-end">
                 <Button variant="primary" className="mb-2 fw-semibold text-white p-3">ADJUST ITEM</Button>
               </div>
             </div>
           </Card.Body>
         </Card>

         <Card className="flex-grow-1 d-flex flex-column">
                     <Card.Body className="d-flex flex-column h-100 p-3">
             <div className="d-flex justify-content-between align-items-center mb-2">
               <h5 className="mb-0">TRANSACTIONS</h5>
               <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                 <div style={{ position: "relative", width: "200px" }}>
                   <FaSearch style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "gray" }} />
                   <input type="text" className="form-control form-control-sm" style={{ paddingLeft: "30px" }} placeholder="Search..." />
                 </div>
                                  <Button variant="light"><FaFileExcel size={20} color="#217346" /></Button>
              </div>
             </div>
             <Table responsive bordered hover size="sm" className="pro-table text-center mt-3 text-muted">
               <thead>
                                 <tr>
                  <th>NAME</th><th>QUANTITY</th><th>STOCK VALUE</th>
                 </tr>
               </thead>
               <tbody>
                 <tr><td>Sampleee</td><td className="text-danger">0</td><td className="text-success">₹ 0.00</td></tr>
                 <tr><td>Service</td><td className="text-danger">0</td><td className="text-success">₹ 0.00</td></tr>
               </tbody>
             </Table>
             <div className="flex-grow-1 d-flex justify-content-center align-items-center">
               <span className="text-muted">No Rows to Show</span>
             </div>
                        </Card.Body>
         </Card>
      </Col>

      <AddCate
        show={showCategoryModal}
        onHide={() => {
          setShowCategoryModal(false);
          setSelectedCategory(null);
        }}
        onSaveSuccess={loadCategories}
        categoryToEdit={selectedCategory}
      />
    </>
  );
}