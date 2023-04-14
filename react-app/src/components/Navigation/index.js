import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import Button from '../Button';
import SiteLogo from './SiteLogo';
import SignupFormModal from '../SignupFormModal';
import { useModal } from '../../context/Modal';
import LoginFormModal from '../LoginFormModal';
import OpenModalButton from '../OpenModalButton';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const loginButtonText = sessionUser ? "Login" : "Open Discord";
  const [ showMenu, setShowMenu ] = useState(false);

  // const
  // const onClick = () => {
  //   if (onModalClose) setOnModalClose(onModalClose);
  //   setModalContent(modalComponent);
  //   if (onButtonClick) onButtonClick();
  // };

  const closeMenu = () => setShowMenu(false)
  return (
    <div className='navbar'>
      <div className='nav-bar-container'>
        <SiteLogo />
      </div>
      <div>
      </div>
      {isLoaded && (
        <div>
          {/* <ProfileButton user={sessionUser} />
          <Button buttonStyle='btn--demo' modalComponent={LoginFormModal}>
            {loginButtonText}
          </Button> */}
          <OpenModalButton
            buttonText={loginButtonText}
            onButtonClick={closeMenu}
            modalComponent={<LoginFormModal />}
          />
        </div>
      )}
    </div>
  );
}

export default Navigation;
