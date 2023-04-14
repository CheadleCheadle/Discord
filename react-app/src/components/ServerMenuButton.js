import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteServerModal from "./DeleteServerModal";
import EditServerForm from "./EditServerForm";
import OpenModalButton from "./OpenModalButton";
import { thunkLoadAllServers } from "../store/servers";

function ServerMenuButton() {
 const [showMenu, setShowMenu] = useState(false);
 const ulRef = useRef();
 const dispatch = useDispatch();
 const return_servers_state = useSelector((state) => state.servers);
 const return_servers = return_servers_state.allServers;
 const serverId = return_servers_state.singleServer;
 const server = return_servers[serverId];
 useEffect(() => {
  dispatch(thunkLoadAllServers());
 }, [dispatch]);

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

 const ulClassName = "svr-menu-profile-dropdown" + (showMenu ? "" : " hidden");

 return (
  <>
   <div className="svr-dropdown-parent svr-toggle-btn ">
    <button onClick={openMenu} className="down-close-btn">
     {showMenu ? (
      <i className="fa-solid fa-x fa-sm"></i>
     ) : (
      <i className="fa-solid fa-chevron-down fa-sm"></i>
     )}
    </button>
    <div className={ulClassName} ref={ulRef}>
     <div className="svr-dropdown-content">{"Hello, " + "user.firstName"}</div>
     <div className="svr-dropdown-content">{"user.email"}</div>
     <div className="svr-dropdown-content">
      <OpenModalButton
       someN="svr-delete-button svr-dropdown-content"
       buttonText="Delete the Server"
       modalComponent={<DeleteServerModal serverId={server?.id} />}
      />
     </div>
     <div className="svr-dropdown-content">
      <OpenModalButton
       someN="svr-edit-button svr-dropdown-content"
       buttonText="Edit the Server"
       modalComponent={<EditServerForm server={server} />}
      />
     </div>
    </div>
   </div>
  </>
 );
}

export default ServerMenuButton;
