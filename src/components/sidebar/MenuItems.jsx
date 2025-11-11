import { MdOutlineHome } from "react-icons/md";
import { MdOutlineGroup } from "react-icons/md"; 
import { MdOutlineShoppingBag } from "react-icons/md";
import { MdOutlineSell } from "react-icons/md";
import { MdOutlineShoppingCart } from "react-icons/md";
import { MdTrendingUp } from "react-icons/md";
import { MdAttachMoney } from "react-icons/md";
import { MdOutlineAssignment } from "react-icons/md";
import { MdOutlineSync } from "react-icons/md"
import { MdReceiptLong } from "react-icons/md";








const MenuItems = [
  {
    path: "/dashboard",
    text: "Dashboard",
    icon: <MdOutlineHome />,
  },
  {
    path: "/parties",
    text: "Parties",
    icon: <MdOutlineGroup/>,
  },
  {
    path: "/items",
    text: "Items",
    icon: <MdOutlineShoppingBag/>,

  },
  {
    path: "/sale",
    text: "Sale",
    icon: <MdOutlineSell/>,
    
  },
  {
    path:"/purchaseandexpanse",
    text:"Purchase and Expanse",
    icon: <MdOutlineShoppingCart/>,
  },
  {
    path: "/grow",
    text: "Grow Your Business",
    icon: <MdTrendingUp/>,
  },
  {
    path: "/cash",
    text: "Cash & Bank",
    icon: <MdAttachMoney/>,
  },
  {
    path: "/reports",
    text: "Reports",
    icon: <MdOutlineAssignment/>,
  },
  {
    path: "/sync",
    text: "Sync, Share & Backup",
    icon: <MdOutlineSync/>,
  },
  {
    path: "/updates",
    text: "Bulk GST Update",
    icon: <MdReceiptLong />,
  },
];

export default MenuItems;
