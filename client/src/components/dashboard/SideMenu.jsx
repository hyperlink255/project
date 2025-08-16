import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { LINKS1, LINKS2, LINKS3 } from "../../services/links";
import { AppContext } from "../../context/AppContext";

const SideMenu = () => {
  const {user}  = useContext(AppContext)
  const roleLinks = {
    admin: LINKS3,
    organizer: LINKS2,
    user: LINKS1,
  };
  const links = roleLinks[user?.role] || [];
  return (
    <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col">
      {links.map((item) => {
        const Icon = item.icon;
         return (
        <NavLink
          key={item.name}
          to={item.path}
          end={item.path === `/dashboard/${user.role}`}
          className={({ isActive }) =>
            `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 
             md:px-10 gap-3 ${
               isActive
                 ? "bg-indigo-50 border-r-[6px] border-indigo-500/90 text-indigo-500/90"
                 : "hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90"
             }`
          }
        >
          <div className=""><Icon/></div>
          <p className="md:block hidden text-center">{item.name}</p>
        </NavLink>
         )
      })}
    </div>
  );
};

export default SideMenu;
