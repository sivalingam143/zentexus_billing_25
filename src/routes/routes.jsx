import DashBoard from "../view/listings/Dashboard/Dashboard";
import Login from "../view/Login";
import Parties from "../view/listings/Parties/Parties";
import Items from "../view/listings/items/items";


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
    path: "/items",
    component: Items,
  },
];
export default routes;
