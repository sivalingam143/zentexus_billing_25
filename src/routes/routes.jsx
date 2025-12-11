import Login from "../view/Login";
import Parties from "../view/listings/Parties";
import items from "../view/listings/items";
import Sale from "../view/listings/sale";
import Purchase from "../view/listings/purchase";
import Grow from "../view/listings/grow";
import Cash from "../view/listings/cash";
import Reports from "../view/listings/reports";
import Sync from "../view/listings/sync";
import Updates from "../view/listings/updates";
import DashBoard from "../view/listings/DashBoard";
import DashboardSale from "../view/creation/SalesModalCreation";
import DashboardPurchase from "../view/creation/PurchaseModalCreation";
import EstimateCreation from "../view/creation/EstimateCreationModal";
import Estimate from "../view/listings/Estimate";

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
    path: "/sale/create",
    component: DashboardSale,
  },
  {
    path: "/sale/edit/:id",
    component: DashboardSale,
  },
  {
    path: "/sale/view/:id",
    component: DashboardSale,
  },
 {
    path: "/estimate",
    component: Estimate,
  },
  {
    path: "/estimate/create",
    component: EstimateCreation,
  },
  {
    path: "/estimate/edit/:id",
    component: EstimateCreation,
  },
  {
    path: "/estimate/view/:id",
    component: EstimateCreation,
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
    path: "/dashboardpurchase",
    component: DashboardPurchase,
  },
];
export default routes;
