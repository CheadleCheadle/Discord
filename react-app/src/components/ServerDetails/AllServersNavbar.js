import React from "react";
import { useSelector } from "react-redux";
import ProfileButton from "../Navigation/ProfileButton";
import NavBarServerList from "../NavBarServerList";
import OpenModalButton from "../OpenModalButton";
import AddServerForm from "../AddServerForm";
import "../Navigation/Navigation.css";
import { NavLink, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import OpenModalMenuItem from "../OpenModalButton";
import AddChannelModal from "../AddChannelModal";

const AllServersNavbar = () => {
  const return_servers = useSelector((state) => state.servers.allServers);
  const sessionUser = useSelector((state) => state.session.user);
  // const servers = Object.values(return_servers);
  //  const server
  const history = useHistory();
  const goHome = () => {
    return history.push("/servers");
  };
  return (
    <>
      <div className="svr-nav-bar">
        <div className="svr-nav-server-list">
          <div id="home" onClick={() => goHome()}>
            <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png"></img>
          </div>
          <NavBarServerList />
        </div>
        <div className="svr-nav-menu">
          {/* <div className="svr-nav-menu-item svr-dropdown-parent"> */}
          <ProfileButton user={sessionUser} />
          {/* </div> */}
          <div className="svr-nav-menu-item">
            <OpenModalButton
              modalCSSClass="svr-new-server-button"
              buttonText="➕"
              modalComponent={<AddServerForm user={sessionUser} />}
            />
          </div>
          <div className="svr-nav-menu-item">
            <OpenModalMenuItem
              modalCSSClass="svr-new-channel-button"
              buttonText="➕"
              itemText="New Channel"
              modalComponent={<AddChannelModal />}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AllServersNavbar;
