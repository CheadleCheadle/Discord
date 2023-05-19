import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteServerModal from "./DeleteServerModal";
import EditServerForm from "./EditServerForm";
import OpenModalButton from "./OpenModalButton";
import { loadOneServerId } from "../store/servers";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function ServerMenuBox({ servers, user }) {
  const ulRef = useRef();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation()
  const currUser = useSelector(state => state.session.user)
  const serverId = useSelector(state => state.servers.singleServerId);
  const server = useSelector(state => state.servers.allServers[ state.servers.singleServerId ]);
  const [ showMenu, setShowMenu ] = useState(false);
  const [ serverNameDisplay, setServerNameDisplay ] = useState(`Welcome, ${currUser.firstname}`)
  useEffect(() => {
    if (servers.length !== 0) {
      dispatch(loadOneServerId(server.id));
    }
  }, [ dispatch ]);

  const renderDelete = () => {
    if (server.owner_id == currUser.id) {

      return (
          <>
        <div
        onClick={() => {
            history.push(`/servers/${serverId}/edit`);
        }}
        >
            Server Settings
        </div>

          </>
      )
    } else {
      return (
        <div>
          <h3>{server.name}</h3>
          <p>{server.description}</p>
        </div>
      )
    }
  }
  useEffect(() => {
    renderDelete();
  }, [renderDelete, server])


  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current?.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [ showMenu ]);

  const ulClassName = "svr-menu-profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <div className="svr-menu-name">
        {server ? <h3>{server.name}</h3> : null}
      <div className="svr-dropdown-parent svr-toggle-btn ">
        <button onClick={openMenu} className="down-close-btn">
          {showMenu ? (
            <i className="fa-solid fa-x fa-sm"></i>
          ) : (
            <i className="fa-solid fa-chevron-down fa-sm"></i>
          )}
        </button>
        <div className={ulClassName} ref={ulRef}>
          <div className="svr-dropdown-content">{`Hello,${user?.firstname}`}</div>
          <div className="svr-dropdown-content">{`${user?.email}`}</div>
            {renderDelete()}
        </div>
      </div>
      </div>
    </>
  );
}
