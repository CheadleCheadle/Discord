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
      setShowMenu(false);
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [ showMenu ]);


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
      </div>
    </>
  );
}

export default NavBarServer;
