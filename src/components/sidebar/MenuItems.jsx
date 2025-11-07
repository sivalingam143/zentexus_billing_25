import { MdOutlineHome } from "react-icons/md";
import { MdOutlineGroup } from "react-icons/md"; 
import { MdOutlineShoppingBag } from "react-icons/md";
//import { MdOutliesaleShoppingCart } from "react-icons/md";


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

];

export default MenuItems;
