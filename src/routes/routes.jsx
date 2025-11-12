import Login from "../view/Login";
import Parties from "../view/listings/Parties/Parties";
import items from "../view/listings/Items/items";
import Sale from "../view/listings/Sale/sale";
import Purchase from "../view/listings/Purchase/purchase";
import Grow from "../view/listings/Grow/grow";
import Cash from "../view/listings/Cash/cash";
import Reports from "../view/listings/Reports/reports";
import Sync from "../view/listings/Sync/sync";
import Updates from "../view/listings/Updates/updates";
import DashBoard from "../view/listings/Dashboard/DashBoard";
import DashboardSale from "../view/listings/Sale/DashboardSale";
import DashboardPurchase from "../view/listings/Sale/DashboardPurchase";

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
  {
    path: "/dashboardsale",
    component: DashboardSale,
  },
  {
    path: "/dashboardpurchase",
    component: DashboardPurchase,
  },
];
export default routes;
