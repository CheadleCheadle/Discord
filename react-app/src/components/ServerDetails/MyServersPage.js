import React, { useEffect, useState } from "react";
import AllServersNavbar from "./AllServersNavbar";
import { Route, Switch, useLocation } from "react-router-dom";
import SingleServerPage from "./SingleServerPage";
import Friends from "../Friends";
import FriendDisplay from "../FriendDisplay";
import ServerMenuBox from "../ServerMenuBox";
import { useDispatch, useSelector } from "react-redux";
import { getMembershipsThunk } from "../../store/session";
import AllServersPage from "./allServers";
import { logout } from "../../store/session";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loading from "../loading";
import { useModal } from "../../context/Modal";
import UserInfo from "../UserInfoModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faHeadphones, faMicrophone} from "@fortawesome/free-solid-svg-icons";
const MyServersPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const serversObj = useSelector(state => state.servers.allServers);
  const servers = Object.values(serversObj)
  const location = useLocation();
  const [ showFriends, setShowFriends ] = useState(false)
  const [ isLoaded, setIsLoaded ] = useState(false)
  const { setModalContent, setOnModalClose } = useModal();
  useEffect(() => {
    dispatch(getMembershipsThunk())
      .then(() => setIsLoaded(true))
  }, [ dispatch ])

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout(sessionUser))
      .then(() => history.push('/'));
  };

  const handleUser = () => {
    setModalContent(<UserInfo user={sessionUser} />)
  }

  useEffect(() => {
    if (location.pathname.slice(0, 8) === '/friends' || location.pathname === '/servers') setShowFriends(true)
    else setShowFriends(false)
  }, [ location.pathname ]);

  if (!isLoaded) {
    return <Loading />
  }
  return (
    <>
      {isLoaded && (
        <>
          <AllServersNavbar></AllServersNavbar>
          {showFriends && (
            <div className="friends-column">
              <Friends></Friends>
              <div className="user-info-nav">
                <div onClick={() => handleUser()} className="user-info">
                  <div id="pfp-cont">
                    <img src={sessionUser.photo_url}></img>
                  </div>

                  <div>
                    <span id="user-username">
                      <h4>{sessionUser.username}</h4>
                      <p>{sessionUser.username} #{sessionUser.code}</p>
                    </span>
                  </div>
                </div>
                <div className="user-icons">
                <FontAwesomeIcon  icon={faMicrophone} />
                <FontAwesomeIcon  icon={faHeadphones} />
                <FontAwesomeIcon onClick={() => history.push('/user/edit')} icon={faGear} />
                </div>
                {/* <div className="pointer" onClick={handleLogout}>Logout</div> */}
              </div>
            </div>
          )}
          <Switch>
            <Route path={'/servers/:serverId'}>
              <SingleServerPage />

            </Route>
            <Route path={"/friends/:friendId"} component={FriendDisplay} />
            <Route exact path={"/servers"} component={AllServersPage} />
          </Switch>

        </>
      )}
    </>
  )
}

export default MyServersPage
