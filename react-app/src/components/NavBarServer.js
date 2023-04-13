import React, { useState, useEffect, useRef } from "react";
import OpenModalButton from "./OpenModalButton";
import DeleteServerModal from "./DeleteServerModal";
import EditServerForm from "./EditServerForm";

function NavBarServer({ server }) {
  const [ showMenu, setShowMenu ] = useState(false);
  const ulRef = useRef();

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
  }, [ showMenu ]);

  const ulClassName = "svr-profile-dropdown" + (showMenu ? "" : " hidden");

  let divStyle = {
    backgroundImage: "url(" + server.icon_url + ")",
  };
  return (
    <>
      <div className="dropdown">
        <button
          onClick={openMenu}
          className="svr-ctx-box "
          style={divStyle}
          data-tooltip={server.name}
        ></button>
        <div className={ulClassName} ref={ulRef}>
          <div className="dropdown-content">{"Hello, " + "user.firstName"}</div>
          <div className="dropdown-content">{"user.email"}</div>
          <OpenModalButton
            someN="svr-delete-button"
            buttonText="Delete the Server"
            modalComponent={<DeleteServerModal serverId={server.id} />}
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

export default NavBarServer;
