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


  return (
      <div className="svr-nav-bar">
        <div className="svr-nav-server-list">
          <NavBarServerList />
        </div>

      </div>
  );
};

export default AllServersNavbar;
