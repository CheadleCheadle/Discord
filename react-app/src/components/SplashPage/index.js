import React, { useState } from 'react'
import Navigation from '../Navigation'
import "./SplashPage.css"
import Button from '../Button'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../store/session'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import SignupFormModal from '../SignupFormModal'
import OpenModalButton from '../OpenModalButton'
import Loading from '../loading'

const SplashPage = (isLoaded) => {
  const dispatch = useDispatch();

  const history = useHistory()
  const [showMenu, setShowMenu] = useState(false);
  const demoUser = () => {
    dispatch(login("demo@aa.io", "password"))
      .then(() => history.push('/servers'))
  }
  const demoSecondUser = () => {
    dispatch(login("marnie@aa.io", "password"))
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
            <Button buttonStyle={'btn--demo'} buttonSize={'btn--splash'} onClick={demoSecondUser}>
              Demo User 2 Login
            </Button>
          </div>
        </div>
      </div>
        <div id="splash-page-bottom-half">
          <div id="links-cont">

          <div className='links'>
              <p>Tony Zheng</p>
            <div className="links-name">
            <a id="linkedin" href="https://www.linkedin.com/in/tony-zheng-577840156/" target="_blank">
              <i class="fa-brands fa-linkedin"></i>
            </a>

            <a id="linkedin" href="https://github.com/usr1l" target="_blank">
              <i class="fa-brands fa-github"></i>
            </a>
            </div>
          </div>

          <div className='links'>
              <p>Chunyi Koo</p>
            <div className="links-name">
            <a id="linkedin" href="https://www.linkedin.com/in/chunyi-koo-70780025a/" target="_blank">
              <i class="fa-brands fa-linkedin"></i>
            </a>

            <a id="linkedin" href="https://github.com/ChunyiKoo" target="_blank">
              <i class="fa-brands fa-github"></i>
            </a>
            </div>
          </div>

          <div className='links'>
              <p>Grant Cheadle</p>
            <div className="links-name">
            <a id="linkedin" href="https://www.linkedin.com/in/grant-a-cheadle-0233771a7/" target="_blank">
              <i class="fa-brands fa-linkedin"></i>
            </a>

            <a id="linkedin" href="https://github.com/CheadleCheadle" target="_blank">
              <i class="fa-brands fa-github"></i>
            </a>
            </div>
          </div>

          </div>
        </div>
    </div>
  )
}

export default SplashPage
