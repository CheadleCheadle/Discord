import React from 'react'
import Navigation from '../Navigation'
import "./SplashPage.css"

const SplashPage = (isLoaded) => {
  return (
    <>
      <div>
        <Navigation isLoaded={isLoaded} />
        <div id='splash-page-banner'></div>
      </div>
    </>
  )
}

export default SplashPage
