import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import Fab from "../Fab";
import NavBarServerList from "../NavBarServerList";
import { thunkLoadAllServers } from "../../store/servers";
import OpenModalButton from "../OpenModalButton";
import AddServerForm from "../AddServerForm";
// import servers from "../../servers.json";
const Navigation = () => {
 const dispatch = useDispatch();
 const history = useHistory();
 //  const return_servers = useSelector((state) => state.servers.allServers);

 const sessionUser = useSelector((state) => state.session.user);

 //  const servers = Object.values(return_servers);
 let servers = sessionUser?.servers;
 console.log("Inside Navigation servers", servers);

 useEffect(() => {
  dispatch(thunkLoadAllServers());
 }, [dispatch]);
 //  console.log("Navigation servers: ", servers);
 if (!servers) return null;
 else
  return (
   <div className="svr-nav-bar">
    <div className="svr-nav-server-list">
     <NavBarServerList servers={servers} />
    </div>
    <div className="svr-nav-menu">
     {/* <div>
     <NavLink exact to="/">
      Home
     </NavLink>
    </div> */}

     <div className="svr-nav-menu-item svr-dropdown-parent">
      <ProfileButton user={sessionUser} />
     </div>

     <div className="svr-nav-menu-item">
      {/* <Fab onClick={() => history.push("/servers/new")} /> */}
      <OpenModalButton
       someN="svr-new-server-button"
       buttonText="create"
       modalComponent={<AddServerForm user={sessionUser} />}
      />
     </div>
    </div>
   </div>
  );
};

export default Navigation;
