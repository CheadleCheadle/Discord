import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import Button from '../Button';
import SiteLogo from './SiteLogo';
import SignupFormModal from '../SignupFormModal';
import { useModal } from '../../context/Modal';
import LoginFormModal from '../LoginFormModal';
import OpenModalButton from '../OpenModalButton';
import "../Button/Button.css"
function Navigation({ isLoaded }) {
  const history = useHistory()
  const sessionUser = useSelector(state => state.session.user);
  const [ showMenu, setShowMenu ] = useState(false);
  const [ loginButtonText, setLoginButtonText ] = useState('Login');

  useEffect(() => {
    if (!sessionUser) setLoginButtonText('Open Discord')
    else setLoginButtonText("Login")
  }, [ sessionUser ])

  const closeMenu = () => setShowMenu(false)
  const showDiscord = () => history.push("/servers")


  return (
    <div className='navbar'>
      <div className='nav-bar-container'>
        <SiteLogo />
      </div>
      <div>
      </div>
      {isLoaded && (
        <div className='btn-mobile'>
          <OpenModalButton
            buttonText={sessionUser ? "Open Discord" : "Login"}
            onButtonClick={sessionUser ? showDiscord : closeMenu}
            modalComponent={sessionUser ? null : <LoginFormModal />}
            modalCSSClass={'btn btn--demo btn--medium'}
          />
        </div>
      )}
    </div >
  );
}

export default Navigation;
