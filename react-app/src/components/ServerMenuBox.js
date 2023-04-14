import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteServerModal from "./DeleteServerModal";
import EditServerForm from "./EditServerForm";
import OpenModalButton from "./OpenModalButton";
import { thunkLoadAllServers, loadOneServerId } from "../store/servers";

export default function ServerMenuBox({ servers, user }) {
 const [showMenu, setShowMenu] = useState(false);
 const ulRef = useRef();
 const dispatch = useDispatch();
 //  const return_servers_state = useSelector((state) => state.servers);
 //  const return_servers = return_servers_state.allServers;
 //  const serverId = return_servers_state.singleServerId;
 //  const server = return_servers[serverId];

 const server = useSelector(state => state.servers.allServers[state.servers.singleServerId]);
 console.log("SERERE", server)
 useEffect(() => {
  if (servers.length !== 0) {
   dispatch(loadOneServerId(servers[1].id));
  }
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
   <div className="svr-menu-name">
    {server ? server.name : "You have not joined a server yet!"}
   </div>
   <div className="svr-dropdown-parent svr-toggle-btn ">
    <button onClick={openMenu} className="down-close-btn">
     {showMenu ? (
      <i className="fa-solid fa-x fa-sm"></i>
     ) : (
      <i className="fa-solid fa-chevron-down fa-sm"></i>
     )}
    </button>
    <div className={ulClassName} ref={ulRef}>
     <div className="dropdown-content">{`Hello,${user?.firstname}`}</div>
     <div className="dropdown-content">{`${user?.email}`}</div>
     <OpenModalButton
      someN="svr-delete-button"
      buttonText="Delete the Server"
      modalComponent={<DeleteServerModal serverId={server?.id} />}
     />
     <OpenModalButton
      someN="svr-edit-button"
      buttonText="Edit the Server"
      modalComponent={<EditServerForm server={server} />}
     />
    </div>
   </div>
  </>
 );
}
