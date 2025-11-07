import { MdOutlineHome } from "react-icons/md";
import { MdAdjust } from "react-icons/md";
import { BiUserPlus } from "react-icons/bi";
import { BsFilePlus } from "react-icons/bs";
import { LiaFanSolid } from "react-icons/lia";
import { GiRopeDart } from "react-icons/gi";
import { BsBox } from "react-icons/bs";
import { BsBoxes } from "react-icons/bs";
import { GiPunch } from "react-icons/gi";
import { BiSolidReport } from "react-icons/bi";
import { GiSkippingRope } from "react-icons/gi";
import { GrRestroomMen } from "react-icons/gr";
import { GiExplosiveMeeting } from "react-icons/gi";
const MenuItems = [
  // {
  //   path: "/dashboard",
  //   text: "Dashboard",
  //   icon: <MdOutlineHome />,
  // },
  {
    path: "/users",
    text: "Users",
    icon: <BiUserPlus />,
  },
  {
    path: "/master/category",
    text: "Master",
    icon: <BsFilePlus />,
    submenu: [
      // {
      //   path: "/master/group",
      //   text: "Group",
      // },
      // {
      //   path: "/master/category/",
      //   text: "Category",
      // },
      {
        path: "/master/products/",
        text: "பொருள்கள்",
      },
      {
        path: "/master/Staff/",
        text: "ஊழியர்கள்",
      },
      {
        path: "/master/Ringpunch",
        text: "வளையம் குத்து",
      },
      {
        path: "/master/paysetting",
        text: "செலுத்து ஷெட்டினக்ஸ்",
      },
    ],
  },

  // {
  //   path: "/plateentry",
  //   text: "Plate Entry",
  //   icon: <MdAdjust />,
  // },
  {
    path: "/Ringboxingsection",
    text: "வளையம் குத்து பிரிவு",
    icon: <LiaFanSolid />,
  },
  {
    path: "/knotting",
    text: "பின்னல் பிரிவு",
    icon: <GiRopeDart />,
  },
  {
    path: "/deluxe",
    text: "டீலக்ஸ் பின்னல்",
    icon: <GiSkippingRope />,
  },
  {
    path: "/packing",
    text: "பாக்கெட் பிரிவு",
    icon: <BsBox />,
  },
  {
    path: "/company",
    text: " கம்பெனி பிரிவு",
    icon: <BsBoxes />,
  },
  {
    path: "/pay",
    text: "செலுத்து பிரிவு",
    icon: <GiPunch />,
  },
  {
    path: "/Explosivedevice",
    text: "வெடி உருடு பிரிவு",
    icon: <GiExplosiveMeeting />,
  },

  {
    path: "/report",
    text: "Report",
    icon: <BiSolidReport />,
  },
  {
    path: "/companyreport",
    text: "CompanyReport",
    icon: <GrRestroomMen />,
  },
];

export default MenuItems;
