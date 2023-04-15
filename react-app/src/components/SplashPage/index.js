import React, { useState } from 'react'
import Navigation from '../Navigation'
import "./SplashPage.css"
import Button from '../Button'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../store/session'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import SignupFormModal from '../SignupFormModal'
import OpenModalButton from '../OpenModalButton'

const SplashPage = (isLoaded) => {
  const dispatch = useDispatch();

  const history = useHistory()
  const [ showMenu, setShowMenu ] = useState(false);
  const demoUser = async () => {
    dispatch(login("demo@aa.io", "password"))
      .then(() => history.push('/servers'))
  }

  const closeMenu = () => setShowMenu(false)

  return (
    <div id='full-splash-page'>
      <div id='splash-page-top-half'>
        <Navigation isLoaded={isLoaded} />
        <div id='splash-page-content'>
          <h1 id='splash-page-content-h1'>IMAGINE A PLACE...</h1>
          <h2 id='splash-page-content-h2'>
            ...where you can belong to a school club, a gaming group, or a worldwide art community. Where just you and a handful of friends can spend time together. A place that makes it easy to talk every day and hang out more often.
          </h2>
          <div id='splash-page-button-container'>
            <div className='btn-mobile'>
              <OpenModalButton
                buttonText={'Sign Up'}
                onButtonClick={closeMenu}
                modalComponent={<SignupFormModal />}
                modalCSSClass={'btn btn--demo btn--splash'}
              />
            </div>
            <Button buttonStyle={'btn--demo'} buttonSize={'btn--splash'} onClick={demoUser}>
              Demo User Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
// {/* <div id='splash-page-second-half'>
//   <div></div>
// </div> */}

export default SplashPage
