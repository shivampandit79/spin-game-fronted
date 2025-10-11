import { AnimatePresence, motion } from "framer-motion";
import { path } from "framer-motion/client";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import {
  FaAssistiveListeningSystems,
  FaBars,
  FaFile,
  FaFirstOrder,
  FaInbox,
  FaJediOrder,
  FaSave,
  FaShip,
  FaUser,
} from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    icon: <FaHome />,
  },
  {
    path: "/user",
    name: "User",
    icon: <FaUser />,
  },
  {
    path: "/deposit",
    name: "Deposit",
    icon: <FaInbox />,
  },
  {
    path: "/refer",
    name: "ReferEarn",
    icon: <FaChartBar />,
  },
  {
    path: "/file-manager",
    name: "FileManager",
    icon: <FaFile />,
  },
  {
    path: "/saved",
    name: "Saved",
    icon: <FaSave />,
  },
  {
    path: "/settings",
    name: "Settings",
    icon: <FaAssistiveListeningSystems />,
  },
];

const Sidebar = ({ children }) => {

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      opacity: 0,
      transition:{
        duration: 0.2,
      }
    },
    show:{
      width: "130px",
      padding: "5px 10px",
      opacity: 1,
      transition:{
        duration: 0.2,
      }
    }
  }


  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition:{
        duration: 0.5,
      }
    },
    show:{
      width: "auto",
      opacity: 1,
      transition:{
        duration: 0.2,
      }
    }
  }




  return (
    <div className="main-container">
      <motion.div animate={{ width: isOpen ? "200px" : "35px" }} className="sidebar">
        <div className="top_section">
          {isOpen && <h1  className="logo">Spin With Real Cash</h1>}
            <div className="bars"><FaBars onClick={toggle}/></div>
          
        </div>

        {/* <div className="search">
          <div className="search_icon">
            <BiSearch/>
          </div>
          <AnimatePresence>
            {isOpen && <motion.input initial="hidden" animate="show" exit="hidden" variants={inputAnimation} placeholder="Search.."/>}
          </AnimatePresence>
        </div> */}
        <section className="routes">
          {routes.map((route) => (
            <NavLink to={route.path} key={route.name} className="link">
              <div className="icon">{route.icon}</div>
              <AnimatePresence>
                {isOpen && <motion.div variants={showAnimation} initial="hidden" animate="show" exit="hidden" className="link_text">{route.name}</motion.div>}
              </AnimatePresence>
            </NavLink>
          ))}
        </section>
      </motion.div>
        <main>{children}</main>
    </div>
  );
};

export default Sidebar;
