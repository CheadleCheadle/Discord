import React from 'react';
import logo from "../static/discord-logo.png"
import { Link } from 'react-router-dom';
import './Navigation.css';

const SiteLogo = () => {
  return (
    <Link to="/" className='navbar-logo'>
      <img id='site-logo' src={logo} alt='logo' />
    </Link>
  )
};

export default SiteLogo;
