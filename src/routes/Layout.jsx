// // src/components/Layout.js
// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import SideBar from '../components/sidebar/SideBar';
// import Header from '../components/sidebar/Header';

// const Layout = ({ children }) => {
//   const location = useLocation();
//   const isLoginPage = location.pathname === '/';

//   return (
//     <>
//       <Header />
//       {!isLoginPage && <SideBar />}
//       <div className={isLoginPage ? 'login-content' : 'content'}>
//         {children}
//       </div>
//     </>
//   );
// };

// export default Layout;



import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import SideBar from '../components/sidebar/SideBar';
import Header from '../components/sidebar/Header';
import AddMoreModal from '../view/creation/AddMoreModal';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === '/';
  const [showModal, setShowModal] = useState(false);

  // GLOBAL KEYBOARD SHORTCUTS
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. Ctrl+Enter: Open Quick Actions Modal
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        setShowModal(true);
      }
      
      // 2. Alt+S: Directly open Sale Invoice (ANYWHERE)
      if (e.altKey && e.key.toUpperCase() === 'S') {
        e.preventDefault();
        navigate('/sale/create'); // Direct navigation
      }
      
      // 3. Alt+P: Directly open Purchase Bill
      if (e.altKey && e.key.toUpperCase() === 'P') {
        e.preventDefault();
        navigate('/purchase/create');
      }
      
      // 4. Alt+M: Directly open Estimate
      if (e.altKey && e.key.toUpperCase() === 'M') {
        e.preventDefault();
        navigate('/estimate/create');
      }
      
      // 5. Alt+E: Directly open Expenses
      if (e.altKey && e.key.toUpperCase() === 'E') {
        e.preventDefault();
        navigate('/expenses');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]); // ADD navigate to dependencies

  return (
    <>
      <Header />
      {!isLoginPage && <SideBar />}
      <div className={isLoginPage ? 'login-content' : 'content'}>
        {children}
      </div>
      
      <AddMoreModal
        show={showModal}
        onHide={() => setShowModal(false)}
      />
    </>
  );
};

export default Layout;