import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../slice/authSlice";
import LoginMiddleware from "../middleware/LoginMiddleware";
import userReducer from "../slice/UserSlice";
import productReducer from "../slice/ProductSlice";
import staffReducer from "../slice/StaffSlice";
import settingReducer from "../slice/SettingSlice";
import paysettingReducer from "../slice/paySettingSlice";
import plateEnterReducer from "../slice/PlateEntrySlice";
import ringboxingReducer from "../slice/RingboxingsectionSlice";
import knottingReducer from "../slice/KnottingSlice";
import deluxeReducer from "../slice/DeluxeSlice";
import packingReducer from "../slice/PackingSlice";
import reportReducer from "../slice/ReportSlice";
import explosiveReducer from "../slice/ExplosiveSlice";
import companyReportReducer from "../slice/CompanyReportSlice";
import companyReducer from "../slice/companySlice";
import payReducer from "../slice/PaySlice";
import salaryReportReducer from "../slice/salarySilce";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    Product: productReducer,
    Staff: staffReducer,
    Setting: settingReducer,
    paySetting: paysettingReducer,
    PlateEntry: plateEnterReducer,
    ringboxing: ringboxingReducer,
    knotting: knottingReducer,
    deluxe: deluxeReducer,
    packing: packingReducer,
    explosivePayroll: explosiveReducer,
    Report: reportReducer,
    CompanyReport: companyReportReducer,
    Company: companyReducer,
    Pay: payReducer,
    SalaryReportSlice: salaryReportReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(LoginMiddleware),
});

export default store;
