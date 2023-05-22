import NavBarServer from "./NavBarServer";
import { NavLink, useHistory } from "react-router-dom";
import "./Navigation/Navigation.css"
import { useSelector, useDispatch } from "react-redux";
import { loadOneServerId } from "../store/servers";
import { useEffect } from "react";
import { getMembershipsThunk } from "../store/session";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddServerForm from "./AddServerForm";
import OpenModalButton from "./OpenModalButton";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
function NavBarServerList() {
  const serversObj = useSelector(state => state.session.user.servers)
  const servers = Object.values(serversObj)
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

  const [ activeItem, setActiveItem ] = useState(null);

  const handleClick = (server) => {
    setActiveItem(server.id)
    dispatch(loadOneServerId(server.id));
  }
  const goHome = (id) => {
    setActiveItem(id);
    return history.push("/servers");
  };


  return (
    <>
      <div className="server-indicator">
        <span id={location.pathname === '/servers' ? 'active-indicator-home' : "inactive-indicator"}></span>
        <div className="server-list">
          <div id={location.pathname === '/servers' ? 'home-active' : 'home'} onClick={() => goHome(400)}>
            <img width="48" height="48" color="#DBDEE1" src="https://img.icons8.com/ios-filled/50/DBDEE1/discord-logo.png" alt="discord-logo" />
          </div>
          <div id="spacer-cont">
            <span id="spacer"></span>
          </div>
          <div className="bunch-servers">
            {servers.map((server) => (
              <>
                <NavLink key={server.name} to={`/servers/${server.id}`}>
                  <span id={activeItem === server.id ? 'active-indicator' : "inactive-indicator"}></span>
                  <div onClick={() => handleClick(server)} key={server.id} className="svr-nav-menu-item">
                    <img src={server.icon_url}></img>
                  </div>
                </NavLink >
              </>
            ))}
            <div className="svr-nav-menu-item">
              <OpenModalButton
                modalCSSClass="new-svr-button"
                // buttonText={<FontAwesomeIcon icon={faPlus} />}
                modalComponent={<AddServerForm user={sessionUser} />}
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default NavBarServerList;
