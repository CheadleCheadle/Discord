import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import Button from '../Button';
import SiteLogo from './SiteLogo';
import SignupFormModal from '../SignupFormModal';
import { useModal } from '../../context/Modal';
import LoginFormModal from '../LoginFormModal';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const loginButtonText = sessionUser ? "Login" : "Open Discord";
  // const
  // const onClick = () => {
  //   if (onModalClose) setOnModalClose(onModalClose);
  //   setModalContent(modalComponent);
  //   if (onButtonClick) onButtonClick();
  // };

  return (
    <div className='navbar'>
      <div className='nav-bar-container'>
        <SiteLogo />
      </div>
      <div>
      </div>
      {isLoaded && (
        <div>
          <ProfileButton user={sessionUser} />
          <Button buttonStyle='btn--demo' modalComponent={LoginFormModal}>
            {loginButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}

export default Navigation;
