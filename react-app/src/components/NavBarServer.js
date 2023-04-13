import React, { useState, useEffect, useRef } from "react";
import OpenModalButton from "./OpenModalButton";
import DeleteServerModal from "./DeleteServerModal";
import EditServerForm from "./EditServerForm";
import { useSelector, useDispatch } from "react-redux";
import { thunkLoadAllServers, loadCurrentServerId } from "../store/servers";

function NavBarServer({ serverId }) {
 const [showMenu, setShowMenu] = useState(false);
 const ulRef = useRef();
 const dispatch = useDispatch();
 const return_servers = useSelector((state) => state.servers.allServers);
 const server = return_servers[serverId];
 //console.log("Inside NavBarServer server", server);

 useEffect(() => {
  dispatch(thunkLoadAllServers());
 }, [dispatch, serverId]);

 const handleClick = (e) => {
  e.preventDefault();
  dispatch(loadCurrentServerId(serverId));
 };

 let divStyle;

 //  if (server)
 divStyle = {
  backgroundImage: "url(" + server?.icon_url + ")",
 };
 //console.log("divStyle", divStyle);
 //  if (!server) return null;
 //  else
 return (
  <>
   <div className="dropdown">
    {/* <button onClick={openMenu}>
     <i className="fas fa-user-circle fa-3x svr-profile-btn-color" />
    </button> */}
    <button
     onClick={handleClick}
     className="svr-ctx-box "
     style={divStyle}
     data-tooltip={server?.name}
    ></button>
    {/* <div className={ulClassName} ref={ulRef}></div> */}
   </div>
  </>
 );
}

export default NavBarServer;
