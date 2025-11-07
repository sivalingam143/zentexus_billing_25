import Category from "../view/listings/Category";
import Company from "../view/listings/Company";
import CompanyCreate from "../view/listings/CompanyCreate";
import CompanyEdit from "../view/listings/CompanyEdit";
import DashBoard from "../view/listings/DashBoard";
import RingBoxing from "../view/listings/RingBoxing";
import Group from "../view/listings/Group";
import PlateEntry from "../view/listings/PlateEntry";
import Products from "../view/listings/Products";
import Staff from "../view/listings/Staff";
import User from "../view/listings/User";
import Login from "../view/Login";
import Knotting from "../view/listings/Knotting";
import Deluxe from "../view/listings/Deluxe";
import Packing from "../view/listings/Packing";
import Cooly from "../view/listings/Cooly";
import Pay from "../view/listings/Pay";
import Report from "../view/listings/Report";
import CompanyReport from "../view/listings/CompanyReport";
import PaySetting from "../view/listings/PaySetting";
import Explosive from "../view/listings/Explosive";

const routes = [
  {
    path: "/",
    component: Login,
  },
  // {
  //   path: "/dashboard",
  //   component: DashBoard,
  // },
  {
    path: "/company",
    component: Company,
  },
  {
    path: "/company/create",
    component: CompanyCreate,
  },
  {
    path: "/company/edit/:id", // Add the edit route
    component: CompanyEdit,
  },

  {
    path: "/master/group/",
    component: Group,
  },
  {
    path: "/master/category/",
    component: Category,
  },
  {
    path: "/master/products/",
    component: Products,
  },
  {
    path: "/master/staff/",
    component: Staff,
  },
  {
    path: "/master/Ringpunch",
    component: Cooly,
  },
  {
    path: "/master/paysetting",
    component: PaySetting,
  },

  {
    path: "/users",
    component: User,
  },
  {
    path: "/plateentry",
    component: PlateEntry,
  },
  {
    path: "/Ringboxingsection",
    component: RingBoxing,
  },

  {
    path: "/Knotting",
    component: Knotting,
  },
  {
    path: "/deluxe",
    component: Deluxe,
  },
  {
    path: "/packing",
    component: Packing,
  },
  {
    path: "/pay",
    component: Pay,
  },
  {
    path: "/Explosivedevice",
    component: Explosive,
  },

  {
    path: "/report",
    component: Report,
  },
  {
    path: "/companyreport",
    component: CompanyReport,
  },
];
export default routes;
