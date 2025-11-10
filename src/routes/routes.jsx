import Login from "../view/Login";
import Parties from "../view/listings/Parties/Parties";
import items from "../view/listings/items/items";
import Sale from "../view/listings/sale/sale";
import Purchase from "../view/listings/Purchase/purchase";
import Grow from "../view/listings/Grow/grow";
import Cash from "../view/listings/Cash/cash";
import Reports from "../view/listings/Reports/reports";
import Sync from "../view/listings/Sync/sync";
import Updates from "../view/listings/Updates/updates";
import DashBoard from "../view/listings/Dashboard/DashBoard";

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
    component: items,
  },
  {
    path: "/Sale",
    component: Sale,
  },
  {
    path: "/purchase",
    component: Purchase,
  },
  {
    path: "/grow",
    component: Grow,
  },
  {
    path: "/cash",
    component: Cash,
  },
  {
    path: "/reports",
    component: Reports,
  },
  {
    path: "/sync",
    component: Sync,
  },
  {
    path: "/updates",
    component: Updates,
  },
];
export default routes;
