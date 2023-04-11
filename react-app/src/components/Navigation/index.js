import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import Fab from "../Fab";
import NavBarServerList from "../NavBarServerList";
import {thunkLoadAllServers} from "../../store/servers";
// import servers from "../../servers.json";
const Navigation = () => {
 const dispatch = useDispatch();

 const return_servers = useSelector((state) => state.servers.allServers);

 const sessionUser = useSelector((state) => state.session.user);

 const servers = Object.values(return_servers);


 useEffect(() => {
 dispatch(thunkLoadAllServers());
 }, [dispatch]);

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
     <NavLink to="/servers/new">
      <Fab />
     </NavLink>
    </div>
   </div>
  </div>
 );
};

export default Navigation;
