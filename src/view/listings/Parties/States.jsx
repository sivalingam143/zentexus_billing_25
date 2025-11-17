// import React from "react";

// const indiaStates = [
//   "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
//   "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
//   "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
//   "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
//   "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
//   "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
//   "Chandigarh", "Dadra and Nagar Haveli and Daman & Diu", "Delhi",
//   "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
// ];

//  function StateSelect() {
//   return (
//     <>
//       {/* <option>Select State</option> */}
//       {indiaStates.map((state, index) => (
//         <option key={index}>{state}</option>
//       ))}
//     </>
//   );
// }
// export default StateSelect

import React from "react";

// The state list is converted to objects with id and name (State Code/ID)
const indiaStatesData = [
  { id: 1, name: "Andhra Pradesh" },
  { id: 2, name: "Arunachal Pradesh" },
  { id: 3, name: "Assam" },
  { id: 4, name: "Bihar" },
  { id: 5, name: "Chhattisgarh" },
  { id: 6, name: "Goa" },
  { id: 7, name: "Gujarat" },
  { id: 8, name: "Haryana" },
  { id: 9, name: "Himachal Pradesh" },
  { id: 10, name: "Jharkhand" },
  { id: 11, name: "Karnataka" },
  { id: 12, name: "Kerala" },
  { id: 13, name: "Madhya Pradesh" },
  { id: 14, name: "Maharashtra" },
  { id: 15, name: "Manipur" },
  { id: 16, name: "Meghalaya" },
  { id: 17, name: "Mizoram" },
  { id: 18, name: "Nagaland" },
  { id: 19, name: "Odisha" },
  { id: 20, name: "Punjab" },
  { id: 21, name: "Rajasthan" },
  { id: 22, name: "Sikkim" },
  { id: 23, name: "Tamil Nadu" },
  { id: 24, name: "Telangana" },
  { id: 25, name: "Tripura" },
  { id: 26, name: "Uttar Pradesh" },
  { id: 27, name: "Uttarakhand" },
  { id: 28, name: "West Bengal" },
  { id: 29, name: "Andaman and Nicobar Islands" },
  { id: 30, name: "Chandigarh" },
  { id: 31, name: "Dadra and Nagar Haveli and Daman & Diu" },
  { id: 32, name: "Delhi" },
  { id: 33, name: "Jammu and Kashmir" },
  { id: 34, name: "Ladakh" },
  { id: 35, name: "Lakshadweep" },
  { id: 36, name: "Puducherry" }
];

 function StateSelect() {
  return (
    <>
     
      <option value="">Select State</option> 
      {indiaStatesData.map((state) => (
        <option 
          key={state.id} 
          value={state.name}
        > 
          {state.name}
        </option>
      ))}
    </>
  );
}
export default StateSelect