import DashBoard from "../view/listings/Dashboard/Dashboard";
import Login from "../view/Login";
import Parties from "../view/listings/Parties/Parties";
import Items from "../view/listings/Items/items";
//import Sale from "../view/listings/Sale/sale";

const routes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/dashboard",
    component: DashBoard,
  },
  {
    path: "/parties",
    component: Parties,
  },
  {
    path: "/Items",
    component: Items,
  },
 
];
export default routes;
