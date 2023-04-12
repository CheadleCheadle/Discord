// import {
//  ContextMenuTrigger,
//  ContextMenu,
//  ContextMenuItem,
// } from "rctx-contextmenu";
import React, { useState, useEffect, useRef } from "react";
//import { useDispatch } from "react-redux";
// import { logout } from "../../store/session";

function NavBarServer({ server }) {
 //const dispatch = useDispatch();
 const [showMenu, setShowMenu] = useState(true);
 const ulRef = useRef();

 const openMenu = () => {
  if (showMenu) return;
  setShowMenu(true);
 };

 useEffect(() => {
  if (!showMenu) return;

  const closeMenu = (e) => {
   if (!ulRef.current.contains(e.target)) {
    setShowMenu(false);
   }
  };

  document.addEventListener("click", closeMenu);

  return () => document.removeEventListener("click", closeMenu);
 }, [showMenu]);

 //  const handleLogout = (e) => {
 //   e.preventDefault();
 //   dispatch(logout());
 //  };

 const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
 const closeMenu = () => setShowMenu(false);

 let divStyle = {
  backgroundImage: "url(" + server.icon_url + ")",
 };
 //  console.log("divStyle: ", divStyle);
 return (
  <>
   <div
    className="dropdown"
    // style={divStyle}
    //data-tooltip={server.name}
   >
    {/* <ContextMenuTrigger id="my-context-menu"> */}
    <button
     onClick={openMenu}
     className="svr-ctx-box "
     style={divStyle}
     data-tooltip={server.name}
    ></button>
    {/* </ContextMenuTrigger> */}

    <div className={ulClassName} ref={ulRef}>
     <div className="dropdown-content">Menu Item 1</div>
     <div className="dropdown-content">Menu Item 2</div>
     <div className="dropdown-content">Menu Item 3</div>
     <div className="dropdown-content">Menu Item 4</div>
    </div>
   </div>
  </>
 );
}

export default NavBarServer;
