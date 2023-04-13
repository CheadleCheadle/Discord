import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import NavBarServerList from "../NavBarServerList";
import { thunkLoadAllServers } from "../../store/servers";
import OpenModalButton from "../OpenModalButton";
import AddServerForm from "../AddServerForm";
import ServerMenuBox from "../ServerMenuBox";
// import servers from "../../servers.json";
const Navigation = () => {
 const dispatch = useDispatch();
 const return_servers = useSelector((state) => state.servers.allServers);
 const returnServers = Object.values(return_servers);

 let servers = [];
 const sessionUser = useSelector((state) => state.session.user);
 if (sessionUser) {
  returnServers.forEach((server) =>
   server.users.forEach((user) => {
    if (user.id === sessionUser.id) servers.push(server);
   })
  );
 }

 console.log("Inside Navigation servers", servers);

 useEffect(() => {
  dispatch(thunkLoadAllServers());
 }, [dispatch]);
 //  console.log("Navigation servers: ", servers);
 if (!servers) return null;
 else
  return (
   <div className="whole-outer-container">
    <div className="svr-nav-bar">
     <div className="svr-nav-server-list">
      <NavBarServerList servers={servers} />
     </div>
     <div className="svr-nav-menu">
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
    <div className="svr-channel-column">
     <div className="svr-menu-box">
      <ServerMenuBox servers={servers} user={sessionUser} />
     </div>
    </div>
   </div>
  );
};

export default Navigation;
