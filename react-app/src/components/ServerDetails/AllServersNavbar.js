import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfileButton from "../Navigation/ProfileButton";
import NavBarServerList from "../NavBarServerList";
import OpenModalButton from "../OpenModalButton";
import AddServerForm from "../AddServerForm";
import "../Navigation/Navigation.css"

const AllServersNavbar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const return_servers = useSelector((state) => state.servers.allServers);
  const sessionUser = useSelector((state) => state.session.user);
  const servers = Object.values(return_servers);

  return (
    <>
      <div className="svr-nav-bar">
        <div className="svr-nav-server-list">
          <NavBarServerList servers={servers} />
        </div>
        <div className="svr-nav-menu">
          <div className="svr-nav-menu-item svr-dropdown-parent">
            <ProfileButton user={sessionUser} />
          </div>
          <div className="svr-nav-menu-item">
            <OpenModalButton
              someN="svr-new-server-button"
              buttonText="create"
              modalComponent={<AddServerForm user={sessionUser} />}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AllServersNavbar;
