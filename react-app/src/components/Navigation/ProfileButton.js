import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function ProfileButton({ user }) {
 const dispatch = useDispatch();
 const [showMenu, setShowMenu] = useState(false);
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
 }, [showMenu]);

 const handleLogout = (e) => {
  e.preventDefault();
  dispatch(logout());
 };

 const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
 const closeMenu = () => setShowMenu(false);

 return (
  <>
   <div className="dropdown">
    <button onClick={openMenu}>
     <i className="fas fa-user-circle fa-3x svr-profile-btn-color" />
    </button>
    <div className={ulClassName} ref={ulRef}>
     {user ? (
      <>
       <div className="dropdown-content">{"Hello, " + user.firstName}</div>
       <div className="dropdown-content">{user.email}</div>
       <div className="dropdown-content logout-button-container">
        <button className="logout-button" onClick={handleLogout}>
         Log Out
        </button>
       </div>
      </>
     ) : (
      <>
       <OpenModalButton
        buttonText="Log In"
        onItemClick={closeMenu}
        modalComponent={<LoginFormModal />}
       />

       <OpenModalButton
        buttonText="Sign Up"
        onItemClick={closeMenu}
        modalComponent={<SignupFormModal />}
       />
      </>
     )}
    </div>
   </div>
  </>
 );
}

export default ProfileButton;
